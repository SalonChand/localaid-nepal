const Organization = require('../models/Organization');

// @desc    Get all pending (unverified) organizations
// @route   GET /api/admin/organizations/pending
// @access  Private/Admin
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

// @desc    Verify an organization
// @route   PUT /api/admin/organizations/:id/verify
// @access  Private/Admin
exports.verifyOrganization = async (req, res) => {
  try {
    const org = await Organization.findByPk(req.params.id);
    
    if (!org) {
      return res.status(404).json({ message: 'Organization not found' });
    }

    org.isVerified = true;
    await org.save();

    res.status(200).json({ success: true, data: org });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};