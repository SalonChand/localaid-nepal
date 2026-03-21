const express = require('express');
const router = express.Router();
const { createEvent, getAllEvents } = require('../controllers/eventController');
const { protect } = require('../middleware/auth');

// Public route to see events
router.get('/', getAllEvents);

// Protected route to create an event (Requires login token)
router.post('/', protect, createEvent);

module.exports = router;