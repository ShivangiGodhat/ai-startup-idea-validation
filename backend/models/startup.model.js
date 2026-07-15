const mongoose = require('mongoose');

const startupIdeaSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  startupName: {
    type: String,
    required: [true, 'Startup Name is required'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Idea description is required'],
  },
  industry: {
    type: String,
    required: [true, 'Industry is required'],
  },
  targetMarket: {
    type: String,
    required: [true, 'Target Market is required'],
  },
  country: {
    type: String,
    required: [true, 'Country is required'],
  },
  businessModel: {
    type: String,
    required: [true, 'Business Model is required'],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('StartupIdea', startupIdeaSchema);
