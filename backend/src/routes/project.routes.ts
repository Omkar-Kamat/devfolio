import { Router } from 'express';
import { getAllProjects, getProject, createProject, updateProject, deleteProject, reorderProjects } from '../controllers/project.controller';
import { authenticate } from '../middleware/auth';

const router = Router();

router.route('/')
    .get(getAllProjects)
    .post(authenticate, createProject);

router.route('/reorder')
    .put(authenticate, reorderProjects);

router.route('/:id')
    .get(getProject)
    .put(authenticate, updateProject)
    .delete(authenticate, deleteProject);

export default router;
