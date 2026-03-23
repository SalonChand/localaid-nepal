const Event = require('../models/Event');
const Participation = require('../models/Participation');

exports.createEvent = async (req, res) => {
  try {
    const { title, description, date, location, capacity, organizationId } = req.body;

    const event = await Event.create({
      title, description, date, location, capacity, organizationId
    });

    res.status(201).json({ success: true, data: event });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

exports.getAllEvents = async (req, res) => {
  try {
    const events = await Event.findAll({
      where: { status: 'Upcoming' },
      include: [{ model: Participation, as: 'participants', attributes: ['userId'] }],
      order: [['date', 'ASC']]
    });

    res.status(200).json({ success: true, count: events.length, data: events });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// --- NEW RSVP FUNCTION ---
exports.rsvpEvent = async (req, res) => {
  try {
    const { eventId } = req.params;
    const event = await Event.findByPk(eventId);
    
    if (!event) return res.status(404).json({ message: 'Event not found' });

    // Check if the user is already going
    const existingParticipation = await Participation.findOne({ 
      where: { eventId, userId: req.user.id } 
    });

    if (existingParticipation) {
      // If already going, clicking again means "Leave Event"
      await existingParticipation.destroy();
      return res.status(200).json({ success: true, message: 'Left event', joined: false });
    } else {
      // Check capacity
      const currentParticipants = await Participation.count({ where: { eventId } });
      if (event.capacity && currentParticipants >= event.capacity) {
        return res.status(400).json({ message: 'Event is fully booked!' });
      }

      // Join the event
      await Participation.create({ eventId, userId: req.user.id });
      return res.status(200).json({ success: true, message: 'Joined event', joined: true });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};