const SupportRequest = require('../models/SupportRequest');
const TaskAssignment = require('../models/TaskAssignment');

exports.createRequest = async (req, res) => {
  try {
    // ADDED contactPhone here so the server actually grabs it from the frontend!
    const { title, description, category, urgency, location, latitude, longitude, contactPhone } = req.body;

    const newRequest = await SupportRequest.create({
      title, 
      description, 
      category, 
      urgency, 
      location, 
      latitude, 
      longitude,
      contactPhone, // SAVES IT TO MYSQL HERE
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
      include:[{ model: TaskAssignment, as: 'taskDetails' }], 
      order: [['createdAt', 'DESC']]
    });

    res.status(200).json({ success: true, count: requests.length, data: requests });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};