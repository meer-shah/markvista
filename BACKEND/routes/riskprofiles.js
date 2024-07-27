const express = require('express');
const {
  getAllRiskProfiles,
  getSingleRiskProfile,
  createRiskProfile,
  deleteRiskProfile,
  updateRiskProfile
} = require('../controllers/riskprofilecontroller');

const router = express.Router();

// Get all risk profiles 
router.get('/', getAllRiskProfiles);

// Get a single risk profile
router.get('/:id', getSingleRiskProfile);

// Create a new risk profile
router.post('/', createRiskProfile);

// Delete a risk profile
router.delete('/:id', deleteRiskProfile);

// Update a risk profile
router.patch('/:id', updateRiskProfile);

module.exports = router;
