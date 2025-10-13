import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const app = express();
const PORT = 3002;

app.use(cors());
app.use(express.json());

app.get('/test', (req, res) => {
  res.status(200).json({ message: 'API running' });
});


// Get all posts
app.get('/api/getPosts', async (req, res) => {
  try {
    const posts = await prisma.posts.findMany({
      include: {
        categories: true,
        statuses: true
      }
    });
    return res.status(200).json({ posts });
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
    const post = await prisma.posts.findUnique({
      where: { id: parseInt(id) },
      include: {
        categories: true,
        statuses: true
      }
    });
    
    if (!post) {
      return res.status(404).json({ "message": "Server could not find a requested post" });
    }
    
    // Transform response to match requirement // EDIT: Transform to flat structure
    const response = {
      id: post.id,
      image: post.image,
      category: post.categories?.name || null, // EDIT: Extract category name
      title: post.title,
      description: post.description,
      date: post.date,
      content: post.content,
      status: post.statuses?.status || null, // EDIT: Extract status
      likes_count: post.likes_count || 0 // EDIT: Include likes_count
    };
    
    return res.status(200).json(response); // EDIT: Return flat object directly
  } catch (err) {
    console.error('Get post error:', err);
    return res.status(500).json({ "message": "Server could not read post because database connection" });
  }
});

// Create post
app.post('/api/posts', async (req, res) => {
  try {
    const { title, image, category_id, description, content, status_id } = req.body;
    
    if (!title || !content) {
      return res.status(400).json({ "message": "Server could not create post because there are missing data from client" });
    }

    return res.status(201).json({ "message": "Created post sucessfully" });
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

    const post = await prisma.posts.update({
      where: { id: parseInt(id) },
      data: {
        title,
        image,
        category_id,
        description,
        content,
        status_id
      },
      include: {
        categories: true,
        statuses: true
      }
    });

    return res.status(200).json({ 
      message: 'Post updated successfully',
      post
    });
  } catch (err) {
    if (err.code === 'P2025') {
      return res.status(404).json({ message: 'Post not found' });
    }
    console.error('Update post error:', err);
    return res.status(500).json({ "message": "Server could not create post because database connection" });
  }
});

// Delete post
app.delete('/api/posts/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.posts.delete({
      where: { id: parseInt(id) }
    });

    return res.status(200).json({ message: 'Post deleted successfully' });
  } catch (err) {
    if (err.code === 'P2025') {
      return res.status(404).json({ message: 'Post not found' });
    }
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

// Graceful shutdown
process.on('SIGINT', async () => {
  await prisma.$disconnect();
  process.exit(0);
});

app.listen(PORT, () => console.log(`API running on http://localhost:${PORT}`));