const express = require('express');
const router = express.Router();
const { 
  getPendingOrganizations, 
  verifyOrganization,
  getSystemStats,
  getAllUsers,
  updateUserRole,
  deleteUser
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);
router.use(authorize('admin'));

// NGO Verification
router.get('/organizations/pending', getPendingOrganizations);
router.put('/organizations/:id/verify', verifyOrganization);

// Analytics
router.get('/stats', getSystemStats);

// User Management
router.get('/users', getAllUsers);
router.put('/users/:id/role', updateUserRole);
router.delete('/users/:id', deleteUser);

module.exports = router;