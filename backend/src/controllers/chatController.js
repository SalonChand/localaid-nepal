const Message = require('../models/Message');
const User = require('../models/User');

exports.getTaskMessages = async (req, res) => {
  try {
    const { taskId } = req.params;
    
    const messages = await Message.findAll({
      where: { taskId },
      include:[{ model: User, as: 'sender', attributes: ['id', 'name', 'role'] }],
      order: [['createdAt', 'ASC']] // Oldest to newest
    });

    res.status(200).json({ success: true, data: messages });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};