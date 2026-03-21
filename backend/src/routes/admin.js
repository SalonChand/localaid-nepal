const express = require('express');
const router = express.Router();
const { getPendingOrganizations, verifyOrganization } = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/auth');

// Apply both middlewares: User must be logged in AND must be an 'admin'
router.use(protect);
router.use(authorize('admin'));

router.get('/organizations/pending', getPendingOrganizations);
router.put('/organizations/:id/verify', verifyOrganization);

module.exports = router;