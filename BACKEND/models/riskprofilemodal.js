
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


const AdjustedRiskSchema = new mongoose.Schema({
    riskProfileId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'RiskProfile',
        required: true,
    },
    adjustedRisk: {
        type: Number,
        required: true,
    },
    timestamp: {
        type: Date,
        default: Date.now,
    },
});

const AdjustedRisk = mongoose.model('AdjustedRisk', AdjustedRiskSchema);
module.exports = AdjustedRisk;

module.exports = mongoose.model('RiskProfile', riskProfileSchema);
