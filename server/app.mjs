import express from 'express';
import cors from 'cors';
import postRouter from './routes/postRoutes.mjs';
import authRouter from './routes/authRoutes.mjs';
import uploadRouter from './routes/uploadRoutes.mjs';
import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT;

const app = express();

app.use(cors());
app.use(express.json());

app.get('/test', (req, res) => {
  res.status(200).json({ message: 'API running' });
});

// ไม่ต้องมี static file serving แล้ว
// เพราะรูปจะอยู่ใน Supabase Storage

app.use('/posts', postRouter);
app.use('/auth', authRouter);
app.use('/upload', uploadRouter);

// Graceful shutdown
process.on('SIGINT', async () => {
  process.exit(0);
});

app.listen(PORT, () => console.log(`API running on http://localhost:${PORT}`));