import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import { LoginSchema } from '../utils/schemas';

const generateTokens = (userId: string, email: string) => {
    const accessToken = jwt.sign({ id: userId, email }, process.env.JWT_SECRET || 'secret', {
        expiresIn: '15m',
    });

    const refreshToken = jwt.sign({ id: userId }, process.env.JWT_REFRESH_SECRET || 'refresh_secret', {
        expiresIn: '7d',
    });

    return { accessToken, refreshToken };
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

    // Hash refresh token for DB
    const salt = await bcrypt.genSalt(10);
    const refreshTokenHash = await bcrypt.hash(refreshToken, salt);

    user.refreshTokenHash = refreshTokenHash;
    user.lastLogin = new Date();
    await user.save();

    // Set cookies
    res.cookie('refresh_token', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    res.cookie('session', '1', {
        httpOnly: false,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    res.json({ success: true, accessToken });
};

export const logout = async (req: Request, res: Response) => {
    res.cookie('refresh_token', '', { expires: new Date(0) });
    res.cookie('session', '', { expires: new Date(0) });
    res.json({ success: true, message: 'Logged out successfully' });
};

export const refresh = async (req: Request, res: Response) => {
    const refreshToken = req.cookies.refresh_token;
    if (!refreshToken) {
        return res.status(401).json({ success: false, message: 'No refresh token' });
    }

    try {
        const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET || 'refresh_secret') as { id: string };
        const user = await User.findById(decoded.id);

        if (!user || !user.refreshTokenHash) {
            return res.status(401).json({ success: false, message: 'Invalid refresh token' });
        }

        const isMatch = await bcrypt.compare(refreshToken, user.refreshTokenHash);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: 'Invalid refresh token' });
        }

        // Generate new tokens (rotation)
        const tokens = generateTokens(user.id, user.email);
        const salt = await bcrypt.genSalt(10);
        user.refreshTokenHash = await bcrypt.hash(tokens.refreshToken, salt);
        await user.save();

        res.cookie('refresh_token', tokens.refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });

        res.cookie('session', '1', {
            httpOnly: false,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });

        res.json({ success: true, accessToken: tokens.accessToken });
    } catch (err) {
        return res.status(401).json({ success: false, message: 'Invalid refresh token' });
    }
};
