const express = require('express');
const router = express.Router();
const { getTaskMessages } = require('../controllers/chatController');
const { protect } = require('../middleware/auth');

router.get('/:taskId', protect, getTaskMessages);

module.exports = router;