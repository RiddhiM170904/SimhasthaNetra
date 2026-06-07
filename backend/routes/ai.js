const express = require('express');
const router = express.Router();
const { Anthropic } = require('@anthropic-ai/sdk');

// Initialize Anthropic SDK if key is provided, else use mocks
const anthropic = process.env.ANTHROPIC_API_KEY
  ? new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
  : null;

// @route   POST /api/ai/triage
// @desc    Triage incoming incident texts using Claude
router.post('/triage', async (req, res) => {
  const { text } = req.body;
  if (!text) return res.status(400).json({ error: 'Text prompt is required' });

  if (!anthropic) {
    // Fallback Mock data
    return res.json({
      category: "Crowd Congestion Alert",
      severity: "medium",
      hindi_summary: "भीड़ का दबाव बढ़ रहा है, वैकल्पिक मार्ग चालू किए जा रहे हैं।",
      draft_police_alert: "Deploy additional personnel to redirect flow.",
      draft_health_alert: "First aid team on standby.",
      draft_ndrf_alert: "Quick Response Team alert."
    });
  }

  try {
    const response = await anthropic.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 500,
      system: "You are an AI dispatcher for Simhastha 2028. Triage incoming crowd reports and return a strict JSON with keys: category, severity (low/medium/high), hindi_summary, draft_police_alert, draft_health_alert, draft_ndrf_alert.",
      messages: [{ role: "user", content: text }]
    });

    const parsed = JSON.parse(response.content[0].text);
    res.json(parsed);
  } catch (err) {
    res.status(500).json({ error: 'Failed to query Claude API: ' + err.message });
  }
});

module.exports = router;
