// const RiskProfile = require('../models/riskprofilemodal');
// const mongoose = require('mongoose');

// // Get all risk profiles
// const getAllRiskProfiles = async (req, res) => {
//   try {
//     const riskProfiles = await RiskProfile.find({});
//     res.status(200).json(riskProfiles);
//   } catch (error) {
//     res.status(500).json({ message: 'Error fetching risk profiles', error: error.message });
//   }
// };

// // Get a single risk profile
// const getSingleRiskProfile = async (req, res) => {
//   const { id } = req.params;

//   if (!mongoose.Types.ObjectId.isValid(id)) {
//     return res.status(400).json({ message: 'Invalid ID format' });
//   }

//   try {
//     const riskProfile = await RiskProfile.findById(id);
//     if (!riskProfile) {
//       return res.status(404).json({ message: 'Risk profile not found' });
//     }
//     res.status(200).json(riskProfile);
//   } catch (error) {
//     res.status(500).json({ message: 'Error fetching risk profile', error: error.message });
//   }
// };

// // Create a new risk profile
// const createRiskProfile = async (req, res) => {
//   const {
//     title,
//     description,
//     SLallowedperday,
//     initialRiskPerTrade,
//     increaseOnWin,
//     decreaseOnLoss,
//     maxRisk,
//     minRisk,
//     reset,
//     growthThreshold,
//     payoutPercentage
//   } = req.body;

//   try {
//     const newRiskProfile = await RiskProfile.create({
//       title,
//       description,
//       SLallowedperday,
//       initialRiskPerTrade,
//       increaseOnWin,
//       decreaseOnLoss,
//       maxRisk,
//       minRisk,
//       reset,
//       growthThreshold,
//       payoutPercentage,
//       minRiskRewardRatio,
//     });
//     res.status(201).json({ message: 'New risk profile created', data: newRiskProfile });
//   } catch (error) {
//     res.status(500).json({ message: 'Error creating risk profile', error: error.message });
//   }
// };

// // Delete a risk profile
// const deleteRiskProfile = async (req, res) => {
//   const { id } = req.params;

//   if (!mongoose.Types.ObjectId.isValid(id)) {
//     return res.status(400).json({ message: 'Invalid ID format' });
//   }

//   try {
//     const deletedRiskProfile = await RiskProfile.findByIdAndDelete(id);
//     if (!deletedRiskProfile) {
//       return res.status(404).json({ message: 'Risk profile not found' });
//     }
//     res.status(200).json({ message: 'Risk profile deleted', data: deletedRiskProfile });
//   } catch (error) {
//     res.status(500).json({ message: 'Error deleting risk profile', error: error.message });
//   }
// };

// // Update a risk profile
// const updateRiskProfile = async (req, res) => {
//   const { id } = req.params;

//   if (!mongoose.Types.ObjectId.isValid(id)) {
//     return res.status(400).json({ message: 'Invalid ID format' });
//   }

//   const updates = req.body;

//   try {
//     const updatedRiskProfile = await RiskProfile.findByIdAndUpdate(id, updates, { new: true });
//     if (!updatedRiskProfile) {
//       return res.status(404).json({ message: 'Risk profile not found' });
//     }
//     res.status(200).json({ message: 'Risk profile updated', data: updatedRiskProfile });
//   } catch (error) {
//     res.status(500).json({ message: 'Error updating risk profile', error: error.message });
//   }
// };

// const activateprofile = async (req, res) => {
//   const { id } = req.params;

//   // Validate the ID format
//   if (!mongoose.Types.ObjectId.isValid(id)) {
//     return res.status(400).json({ message: 'Invalid ID format' });
//   }

//   // Ensure the body contains 'ison'
//   const { ison } = req.body;

//   if (typeof ison !== 'boolean') {
//     return res.status(400).json({ message: 'Invalid ison value; must be a boolean' });
//   }

//   try {
//     // Deactivate the currently active risk profile if one exists
//     const activatedRisk = await RiskProfile.findOne({ ison: true });
//     if (activatedRisk) {
//       activatedRisk.ison = false;
//       await activatedRisk.save();
//     }

//     // Update the selected risk profile to set its 'ison' field
//     const updatedRiskProfile = await RiskProfile.findByIdAndUpdate(
//       id,
//       { ison },
//       { new: true }
//     );

//     // Check if the risk profile was found
//     if (!updatedRiskProfile) {
//       return res.status(404).json({ message: 'Risk profile not found' });
//     }

