const Organization = require('../models/Organization');
const User = require('../models/User');
const SupportRequest = require('../models/SupportRequest');
const Event = require('../models/Event');

// --- NGO VERIFICATION ---
exports.getPendingOrganizations = async (req, res) => {
  try {
    const orgs = await Organization.findAll({
      where: { isVerified: false },
      order: [['createdAt', 'ASC']]
    });
    res.status(200).json({ success: true, count: orgs.length, data: orgs });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

exports.verifyOrganization = async (req, res) => {
  try {
    const org = await Organization.findByPk(req.params.id);
    if (!org) return res.status(404).json({ message: 'Organization not found' });

    org.isVerified = true;
    await org.save();
    res.status(200).json({ success: true, data: org });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// --- SYSTEM ANALYTICS & REPORTING ---
exports.getSystemStats = async (req, res) => {
  try {
    const totalUsers = await User.count();
    const totalCitizens = await User.count({ where: { role: 'citizen' } });
    const totalVolunteers = await User.count({ where: { role: 'volunteer' } });
    
    const totalRequests = await SupportRequest.count();
    const completedRequests = await SupportRequest.count({ where: { status: 'Completed' } });
    
    const totalNGOs = await Organization.count({ where: { isVerified: true } });
    const totalEvents = await Event.count();

    res.status(200).json({
      success: true,
      data: {
        users: { total: totalUsers, citizens: totalCitizens, volunteers: totalVolunteers },
        requests: { total: totalRequests, completed: completedRequests },
        ngos: totalNGOs,
        events: totalEvents
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// --- USER MANAGEMENT ---
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ['password'] },
      order: [['createdAt', 'DESC']]
    });
    res.status(200).json({ success: true, count: users.length, data: users });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

exports.updateUserRole = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Prevent changing your own role to avoid locking yourself out
    if (user.id === req.user.id) {
      return res.status(400).json({ message: 'You cannot change your own admin role.' });
    }

    user.role = req.body.role;
    await user.save();

    res.status(200).json({ success: true, data: { id: user.id, name: user.name, role: user.role } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (user.id === req.user.id) {
      return res.status(400).json({ message: 'You cannot delete yourself.' });
    }

    await user.destroy();
    res.status(200).json({ success: true, message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};