const Event = require('../models/Event');

// @desc    Create a new event
// @route   POST /api/events
// @access  Private (Organizations only)
exports.createEvent = async (req, res) => {
  try {
    // Note: In a real app, you'd verify if the logged-in user actually belongs to this organization.
    // For now, we will just pass the organizationId in the body.
    const { title, description, date, location, capacity, organizationId } = req.body;

    const event = await Event.create({
      title,
      description,
      date,
      location,
      capacity,
      organizationId
    });

    res.status(201).json({ success: true, data: event });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// @desc    Get all upcoming events
// @route   GET /api/events
// @access  Public
exports.getAllEvents = async (req, res) => {
  try {
    const events = await Event.findAll({
      where: { status: 'Upcoming' },
      order: [['date', 'ASC']] // Closest events first
    });

    res.status(200).json({ success: true, count: events.length, data: events });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};