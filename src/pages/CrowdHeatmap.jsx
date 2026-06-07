import { useState } from 'react';
import { ZONES } from '../data/mockData.js';
import { getZoneAdvisory } from '../services/claude.js';

// ── UJJAIN ZONE & GHAT DATA ────────────────────────────────────────
const GHATS = [
  { id:'triveni',   name:'Triveni Sangam',     x:218, y:108, type:'sangam',  desc:'Holy confluence — Kshipra, Gambhir & Saraswati' },
  { id:'gaughat',   name:'Gau Ghat',           x:210, y:168, type:'ghat',    desc:'Popular bathing ghat' },
  { id:'ramghat',   name:'Ram Ghat',           x:208, y:228, type:'primary', desc:'Main Simhastha bathing ghat — Shahi Snan site' },
  { id:'naighat',   name:'Nai Ghat',           x:208, y:278, type:'ghat',    desc:'Adjacent to Ram Ghat' },
  { id:'bhukhi',    name:'Bhukhi Mata Ghat',   x:210, y:335, type:'ghat',    desc:'Named after Bhukhi Mata temple' },
  { id:'duttag',    name:'Dutta Akhara Ghat',  x:218, y:390, type:'akhara',  desc:'Akhara zone — sadhus & akharas assemble' },
  { id:'mangg',     name:'Mangalnath Ghat',    x:224, y:468, type:'temple',  desc:'Mangalnath temple — origin of Ujjain\'s astrology' },
];

const LANDMARKS = [
  { id:'mahakal',  name:'Mahakal Mandir',  x:355, y:228, icon:'🔱', type:'temple',  density:91 },
  { id:'freeganj', name:'Freeganj',        x:500, y:148, icon:'🏪', type:'market',  density:45 },
  { id:'tower',    name:'Tower Chowk',     x:420, y:335, icon:'🗼', type:'junction',density:48 },
  { id:'nanakheda',name:'Nanakheda',       x:635, y:190, icon:'🚉', type:'station', density:55 },
  { id:'dewas',    name:'Dewas Naka',      x:680, y:430, icon:'🛣️', type:'highway', density:41 },
  { id:'duttaz',   name:'Dutta Akhara',   x:310, y:390, icon:'🏕️', type:'akhara',  density:73 },
  { id:'mangal',   name:'Mangalnath',     x:272, y:470, icon:'⛪', type:'temple',  density:62 },
];

const ZONE_AREAS = [
  { id:'ramghat',    cx:255, cy:235, r:62,  name:'Ramghat Zone',      density:87, status:'critical' },
  { id:'mahakal',   cx:390, cy:232, r:68,  name:'Mahakal Mandir',    density:91, status:'critical' },
  { id:'mangalnath',cx:270, cy:468, r:52,  name:'Mangalnath Zone',   density:62, status:'watch'    },
  { id:'freeganj',  cx:510, cy:148, r:50,  name:'Freeganj',          density:45, status:'safe'     },
  { id:'dutta',     cx:300, cy:388, r:50,  name:'Dutta Akhara',      density:73, status:'watch'    },
  { id:'bhukhi',    cx:248, cy:330, r:42,  name:'Bhukhi Mata Ghat',  density:38, status:'safe'     },
  { id:'nanakheda', cx:640, cy:190, r:55,  name:'Nanakheda',         density:55, status:'watch'    },
  { id:'tower',     cx:435, cy:335, r:48,  name:'Tower Chowk',       density:48, status:'safe'     },
  { id:'dewas',     cx:690, cy:435, r:52,  name:'Dewas Naka',        density:41, status:'safe'     },
];

const DENSITY_COLOR = d =>
  d >= 85 ? { fill:'#ef4444', stroke:'#dc2626' } :
  d >= 60 ? { fill:'#f59e0b', stroke:'#d97706' } :
             { fill:'#22c55e', stroke:'#16a34a' };

const HOUR_MODIFIER = h =>
  h <= 6  ? 0.50 : h <= 8  ? 0.75 : h <= 10 ? 0.95 :
  h <= 12 ? 0.90 : h <= 14 ? 1.00 : h <= 16 ? 0.95 : 0.70;

