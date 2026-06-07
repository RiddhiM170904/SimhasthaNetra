const mongoose = require('mongoose');

const ZoneSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  density: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  status: {
    type: String,
    enum: ['safe', 'watch', 'critical'],
    default: 'safe'
  },
  volunteers: {
    type: Number,
    default: 0
  },
  ambulances: {
    type: Number,
    default: 0
  },
  reports: {
    type: Number,
    default: 0
  },
  capacity: {
    type: Number,
    default: 10000
  },
  occupancy: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Zone', ZoneSchema);
