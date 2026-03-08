import { Router } from 'express';
import { submitContact, getMessages, markRead, deleteMessage } from '../controllers/contact.controller';
import { authenticate } from '../middleware/auth';

const router = Router();

router.post('/', submitContact);

// Admin routes
router.get('/', authenticate, getMessages);
router.put('/:id/read', authenticate, markRead);
router.delete('/:id', authenticate, deleteMessage);

export default router;
