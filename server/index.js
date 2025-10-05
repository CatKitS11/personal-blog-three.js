import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors());

app.get('/api/profile', (req, res) => {
    res.status(200).json({
        data: { name: 'john', age: 20 }
    });
});

const PORT = 3000;
app.listen(PORT, () => console.log(`API running on http://localhost:${PORT}`));