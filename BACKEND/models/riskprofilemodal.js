
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const riskProfileSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
  },
  SLallowedperday: {
    type: Number
  },
  initialRiskPerTrade: {
    type: Number,
    required: true
  },
  increaseOnWin: {
    type: Number,
  },
  decreaseOnLoss: {
    type: Number,
  },
  maxRisk: {
    type: Number,
  },
  minRisk: {
    type: Number,
  },
  reset: {
    type: Number,
  },
  growthThreshold: {
    type: Number,
  },
  payoutPercentage: {
    type: Number,
  },
  noofactivetrades: {
    type: Number,
  },
  minRiskRewardRatio: { // New field added here
    type: Number,
    // or false, depending on your requirements
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  ison: {
    type: Boolean,
    default: false,
  }
});



const dailyLossSchema = new mongoose.Schema(
  {
    date: { type: String, required: true }, // Store date as a string in 'YYYY-MM-DD' format
    totalLoss: { type: Number, default: 0 }, // Store the total losses for the day
  },
  { timestamps: true }
);

// Create the model
const DailyLoss = mongoose.model("DailyLoss", dailyLossSchema);

module.exports = DailyLoss;




module.exports = mongoose.model('RiskProfile', riskProfileSchema);
