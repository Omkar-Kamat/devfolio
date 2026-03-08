import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import { LoginSchema } from '../utils/schemas';

const generateTokens = (userId: string, email: string) => {
    const accessToken = jwt.sign(
        { id: userId, email },
        process.env.JWT_SECRET || 'secret',
        { expiresIn: '15m' }
    );
    const refreshToken = jwt.sign(
        { id: userId },
        process.env.JWT_REFRESH_SECRET || 'refresh_secret',
        { expiresIn: '7d' }
    );
    return { accessToken, refreshToken };
};

// Cookie options — centralised so login, refresh, and logout are always consistent
const refreshCookieOptions = {
    httpOnly: true,                                           // Unreadable by JS — XSS safe
    secure: process.env.NODE_ENV === 'production',            // HTTPS only in prod
    sameSite: 'strict' as const,                              // CSRF protection
    path: '/api/auth',                                        // Scoped — NOT sent on every API call
    maxAge: 7 * 24 * 60 * 60 * 1000,                         // 7 days
};

const sessionCookieOptions = {
    httpOnly: false,                                          // Must be readable by Next.js middleware at edge
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    path: '/',
    maxAge: 7 * 24 * 60 * 60 * 1000,
};

export const login = async (req: Request, res: Response) => {
    const parsed = LoginSchema.safeParse(req.body);
    if (!parsed.success) {
        return res.status(400).json({ success: false, errors: parsed.error.errors });
    }

    const { email, password } = parsed.data;

    const user = await User.findOne({ email });
    if (!user) {
        return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
        return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const { accessToken, refreshToken } = generateTokens(user.id, user.email);

    const salt = await bcrypt.genSalt(10);
    user.refreshTokenHash = await bcrypt.hash(refreshToken, salt);
    user.refreshTokenExpiry = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    user.lastLogin = new Date();
    await user.save();

    // refresh_token: HttpOnly + Strict + scoped to /api/auth only
    res.cookie('refresh_token', refreshToken, refreshCookieOptions);
    // session: readable by Next.js middleware edge function to protect /admin/* routes
    res.cookie('session', '1', sessionCookieOptions);

    // Access token returned in body ONLY — stored in Zustand memory (never localStorage)
    res.json({ success: true, accessToken });
};

export const logout = async (req: Request, res: Response) => {
    // Must clear cookies with the SAME path/domain they were set with — otherwise browser ignores it
    res.cookie('refresh_token', '', { ...refreshCookieOptions, maxAge: 0 });
    res.cookie('session', '', { ...sessionCookieOptions, maxAge: 0 });
    res.json({ success: true, message: 'Logged out successfully' });
};

export const refresh = async (req: Request, res: Response) => {
    const refreshToken = req.cookies.refresh_token;
    if (!refreshToken) {
        return res.status(401).json({ success: false, message: 'No refresh token' });
    }

    // Express 5: thrown errors auto-propagate to global error handler — no outer try/catch needed
    const decoded = jwt.verify(
        refreshToken,
        process.env.JWT_REFRESH_SECRET || 'refresh_secret'
    ) as { id: string };

    const user = await User.findById(decoded.id);
    if (!user || !user.refreshTokenHash || !user.refreshTokenExpiry) {
        return res.status(401).json({ success: false, message: 'Invalid refresh token' });
    }

    // Check expiry stored in DB (defence-in-depth — even if JWT hasn't expired yet)
    if (user.refreshTokenExpiry < new Date()) {
        return res.status(401).json({ success: false, message: 'Refresh token expired' });
    }

    const isMatch = await bcrypt.compare(refreshToken, user.refreshTokenHash);
    if (!isMatch) {
        return res.status(401).json({ success: false, message: 'Invalid refresh token' });
    }

    // Rotate refresh token — old token is invalidated immediately
    const tokens = generateTokens(user.id, user.email);
    const salt = await bcrypt.genSalt(10);
    user.refreshTokenHash = await bcrypt.hash(tokens.refreshToken, salt);
    user.refreshTokenExpiry = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    await user.save();

    res.cookie('refresh_token', tokens.refreshToken, refreshCookieOptions);
    res.cookie('session', '1', sessionCookieOptions);

    res.json({ success: true, accessToken: tokens.accessToken });
};
