const express = require('express');
const {
  placeOrder
  } = require('../controllers/order');
  
  const router = express.Router();
  router.post('/place-order', placeOrder);
  module.exports = router;