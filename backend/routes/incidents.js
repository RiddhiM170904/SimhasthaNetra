const express = require('express');
const router = express.Router();
const Incident = require('../models/Incident');

// @route   GET /api/incidents
// @desc    Get all incidents
router.get('/', async (req, res) => {
  try {
    const incidents = await Incident.find().sort({ createdAt: -1 });
    res.json(incidents);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @route   POST /api/incidents
// @desc    Create a new incident
router.post('/', async (req, res) => {
  const incident = new Incident({
    zone: req.body.zone,
    severity: req.body.severity,
    category: req.body.category || 'Pending Triage',
    time: req.body.time || new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
    unit: req.body.unit || 'Unassigned',
    status: req.body.status || 'new',
    text: req.body.text,
    ai_tag: req.body.ai_tag,
    draft_police_alert: req.body.draft_police_alert,
    draft_health_alert: req.body.draft_health_alert,
    draft_ndrf_alert: req.body.draft_ndrf_alert,
  });

  try {
    const newIncident = await incident.save();
    res.status(201).json(newIncident);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// @route   PUT /api/incidents/:id
// @desc    Update incident status (e.g. active, resolved)
router.put('/:id', async (req, res) => {
  try {
    const incident = await Incident.findById(req.params.id);
    if (!incident) return res.status(404).json({ message: 'Incident not found' });

    if (req.body.status) incident.status = req.body.status;
    if (req.body.severity) incident.severity = req.body.severity;
    if (req.body.category) incident.category = req.body.category;
    if (req.body.ai_tag) incident.ai_tag = req.body.ai_tag;
    if (req.body.unit) incident.unit = req.body.unit;

    const updatedIncident = await incident.save();
    res.json(updatedIncident);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
