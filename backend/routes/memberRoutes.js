const express = require('express');
const memberController = require('../controllers/memberController');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

router.post('/', memberController.create);
router.get('/', memberController.getAll);
router.get('/:id', memberController.getById);
router.put('/:id', authMiddleware, memberController.update);
router.delete('/:id', authMiddleware, memberController.delete);

module.exports = router;
