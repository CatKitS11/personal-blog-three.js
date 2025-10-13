import express from 'express';
import cors from 'cors';
import pool from './utils/db.mjs';

const app = express();
const PORT = 3002;

app.use(cors());
app.use(express.json());

app.get('/test', (req, res) => {
  res.status(200).json({ message: 'API running' });
});


// Test database connection
app.get('/api/health', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.status(200).json({ 
      message: 'Database connected successfully',
      time: result.rows[0].now 
    });
  } catch (err) {
    console.error('Database connection error:', err);
    res.status(500).json({ 
      message: 'Database connection failed',
      error: err.message 
    });
  }
});

// Get all posts
app.get('/api/getPosts', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM posts');
    return res.status(200).json({ posts: result.rows });
  } catch (err) {
    console.error('Get posts error:', err);
    return res.status(500).json({ 
      message: 'Could not get posts',
      error: err.message 
    });
  }
});

// Get single post
app.get('/api/posts/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM posts WHERE id = $1', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Post not found' });
    }
    
    return res.status(200).json({ post: result.rows[0] });
  } catch (err) {
    console.error('Get post error:', err);
    return res.status(500).json({ 
      message: 'Could not get post',
      error: err.message 
    });
  }
});

// Create post
app.post('/api/posts', async (req, res) => {
  try {
    const { title, image, category_id, description, content, status_id } = req.body;
    
    if (!title || !content) {
      return res.status(400).json({ message: 'Title and content are required' });
    }

    const result = await pool.query(
      `INSERT INTO posts (title, image, category_id, description, content, status_id) 
       VALUES ($1, $2, $3, $4, $5, $6) 
       RETURNING *`,
      [title, image, category_id, description, content, status_id]
    );

    return res.status(201).json({ 
      message: 'Post created successfully',
      post: result.rows[0]
    });
  } catch (err) {
    console.error('Create post error:', err);
    return res.status(500).json({ 
      message: 'Could not create post',
      error: err.message 
    });
  }
});

// Update post
app.put('/api/posts/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, image, category_id, description, content, status_id } = req.body;

    const result = await pool.query(
      `UPDATE posts 
       SET title = $1, image = $2, category_id = $3, description = $4, content = $5, status_id = $6
       WHERE id = $7
       RETURNING *`,
      [title, image, category_id, description, content, status_id, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Post not found' });
    }

    return res.status(200).json({ 
      message: 'Post updated successfully',
      post: result.rows[0]
    });
  } catch (err) {
    console.error('Update post error:', err);
    return res.status(500).json({ 
      message: 'Could not update post',
      error: err.message 
    });
  }
});

// Delete post
app.delete('/api/posts/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM posts WHERE id = $1 RETURNING *', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Post not found' });
    }

    return res.status(200).json({ message: 'Post deleted successfully' });
  } catch (err) {
    console.error('Delete post error:', err);
    return res.status(500).json({ 
      message: 'Could not delete post',
      error: err.message 
    });
  }
});

app.get('/api/profile', (req, res) => {
  res.status(200).json({
    data: { name: 'john', age: 20 }
  });
});

app.listen(PORT, () => console.log(`API running on http://localhost:${PORT}`));