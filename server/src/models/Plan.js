const mongoose = require('mongoose');

const planSchema = new mongoose.Schema({
  name: {
    type: String,
    enum: ['free', 'pro', 'enterprise'],
    unique: true,
    required: true,
  },
  limits: {
    actionsPerMonth: { type: Number, required: true }, // -1 means unlimited
    listingsPerMonth: { type: Number, required: true },
    aiVerifications: { type: Number, required: true },
  },
  price: {
    type: Number,
    required: true, // monthly USD
  },
  features: [String],
});

module.exports = mongoose.model('Plan', planSchema);
