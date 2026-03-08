import { Request, Response } from 'express';
import Project from '../models/Project';
import { ProjectSchema } from '../utils/schemas';

export const getAllProjects = async (req: Request, res: Response) => {
    const filter: any = { active: { $ne: false } }; // exclude soft-deleted
    if (req.query.featured === 'true') filter.featured = true;
    const projects = await Project.find(filter).sort({ order: 1 });
    res.json({ success: true, count: projects.length, data: projects });
};

export const getProject = async (req: Request, res: Response) => {
    // Design spec uses :slug for public project detail pages
    const project = await Project.findOne({
        $or: [{ _id: req.params.id }, { slug: req.params.id }],
        active: { $ne: false },
    });
    if (!project) {
        return res.status(404).json({ success: false, message: 'Project not found' });
    }
    res.json({ success: true, data: project });
};

export const createProject = async (req: Request, res: Response) => {
    // Validate input with shared Zod schema before touching DB
    const parsed = ProjectSchema.safeParse(req.body);
    if (!parsed.success) {
        return res.status(400).json({ success: false, errors: parsed.error.errors });
    }
    const project = await Project.create(parsed.data);
    res.status(201).json({ success: true, data: project });
};

export const updateProject = async (req: Request, res: Response) => {
    // Allow partial updates — use partial() so not all fields are required on PATCH-style PUT
    const parsed = ProjectSchema.partial().safeParse(req.body);
    if (!parsed.success) {
        return res.status(400).json({ success: false, errors: parsed.error.errors });
    }
    const project = await Project.findByIdAndUpdate(req.params.id, parsed.data, {
        new: true,
        runValidators: true,
    });
    if (!project) {
        return res.status(404).json({ success: false, message: 'Project not found' });
    }
    res.json({ success: true, data: project });
};

// Soft delete per design spec Section 8.2 ("sets active: false")
export const deleteProject = async (req: Request, res: Response) => {
    const project = await Project.findByIdAndUpdate(
        req.params.id,
        { active: false },
        { new: true }
    );
    if (!project) {
        return res.status(404).json({ success: false, message: 'Project not found' });
    }
    res.json({ success: true, message: 'Project archived successfully' });
};

export const reorderProjects = async (req: Request, res: Response) => {
    const { projects } = req.body;
    if (!projects || !Array.isArray(projects)) {
        return res.status(400).json({ success: false, message: 'Invalid data: expected { projects: [{ id, order }] }' });
    }

    // Validate each item has id and order
    const invalid = projects.some((p: any) => !p.id || typeof p.order !== 'number');
    if (invalid) {
        return res.status(400).json({ success: false, message: 'Each item must have id (string) and order (number)' });
    }

    await Promise.all(projects.map((p: { id: string; order: number }) =>
        Project.findByIdAndUpdate(p.id, { order: p.order })
    ));

    res.json({ success: true, message: 'Projects reordered successfully' });
};

