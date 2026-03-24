const { Op } = require('sequelize');
const TaskAssignment = require('../models/TaskAssignment');
const SupportRequest = require('../models/SupportRequest');
const Notification = require('../models/Notification');
const { sendSMS } = require('../services/smsService');

exports.getAvailableTasks = async (req, res) => {
  try {
    // --- NEW STRICT SECURITY CHECK ---
    // Prevent normal citizens from viewing the public task board
    if (req.user.role === 'citizen') {
      return res.status(403).json({ 
        success: false, 
        message: 'Privacy Lock: Citizens are not authorized to view other citizens\' requests.' 
      });
    }

    const availableRequests = await SupportRequest.findAll({
      where: { 
        status: 'Pending',
        citizenId: { [Op.ne]: req.user.id } 
      },
      order: [['createdAt', 'DESC']]
    });

    res.status(200).json({
      success: true,
      count: availableRequests.length,
      data: availableRequests
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

exports.acceptTask = async (req, res) => {
  try {
    // Ensure only volunteers/orgs can accept tasks
    if (req.user.role === 'citizen') {
      return res.status(403).json({ message: 'Citizens cannot accept tasks.' });
    }

    const { requestId } = req.params;
    const request = await SupportRequest.findByPk(requestId);
    
    if (!request) {
      return res.status(404).json({ message: 'Support request not found' });
    }
    
    if (request.citizenId === req.user.id) {
      return res.status(403).json({ message: 'You cannot accept your own support request.' });
    }

    if (request.status !== 'Pending') {
      return res.status(400).json({ message: 'This request has already been accepted or completed.' });
    }

    const task = await TaskAssignment.create({
      volunteerId: req.user.id,
      supportRequestId: requestId,
      status: 'Assigned'
    });

    request.status = 'In-Progress';
    await request.save();

    await Notification.create({
      userId: request.citizenId, 
      title: 'Volunteer Assigned!',
      message: `Good news! ${req.user.name} has accepted your request: "${request.title}". Please check the app to chat with them.`,
      type: 'task_update'
    });

    if (request.contactPhone) {
      const smsText = `LocalAid: ${req.user.name} has accepted your help request "${request.title}". Open the app to coordinate.`;
      await sendSMS(request.contactPhone, smsText);
    }

    res.status(201).json({
      success: true,
      message: 'Task successfully accepted!',
      data: task
    });
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
        message: `Your request "${request.title}" has been marked as completed by the volunteer. Stay safe!`,
        type: 'task_update'
      });

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