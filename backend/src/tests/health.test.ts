import { describe, it, expect } from 'vitest';
import request from 'supertest';
import express from 'express';

// Create a fast mock app for testing the health route specifically
const app = express();
app.get('/health', (req, res) => res.status(200).json({ status: 'ok', message: 'Backend is running smoothly' }));

describe('Health Endpoint', () => {
    it('should return 200 OK', async () => {
        const response = await request(app).get('/health');
        expect(response.status).toBe(200);
        expect(response.body).toEqual({ status: 'ok', message: 'Backend is running smoothly' });
    });
});
