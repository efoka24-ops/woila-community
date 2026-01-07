const express = require('express');
const blogController = require('../controllers/blogController');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

router.post('/', authMiddleware, blogController.create);
router.get('/', blogController.getAll);
router.post('/:id/views', blogController.getById);
router.get('/:id', blogController.getById);
router.put('/:id', authMiddleware, blogController.update);
router.post('/:id/publish', authMiddleware, blogController.publish);
router.delete('/:id', authMiddleware, blogController.delete);

module.exports = router;
