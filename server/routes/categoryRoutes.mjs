import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import protectAdmin from "../middlewares/protectAdmin.mjs";

const prisma = new PrismaClient();
const categoryRouter = Router();

// GET /categories - Get all categories
categoryRouter.get("/", async (req, res) => {
  try {
    const categories = await prisma.categories.findMany({
      orderBy: { name: 'asc' }
    });
    return res.status(200).json({ categories });
  } catch (err) {
    return res.status(500).json({ message: "Failed to fetch categories" });
  }
});

// POST /categories - Create category (Admin only)
categoryRouter.post("/", protectAdmin, async (req, res) => {
  try {
    const { name } = req.body;
    const category = await prisma.categories.create({
      data: { name }
    });
    return res.status(201).json({ message: "Category created successfully", category });
  } catch (err) {
    return res.status(500).json({ message: "Failed to create category" });
  }
});

// PUT /categories/:id - Update category (Admin only)
categoryRouter.put("/:id", protectAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    const category = await prisma.categories.update({
      where: { id: parseInt(id) },
      data: { name }
    });
    return res.status(200).json({ message: "Category updated successfully", category });
  } catch (err) {
    return res.status(500).json({ message: "Failed to update category" });
  }
});

// DELETE /categories/:id - Delete category (Admin only)
categoryRouter.delete("/:id", protectAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.categories.delete({
      where: { id: parseInt(id) }
    });
    return res.status(200).json({ message: "Category deleted successfully" });
  } catch (err) {
    return res.status(500).json({ message: "Failed to delete category" });
  }
});

export default categoryRouter;
