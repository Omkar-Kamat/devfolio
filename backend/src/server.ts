import 'dotenv/config';
import express, { Express, Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';

// import routes
import authRoutes from './routes/auth.routes';
import projectRoutes from './routes/project.routes';
import skillRoutes from './routes/skill.routes';
import experienceRoutes from './routes/experience.routes';
import blogRoutes from './routes/blog.routes';
import contactRoutes from './routes/contact.routes';

const app: Express = express();
const PORT = process.env.PORT || 5000;

// Allowed origins — never use wildcard when credentials: true
const allowedOrigins = (process.env.FRONTEND_URL || 'http://localhost:3000').split(',');

// Global rate limiter — generous for public API
const globalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 200,
    standardHeaders: true,
    legacyHeaders: false,
    message: { success: false, message: 'Too many requests, please try again later.' },
});

// Strict limiter for contact form — 5 requests/hour per IP (per design spec NFR-S-05)
const contactLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 5,
    standardHeaders: true,
    legacyHeaders: false,
    message: { success: false, message: 'Too many contact submissions. Please try again in an hour.' },
});

// Auth endpoint limiter — prevent brute-force
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 20,
    standardHeaders: true,
    legacyHeaders: false,
    message: { success: false, message: 'Too many authentication attempts.' },
});

// Middleware
app.use(helmet());
app.use(cors({
    // Explicitly whitelist origin — credentials require exact origin, NOT '*'
    origin: (origin, callback) => {
        // Allow requests with no origin (e.g. mobile apps, Postman in dev)
        if (!origin) return callback(null, true);
        if (allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error(`CORS: Origin '${origin}' not allowed`));
        }
    },
    credentials: true, // Required for HttpOnly cookie to be sent cross-origin
}));
app.use(globalLimiter);
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Routes — apply specific limiters where needed
app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/skills', skillRoutes);
app.use('/api/experience', experienceRoutes);
app.use('/api/blog', blogRoutes);
app.use('/api/contact', contactLimiter, contactRoutes);

// Health check — used by UptimeRobot to prevent Render cold starts
app.get('/health', (req: Request, res: Response) => {
    res.status(200).json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        db: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    });
});

// Global Error Handler — Express 5 async errors propagate here automatically (no try/catch needed in controllers)
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    // Don't log expected 4xx errors as errors
    const statusCode = err.statusCode || err.status || 500;
    if (statusCode >= 500) {
        console.error('[Server Error]', err);
    }
    // Never expose stack traces in production
    res.status(statusCode).json({
        success: false,
        message: statusCode >= 500 && process.env.NODE_ENV === 'production'
            ? 'Internal Server Error'
            : err.message || 'Internal Server Error',
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    });
});

// Start Server
const startServer = async () => {
    try {
        if (process.env.MONGODB_URI) {
            await mongoose.connect(process.env.MONGODB_URI);
            console.log('Connected to MongoDB');
        } else {
            console.warn('MONGODB_URI not found in env. Running without MongoDB connection for now.');
        }

        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
};

startServer();
