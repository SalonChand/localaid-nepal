const SupportRequest = require('../models/SupportRequest');
const TaskAssignment = require('../models/TaskAssignment');

exports.createRequest = async (req, res) => {
  try {
    // We added availableDate and bloodType to the incoming data!
    const { title, description, category, urgency, location, latitude, longitude, contactPhone, availableDate, bloodType } = req.body;

    const newRequest = await SupportRequest.create({
      title, 
      description, 
      category, 
      urgency, 
      location, 
      latitude, 
      longitude,
      contactPhone,
      availableDate, // SAVES THE DATE
      bloodType,     // SAVES THE BLOOD TYPE
      citizenId: req.user.id 
    });

    res.status(201).json({ success: true, data: newRequest });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

exports.getMyRequests = async (req, res) => {
  try {
    const requests = await SupportRequest.findAll({
      where: { citizenId: req.user.id },
      include: [{ model: TaskAssignment, as: 'taskDetails' }], 
      order: [['createdAt', 'DESC']]
    });

    res.status(200).json({ success: true, count: requests.length, data: requests });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};