import { Router } from 'express';
import Skill from '../models/Skill';
import { authenticate } from '../middleware/auth';

const router = Router();

router.get('/', async (req, res) => {
    const skills = await Skill.find();
    res.json({ success: true, data: skills });
});

router.post('/', authenticate, async (req, res) => {
    const skill = await Skill.create(req.body);
    res.status(201).json({ success: true, data: skill });
});

router.delete('/:id', authenticate, async (req, res) => {
    await Skill.findByIdAndDelete(req.params.id);
    res.json({ success: true });
});

export default router;
