import { Router } from 'express';
import Blog from '../models/Blog';
import { authenticate } from '../middleware/auth';

const router = Router();

router.get('/', async (req, res) => {
    const blogs = await Blog.find({ status: 'published' }).sort({ createdAt: -1 });
    res.json({ success: true, data: blogs });
});

router.get('/:slug', async (req, res) => {
    const blog = await Blog.findOne({ slug: req.params.slug });
    if (!blog) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, data: blog });
});

router.post('/', authenticate, async (req, res) => {
    const blog = await Blog.create(req.body);
    res.status(201).json({ success: true, data: blog });
});

router.put('/:id', authenticate, async (req, res) => {
    const blog = await Blog.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, data: blog });
});

router.delete('/:id', authenticate, async (req, res) => {
    await Blog.findByIdAndDelete(req.params.id);
    res.json({ success: true });
});

export default router;
