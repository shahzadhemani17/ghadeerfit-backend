import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { generateSlug } from '../utils/slugify';

const prisma = new PrismaClient();

export const getAllCategories = async (req: Request, res: Response) => {
  try {
    const categories = await prisma.category.findMany({
      orderBy: {
        name: 'asc',
      },
      include: {
        _count: {
          select: { videos: true }
        }
      }
    });
    res.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
};

export const getCategoryById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const category = await prisma.category.findUnique({
      where: { id },
      include: {
        _count: {
          select: { videos: true }
        }
      }
    });

    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }

    res.json(category);
  } catch (error) {
    console.error('Error fetching category:', error);
    res.status(500).json({ error: 'Failed to fetch category' });
  }
};

export const createCategory = async (req: Request, res: Response) => {
  try {
    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Category name is required' });
    }

    // Generate slug from name
    const slug = generateSlug(name);

    // Check if category with same name or slug exists
    const existing = await prisma.category.findFirst({
      where: {
        OR: [
          { name },
          { slug }
        ]
      }
    });

    if (existing) {
      return res.status(400).json({ 
        error: 'A category with this name already exists' 
      });
    }

    const category = await prisma.category.create({
      data: {
        name,
        slug,
        description: description || null,
      },
    });

    res.status(201).json(category);
  } catch (error) {
    console.error('Error creating category:', error);
    res.status(500).json({ error: 'Failed to create category' });
  }
};

export const updateCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Category name is required' });
    }

    // Generate new slug if name changed
    const slug = generateSlug(name);

    // Check if another category has the same name or slug
    const existing = await prisma.category.findFirst({
      where: {
        AND: [
          { id: { not: id } },
          {
            OR: [
              { name },
              { slug }
            ]
          }
        ]
      }
    });

    if (existing) {
      return res.status(400).json({ 
        error: 'Another category with this name already exists' 
      });
    }

    const category = await prisma.category.update({
      where: { id },
      data: {
        name,
        slug,
        description: description || null,
      },
    });

    res.json(category);
  } catch (error) {
    console.error('Error updating category:', error);
    res.status(500).json({ error: 'Failed to update category' });
  }
};

export const deleteCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Check if category has associated videos
    const category = await prisma.category.findUnique({
      where: { id },
      include: {
        _count: {
          select: { videos: true }
        }
      }
    });

    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }

    if (category._count.videos > 0) {
      return res.status(400).json({ 
        error: `Cannot delete category. It has ${category._count.videos} associated video(s)` 
      });
    }

    await prisma.category.delete({
      where: { id },
    });

    res.json({ message: 'Category deleted successfully' });
  } catch (error) {
    console.error('Error deleting category:', error);
    res.status(500).json({ error: 'Failed to delete category' });
  }
};

