const express = require('express');
const {
  getAllRiskProfiles,
  getSingleRiskProfile,
  createRiskProfile,
  deleteRiskProfile,
  updateRiskProfile,
  activateprofile,
  getActiveRiskProfile
} = require('../controllers/riskprofilecontroller');

const router = express.Router();
router.get('/getactive', getActiveRiskProfile);
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
router.put('/:id/activate', activateprofile); // Activate/deactivate risk profile


module.exports = router;
