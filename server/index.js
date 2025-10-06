import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
export const prisma = new PrismaClient();

const app = express();
app.use(cors());
app.use(express.json()); // EDIT: parse JSON body


app.post('/api/posts', async (req, res) => { // EDIT: ใช้ Prisma แทน
    try {
        const { title, image, category_id, description, content, status_id } = req.body;
        if (!title || !category_id || !content || !status_id) {
            return res.status(400).json({ message: 'Server could not create post because there are missing data from client' });
        }

        const post = await prisma.post.create({ // EDIT
            data: { title, image, category_id, description, content, status_id }
        });

        return res.status(201).json({ message: 'Created post sucessfully', id: post.id });
    } catch (err) {
        console.error('Create post error:', err);
        return res.status(500).json({ message: 'Server could not create post because database connection' });
    }
}); // EDIT

app.get('/api/profile', (req, res) => {
    res.status(200).json({
        data: { name: 'john', age: 20 }
    });
});

const PORT = 3002;
app.listen(PORT, () => console.log(`API running on http://localhost:${PORT}`));