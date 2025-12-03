import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { deleteFile } from '../utils/fileUpload';

const prisma = new PrismaClient();

// Helper function to extract relative path from full URL
const extractRelativePath = (url: string): string => {
  if (url.startsWith('/images/')) {
    return url;
  }
  // Extract /images/... from full URL
  const match = url.match(/\/images\/[^/]+$/);
  return match ? match[0] : url;
};

export const getAllBanners = async (req: Request, res: Response) => {
  try {
    const { active_only } = req.query;
    
    const where: any = {};
    if (active_only === 'true') {
      where.is_active = true;
    }

    const banners = await prisma.bannerImage.findMany({
      where,
      orderBy: {
        order: 'asc',
      },
    });
    res.json(banners);
  } catch (error) {
    console.error('Error fetching banners:', error);
    res.status(500).json({ error: 'Failed to fetch banners' });
  }
};

export const getBannerById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const banner = await prisma.bannerImage.findUnique({
      where: { id: Number(id) },
    });

    if (!banner) {
      return res.status(404).json({ error: 'Banner not found' });
    }

    res.json(banner);
  } catch (error) {
    console.error('Error fetching banner:', error);
    res.status(500).json({ error: 'Failed to fetch banner' });
  }
};

export const createBanner = async (req: Request, res: Response) => {
  try {
    const { title, link_url, is_active, order } = req.body;
    const relativePath = (req as any).file ? `/images/${(req as any).file.filename}` : null;

    if (!relativePath) {
      return res.status(400).json({ error: 'Banner image is required' });
    }

    // Construct full URL with base URL
    const baseUrl = process.env.BASE_URL || `${req.protocol}://${req.get('host')}`;
    const image_url = `${baseUrl}${relativePath}`;

    const banner = await prisma.bannerImage.create({
      data: {
        title: title || null,
        image_url,
        link_url: link_url || null,
        is_active: is_active === 'true' || is_active === true,
        order: order ? parseInt(order) : 0,
      },
    });

    res.status(201).json(banner);
  } catch (error) {
    console.error('Error creating banner:', error);
    if ((req as any).file) {
      deleteFile(`/images/${(req as any).file.filename}`);
    }
    res.status(500).json({ error: 'Failed to create banner' });
  }
};

export const updateBanner = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title, link_url, is_active, order } = req.body;
    const relativePath = (req as any).file ? `/images/${(req as any).file.filename}` : undefined;

    // Get existing banner
    const existingBanner = await prisma.bannerImage.findUnique({
      where: { id: Number(id) },
    });

    if (!existingBanner) {
      if (relativePath) deleteFile(relativePath);
      return res.status(404).json({ error: 'Banner not found' });
    }

    const updateData: any = {
      title: title !== undefined ? (title || null) : existingBanner.title,
      link_url: link_url || null,
      is_active: is_active === 'true' || is_active === true,
      order: order ? parseInt(order) : existingBanner.order,
    };

    if (relativePath) {
      // Construct full URL with base URL
      const baseUrl = process.env.BASE_URL || `${req.protocol}://${req.get('host')}`;
      updateData.image_url = `${baseUrl}${relativePath}`;
    }

    const banner = await prisma.bannerImage.update({
      where: { id: Number(id) },
      data: updateData,
    });

    // Delete old image if new one uploaded
    if (relativePath && existingBanner.image_url) {
      const oldRelativePath = extractRelativePath(existingBanner.image_url);
      deleteFile(oldRelativePath);
    }

    res.json(banner);
  } catch (error) {
    console.error('Error updating banner:', error);
    if ((req as any).file) {
      deleteFile(`/images/${(req as any).file.filename}`);
    }
    res.status(500).json({ error: 'Failed to update banner' });
  }
};

export const deleteBanner = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const banner = await prisma.bannerImage.findUnique({
      where: { id: Number(id) },
    });

    if (!banner) {
      return res.status(404).json({ error: 'Banner not found' });
    }

    await prisma.bannerImage.delete({
      where: { id: Number(id) },
    });

    // Delete image file
    if (banner.image_url) {
      const relativePath = extractRelativePath(banner.image_url);
      deleteFile(relativePath);
    }

    res.json({ message: 'Banner deleted successfully' });
  } catch (error) {
    console.error('Error deleting banner:', error);
    res.status(500).json({ error: 'Failed to delete banner' });
  }
};

