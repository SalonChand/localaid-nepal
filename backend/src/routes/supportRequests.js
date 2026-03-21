const express = require('express');
const router = express.Router();
const { createRequest, getMyRequests } = require('../controllers/supportRequestController');
const { protect } = require('../middleware/auth');

// Apply 'protect' middleware so only logged-in users can access these
router.post('/', protect, createRequest);
router.get('/my-requests', protect, getMyRequests);

module.exports = router;