const express = require('express');
const router = express.Router();
const { getMyNotifications, markAsRead } = require('../controllers/notificationController');
const { protect } = require('../middleware/auth');

router.use(protect); // Must be logged in
router.get('/', getMyNotifications);
router.put('/:id/read', markAsRead);

module.exports = router;