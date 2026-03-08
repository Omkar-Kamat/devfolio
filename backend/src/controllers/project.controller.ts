import { Request, Response } from 'express';
import Project from '../models/Project';

export const getAllProjects = async (req: Request, res: Response) => {
    const query = req.query.featured === 'true' ? { featured: true } : {};
    const projects = await Project.find(query).sort({ order: 1 });
    res.json({ success: true, count: projects.length, data: projects });
};

export const getProject = async (req: Request, res: Response) => {
    const project = await Project.findById(req.params.id);
    if (!project) {
        return res.status(404).json({ success: false, message: 'Project not found' });
    }
    res.json({ success: true, data: project });
};

export const createProject = async (req: Request, res: Response) => {
    const project = await Project.create(req.body);
    res.status(201).json({ success: true, data: project });
};

export const updateProject = async (req: Request, res: Response) => {
    const project = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!project) {
        return res.status(404).json({ success: false, message: 'Project not found' });
    }
    res.json({ success: true, data: project });
};

export const deleteProject = async (req: Request, res: Response) => {
    const project = await Project.findByIdAndDelete(req.params.id);
    if (!project) {
        return res.status(404).json({ success: false, message: 'Project not found' });
    }
    res.json({ success: true, data: {} });
};

export const reorderProjects = async (req: Request, res: Response) => {
    const { projects } = req.body; // array of { id, order }
    if (!projects || !Array.isArray(projects)) {
        return res.status(400).json({ success: false, message: 'Invalid data' });
    }

    const updates = projects.map(p =>
        Project.findByIdAndUpdate(p.id, { order: p.order })
    );

    await Promise.all(updates);
    res.json({ success: true, message: 'Projects reordered successfully' });
};
