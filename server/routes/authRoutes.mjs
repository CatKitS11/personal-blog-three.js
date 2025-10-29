import { Router } from "express";
import { createClient } from "@supabase/supabase-js";
import pool from "../utils/db.mjs";
import protectUser from "../middlewares/protectUser.mjs";

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY
);
const authRouter = Router();

// จะเพิ่ม routes ต่างๆ ที่นี่

authRouter.post("/register", async (req, res) => {
    const { email, password, username, name } = req.body;

    try {
        // ตรวจสอบว่า username มีในฐานข้อมูลหรือไม่
        const usernameCheckQuery = `
                                  SELECT * FROM users 
                                  WHERE username = $1
                                 `;
        const usernameCheckValues = [username];
        const { rows: existingUser } = await pool.query(
            usernameCheckQuery,
            usernameCheckValues
        );

        if (existingUser.length > 0) {
            return res.status(400).json({ error: "This username is already taken" });
        }

        // สร้างผู้ใช้ใหม่ผ่าน Supabase Auth
        const { data, error: supabaseError } = await supabase.auth.signUp({
            email,
            password,
        });

        // ตรวจสอบ error จาก Supabase
        if (supabaseError) {
            if (supabaseError.code === "user_already_exists") {
                return res
                    .status(400)
                    .json({ error: "User with this email already exists" });
            }
            // จัดการกับ error อื่นๆ จาก Supabase
            return res
                .status(400)
                .json({ error: "Failed to create user. Please try again." });
        }

        const supabaseUserId = data.user.id;

        // เพิ่มข้อมูลผู้ใช้ในฐานข้อมูล PostgreSQL
        const query = `
                INSERT INTO users (id, username, name, email, role, profile_picture_url)
                VALUES ($1, $2, $3, $4, $5, $6)
                RETURNING *;
              `;

        const values = [supabaseUserId, username, name, email, "user", null]; // ใช้ profile_picture_url

        const { rows } = await pool.query(query, values);
        res.status(201).json({
            message: "User created successfully",
            user: rows[0],
        });
    } catch (error) {
        res.status(500).json({ error: "An error occurred during registration" });
    }
});

authRouter.post("/login", async (req, res) => {
    const { email, password } = req.body;

    try {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            // ตรวจสอบว่า error เกิดจากข้อมูลเข้าสู่ระบบไม่ถูกต้องหรือไม่
            if (
                error.code === "invalid_credentials" ||
                error.message.includes("Invalid login credentials")
            ) {
                return res.status(400).json({
                    error: "Your password is incorrect or this email doesn't exist",
                });
            }
            return res.status(400).json({ error: error.message });
        }

        return res.status(200).json({
            message: "Signed in successfully",
            access_token: data.session.access_token,
        });
    } catch (error) {
        return res.status(500).json({ error: "An error occurred during login" });
    }
});

authRouter.get("/get-user", async (req, res) => {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
        return res.status(401).json({ error: "No token provided" });
    }

    try {
        const { data, error } = await supabase.auth.getUser(token);

        if (error || !data.user) {
            return res.status(401).json({ error: "Invalid token" });
        }

        const supabaseUserId = data.user.id;

        // ดึงข้อมูลผู้ใช้จากฐานข้อมูล PostgreSQL
        const query = `
            SELECT id, username, name, email, role, profile_picture_url, bio
            FROM users 
            WHERE id = $1
        `;
        const { rows } = await pool.query(query, [supabaseUserId]);

        if (rows.length === 0) {
            return res.status(404).json({ error: "User not found" });
        }

        res.status(200).json(rows[0]);
    } catch (error) {
        console.error("Get user error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

authRouter.put("/reset-password", async (req, res) => {
    const token = req.headers.authorization?.split(" ")[1]; // ดึง token จาก Authorization header
    const { oldPassword, newPassword } = req.body;

    if (!token) {
        return res.status(401).json({ error: "Unauthorized: Token missing" });
    }

    if (!newPassword) {
        return res.status(400).json({ error: "New password is required" });
    }

    try {
        // ตั้งค่า session ด้วย token ที่ส่งมา
        const { data: userData, error: userError } = await supabase.auth.getUser(
            token
        );

        if (userError) {
            return res.status(401).json({ error: "Unauthorized: Invalid token" });
        }

        // ตรวจสอบรหัสผ่านเดิมโดยลองล็อกอิน
        const { data: loginData, error: loginError } =
            await supabase.auth.signInWithPassword({
                email: userData.user.email,
                password: oldPassword,
            });

        if (loginError) {
            return res.status(400).json({ error: "Invalid old password" });
        }

        // อัปเดตรหัสผ่านของผู้ใช้
        const { data, error } = await supabase.auth.updateUser({
            password: newPassword,
        });

        if (error) {
            return res.status(400).json({ error: error.message });
        }

        res.status(200).json({
            message: "Password updated successfully",
            user: data.user,
        });
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
});


authRouter.put("/profile", protectUser, async (req, res) => {
    try {
        const userId = req.user.id; // Supabase user ID
        const { name, username, profile_picture, bio } = req.body;

        // กัน username ซ้ำ (ยกเว้นของตัวเอง) // EDIT
        const dupCheck = await pool.query(
          `SELECT 1 FROM users WHERE username = $1 AND id <> $2 LIMIT 1`,
          [username, userId]
        ); // EDIT
        if (dupCheck.rowCount > 0) { // EDIT
          return res.status(400).json({ success: false, error: "This username is already taken" }); // EDIT
        } // EDIT

        const updateQuery = `
                UPDATE users
                SET name = $1,
                    username = $2,
                    profile_picture_url = $3,
                    bio = $4
                WHERE id = $5
                RETURNING id, name, username, profile_picture_url, bio, email;
            `;
        const updateValues = [name, username, profile_picture, bio, userId];

        const { rows } = await pool.query(updateQuery, updateValues);

        if (rows.length === 0) {
            return res.status(404).json({
                success: false,
                error: "User not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            user: rows[0]
        });

    } catch (error) {
        console.error("Update profile error:", error); // EDIT
        // ส่งรายละเอียด code/detail ออกไปเพื่อดีบักได้ // EDIT
        return res.status(500).json({
          success: false,
          error: error?.detail || error?.message || "Failed to update profile", // EDIT
          code: error?.code || undefined, // EDIT
        }); // EDIT
    }
});

// เพิ่ม endpoint สำหรับเช็ค availability
authRouter.post('/check-availability', async (req, res) => {
  try {
    const { field, value } = req.body;
    
    if (!field || !value) {
      return res.status(400).json({ error: 'Field and value are required' });
    }
    
    if (!['username', 'email'].includes(field)) {
      return res.status(400).json({ error: 'Invalid field' });
    }
    
    // เช็คใน database ว่า username หรือ email ซ้ำหรือไม่
    const existingUser = await pool.query(`
      SELECT * FROM users 
      WHERE ${field} = $1
    `, [value]);
    
    res.json({ 
      available: existingUser.rows.length === 0,
      field,
      value 
    });
    
  } catch (error) {
    console.error('Check availability error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


export default authRouter;

