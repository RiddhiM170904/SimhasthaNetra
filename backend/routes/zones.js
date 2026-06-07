const express = require('express');
const router = express.Router();
const Zone = require('../models/Zone');

// @route   GET /api/zones
// @desc    Get all zone details
router.get('/', async (req, res) => {
  try {
    const zones = await Zone.find();
    res.json(zones);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @route   PUT /api/zones/:id
// @desc    Update density/status/counts of a zone
router.put('/:id', async (req, res) => {
  try {
    const zone = await Zone.findOne({ id: req.params.id });
    if (!zone) return res.status(404).json({ message: 'Zone not found' });

    if (req.body.density !== undefined) zone.density = req.body.density;
    if (req.body.status) zone.status = req.body.status;
    if (req.body.volunteers !== undefined) zone.volunteers = req.body.volunteers;
    if (req.body.ambulances !== undefined) zone.ambulances = req.body.ambulances;
    if (req.body.reports !== undefined) zone.reports = req.body.reports;
    if (req.body.occupancy !== undefined) zone.occupancy = req.body.occupancy;

    const updatedZone = await zone.save();
    res.json(updatedZone);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
