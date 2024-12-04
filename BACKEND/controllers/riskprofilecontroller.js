

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
  // Helper function to sanitize values, setting defaults if undefined or empty
  const sanitize = (value, defaultValue) => {
    return value === "" || value === undefined ? defaultValue : value;
  };

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
    payoutPercentage,
    minRiskRewardRatio,
    isDefault,
  } = req.body;

  try {
    // If the profile is marked as default, turn off 'default' for all other profiles
    if (isDefault) {
      // Set all other profiles' `default` to false
      await RiskProfile.updateMany({}, { default: false });
    }

    // Create the new risk profile with sanitized data
    const newRiskProfile = await RiskProfile.create({
      title,
      description,
      SLallowedperday: sanitize(SLallowedperday, 100),
      initialRiskPerTrade: sanitize(initialRiskPerTrade, 0),
      increaseOnWin: sanitize(increaseOnWin, 0),
      decreaseOnLoss: sanitize(decreaseOnLoss, 0),
      maxRisk: sanitize(maxRisk, 100),
      minRisk: sanitize(minRisk, 0),
      reset: sanitize(reset, 100000),
      growthThreshold: sanitize(growthThreshold, 0),
      payoutPercentage: sanitize(payoutPercentage, 0),
      minRiskRewardRatio: sanitize(minRiskRewardRatio, 1),
      default: sanitize(isDefault, false),
    });

    res.status(201).json({ message: 'New risk profile created', data: newRiskProfile });
  } catch (error) {
    console.error("Error creating risk profile:", error);
    res.status(500).json({ message: 'Error creating risk profile', error: error.message });
  }
};


// Delete a risk profile
const deleteRiskProfile = async (req, res) => {
  const { id } = req.params;

  // Validate the ID format
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid ID format' });
  }

  try {
    const riskProfile = await RiskProfile.findById(id);

    // If the profile is the default, prevent deletion
    if (riskProfile.default) {
      return res.status(400).json({ message: 'Cannot delete the default risk profile' });
    }

    // If the profile to be deleted is active (ison: true)
    if (riskProfile.ison) {
      // Find the default risk profile
      const defaultProfile = await RiskProfile.findOne({ default: true });

      // If there is a default profile, deactivate all active profiles
      if (defaultProfile) {
        // Deactivate all profiles that have ison: true
        await RiskProfile.updateMany({ ison: true }, { ison: false });

        // Set the default profile as active
        defaultProfile.ison = true;
        await defaultProfile.save();  // Save the updated default profile
      }
    }

    // Proceed to delete the risk profile
    const deletedRiskProfile = await RiskProfile.findByIdAndDelete(id);
    if (!deletedRiskProfile) {
      return res.status(404).json({ message: 'Risk profile not found' });
    }

    // Return success message
    res.status(200).json({ message: 'Risk profile deleted successfully', data: deletedRiskProfile });
  } catch (error) {
    // Handle errors
    console.error(error);
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

// Get active risk profiles
const getActiveRiskProfile = async (req, res) => {
  try {
    // Fetch only risk profiles where ison is true
    const activeRiskProfile = await RiskProfile.findOne({ ison: true });
    if (!activeRiskProfile) {
      return res.status(404).json({ message: 'No active risk profile found' });
    }
    res.status(200).json(activeRiskProfile);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching active risk profile', error: error.message });
  }
};

// Activate/deactivate a risk profile
const activateprofile = async (req, res) => {
  const { id } = req.params;

  // Validate the ID format
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid ID format' });
  }

  const { ison } = req.body;

  // Ensure `ison` is a boolean and reject attempts to set `ison: false`
  if (ison !== true) {
    return res.status(400).json({
      message: 'You can only activate a risk profile. Deactivation is not allowed directly.',
    });
  }

  try {
    // Deactivate all other profiles
    await RiskProfile.updateMany({ ison: true }, { ison: false });

    // Activate the selected profile
    const updatedRiskProfile = await RiskProfile.findByIdAndUpdate(
      id,
      {
        ison: true,
        previousrisk: 0,
        currentrisk: 0,
        consecutiveWins: 0,
        consecutiveLosses: 0,
        user: null, // Reset user reference
        goals: [], // Clear goals array
      },
      { new: true }
    );

    if (!updatedRiskProfile) {
      return res.status(404).json({ message: 'Risk profile not found' });
    }

    res.status(200).json({
      message: 'Risk profile activated successfully',
      data: updatedRiskProfile,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error activating risk profile',
      error: error.message,
    });
  }
};

// Ensure that there is always one default profile
const resetdeault = async (req, res) => {
  const { id } = req.body; // The ID of the profile to be set as default

  try {
    // Validate the incoming ID
    if (!id) {
      return res.status(400).json({ error: 'Profile ID is required.' });
    }

    // Check if there's already a default profile set
    const existingDefault = await RiskProfile.findOne({ default: true });

    // If there is no default profile, allow the first profile to remain as default
    if (!existingDefault) {
      const firstProfile = await RiskProfile.findOne();
      if (firstProfile) {
        await RiskProfile.updateOne({ _id: firstProfile._id }, { default: true });
      }
    } else {
      // If a default profile exists, set all others' `default` to false
      await RiskProfile.updateMany({ _id: { $ne: id } }, { default: false });
    }

    // Set the selected profile as the default
    const updatedProfile = await RiskProfile.findByIdAndUpdate(
      id,
      { default: true },
      { new: true }
    );

    if (!updatedProfile) {
      return res.status(404).json({ error: 'Profile not found.' });
    }

    res.status(200).json({
      message: 'Default risk profile updated successfully.',
      updatedProfile,
    });
  } catch (error) {
    console.error('Error resetting default profile:', error);
    res.status(500).json({ error: 'Failed to reset default profile.' });
  }
};



module.exports = {
  getAllRiskProfiles,
  getSingleRiskProfile,
  createRiskProfile,
  deleteRiskProfile,
  updateRiskProfile,
  activateprofile,
  getActiveRiskProfile,
  resetdeault

};
