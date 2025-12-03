import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

// Extend Express Session to include userId
declare module 'express-session' {
  interface SessionData {
    userId: number;
  }
}

// Login
export const login = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

    // Validate input
    if (!username || !password) {
      return res.status(400).json({ 
        success: false,
        error: 'Username and password are required' 
      });
    }

    // Find user by username
    const user = await prisma.user.findUnique({
      where: { username }
    });

    if (!user) {
      return res.status(401).json({ 
        success: false,
        error: 'Invalid username or password' 
      });
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return res.status(401).json({ 
        success: false,
        error: 'Invalid username or password' 
      });
    }

    // Set session
    req.session.userId = user.id;

    res.json({ 
      success: true,
      message: 'Login successful',
      user: {
        id: user.id,
        username: user.username
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      success: false,
      error: 'An error occurred during login' 
    });
  }
};

// Logout
export const logout = async (req: Request, res: Response) => {
  try {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ 
          success: false,
          error: 'Failed to logout' 
        });
      }
      res.clearCookie('connect.sid');
      res.json({ 
        success: true,
        message: 'Logout successful' 
      });
    });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ 
      success: false,
      error: 'An error occurred during logout' 
    });
  }
};

// Check authentication status
export const checkAuth = async (req: Request, res: Response) => {
  try {
    if (!req.session.userId) {
      return res.status(401).json({ 
        success: false,
        authenticated: false 
      });
    }

    const user = await prisma.user.findUnique({
      where: { id: req.session.userId },
      select: {
        id: true,
        username: true
      }
    });

    if (!user) {
      return res.status(401).json({ 
        success: false,
        authenticated: false 
      });
    }

    res.json({ 
      success: true,
      authenticated: true,
      user: {
        id: user.id,
        username: user.username
      }
    });
  } catch (error) {
    console.error('Check auth error:', error);
    res.status(500).json({ 
      success: false,
      error: 'An error occurred while checking authentication' 
    });
  }
};

