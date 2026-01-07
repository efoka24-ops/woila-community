const express = require('express');
const router = express.Router();
const membershipController = require('../controllers/membershipController');
const auth = require('../middleware/auth');

// Routes publiques
router.post('/', membershipController.createRequest);

// Routes privées (admin)
router.get('/', auth, membershipController.getAll);
router.get('/:id', auth, membershipController.getById);
router.post('/:id/approve', auth, membershipController.approve);
router.post('/:id/reject', auth, membershipController.reject);
router.delete('/:id', auth, membershipController.delete);

module.exports = router;
