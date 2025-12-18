import express from 'express';
import { 
  getAllPosts, 
  getPostBySlug, 
  createPost, 
  updatePost, 
  deletePost 
} from '../controllers/blogController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getAllPosts);
router.get('/:slug', getPostBySlug);
router.post('/', authenticate, createPost);
router.put('/:id', authenticate, updatePost);
router.delete('/:id', authenticate, deletePost);

export default router;
