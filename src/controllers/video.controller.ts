import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getAllVideos = async (req: Request, res: Response) => {
  try {
    const { 
      search, 
      category_ids, 
      cursor, 
      limit = '10' 
    } = req.query;

    const take = parseInt(limit as string);
    const where: any = {};

    // Search filter
    if (search && typeof search === 'string') {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    // Category filter
    if (category_ids && typeof category_ids === 'string') {
      const categoryArray = category_ids.split(',').filter(Boolean);
      if (categoryArray.length > 0) {
        where.categories = {
          some: {
            categoryId: { in: categoryArray }
          }
        };
      }
    }

    // Build cursor-based query
    const queryOptions: any = {
      take: take + 1, // Fetch one extra to check if there are more
      where,
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        categories: {
          include: {
            category: true
          }
        }
      }
    };

    if (cursor && typeof cursor === 'string') {
      queryOptions.cursor = { id: parseInt(cursor) };
      queryOptions.skip = 1; // Skip the cursor itself
    }

    const videos = await prisma.video.findMany(queryOptions);

    // Check if there are more videos
    const hasMore = videos.length > take;
    const videosToReturn = hasMore ? videos.slice(0, -1) : videos;

    // Get next cursor
    const nextCursor = hasMore 
      ? videosToReturn[videosToReturn.length - 1].id.toString()
      : null;

    res.json({
      videos: videosToReturn,
      nextCursor,
      hasMore,
    });
  } catch (error) {
    console.error('Error fetching videos:', error);
    res.status(500).json({ error: 'Failed to fetch videos' });
  }
};

export const getVideoById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const video = await prisma.video.findUnique({
      where: { id: Number(id) },
      include: {
        categories: {
          include: {
            category: true
          }
        }
      }
    });

    if (!video) {
      return res.status(404).json({ error: 'Video not found' });
    }

    res.json(video);
  } catch (error) {
    console.error('Error fetching video:', error);
    res.status(500).json({ error: 'Failed to fetch video' });
  }
};

export const createVideo = async (req: Request, res: Response) => {
  try {
    const { title, video_link, description, category_ids } = req.body;

    if (!title || !video_link) {
      return res.status(400).json({ error: 'Title and video_link are required' });
    }

    // Parse category IDs if provided
    let categoryIds: string[] = [];
    if (category_ids) {
      try {
        categoryIds = typeof category_ids === 'string' 
          ? JSON.parse(category_ids) 
          : category_ids;
      } catch (e) {
        return res.status(400).json({ error: 'Invalid category_ids format' });
      }
    }

    const video = await prisma.video.create({
      data: {
        title,
        video_link,
        description: description || null,
        categories: {
          create: categoryIds.map((categoryId: string) => ({
            category: {
              connect: { id: categoryId }
            }
          }))
        }
      },
      include: {
        categories: {
          include: {
            category: true
          }
        }
      }
    });

    res.status(201).json(video);
  } catch (error) {
    console.error('Error creating video:', error);
    res.status(500).json({ error: 'Failed to create video' });
  }
};

export const updateVideo = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title, video_link, description, category_ids } = req.body;

    if (!title || !video_link) {
      return res.status(400).json({ error: 'Title and video_link are required' });
    }

    // Check if video exists
    const existingVideo = await prisma.video.findUnique({
      where: { id: Number(id) },
    });

    if (!existingVideo) {
      return res.status(404).json({ error: 'Video not found' });
    }

    // Parse category IDs if provided
    let categoryIds: string[] | undefined;
    if (category_ids !== undefined) {
      try {
        categoryIds = typeof category_ids === 'string' 
          ? JSON.parse(category_ids) 
          : category_ids;
      } catch (e) {
        return res.status(400).json({ error: 'Invalid category_ids format' });
      }
    }

    // Build update data
    const updateData: any = {
      title,
      video_link,
      description: description || null,
    };

    // Update categories if provided
    if (categoryIds !== undefined) {
      // Delete existing associations and create new ones
      await prisma.videoCategory.deleteMany({
        where: { videoId: Number(id) }
      });

      updateData.categories = {
        create: categoryIds.map((categoryId: string) => ({
          category: {
            connect: { id: categoryId }
          }
        }))
      };
    }

    const video = await prisma.video.update({
      where: { id: Number(id) },
      data: updateData,
      include: {
        categories: {
          include: {
            category: true
          }
        }
      }
    });

    res.json(video);
  } catch (error) {
    console.error('Error updating video:', error);
    res.status(500).json({ error: 'Failed to update video' });
  }
};

export const deleteVideo = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const video = await prisma.video.findUnique({
      where: { id: Number(id) },
    });

    if (!video) {
      return res.status(404).json({ error: 'Video not found' });
    }

    await prisma.video.delete({
      where: { id: Number(id) },
    });

    res.json({ message: 'Video deleted successfully' });
  } catch (error) {
    console.error('Error deleting video:', error);
    res.status(500).json({ error: 'Failed to delete video' });
  }
};

