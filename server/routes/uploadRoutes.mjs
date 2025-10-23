import { Router } from "express";
import multer from "multer";
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
import protectUser from "../middlewares/protectUser.mjs"; // เพิ่ม import
import pool from "../utils/db.mjs"; // เพิ่ม import

dotenv.config();

const uploadRouter = Router();

// สร้าง Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// ตั้งค่า multer สำหรับ upload to memory
const storage = multer.memoryStorage();

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
});

uploadRouter.post("/image", protectUser, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: "No file uploaded"
      });
    }

    // ดึงข้อมูล user จาก database เพื่อใช้ชื่อสร้าง folder
    const userId = req.user.id; // Supabase user ID
    const userQuery = 'SELECT name FROM users WHERE id = $1';
    const { rows } = await pool.query(userQuery, [userId]);
    
    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: "User not found"
      });
    }

    const userName = rows[0].name;
    // สร้าง folder name จากชื่อ user (แทนที่ space ด้วย dash และ lowercase)
    const folderName = userName.toLowerCase().replace(/\s+/g, '-');
    
    // สร้างชื่อไฟล์ใหม่: profile + เวลาปัจจุบัน
    const uploadTime = Date.now();
    const fileExt = req.file.originalname.split('.').pop();
    const fileName = `${folderName}/profile-${uploadTime}.${fileExt}`; // เปลี่ยนจาก uniqueSuffix เป็น profile-timestamp

    // Upload ไป Supabase Storage
    const { data, error } = await supabase.storage
      .from('photo-profiles')
      .upload(fileName, req.file.buffer, {
        contentType: req.file.mimetype,
        upsert: false
      });

    if (error) {
      console.error("Supabase upload error:", error);
      return res.status(500).json({
        success: false,
        error: "Failed to upload to storage"
      });
    }

    // สร้าง public URL
    const { data: publicUrlData } = supabase.storage
      .from('photo-profiles')
      .getPublicUrl(fileName);

    res.status(200).json({
      success: true,
      message: "Image uploaded successfully",
      imageUrl: publicUrlData.publicUrl,
      filename: fileName,
      folderName: folderName
    });

  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to upload image"
    });
  }
});

// DELETE /upload/image - ลบรูปภาพจาก Supabase Storage
uploadRouter.delete("/image/:filename", protectUser, async (req, res) => { // เพิ่ม protectUser middleware
  try {
    const { filename } = req.params;
    const userId = req.user.id;

    // ตรวจสอบว่าไฟล์นี้เป็นของ user นี้หรือไม่
    const userQuery = 'SELECT name FROM users WHERE id = $1';
    const { rows } = await pool.query(userQuery, [userId]);
    
    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: "User not found"
      });
    }

    const userName = rows[0].name;
    const folderName = userName.toLowerCase().replace(/\s+/g, '-');
    
    // ตรวจสอบว่าไฟล์อยู่ใน folder ของ user นี้หรือไม่
    if (!filename.startsWith(folderName + '/')) {
      return res.status(403).json({
        success: false,
        error: "You can only delete your own files"
      });
    }

    const { error } = await supabase.storage
      .from('photo-profiles')
      .remove([filename]);

    if (error) {
      return res.status(500).json({
        success: false,
        error: "Failed to delete image"
      });
    }

    res.status(200).json({
      success: true,
      message: "Image deleted successfully"
    });

  } catch (error) {
    console.error("Delete error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to delete image"
    });
  }
});

export default uploadRouter;