import express from 'express';
import cors from 'cors';
import postRouter from './routes/postRoutes.mjs';

const app = express();
const PORT = 3002;

app.use(cors());
app.use(express.json());

app.get('/test', (req, res) => {
  res.status(200).json({ message: 'API running' });
});

app.use('/posts', postRouter);


// Graceful shutdown
process.on('SIGINT', async () => {
  await prisma.$disconnect();
  process.exit(0);
});

app.listen(PORT, () => console.log(`API running on http://localhost:${PORT}`));