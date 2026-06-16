const mongoose = require('mongoose');

const listingSchema = new mongoose.Schema({
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  action: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Action',
  },
  title: {
    type: String,
    required: [true, 'Title is required'],
    maxlength: 200,
  },
  type: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    maxlength: 2000,
  },
  price: {
    type: Number,
    required: true,
    min: [0, 'Price cannot be negative'],
  },
  credits: {
    type: Number,
    required: true,
    min: [1, 'Must list at least 1 credit'],
  },
  co2Offset: {
    type: Number,
    required: true,
    min: 0,
  },
  location: {
    type: String,
    required: true,
  },
  imageUrl: String,
  active: {
    type: Boolean,
    default: true,
    index: true,
  },
}, {
  timestamps: true,
});

listingSchema.index({ active: 1, createdAt: -1 });
listingSchema.index({ type: 1 });

module.exports = mongoose.model('Listing', listingSchema);
