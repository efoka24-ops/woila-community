import express from 'express';
import { 
  createMessage, 
  getAllMessages, 
  replyMessage 
} from '../controllers/contactController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.post('/', createMessage);
router.get('/', authenticate, getAllMessages);
router.put('/:id/reply', authenticate, replyMessage);

export default router;
