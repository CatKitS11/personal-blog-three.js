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
app.get('/posts', async (req, res) => {
  try {
    // Get query parameters with defaults // EDIT: Add query params
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 6;
    const category = req.query.category;
    const keyword = req.query.keyword;
    
    // Calculate skip for pagination // EDIT: Calculate offset
    const skip = (page - 1) * limit;
    
    // Build where clause for filtering // EDIT: Build filter conditions
    const where = {};
    
    // Filter by category if provided // EDIT: Category filter
    if (category) {
      where.categories = {
        name: category
      };
    }
    
    // Search by keyword in title, description, or content // EDIT: Keyword search
    if (keyword) {
      where.OR = [
        { title: { contains: keyword, mode: 'insensitive' } },
        { description: { contains: keyword, mode: 'insensitive' } },
        { content: { contains: keyword, mode: 'insensitive' } }
      ];
    }
    
    // Get total count for pagination // EDIT: Count total posts
    const totalPosts = await prisma.posts.count({ where });
    
    // Get posts with pagination // EDIT: Fetch posts with pagination
    const posts = await prisma.posts.findMany({
      where,
      skip,
      take: limit,
      include: {
        categories: true,
        statuses: true
      },
      orderBy: {
        date: 'desc' // EDIT: Order by date descending
      }
    });
    
    // Transform posts to flat structure // EDIT: Transform response
    const transformedPosts = posts.map(post => ({
      id: post.id,
      image: post.image,
      category: post.categories?.name || null,
      title: post.title,
      description: post.description,
      date: post.date,
      content: post.content,
      status: post.statuses?.status || null,
      likes_count: post.likes_count || 0
    }));
    
    // Calculate pagination metadata // EDIT: Calculate pagination info
    const totalPages = Math.ceil(totalPosts / limit);
    const nextPage = page < totalPages ? page + 1 : null;
    
    // Return paginated response // EDIT: Return pagination response
    return res.status(200).json({
      totalPosts,
      totalPages,
      currentPage: page,
      limit,
      posts: transformedPosts,
      nextPage
    });
  } catch (err) {
    console.error('Get posts error:', err);
    return res.status(500).json({ 
      "message": "Server could not read post because database connection"
    });
  }
});

// Get single post
app.get('/posts/:postId', async (req, res) => {
  try {
    const { postId } = req.params;
    const post = await prisma.posts.findUnique({
      where: { id: parseInt(postId) },
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
app.post('/posts', async (req, res) => {
  try {
    const { title, image, category_id, description, content, status_id } = req.body;
    
    // Validate title // EDIT: Add title validation
    if (!title) {
      return res.status(400).json({ message: "Title is required" });
    }
    if (typeof title !== 'string') {
      return res.status(400).json({ message: "Title must be a string" });
    }

    // Validate image // EDIT: Add image validation
    if (!image) {
      return res.status(400).json({ message: "Image is required" });
    }
    if (typeof image !== 'string') {
      return res.status(400).json({ message: "Image must be a string" });
    }

    // Validate category_id // EDIT: Add category_id validation
    if (category_id === undefined || category_id === null) {
      return res.status(400).json({ message: "Category ID is required" });
    }
    if (typeof category_id !== 'number') {
      return res.status(400).json({ message: "Category ID must be a number" });
    }

    // Validate description // EDIT: Add description validation
    if (!description) {
      return res.status(400).json({ message: "Description is required" });
    }
    if (typeof description !== 'string') {
      return res.status(400).json({ message: "Description must be a string" });
    }

    // Validate content // EDIT: Add content validation
    if (!content) {
      return res.status(400).json({ message: "Content is required" });
    }
    if (typeof content !== 'string') {
      return res.status(400).json({ message: "Content must be a string" });
    }

    // Validate status_id // EDIT: Add status_id validation
    if (status_id !== undefined && status_id !== null && typeof status_id !== 'number') {
      return res.status(400).json({ message: "Status ID must be a number" });
    }

    const post = await prisma.posts.create({
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

    return res.status(201).json({ "message": "Created post sucessfully" });
  } catch (err) {
    console.error('Create post error:', err);
    return res.status(500).json({ "message": "Server could not create post because database connection" });
  }
});

// Update post
app.put('/posts/:postId', async (req, res) => {
  try {
    const { postId } = req.params;
    const { title, image, category_id, description, content, status_id } = req.body;

    // Validate title // EDIT: Add title validation
    if (!title) {
      return res.status(400).json({ message: "Title is required" });
    }
    if (typeof title !== 'string') {
      return res.status(400).json({ message: "Title must be a string" });
    }

    // Validate image // EDIT: Add image validation
    if (!image) {
      return res.status(400).json({ message: "Image is required" });
    }
    if (typeof image !== 'string') {
      return res.status(400).json({ message: "Image must be a string" });
    }

    // Validate category_id // EDIT: Add category_id validation
    if (category_id === undefined || category_id === null) {
      return res.status(400).json({ message: "Category ID is required" });
    }
    if (typeof category_id !== 'number') {
      return res.status(400).json({ message: "Category ID must be a number" });
    }

    // Validate description // EDIT: Add description validation
    if (!description) {
      return res.status(400).json({ message: "Description is required" });
    }
    if (typeof description !== 'string') {
      return res.status(400).json({ message: "Description must be a string" });
    }

    // Validate content // EDIT: Add content validation
    if (!content) {
      return res.status(400).json({ message: "Content is required" });
    }
    if (typeof content !== 'string') {
      return res.status(400).json({ message: "Content must be a string" });
    }

    // Validate status_id // EDIT: Add status_id validation
    if (status_id !== undefined && status_id !== null && typeof status_id !== 'number') {
      return res.status(400).json({ message: "Status ID must be a number" });
    }

    const post = await prisma.posts.update({
      where: { id: parseInt(postId) },
      data: {
        title,
        image,
        category_id,
        description,
        content,
        status_id
      }
    });

    return res.status(200).json({ "message": "Updated post sucessfully" });
  } catch (err) {
    if (err.code === 'P2025') {
      return res.status(404).json({ "message": "Server could not find a requested post to update" });
    }
    console.error('Update post error:', err);
    return res.status(500).json({ "message": "Server could not update post because database connection" });
  }
});

// Delete post
app.delete('/posts/:postId', async (req, res) => {
  try {
    const { postId } = req.params;
    await prisma.posts.delete({
      where: { id: parseInt(postId) }
    });

    return res.status(200).json({ "message": "Deleted post sucessfully" });
  } catch (err) {
    if (err.code === 'P2025') {
      return res.status(404).json({ "message": "Server could not find a requested post to delete" });
    }
    console.error('Delete post error:', err);
    return res.status(500).json({ "message": "Server could not delete post because database connection" });
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