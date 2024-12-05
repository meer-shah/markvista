const mongoose = require('mongoose');

const ApiConnectionSchema = new mongoose.Schema(
  {
    apiKey: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    secretKey: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('ApiConnection', ApiConnectionSchema);
