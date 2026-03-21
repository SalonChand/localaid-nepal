const Organization = require('../models/Organization');

exports.getAllOrganizations = async (req, res) => {
  try {
    const orgs = await Organization.findAll({ 
      where: { isVerified: true }, // ONLY SHOW VERIFIED ORGS
      order: [['createdAt', 'DESC']] 
    });
    res.status(200).json({ success: true, count: orgs.length, data: orgs });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

exports.getMyOrganization = async (req, res) => {
  try {
    const org = await Organization.findOne({ where: { ownerId: req.user.id } });
    res.status(200).json({ success: true, data: org });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

exports.createOrganization = async (req, res) => {
  try {
    const { name, description, registrationNumber, contactEmail, phone, address } = req.body;
    
    // Check if user already created one
    const existingOrg = await Organization.findOne({ where: { ownerId: req.user.id } });
    if (existingOrg) return res.status(400).json({ message: 'You already have an organization profile.' });

    const organization = await Organization.create({
      name, description, registrationNumber, contactEmail, phone, address, ownerId: req.user.id
    });
    res.status(201).json({ success: true, data: organization });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

exports.updateOrganization = async (req, res) => {
  try {
    const org = await Organization.findOne({ where: { ownerId: req.user.id } });
    if (!org) return res.status(404).json({ message: 'Organization not found.' });

    await org.update(req.body);
    res.status(200).json({ success: true, data: org });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};