const express = require('express');
const router = express.Router();
const apiConnectionController = require('../controllers/apiConnectionController');

// Route to add API connection
router.post('/api-connection', apiConnectionController.addApiConnection);

// Route to get API connection
router.get('/api-connection', apiConnectionController.getApiConnection);

// Route to delete API connection
router.delete('/api-connection', apiConnectionController.deleteApiConnection);

module.exports = router;
