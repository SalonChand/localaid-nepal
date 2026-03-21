const express = require('express');
const router = express.Router();
const { createOrganization, getAllOrganizations, getMyOrganization, updateOrganization } = require('../controllers/organizationController');
const { protect } = require('../middleware/auth'); 

router.get('/', getAllOrganizations);
router.get('/me', protect, getMyOrganization);
router.post('/', protect, createOrganization);
router.put('/me', protect, updateOrganization);

module.exports = router;