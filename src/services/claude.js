// Claude API service — calls Anthropic directly from browser
// NOTE: In production use a backend proxy. For hackathon demo this is fine.

const CLAUDE_API_URL = 'https://api.anthropic.com/v1/messages';
const API_KEY = import.meta.env.VITE_ANTHROPIC_API_KEY || '';

const SYSTEM_PROMPT = `You are NetraBot, the AI operations assistant for SimhasthaNetra — 
the command center for Simhastha Kumbh 2028 in Ujjain. 
You understand Hindi, Hinglish, and English.
Context: 75 lakh pilgrims expected today. Shahi Snan in 4 hours. 
Current critical zones: Ramghat (87%), Mahakal Mandir (91%).
Always respond ONLY with valid JSON — no markdown, no extra text.`;

async function callClaude(userMessage, schema) {
  if (!API_KEY) {
    // Return mock data when no API key
    return getMockResponse(schema, userMessage);
  }
  try {
    const res = await fetch(CLAUDE_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': API_KEY,
        'anthropic-version': '2023-06-01',
        'anthropic-dangerous-direct-browser-access': 'true',
      },
      body: JSON.stringify({
        model: 'claude-opus-4-5',
        max_tokens: 1024,
        system: SYSTEM_PROMPT,
        messages: [{ role: 'user', content: userMessage }],
      }),
    });
    const data = await res.json();
    const text = data.content?.[0]?.text || '{}';
    return JSON.parse(text);
  } catch (e) {
    console.error('Claude API error:', e);
    return getMockResponse(schema, userMessage);
  }
}

// ── INCIDENT TRIAGE ────────────────────────────────────────────────
export async function triageIncident(rawText) {
  const prompt = `Triage this field incident report. Respond in JSON exactly:
{ "severity": "low|medium|high", "zone": "zone name", "category": "category name",
  "hindi_summary": "2-line Hindi summary", "recommended_actions": ["action1","action2","action3"],
  "draft_police_alert": "draft message for police", "draft_health_alert": "draft for health team",
  "draft_ndrf_alert": "draft for NDRF" }

Field report: "${rawText}"`;
  return callClaude(prompt, 'triage');
}

// ── AI SUJHAV (proactive suggestion) ─────────────────────────────
export async function getAISujhav(zoneState) {
  const prompt = `Based on current zone states, give ONE proactive operational suggestion. JSON:
{ "severity": "low|medium|high", "zone": "zone name", "detected": "what was detected",
  "recommendation": "recommended action", "affected_units": ["unit1","unit2"] }

Current zone densities: ${JSON.stringify(zoneState)}`;
  return callClaude(prompt, 'sujhav');
}

// ── ZONE ADVISORY ─────────────────────────────────────────────────
export async function getZoneAdvisory(zone) {
  const prompt = `Zone ${zone.name} has ${zone.density}% crowd density (${zone.status}).
Give a zone-specific advisory JSON:
{ "risk_level": "low|medium|high|critical", "assessment": "2-sentence assessment",
  "immediate_actions": ["action1","action2"], "historical_note": "reference to 2016 or past events if relevant" }`;
  return callClaude(prompt, 'zone');
}

// ── SURGE PREDICTION ──────────────────────────────────────────────
export async function getSurgePrediction(transportData) {
  const prompt = `Based on transport data, predict crowd surge for next 2 hours. JSON:
{ "surge_probability": "0-100", "peak_zone": "zone name", "peak_time": "HH:MM",
  "expected_crowd": "number", "recommended_routes": ["route1","route2"],
  "timeline": [{"time":"HH:MM","crowd":"number","risk":"low|medium|high"}] }

Transport data: ${JSON.stringify(transportData)}`;
  return callClaude(prompt, 'surge');
}

// ── OUTBREAK SCAN ─────────────────────────────────────────────────
export async function getOutbreakScan(healthData) {
  const prompt = `Scan these health indicators for outbreak risk. JSON:
{ "overall_risk": "low|medium|high", "hotspot_zone": "zone name",
  "disease_watch": "disease name", "zones": [{"zone":"name","risk":"level","note":"note"}],
  "historical_comparison": "comparison to 2016 Kumbh data" }

Health data: ${JSON.stringify(healthData)}`;
  return callClaude(prompt, 'outbreak');
}

// ── MOCK RESPONSES (when no API key) ─────────────────────────────
function getMockResponse(schema, input) {
  const delay = ms => new Promise(r => setTimeout(r, ms));
  return delay(1500).then(() => {
    if (schema === 'triage') return {
      severity: 'high', zone: 'Ramghat', category: 'Crowd Surge',
      hindi_summary: 'Ramghat par bheed ki sankhya tezi se badh rahi hai. Turant karwai zaroori hai.',
      recommended_actions: ['Zone A entry rokein', 'Backup force bhejein', 'Medical team alert karein'],
      draft_police_alert: '🚨 POLICE ALERT: Ramghat par crowd surge. Unit Alpha-3 aur Beta-2 turant deploy karein. Alternate routes activate karein.',
      draft_health_alert: '🏥 HEALTH ALERT: Ramghat zone mein medical team standby par rakhein. 2 ambulance pre-position karein.',
      draft_ndrf_alert: '🔵 NDRF ALERT: Ramghat crowd density 87% se upar. Search & rescue team readiness confirm karein.',
    };
    if (schema === 'sujhav') return {
      severity: 'high', zone: 'Mahakal Mandir',
      detected: 'Crowd density 91% — historical surge pattern detected matching 2016 Simhastha data.',
      recommendation: 'Activate alternate darshan queue via North Gate. Deploy 200 additional volunteers immediately.',
      affected_units: ['Volunteer Team C', 'Police Unit 7'],
    };
    if (schema === 'zone') return {
      risk_level: 'critical',
      assessment: 'Zone is at 87% capacity with incoming crowd from Nanakheda station. Shahi Snan proximity increases risk significantly.',
      immediate_actions: ['Close east entry gate', 'Redirect crowd to Mangalnath'],
      historical_note: 'In 2016, this zone saw a critical stampede at similar density. Extreme caution advised.',
    };
    if (schema === 'surge') return {
      surge_probability: '78', peak_zone: 'Ramghat', peak_time: '14:35',
      expected_crowd: '8,20,000',
      recommended_routes: ['Activate R-12 bypass', 'Open temporary camp at Dewas Naka'],
      timeline: [
        { time:'14:00', crowd:'7,80,000', risk:'high' },
        { time:'14:35', crowd:'8,20,000', risk:'critical' },
        { time:'15:00', crowd:'8,00,000', risk:'high' },
      ],
    };
    if (schema === 'outbreak') return {
      overall_risk: 'medium',
      hotspot_zone: 'Dutta Akhara', disease_watch: 'Diarrhea',
      zones: [
        { zone:'Dutta Akhara', risk:'high', note:'3 cases in 90 min — water source suspect' },
        { zone:'Ramghat', risk:'medium', note:'Fever cases rising' },
        { zone:'Nanakheda', risk:'low', note:'Normal baseline' },
      ],
      historical_comparison: '2016 Simhastha saw diarrhea outbreak at Dutta Akhara affecting 400+ pilgrims. Pattern matches current data.',
    };
  });
}
