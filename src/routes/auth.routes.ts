import { Router } from 'express';
import { login, logout, checkAuth } from '../controllers/auth.controller';

const router = Router();

// POST /api/auth/login - Login user
router.post('/login', login);

// POST /api/auth/logout - Logout user
router.post('/logout', logout);

// GET /api/auth/check - Check authentication status
router.get('/check', checkAuth);

export default router;

