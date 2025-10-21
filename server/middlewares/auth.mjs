import jwt from 'jsonwebtoken';
import pool from '../utils/db.mjs';

export const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({ 
        success: false,
        error: 'Access token required' 
      });
    }

    // ตรวจสอบ JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // หาข้อมูล user จาก database
    const userQuery = 'SELECT * FROM users WHERE id = $1';
    const { rows } = await pool.query(userQuery, [decoded.userId]);
    
    if (rows.length === 0) {
      return res.status(401).json({ 
        success: false,
        error: 'User not found' 
      });
    }

    // เพิ่ม user ข้อมูลใน req
    req.user = rows[0];
    next();

  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(403).json({ 
      success: false,
      error: 'Invalid or expired token' 
    });
  }
};