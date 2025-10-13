import { Router } from "express";
import validatePostData from "../middleware/postValidation.mjs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const postRouter = Router();

// GET /posts - Get all posts with pagination
postRouter.get("/", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 6;
    const category = req.query.category;
    const keyword = req.query.keyword;

    const skip = (page - 1) * limit;
    const where = {};

    if (category) {
      where.categories = { name: category };
    }

    if (keyword) {
      where.OR = [
        { title: { contains: keyword, mode: "insensitive" } },
        { description: { contains: keyword, mode: "insensitive" } },
        { content: { contains: keyword, mode: "insensitive" } },
      ];
    }

    const totalPosts = await prisma.posts.count({ where });
    const posts = await prisma.posts.findMany({
      where,
      skip,
      take: limit,
      include: { categories: true, statuses: true },
      orderBy: { date: "desc" },
    });

    const transformedPosts = posts.map((post) => ({
      id: post.id,
      image: post.image,
      category: post.categories?.name || null,
      title: post.title,
      description: post.description,
      date: post.date,
      content: post.content,
      status: post.statuses?.status || null,
      likes_count: post.likes_count || 0,
    }));

    const totalPages = Math.ceil(totalPosts / limit);
    const nextPage = page < totalPages ? page + 1 : null;

    return res.status(200).json({
      totalPosts,
      totalPages,
      currentPage: page,
      limit,
      posts: transformedPosts,
      nextPage,
    });
  } catch (err) {
    console.error("Get posts error:", err);
    return res.status(500).json({
      message: "Server could not read post because database connection",
    });
  }
});

// GET /posts/:postId - Get single post
postRouter.get("/:postId", async (req, res) => {
  try {
    const { postId } = req.params;
    const post = await prisma.posts.findUnique({
      where: { id: parseInt(postId) },
      include: { categories: true, statuses: true },
    });

    if (!post) {
      return res.status(404).json({
        message: "Server could not find a requested post",
      });
    }

    const response = {
      id: post.id,
      image: post.image,
      category: post.categories?.name || null,
      title: post.title,
      description: post.description,
      date: post.date,
      content: post.content,
      status: post.statuses?.status || null,
      likes_count: post.likes_count || 0,
    };

    return res.status(200).json(response);
  } catch (err) {
    console.error("Get post error:", err);
    return res.status(500).json({
      message: "Server could not read post because database connection",
    });
  }
});

// POST /posts - Create post
postRouter.post("/", validatePostData, async (req, res) => {
  try {
    const { title, image, category_id, description, content, status_id } =
      req.body;

    const post = await prisma.posts.create({
      data: { title, image, category_id, description, content, status_id },
      include: { categories: true, statuses: true },
    });

    return res.status(201).json({ message: "Created post sucessfully" });
  } catch (err) {
    console.error("Create post error:", err);
    return res.status(500).json({
      message: "Server could not create post because database connection",
    });
  }
});

// PUT /posts/:postId - Update post
postRouter.put("/:postId", validatePostData, async (req, res) => {
  try {
    const { postId } = req.params;
    const { title, image, category_id, description, content, status_id } =
      req.body;

    const post = await prisma.posts.update({
      where: { id: parseInt(postId) },
      data: { title, image, category_id, description, content, status_id },
    });

    return res.status(200).json({ message: "Updated post sucessfully" });
  } catch (err) {
    if (err.code === "P2025") {
      return res.status(404).json({
        message: "Server could not find a requested post to update",
      });
    }
    console.error("Update post error:", err);
    return res.status(500).json({
      message: "Server could not update post because database connection",
    });
  }
});

// DELETE /posts/:postId - Delete post
postRouter.delete("/:postId", async (req, res) => {
  try {
    const { postId } = req.params;
    await prisma.posts.delete({
      where: { id: parseInt(postId) },
    });

    return res.status(200).json({ message: "Deleted post sucessfully" });
  } catch (err) {
    if (err.code === "P2025") {
      return res.status(404).json({
        message: "Server could not find a requested post to delete",
      });
    }
    console.error("Delete post error:", err);
    return res.status(500).json({
      message: "Server could not delete post because database connection",
    });
  }
});

export default postRouter;
