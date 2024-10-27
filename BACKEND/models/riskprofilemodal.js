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

SLallowedperday:{
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
  createdAt: {
    type: Date,
    default: Date.now
  },
  ison:{
    type: Boolean,
    default: false,
  }

});

module.exports = mongoose.model('RiskProfile', riskProfileSchema);


