const { Op } = require('sequelize');
const TaskAssignment = require('../models/TaskAssignment');
const SupportRequest = require('../models/SupportRequest');
const Notification = require('../models/Notification');
const { sendSMS } = require('../services/smsService'); // IMPORT SMS SERVICE

exports.getAvailableTasks = async (req, res) => {
  try {
    const availableRequests = await SupportRequest.findAll({
      where: { status: 'Pending', citizenId: { [Op.ne]: req.user.id } },
      order: [['createdAt', 'DESC']]
    });
    res.status(200).json({ success: true, count: availableRequests.length, data: availableRequests });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

exports.acceptTask = async (req, res) => {
  try {
    const { requestId } = req.params;
    const request = await SupportRequest.findByPk(requestId);
    
    if (!request) return res.status(404).json({ message: 'Support request not found' });
    if (request.citizenId === req.user.id) return res.status(403).json({ message: 'You cannot accept your own request.' });
    if (request.status !== 'Pending') return res.status(400).json({ message: 'This request has already been accepted.' });

    const task = await TaskAssignment.create({
      volunteerId: req.user.id,
      supportRequestId: requestId,
      status: 'Assigned'
    });

    request.status = 'In-Progress';
    await request.save();

    // 1. Send In-App Notification
    await Notification.create({
      userId: request.citizenId, 
      title: 'Volunteer Assigned!',
      message: `Good news! ${req.user.name} has accepted your request. Open the chat to coordinate.`,
      type: 'task_update'
    });

    // 2. SEND REAL SMS TO CITIZEN'S PHONE (If they provided one)
    if (request.contactPhone) {
      const smsText = `LocalAid: ${req.user.name} has accepted your help request "${request.title}". Please check the app to chat with them.`;
      await sendSMS(request.contactPhone, smsText);
    }

    res.status(201).json({ success: true, message: 'Task successfully accepted!', data: task });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

exports.updateTaskStatus = async (req, res) => {
  try {
    const { status, notes } = req.body;
    const task = await TaskAssignment.findByPk(req.params.id);

    if (!task) return res.status(404).json({ message: 'Task not found' });
    if (task.volunteerId !== req.user.id) return res.status(403).json({ message: 'Not authorized to update this task' });

    task.status = status;
    if (notes) task.notes = notes;
    if (status === 'Completed') task.completedAt = new Date();
    await task.save();

    if (status === 'Completed') {
      const request = await SupportRequest.findByPk(task.supportRequestId);
      request.status = 'Completed';
      await request.save();

      await Notification.create({
        userId: request.citizenId,
        title: 'Request Completed!',
        message: `Your request "${request.title}" has been marked as completed by the volunteer.`,
        type: 'task_update'
      });

      // SEND SMS UPON COMPLETION
      if (request.contactPhone) {
        await sendSMS(request.contactPhone, `LocalAid: Your request "${request.title}" was marked as completed. Stay safe!`);
      }
    }

    res.status(200).json({ success: true, data: task });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

exports.getMyAssignedTasks = async (req, res) => {
  try {
    const tasks = await TaskAssignment.findAll({
      where: { volunteerId: req.user.id },
      include: [{ model: SupportRequest, as: 'supportRequest' }],
      order: [['createdAt', 'DESC']]
    });
    res.status(200).json({ success: true, count: tasks.length, data: tasks });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};