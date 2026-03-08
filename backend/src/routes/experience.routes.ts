import { Router } from 'express';
import Experience from '../models/Experience';
import { authenticate } from '../middleware/auth';

const router = Router();

router.get('/', async (req, res) => {
    const exps = await Experience.find().sort({ order: 1 });
    res.json({ success: true, data: exps });
});

router.post('/', authenticate, async (req, res) => {
    const exp = await Experience.create(req.body);
    res.status(201).json({ success: true, data: exp });
});

router.delete('/:id', authenticate, async (req, res) => {
    await Experience.findByIdAndDelete(req.params.id);
    res.json({ success: true });
});

export default router;
