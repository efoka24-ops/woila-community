const express = require('express');
const eventController = require('../controllers/eventController');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

router.post('/', authMiddleware, eventController.create);
router.get('/', eventController.getAll);
router.get('/:id', eventController.getById);
router.post('/:id/register', eventController.register);
router.put('/:id', authMiddleware, eventController.update);
router.delete('/:id', authMiddleware, eventController.delete);

module.exports = router;
