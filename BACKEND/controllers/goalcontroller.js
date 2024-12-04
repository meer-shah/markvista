
const RiskProfile = require('../models/riskprofilemodal');

// CREATE: Add a new goal to a risk profile
// CREATE: Add a new goal to a risk profile
exports.addGoal = async (req, res) => {
  const { goalType, goalAmount } = req.body;

  if (!goalType || !goalAmount) {
    return res.status(400).json({ message: 'Goal type and amount are required.' });
  }

  try {
    const activeProfile = await RiskProfile.findOne({ ison: true });

    if (!activeProfile) {
      return res.status(404).json({ message: 'No active Risk Profile found.' });
    }

    // Check if the active profile already has a goal
    if (activeProfile.goals.length > 0) {
      return res.status(400).json({ 
        message: 'Only one goal is allowed per profile. Please update or delete the existing goal before adding a new one.' 
      });
    }

    // Add the new goal
    activeProfile.goals.push({ goalType, goalAmount });
    await activeProfile.save();

    res.status(201).json({ message: 'Goal added successfully.', activeProfile });
  } catch (error) {
    console.error('Error adding goal:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};


// READ: Get all goals for a risk profile
exports.getGoals = async (req, res) => {
  try {
    const activeProfile = await RiskProfile.findOne({ ison: true });

    if (!activeProfile) {
      return res.status(404).json({ message: 'No active Risk Profile found.' });
    }

    res.status(200).json({ goals: activeProfile.goals });
  } catch (error) {
    console.error('Error fetching goals:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

// UPDATE: Update a specific goal in a risk profile
exports.updateGoal = async (req, res) => {
  const { goalId, goalType, goalAmount } = req.body;

  if (!goalId || (!goalType && !goalAmount)) {
    return res.status(400).json({ message: 'Goal ID and at least one field to update are required.' });
  }

  try {
    const activeProfile = await RiskProfile.findOne({ ison: true });

    if (!activeProfile) {
      return res.status(404).json({ message: 'No active Risk Profile found.' });
    }

    const goal = activeProfile.goals.id(goalId);

    if (!goal) {
      return res.status(404).json({ message: 'Goal not found.' });
    }

    if (goalType) goal.goalType = goalType;
    if (goalAmount) goal.goalAmount = goalAmount;

    await activeProfile.save();

    res.status(200).json({ message: 'Goal updated successfully.', goal });
  } catch (error) {
    console.error('Error updating goal:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

// DELETE: Remove a specific goal from a risk profile
exports.deleteGoal = async (req, res) => {
  const { goalId } = req.params;

  if (!goalId) {
    return res.status(400).json({ message: 'Goal ID is required.' });
  }

  try {
    const activeProfile = await RiskProfile.findOne({ ison: true });

    if (!activeProfile) {
      return res.status(404).json({ message: 'No active Risk Profile found.' });
    }

    const goal = activeProfile.goals.id(goalId);

    if (!goal) {
      return res.status(404).json({ message: 'Goal not found.' });
    }

    goal.remove();
    await activeProfile.save();

    res.status(200).json({ message: 'Goal deleted successfully.' });
  } catch (error) {
    console.error('Error deleting goal:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};
