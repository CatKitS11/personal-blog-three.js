import { Router } from "express";
import multer from "multer";
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config();

const uploadRouter = Router();

// สร้าง Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY // ใช้ service role key สำหรับ upload
);

// ตั้งค่า multer สำหรับ upload to memory (ไม่เก็บใน disk)
const storage = multer.memoryStorage();

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    // อนุญาตเฉพาะไฟล์รูปภาพ
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
});

// POST /upload/image - Upload รูปภาพไป Supabase Storage
uploadRouter.post("/image", upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: "No file uploaded"
      });
    }

    const folder = req.body.folder || 'general';
    
    // สร้างชื่อไฟล์ใหม่: timestamp + random + extension
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const fileExt = req.file.originalname.split('.').pop();
    const fileName = `${folder}/${uniqueSuffix}.${fileExt}`;

    // Upload ไป Supabase Storage
    const { data, error } = await supabase.storage
      .from('photo-profiles') // ชื่อ bucket ใน Supabase
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
      filename: fileName
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
uploadRouter.delete("/image/:filename", async (req, res) => {
  try {
    const { filename } = req.params;

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