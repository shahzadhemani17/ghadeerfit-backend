import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getAllNotifications = async (req: Request, res: Response) => {
  try {
    const notifications = await prisma.notification.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
    res.json(notifications);
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ error: 'Failed to fetch notifications' });
  }
};

export const getNotificationById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const notification = await prisma.notification.findUnique({
      where: { id: Number(id) },
    });

    if (!notification) {
      return res.status(404).json({ error: 'Notification not found' });
    }

    res.json(notification);
  } catch (error) {
    console.error('Error fetching notification:', error);
    res.status(500).json({ error: 'Failed to fetch notification' });
  }
};

export const createNotification = async (req: Request, res: Response) => {
  try {
    const { title, description } = req.body;

    if (!title || !description) {
      return res.status(400).json({ error: 'Title and description are required' });
    }

    const notification = await prisma.notification.create({
      data: {
        title,
        description,
      },
    });

    res.status(201).json(notification);
  } catch (error) {
    console.error('Error creating notification:', error);
    res.status(500).json({ error: 'Failed to create notification' });
  }
};

export const updateNotification = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title, description } = req.body;

    if (!title || !description) {
      return res.status(400).json({ error: 'Title and description are required' });
    }

    const notification = await prisma.notification.update({
      where: { id: Number(id) },
      data: {
        title,
        description,
      },
    });

    res.json(notification);
  } catch (error) {
    console.error('Error updating notification:', error);
    res.status(500).json({ error: 'Failed to update notification' });
  }
};

export const deleteNotification = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await prisma.notification.delete({
      where: { id: Number(id) },
    });

    res.json({ message: 'Notification deleted successfully' });
  } catch (error) {
    console.error('Error deleting notification:', error);
    res.status(500).json({ error: 'Failed to delete notification' });
  }
};

