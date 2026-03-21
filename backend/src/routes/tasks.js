const express = require('express');
const router = express.Router();
const { getAvailableTasks, acceptTask, updateTaskStatus, getMyAssignedTasks } = require('../controllers/taskAssignmentController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.get('/available', getAvailableTasks);
router.get('/my-tasks', getMyAssignedTasks); 
router.post('/:requestId/accept', acceptTask);
router.put('/:id/status', updateTaskStatus);

module.exports = router;