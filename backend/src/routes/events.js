const express = require('express');
const router = express.Router();
const { createEvent, getAllEvents, rsvpEvent } = require('../controllers/eventController');
const { protect } = require('../middleware/auth');

router.get('/', getAllEvents);
router.post('/', protect, createEvent);

// NEW RSVP ROUTE
router.post('/:eventId/rsvp', protect, rsvpEvent);

module.exports = router;