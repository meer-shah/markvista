const RiskProfile = require('../models/riskprofilemodal');
const mongoose = require('mongoose');

// Get all risk profiles
const getAllRiskProfiles = async (req, res) => {
  try {
    const riskProfiles = await RiskProfile.find({});
    res.status(200).json(riskProfiles);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching risk profiles', error: error.message });
  }
};

// Get a single risk profile
const getSingleRiskProfile = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid ID format' });
  }

  try {
    const riskProfile = await RiskProfile.findById(id);
    if (!riskProfile) {
      return res.status(404).json({ message: 'Risk profile not found' });
    }
    res.status(200).json(riskProfile);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching risk profile', error: error.message });
  }
};

// Create a new risk profile
const createRiskProfile = async (req, res) => {
  const {
    title,
    description,
    SLallowedperday,
    initialRiskPerTrade,
    increaseOnWin,
    decreaseOnLoss,
    maxRisk,
    minRisk,
    reset,
    growthThreshold,
    payoutPercentage
  } = req.body;

  try {
    const newRiskProfile = await RiskProfile.create({
      title,
      description,
      SLallowedperday,
      initialRiskPerTrade,
      increaseOnWin,
      decreaseOnLoss,
      maxRisk,
      minRisk,
      reset,
      growthThreshold,
      payoutPercentage
    });
    res.status(201).json({ message: 'New risk profile created', data: newRiskProfile });
  } catch (error) {
    res.status(500).json({ message: 'Error creating risk profile', error: error.message });
  }
};

// Delete a risk profile
const deleteRiskProfile = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid ID format' });
  }

  try {
    const deletedRiskProfile = await RiskProfile.findByIdAndDelete(id);
    if (!deletedRiskProfile) {
      return res.status(404).json({ message: 'Risk profile not found' });
    }
    res.status(200).json({ message: 'Risk profile deleted', data: deletedRiskProfile });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting risk profile', error: error.message });
  }
};

// Update a risk profile
const updateRiskProfile = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid ID format' });
  }

  const updates = req.body;

  try {
    const updatedRiskProfile = await RiskProfile.findByIdAndUpdate(id, updates, { new: true });
    if (!updatedRiskProfile) {
      return res.status(404).json({ message: 'Risk profile not found' });
    }
    res.status(200).json({ message: 'Risk profile updated', data: updatedRiskProfile });
  } catch (error) {
    res.status(500).json({ message: 'Error updating risk profile', error: error.message });
  }
};

const activateprofile = async (req, res) => {
  const { id } = req.params;

  // Validate the ID format
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid ID format' });
  }

  // Ensure the body contains 'ison'
  const { ison } = req.body;

  if (typeof ison !== 'boolean') {
    return res.status(400).json({ message: 'Invalid ison value; must be a boolean' });
  }

  try {
    // Deactivate the currently active risk profile if one exists
    const activatedRisk = await RiskProfile.findOne({ ison: true });
    if (activatedRisk) {
      activatedRisk.ison = false;
      await activatedRisk.save();
    }

    // Update the selected risk profile to set its 'ison' field
    const updatedRiskProfile = await RiskProfile.findByIdAndUpdate(
      id,
      { ison },
      { new: true }
    );

    // Check if the risk profile was found
    if (!updatedRiskProfile) {
      return res.status(404).json({ message: 'Risk profile not found' });
    }

    res.status(200).json({ message: 'Risk profile activated', data: updatedRiskProfile });
  } catch (error) {
    res.status(500).json({ message: 'Error activating risk profile', error: error.message });
  }
};

// Get  active risk profiles
// Get all active risk profiles
const getActiveRiskProfile = async (req, res) => {
  try {
    // Fetch only risk profiles where ison is true
    const riskProfiles = await RiskProfile.findOne({ ison: true });
    res.status(200).json(riskProfiles);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching risk profiles', error: error.message });
  }
};


module.exports = {
  getAllRiskProfiles,
  getSingleRiskProfile,
  createRiskProfile,
  deleteRiskProfile,
  updateRiskProfile,
  activateprofile,
  getActiveRiskProfile
};