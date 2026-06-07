const mongoose = require('mongoose');

const IncidentSchema = new mongoose.Schema({
  zone: {
    type: String,
    required: true,
  },
  severity: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium',
  },
  category: {
    type: String,
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
  unit: {
    type: String,
    default: 'Unassigned',
  },
  status: {
    type: String,
    enum: ['new', 'active', 'resolved'],
    default: 'new',
  },
  text: {
    type: String,
    required: true,
  },
  ai_tag: {
    type: String,
  },
  draft_police_alert: String,
  draft_health_alert: String,
  draft_ndrf_alert: String,
}, {
  timestamps: true
});

module.exports = mongoose.model('Incident', IncidentSchema);
