const express = require('express');
const {
  placeOrder,
  placeOrderWithRiskProfile, // Include this function
  getOrderListf,
  cancelOrder,
  ammendOrder,
  getPositionInfof,
  setLeverage,
  switchMarginMode,
  getClosedPnlf,
  getAccountBalance,
  getCoinBalance,
  getSingleCoinBalance,
  gettransactionlog,
  showusdtbalance,
} = require('../controllers/order');

const router = express.Router();

// Order Management Routes
router.post('/place-order', placeOrder); // Place a new order
router.post('/place-order-risk-profile', placeOrderWithRiskProfile); // Place order with risk profile
router.get('/order-list', getOrderListf); // Get pending orders
router.post('/cancel-order', cancelOrder); // Cancel an existing order
router.post('/ammend-order', ammendOrder); // Amend an order

// Position Management Routes
router.get('/active-positions', getPositionInfof); // Get active positions
router.post('/set-leverage', setLeverage); // Set leverage for trading
router.post('/switch-margin-mode', switchMarginMode); // Switch margin mode

// Trade History and Risk Management Routes
router.get('/closed-pnl', getClosedPnlf); // Get closed PnL for trade history

router.get('/showusdtbalance', showusdtbalance);
// Account Management Routes
router.get('/account-balance', getAccountBalance); // Get account balance details
router.get('/coin-balance', getCoinBalance); // Get balance of all coins
router.get('/single-coin-balance/:coin', getSingleCoinBalance); // Get balance of a specific coin
router.get('/transaction-log', gettransactionlog)




module.exports = router;
