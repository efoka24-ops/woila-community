const express = require('express');
const contactController = require('../controllers/contactController');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

router.post('/', contactController.create);
router.get('/', authMiddleware, contactController.getAll);
router.put('/:id/read', authMiddleware, contactController.markAsRead);
router.delete('/:id', authMiddleware, contactController.delete);

module.exports = router;
