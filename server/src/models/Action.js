const mongoose = require('mongoose');

const actionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  type: {
    type: String,
    required: [true, 'Action type is required'],
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    maxlength: 2000,
  },
  location: {
    type: String,
    required: [true, 'Location is required'],
  },
  date: {
    type: Date,
    required: true,
  },
  co2Estimate: {
    type: Number,
    required: true,
    min: [0.01, 'CO2 estimate must be positive'],
  },
  credits: {
    type: Number,
    default: 0,
  },
  status: {
    type: String,
    enum: ['pending', 'verified', 'rejected'],
    default: 'pending',
    index: true,
  },
  imageUrl: String,
  blockchainHash: String,
  verification: {
    aiScore: Number,
    geoVerified: Boolean,
    imageAnalysis: String,
    verifiedAt: Date,
  },
}, {
  timestamps: true,
});

actionSchema.index({ user: 1, createdAt: -1 });

module.exports = mongoose.model('Action', actionSchema);