//     res.status(200).json({ message: 'Risk profile activated', data: updatedRiskProfile });
//   } catch (error) {
//     res.status(500).json({ message: 'Error activating risk profile', error: error.message });
//   }
// };

// // Get  active risk profiles
// // Get all active risk profiles
// const getActiveRiskProfile = async (req, res) => {
//   try {
//     // Fetch only risk profiles where ison is true
//     const riskProfiles = await RiskProfile.findOne({ ison: true });
//     res.status(200).json(riskProfiles);
//   } catch (error) {
//     res.status(500).json({ message: 'Error fetching risk profiles', error: error.message });
//   }
// };

// const resetdeault = async (req, res) => {
//   const { id } = req.body;
//   await RiskProfile.updateMany({ _id: { $ne: id } }, { default: false });
//   res.status(200).send('Default updated');
// };

// module.exports = {
//   getAllRiskProfiles,
//   getSingleRiskProfile,
//   createRiskProfile,
//   deleteRiskProfile,
//   updateRiskProfile,
//   activateprofile,
//   getActiveRiskProfile,
//   resetdeault
// };

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
      payoutPercentage,
      minRiskRewardRatio,
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
    const riskProfile = await RiskProfile.findById(id);
    if (riskProfile.default) {
      return res.status(400).json({ message: 'Cannot delete the default risk profile' });
    }

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

  // Ensure the body contains 'ison'
  const { ison } = req.body;

  if (typeof ison !== 'boolean') {
    return res.status(400).json({ message: 'Invalid ison value; must be a boolean' });
  }

  try {
    // If deactivating the default profile (ison: false)
    if (!ison) {
      const profileToDeactivate = await RiskProfile.findById(id);
      
      // If the profile to deactivate is the default profile
      if (profileToDeactivate.default) {
        // Check if any other profile is active
        const activeProfile = await RiskProfile.findOne({ ison: true });

        if (!activeProfile) {
          // Prevent deactivating the default if no other profile is active
          return res.status(400).json({ message: 'Cannot deactivate the default profile unless another profile is active.' });
        }

        // Reset the default profile and assign a new one
        const otherProfiles = await RiskProfile.find({ _id: { $ne: id } });

        if (otherProfiles.length > 0) {
          const newDefaultProfile = otherProfiles[0];  // Pick the first non-default profile
          newDefaultProfile.default = true;
          await newDefaultProfile.save();
        } else {
          // If no profiles are available, set default profile to itself
          profileToDeactivate.default = true;
          await profileToDeactivate.save();
        }
      }
    }

    // If activating a profile (ison: true)
    if (ison) {
      // Deactivate all other profiles by setting 'ison' to false
      await RiskProfile.updateMany({ ison: true }, { ison: false });

      // Ensure that there is always one default risk profile
      const existingDefault = await RiskProfile.findOne({ default: true });
      if (!existingDefault) {
        const firstRiskProfile = await RiskProfile.findOne();
        if (firstRiskProfile) {
          firstRiskProfile.default = true;
          await firstRiskProfile.save();
        }
      }

      // Update the selected profile to set its 'ison' to true
      const updatedRiskProfile = await RiskProfile.findByIdAndUpdate(id, { ison }, { new: true });

      if (!updatedRiskProfile) {
        return res.status(404).json({ message: 'Risk profile not found' });
      }

      return res.status(200).json({ message: 'Risk profile activated', data: updatedRiskProfile });
    }

    // Handle turning off the profile (ison: false)
    const updatedRiskProfile = await RiskProfile.findByIdAndUpdate(id, { ison }, { new: true });

    if (!updatedRiskProfile) {
      return res.status(404).json({ message: 'Risk profile not found' });
    }

    return res.status(200).json({ message: 'Risk profile deactivated', data: updatedRiskProfile });
  } catch (error) {
    res.status(500).json({ message: 'Error activating/deactivating risk profile', error: error.message });
  }
};

// Ensure that there is always one default profile
const resetdeault = async (req, res) => {
  const { id } = req.body;

  try {
    // Ensure that there is at least one default risk profile
    const existingDefault = await RiskProfile.findOne({ default: true });
    if (!existingDefault) {
      // If no default exists, set the first risk profile as default
      const firstRiskProfile = await RiskProfile.findOne();
      if (firstRiskProfile) {
        firstRiskProfile.default = true;
        await firstRiskProfile.save();
      }
    }

    // Set the selected profile as default and reset others
    await RiskProfile.updateMany({ _id: { $ne: id } }, { default: false });
    await RiskProfile.findByIdAndUpdate(id, { default: true });

    res.status(200).send('Default risk profile updated successfully.');
  } catch (error) {
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