export default function CrowdHeatmap() {
  const [selected, setSelected] = useState(null);
  const [advisory, setAdvisory] = useState(null);
  const [loading, setLoading] = useState(false);
  const [hour, setHour] = useState(10);
  const [countdown] = useState({ h:3, m:42, s:17 });

  async function handleClick(zoneId) {
    const zone = ZONE_AREAS.find(z => z.id === zoneId) || GHATS.find(g => g.id === zoneId);
    setSelected(zone);
    setAdvisory(null);
    setLoading(true);
    const data = ZONES.find(z => z.id === zoneId) || { name: zone?.name, density: zone?.density || 50, status: 'watch' };
    const res = await getZoneAdvisory(data);
    setAdvisory(res);
    setLoading(false);
  }

  function getScaledDensity(baseDensity) {
    return Math.min(100, Math.round(baseDensity * HOUR_MODIFIER(hour)));
  }

  return (
    <div className="flex h-full overflow-hidden" style={{ background:'var(--bg)' }}>

      {/* ── MAP AREA ── */}
      <div className="flex-1 p-4 flex flex-col overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between mb-3 flex-shrink-0">
          <div>
            <h2 className="font-mukta font-bold text-xl" style={{ color:'var(--text)' }}>
              🗺️ Ujjain City — Live Crowd Heatmap
            </h2>
            <p className="text-xs mt-0.5" style={{ color:'var(--text3)' }}>
              Simhastha Mahakumbh 2028 · Kshipra River Zone Map · क्षेत्र पर क्लिक करें
            </p>
          </div>
          {/* Shahi Snan Countdown */}
          <div className="text-center px-4 py-2 rounded-xl" style={{ background:'rgba(239,68,68,.12)', border:'1px solid rgba(239,68,68,.3)' }}>
            <div className="text-xs font-medium mb-0.5" style={{ color:'#ef4444' }}>🔱 Shahi Snan</div>
            <div className="font-grotesk font-extrabold text-lg" style={{ color:'#ef4444' }}>
              {String(countdown.h).padStart(2,'0')}:{String(countdown.m).padStart(2,'0')}:{String(countdown.s).padStart(2,'0')}
            </div>
          </div>
        </div>

        {/* Time Slider */}
        <div className="rounded-xl px-4 py-2 mb-3 flex items-center gap-3 flex-shrink-0"
             style={{ background:'var(--card)', border:'1px solid var(--border)' }}>
          <span className="text-xs" style={{ color:'var(--text3)' }}>6 AM</span>
          <input type="range" min={6} max={18} value={hour} onChange={e=>setHour(+e.target.value)}
            className="flex-1" style={{ accentColor:'var(--orange)' }} />
          <span className="text-xs" style={{ color:'var(--text3)' }}>6 PM</span>
          <div className="text-center min-w-[80px]">
            <div className="font-grotesk font-bold text-sm" style={{ color:'var(--orange)' }}>
              {String(hour).padStart(2,'0')}:00
            </div>
            <div className="text-[10px]" style={{ color:'var(--text3)' }}>
              {hour >= 14 && hour <= 16 ? '⚠️ Peak Hours' : hour >= 10 && hour <= 13 ? 'High Traffic' : 'Normal'}
            </div>
          </div>
        </div>

        {/* SVG MAP */}
        <div className="flex-1 rounded-2xl overflow-hidden" style={{ background:'#1a2035', border:'1px solid var(--border)', minHeight:0 }}>
          <svg viewBox="0 0 900 600" width="100%" height="100%" style={{ display:'block' }}>

            {/* ── DEFS: Gradients for heat ── */}
            <defs>
              {ZONE_AREAS.map(z => {
                const d = getScaledDensity(z.density);
                const c = DENSITY_COLOR(d);
                return (
                  <radialGradient key={z.id} id={`heat-${z.id}`} cx="50%" cy="50%" r="50%">
                    <stop offset="0%"   stopColor={c.fill} stopOpacity="0.45" />
                    <stop offset="65%"  stopColor={c.fill} stopOpacity="0.15" />
                    <stop offset="100%" stopColor={c.fill} stopOpacity="0"    />
                  </radialGradient>
                );
              })}
              {/* River gradient */}
              <linearGradient id="river-grad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%"   stopColor="#93c5fd" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#60a5fa" stopOpacity="0.7" />
              </linearGradient>
              <filter id="blur-heat">
                <feGaussianBlur stdDeviation="8" />
              </filter>
            </defs>

            {/* ── CITY BACKGROUND ── */}
            <rect width="900" height="600" fill="#1a2035" />
            {/* City area outline */}
            <polygon points="240,10 800,10 860,60 880,300 840,580 700,590 300,580 240,500 220,350 230,180"
              fill="#1e2636" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />

            {/* ── ROAD NETWORK ── */}
            {/* NH-3 (Agra-Mumbai Highway) - east of city, runs N-S */}
            <path d="M 760,0 L 780,600" stroke="#374151" strokeWidth="5" strokeDasharray="8,4" opacity="0.6" />
            <text x="770" y="30" fill="#6b7280" fontSize="8" textAnchor="middle" fontFamily="Space Grotesk">NH-3</text>
            {/* Ring road east */}
            <path d="M 860,150 Q 820,300 850,450" stroke="#374151" strokeWidth="3" fill="none" opacity="0.5" />
            {/* Main road: Ramghat → Mahakal Mandir */}
            <path d="M 230,228 L 355,228" stroke="#4b5563" strokeWidth="4" opacity="0.8" />
            {/* Mahakal → Tower Chowk */}
            <path d="M 390,265 L 420,310" stroke="#4b5563" strokeWidth="4" opacity="0.8" />
            {/* Freeganj → Nanakheda */}
            <path d="M 550,150 L 630,190" stroke="#4b5563" strokeWidth="3" opacity="0.7" />
            {/* Tower Chowk → Nanakheda */}
            <path d="M 480,335 L 635,210" stroke="#4b5563" strokeWidth="3" opacity="0.6" />
            {/* Dewas Naka road */}
            <path d="M 640,410 L 758,440" stroke="#4b5563" strokeWidth="4" opacity="0.6" />
            {/* Mangalnath road */}
            <path d="M 255,470 L 420,350" stroke="#4b5563" strokeWidth="3" opacity="0.5" />
            {/* Local roads */}
            <path d="M 350,228 L 350,340 L 430,340" stroke="#374151" strokeWidth="2" fill="none" opacity="0.5" />
            <path d="M 300,150 L 500,148" stroke="#374151" strokeWidth="2" opacity="0.4" />

            {/* ── SHIPRA RIVER ── (main feature, flows S→N on west side) */}
            {/* River body */}
            <path d="M 235,600 C 228,540 215,500 208,455 C 198,408 208,375 205,338
                     C 200,300 202,275 205,248 C 207,220 206,195 205,168
                     C 203,140 200,115 208,88 C 215,65 215,38 220,0"
              stroke="url(#river-grad)" strokeWidth="38" fill="none" strokeLinecap="round" opacity="0.85" />
            {/* River highlights */}
            <path d="M 230,600 C 224,540 213,500 207,455 C 197,408 207,375 205,338
                     C 200,300 202,275 205,248 C 207,220 206,195 205,168
                     C 203,140 200,115 208,88 C 215,65 215,38 218,0"
              stroke="rgba(147,197,253,0.35)" strokeWidth="8" fill="none" strokeLinecap="round" />
            {/* Shipra label */}
            <text transform="translate(178,310) rotate(-78)" fill="#93c5fd" fontSize="13"
              fontFamily="Mukta, sans-serif" fontWeight="800" opacity="1" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.8)' }}>Kshipra (Shipra) River</text>

            {/* ── TRIBUTARY: Gambhir River (meets at Triveni) ── */}
            <path d="M 0,90 C 40,92 80,96 120,100 C 155,103 190,106 218,108"
              stroke="#7dd3fc" strokeWidth="12" fill="none" strokeLinecap="round" opacity="0.5" />
            <text x="50" y="84" fill="#7dd3fc" fontSize="10" fontFamily="Mukta" opacity="0.8" fontWeight="600">Gambhir River</text>

            {/* ── HEAT BLOBS (blurred overlays) ── */}
            {ZONE_AREAS.map(z => (
              <ellipse key={`heat-${z.id}`}
                cx={z.cx} cy={z.cy}
                rx={z.r * 1.8 * (getScaledDensity(z.density)/100 * 0.5 + 0.7)}
                ry={z.r * 1.4 * (getScaledDensity(z.density)/100 * 0.5 + 0.7)}
                fill={`url(#heat-${z.id})`} filter="url(#blur-heat)" />
            ))}

            {/* ── ZONE CIRCLES (interactive) ── */}
            {ZONE_AREAS.map(z => {
              const d = getScaledDensity(z.density);
              const c = DENSITY_COLOR(d);
              const isSelected = selected?.id === z.id;
              const isCritical = d >= 85;
              return (
                <g key={z.id} onClick={() => handleClick(z.id)} style={{ cursor:'pointer' }}>
                  {/* Pulse ring for critical */}
                  {isCritical && (
                    <circle cx={z.cx} cy={z.cy} r={z.r + 8}
                      fill="none" stroke={c.fill} strokeWidth="2" opacity="0.4">
                      <animate attributeName="r" values={`${z.r+4};${z.r+14};${z.r+4}`} dur="1.8s" repeatCount="indefinite" />
                      <animate attributeName="opacity" values="0.5;0;0.5" dur="1.8s" repeatCount="indefinite" />
                    </circle>
                  )}
                  <circle cx={z.cx} cy={z.cy} r={z.r}
                    fill={c.fill} fillOpacity={isSelected ? 0.7 : 0.35}
                    stroke={isSelected ? 'white' : c.stroke}
                    strokeWidth={isSelected ? 2.5 : 1.5}
                    className="transition-all duration-300" />
                  <text x={z.cx} y={z.cy - 6} textAnchor="middle"
                    fill="white" fontSize="13" fontWeight="800" fontFamily="Mukta, sans-serif"
                    style={{ textShadow: '0 2px 5px rgba(0,0,0,0.8)' }}>
                    {z.name.split(' ')[0]}
                  </text>
                  <text x={z.cx} y={z.cy + 12} textAnchor="middle"
                    fill="white" fontSize="14" fontWeight="800" fontFamily="Space Grotesk, sans-serif"
                    style={{ textShadow: '0 2px 5px rgba(0,0,0,0.8)' }}>
                    {d}%
                  </text>
                </g>
              );
            })}

            {/* ── BRIDGES ── */}
            {[228, 330, 450].map((y,i) => (
              <g key={i}>
                <line x1="190" y1={y} x2="240" y2={y} stroke="#9ca3af" strokeWidth="5" strokeLinecap="round" />
                <line x1="190" y1={y} x2="240" y2={y} stroke="white" strokeWidth="1.5" strokeLinecap="round" opacity="0.3" />
              </g>
            ))}

            {/* ── GHAT MARKERS ── */}
            {GHATS.map(g => {
              const isSelected = selected?.id === g.id;
              const isPrimary = g.type === 'primary' || g.type === 'sangam';
              return (
                <g key={g.id} onClick={() => handleClick(g.id)} style={{ cursor:'pointer' }}>
                  {/* Connector line to river */}
                  <line x1={g.x} y1={g.y} x2={g.x - 22} y2={g.y}
                    stroke={isPrimary ? '#f97316' : '#60a5fa'} strokeWidth="2.5" opacity="0.8" />
                  {/* Diamond marker */}
                  <polygon
                    points={`${g.x},${g.y-10} ${g.x+10},${g.y} ${g.x},${g.y+10} ${g.x-10},${g.y}`}
                    fill={isPrimary ? '#f97316' : '#3b82f6'}
                    stroke={isSelected ? 'white' : 'rgba(255,255,255,0.9)'}
                    strokeWidth={isSelected ? 3 : 1.5} />
                  {/* Background rect for legibility */}
                  <rect x={g.x + 13} y={g.y - 10} width={g.name.length * 7 + 10} height="20" rx="4" fill="rgba(15,17,23,0.8)" />
                  {/* Label (right side) */}
                  <text x={g.x + 18} y={g.y + 4}
                    fill={isPrimary ? '#fb923c' : '#93c5fd'}
                    fontSize={isPrimary ? '12' : '11'}
                    fontWeight={isPrimary ? '800' : '600'}
                    fontFamily="Mukta, sans-serif">
                    {g.name}
                  </text>
                </g>
              );
            })}

            {/* ── LANDMARK ICONS ── */}
            {LANDMARKS.map(l => (
              <g key={l.id}>
                <text x={l.x} y={l.y} textAnchor="middle" fontSize="14">{l.icon}</text>
                <text x={l.x} y={l.y + 13} textAnchor="middle"
                  fill="rgba(255,255,255,0.5)" fontSize="7.5" fontFamily="Mukta, sans-serif">{l.name}</text>
              </g>
            ))}

            {/* ── LEGEND ── */}
            <g transform="translate(12,12)">
              <rect width="130" height="78" rx="8" fill="rgba(15,17,23,0.88)" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
              <text x="8" y="16" fill="rgba(255,255,255,0.5)" fontSize="8" fontFamily="Mukta">CROWD DENSITY</text>
              {[['#22c55e','< 60% Safe'],['#f59e0b','60–85% Watch'],['#ef4444','> 85% Critical']].map(([c,l],i)=>(
                <g key={l} transform={`translate(8,${24+i*17})`}>
                  <circle cx="5" cy="4" r="5" fill={c} fillOpacity="0.8" />
                  <text x="14" y="8" fill="rgba(255,255,255,0.75)" fontSize="9" fontFamily="Mukta">{l}</text>
                </g>
              ))}
              <g transform="translate(8,71)">
                <polygon points="5,0 9,5 5,10 1,5" fill="#f97316" />
                <text x="14" y="8" fill="rgba(255,255,255,0.75)" fontSize="9" fontFamily="Mukta">Ghat / Sangam</text>
              </g>
            </g>

            {/* ── NORTH ARROW ── */}
            <g transform="translate(845,25)">
              <circle cx="20" cy="20" r="18" fill="rgba(15,17,23,0.7)" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
              <polygon points="20,4 23,20 20,18 17,20" fill="white" />
              <polygon points="20,36 17,20 20,22 23,20" fill="rgba(255,255,255,0.3)" />
              <text x="20" y="13" textAnchor="middle" fill="white" fontSize="7" fontWeight="700" fontFamily="Space Grotesk">N</text>
            </g>

            {/* Scale bar */}
            <g transform="translate(20,580)">
              <line x1="0" y1="0" x2="60" y2="0" stroke="rgba(255,255,255,0.5)" strokeWidth="2" />
              <line x1="0" y1="-4" x2="0" y2="4" stroke="rgba(255,255,255,0.5)" strokeWidth="2" />
              <line x1="60" y1="-4" x2="60" y2="4" stroke="rgba(255,255,255,0.5)" strokeWidth="2" />
              <text x="30" y="-6" textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize="8" fontFamily="Space Grotesk">~1 km</text>
            </g>
          </svg>
        </div>
      </div>

      {/* ── SIDE PANEL ── */}
      {selected && (
        <div className="w-80 border-l p-4 overflow-y-auto flex-shrink-0 animate-slide-in"
             style={{ borderColor:'var(--border)', background:'var(--bg2)' }}>
          <div className="flex items-start justify-between mb-3">
            <div>
              <h3 className="font-mukta font-bold text-lg" style={{ color:'var(--text)' }}>{selected.name}</h3>
              {selected.density !== undefined && (
                <div className="flex items-center gap-2 mt-1">
                  <span className={selected.status==='critical'?'pill-critical':selected.status==='watch'?'pill-high':'pill-safe'}>
                    {selected.status?.toUpperCase()}
                  </span>
                  <span className="font-grotesk font-bold" style={{ color:'var(--orange)' }}>
                    {getScaledDensity(selected.density)}%
                  </span>
                </div>
              )}
              {selected.desc && (
                <p className="text-xs mt-1" style={{ color:'var(--text3)' }}>{selected.desc}</p>
              )}
            </div>
            <button onClick={() => { setSelected(null); setAdvisory(null); }}
              className="w-7 h-7 rounded-lg flex items-center justify-center text-sm"
              style={{ background:'var(--bg3)', color:'var(--text2)' }}>✕</button>
          </div>

          {/* Stats grid */}
          {selected.density !== undefined && (
            <>
              <div className="grid grid-cols-2 gap-2 mb-3">
                {[['Density',getScaledDensity(selected.density)+'%'],
                  ['Zone',selected.status||'N/A'],
                  ['Volunteers', ZONES.find(z=>z.id===selected.id)?.volunteers||'—'],
                  ['Ambulances', ZONES.find(z=>z.id===selected.id)?.ambulances||'—'],
                ].map(([l,v])=>(
                  <div key={l} className="rounded-lg p-2 text-center" style={{ background:'var(--card)' }}>
                    <div className="text-xs" style={{ color:'var(--text3)' }}>{l}</div>
                    <div className="font-grotesk font-bold text-sm" style={{ color:'var(--orange)' }}>{v}</div>
                  </div>
                ))}
              </div>
              {/* Density bar */}
              <div className="mb-3">
                <div className="flex justify-between text-xs mb-1" style={{ color:'var(--text3)' }}>
                  <span>Crowd Density at {String(hour).padStart(2,'0')}:00</span>
                  <span className="font-grotesk font-bold" style={{ color:'var(--text)' }}>{getScaledDensity(selected.density)}%</span>
                </div>
                <div className="h-2 rounded-full overflow-hidden" style={{ background:'var(--bg3)' }}>
                  <div className="h-full rounded-full transition-all duration-700"
                    style={{ width:`${getScaledDensity(selected.density)}%`,
                      background: DENSITY_COLOR(getScaledDensity(selected.density)).fill }} />
                </div>
              </div>
            </>
          )}

          {/* AI Advisory */}
          <div className="rounded-xl p-3" style={{ background:'rgba(249,115,22,.08)', border:'1px solid rgba(249,115,22,.25)' }}>
            <div className="flex items-center gap-2 mb-2">
              <span>🤖</span>
              <span className="font-mukta font-bold text-sm" style={{ color:'var(--orange)' }}>NetraBot Assessment</span>
            </div>
            {loading ? (
              <p className="text-sm animate-pulse" style={{ color:'var(--orange)' }}>Analyzing zone data…</p>
            ) : advisory ? (
              <>
                <span className={advisory.risk_level==='critical'?'pill-critical':advisory.risk_level==='high'?'pill-high':'pill-safe'}>
                  {advisory.risk_level?.toUpperCase()} RISK
                </span>
                <p className="text-xs mt-2 mb-2 font-mukta" style={{ color:'var(--text2)' }}>{advisory.assessment}</p>
                {advisory.immediate_actions?.map((a,i)=>(
                  <div key={i} className="text-xs flex gap-1.5 mb-1" style={{ color:'var(--text3)' }}>
                    <span style={{ color:'var(--orange)' }}>→</span>{a}
                  </div>
                ))}
                {advisory.historical_note && (
                  <div className="mt-2 rounded-lg p-2 text-xs" style={{ background:'rgba(245,158,11,.1)', color:'#fbbf24' }}>
                    📜 {advisory.historical_note}
                  </div>
                )}
              </>
            ) : (
              <p className="text-xs" style={{ color:'var(--text3)' }}>Zone data loaded. Click to get AI assessment.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
