import express from 'express';
import cors from 'cors';
import session from 'express-session';
import dotenv from 'dotenv';
import path from 'path';
import videoRoutes from './routes/video.routes';
import notificationRoutes from './routes/notification.routes';
import categoryRoutes from './routes/category.routes';
import bannerRoutes from './routes/banner.routes';
import authRoutes from './routes/auth.routes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// CORS Configuration
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5000',
  'http://localhost:5001',
  'https://ghadeerfit-backend.onrender.com',
  process.env.FRONTEND_URL,
  process.env.BACKEND_URL
].filter(Boolean); // Remove undefined values

const corsOptions = {
  origin: function (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) {
    // Allow requests with no origin (like mobile apps, Postman, or same-origin)
    if (!origin) {
      return callback(null, true);
    }
    
    // Check if origin is in allowed list
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      // In production, you might want to be more restrictive
      // For now, we'll allow all origins for API access
      callback(null, true);
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
  exposedHeaders: ['Content-Range', 'X-Content-Range'],
  maxAge: 86400 // 24 hours
};

// Middleware
app.use(cors(corsOptions));

// Handle preflight requests
app.options('*', cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session configuration
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-secret-key-change-this-in-production',
  resave: false,
  saveUninitialized: false,
  name: 'ghadeerfit.sid', // Custom session name
  proxy: process.env.NODE_ENV === 'production', // Trust proxy in production (Render uses proxy)
  cookie: {
    secure: process.env.NODE_ENV === 'production', // HTTPS only in production
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    sameSite: 'lax', // 'lax' works for same-origin (admin on same domain as API)
    path: '/' // Cookie available for all paths
  }
}));

// Serve static files (admin panel and images)
app.use(express.static(path.join(__dirname, '../public')));

// Login page route
app.get('/login', (req: express.Request, res: express.Response) => {
  res.sendFile(path.join(__dirname, '../public/login.html'));
});

// Admin panel route
app.get('/admin', (req: express.Request, res: express.Response) => {
  res.sendFile(path.join(__dirname, '../public/admin.html'));
});

// Root route - redirect to login
app.get('/', (req: express.Request, res: express.Response) => {
  res.redirect('/login');
});

// Health check
app.get('/health', (req: express.Request, res: express.Response) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

// Debug endpoint (remove in production or protect with auth)
app.get('/debug/session', (req: express.Request, res: express.Response) => {
  res.json({
    sessionID: req.sessionID,
    session: req.session,
    cookies: req.headers.cookie,
    nodeEnv: process.env.NODE_ENV,
    hasUserId: !!req.session.userId
  });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/videos', videoRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/banners', bannerRoutes);

// Error handling middleware
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

