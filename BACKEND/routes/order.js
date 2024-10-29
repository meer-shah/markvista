const express = require('express');
const {
  placeOrder,placeorderwithconditions
  } = require('../controllers/order');
  
  const router = express.Router();
  router.post('/place-order', placeOrder);
  router.post('/place-orderwithconditions',placeorderwithconditions );

  module.exports = router;