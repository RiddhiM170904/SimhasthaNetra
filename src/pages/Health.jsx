import { useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer,
         BarChart, Bar, XAxis, YAxis, CartesianGrid,
         LineChart, Line, AreaChart, Area } from 'recharts';
import { ZONES, HEALTH_METRICS, DISEASE_DATA, WATER_QUALITY } from '../data/mockData.js';
import { getOutbreakScan } from '../services/claude.js';

const OPD_TREND = [
  { h:'06:00', cases:28  }, { h:'07:00', cases:64  }, { h:'08:00', cases:118 },
  { h:'09:00', cases:145 }, { h:'10:00', cases:162 }, { h:'11:00', cases:155 },
  { h:'12:00', cases:140 }, { h:'13:00', cases:158 }, { h:'14:00', cases:180 },
];

const AGE_DATA = [
  { age:'0–12',  count:48 }, { age:'13–25', count:72 }, { age:'26–40', count:125 },
  { age:'41–60', count:198 }, { age:'61–75', count:267 }, { age:'76+',  count:137 },
];

const ZONE_DISEASE = ZONES.map(z => ({
  zone: z.name.split(' ')[0],
  fever: Math.round(z.reports * 1.2),
  diarrhea: Math.round(z.reports * 0.8),
  respiratory: Math.round(z.reports * 0.6),
}));

const HEATWAVE_ZONES = [
  { zone:'Ramghat',   risk:88, cases:24 },
  { zone:'Mahakal',   risk:91, cases:31 },
  { zone:'Mangalnath',risk:62, cases:12 },
  { zone:'Dutta',     risk:74, cases:18 },
  { zone:'Nanakheda', risk:55, cases:9  },
];

export default function Health() {
  const [scan, setScan] = useState(null);
  const [loading, setLoading] = useState(false);

  async function runScan() {
    setLoading(true);
    const data = ZONES.map(z => ({ zone: z.name, reports: z.reports }));
    const res = await getOutbreakScan(data);
    setScan(res);
    setLoading(false);
  }

  const metrics = [
    { label:'OPD Cases Today',  value:HEALTH_METRICS.opd,        icon:'🏥', color:'var(--orange)' },
    { label:'Critical Cases',   value:HEALTH_METRICS.critical,   icon:'🚨', color:'#ef4444'       },
    { label:'Disease Alerts',   value:HEALTH_METRICS.alerts,     icon:'⚠️', color:'#f59e0b'       },
    { label:'Ambulances Active',value:HEALTH_METRICS.ambulances, icon:'🚑', color:'#22c55e'       },
    { label:'Hospitals on Duty',value:12,                         icon:'⚕️', color:'#3b82f6'       },
    { label:'Blood Units',      value:840,                        icon:'🩸', color:'#dc2626'       },
  ];

  return (
    <div className="p-4 overflow-y-auto h-full" style={{ background:'var(--bg)' }}>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="font-mukta font-bold text-xl" style={{ color:'var(--text)' }}>🏥 Health & Outbreak Watch</h2>
          <p className="text-xs mt-0.5" style={{ color:'var(--text3)' }}>AI-powered disease surveillance · Simhastha 2028</p>
        </div>
        <button onClick={runScan} disabled={loading}
          className="px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2"
          style={{ background:'var(--orange)', color:'white' }}>
          {loading ? <><span className="animate-spin">⚙️</span> Scanning…</> : '🔬 AI Outbreak Scan'}
        </button>
      </div>

      {/* Metric cards */}
      <div className="grid grid-cols-3 md:grid-cols-6 gap-3 mb-4">
        {metrics.map(m => (
          <div key={m.label} className="rounded-xl p-3 text-center" style={{ background:'var(--card)', border:'1px solid var(--border)' }}>
            <div className="text-2xl mb-1">{m.icon}</div>
            <div className="font-grotesk font-extrabold text-xl" style={{ color:m.color }}>{m.value}</div>
            <div className="text-xs" style={{ color:'var(--text3)' }}>{m.label}</div>
          </div>
        ))}
      </div>

      {/* Charts row 1 */}
      <div className="grid grid-cols-3 gap-4 mb-4">
        {/* Disease donut */}
        <div className="rounded-xl p-4" style={{ background:'var(--card)', border:'1px solid var(--border)' }}>
          <h3 className="font-mukta font-semibold text-sm mb-2" style={{ color:'var(--text)' }}>Disease Breakdown</h3>
          <p className="text-[10px] mb-2" style={{ color:'var(--text3)' }}>Based on 2016 Simhastha pattern</p>
          <div style={{ height:200 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={DISEASE_DATA} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={52} outerRadius={78} paddingAngle={3}>
                  {DISEASE_DATA.map((d,i)=><Cell key={i} fill={d.color} />)}
                </Pie>
                <Tooltip formatter={v=>[v+'%','']} contentStyle={{ background:'var(--card2)', border:'1px solid var(--border)', borderRadius:8, fontSize:11 }} />
                <Legend iconSize={8} iconType="circle" wrapperStyle={{ fontSize:'10px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* OPD trend */}
        <div className="rounded-xl p-4" style={{ background:'var(--card)', border:'1px solid var(--border)' }}>
          <h3 className="font-mukta font-semibold text-sm mb-3" style={{ color:'var(--text)' }}>OPD Cases — Hourly</h3>
          <div style={{ height:200 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={OPD_TREND}>
                <defs>
                  <linearGradient id="opdGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%"   stopColor="#22c55e" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#22c55e" stopOpacity="0"   />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="rgba(255,255,255,.05)" />
                <XAxis dataKey="h" tick={{ fontSize:9, fill:'#64748b' }} />
                <YAxis tick={{ fontSize:9, fill:'#64748b' }} />
                <Tooltip contentStyle={{ background:'var(--card2)', border:'1px solid var(--border)', borderRadius:8, fontSize:11 }} />
                <Area type="monotone" dataKey="cases" stroke="#22c55e" fill="url(#opdGrad)" strokeWidth={2} name="OPD Cases" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Age distribution */}
        <div className="rounded-xl p-4" style={{ background:'var(--card)', border:'1px solid var(--border)' }}>
          <h3 className="font-mukta font-semibold text-sm mb-3" style={{ color:'var(--text)' }}>Patient Age Distribution</h3>
          <div style={{ height:200 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={AGE_DATA} layout="vertical" margin={{ left:8 }}>
                <XAxis type="number" tick={{ fontSize:9, fill:'#64748b' }} />
                <YAxis dataKey="age" type="category" tick={{ fontSize:9, fill:'#94a3b8' }} width={35} />
                <Tooltip contentStyle={{ background:'var(--card2)', border:'1px solid var(--border)', borderRadius:8, fontSize:11 }} />
                <Bar dataKey="count" radius={[0,3,3,0]} name="Patients">
                  {AGE_DATA.map((_,i)=><Cell key={i} fill={i>=3?'#ef4444':'#f97316'} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Charts row 2 */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        {/* Zone disease stacked bar */}
        <div className="rounded-xl p-4" style={{ background:'var(--card)', border:'1px solid var(--border)' }}>
          <h3 className="font-mukta font-semibold text-sm mb-3" style={{ color:'var(--text)' }}>Zone-wise Disease Reports</h3>
          <div style={{ height:210 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ZONE_DISEASE}>
                <CartesianGrid stroke="rgba(255,255,255,.05)" />
                <XAxis dataKey="zone" tick={{ fontSize:9, fill:'#64748b' }} />
                <YAxis tick={{ fontSize:9, fill:'#64748b' }} />
                <Tooltip contentStyle={{ background:'var(--card2)', border:'1px solid var(--border)', borderRadius:8, fontSize:11 }} />
                <Bar dataKey="fever"       fill="#f97316" radius={[0,0,0,0]} stackId="a" name="Fever" />
                <Bar dataKey="diarrhea"    fill="#ef4444" radius={[0,0,0,0]} stackId="a" name="Diarrhea" />
                <Bar dataKey="respiratory" fill="#3b82f6" radius={[3,3,0,0]} stackId="a" name="Respiratory" />
                <Legend iconSize={8} wrapperStyle={{ fontSize:10 }} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Heatwave risk + outbreak panel */}
        <div className="flex flex-col gap-3">
          {/* Heatwave */}
          <div className="rounded-xl p-4 flex-1" style={{ background:'var(--card)', border:'1px solid var(--border)' }}>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-mukta font-semibold text-sm" style={{ color:'var(--text)' }}>🌡️ Heatwave Risk by Zone</h3>
              <span className="pill-critical">41°C Alert</span>
            </div>
            {HEATWAVE_ZONES.map(z=>(
              <div key={z.zone} className="flex items-center gap-2 mb-2">
                <span className="text-xs w-20 flex-shrink-0" style={{ color:'var(--text2)' }}>{z.zone}</span>
                <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background:'var(--bg3)' }}>
                  <div className="h-full rounded-full" style={{ width:`${z.risk}%`, background: z.risk>85?'#ef4444':z.risk>70?'#f59e0b':'#22c55e' }} />
                </div>
                <span className="font-grotesk text-xs w-8 text-right" style={{ color:'var(--text2)' }}>{z.risk}%</span>
                <span className="text-xs w-16 text-right" style={{ color:'#ef4444' }}>{z.cases} cases</span>
              </div>
            ))}
          </div>

          {/* Outbreak panel */}
          <div className="rounded-xl p-3" style={{ background:'rgba(239,68,68,.06)', border:'1px solid rgba(239,68,68,.25)' }}>
            <div className="flex items-center gap-2 mb-2">
              <span>🔴</span>
              <h4 className="font-mukta font-bold text-sm" style={{ color:'#ef4444' }}>Live Outbreak Alert — Dutta Akhara</h4>
            </div>
            <p className="text-xs mb-2 font-mukta" style={{ color:'var(--text2)' }}>
              3 diarrhea cases in 90 min. 2016 Simhastha mein yahan outbreak hua tha. Water source suspect.
            </p>
            {scan && (
              <div className="mt-2 text-xs" style={{ color:'var(--text3)' }}>
                <strong style={{ color:'var(--orange)' }}>AI Scan:</strong> {scan.historical_comparison}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Water quality table */}
      <div className="rounded-xl p-4" style={{ background:'var(--card)', border:'1px solid var(--border)' }}>
        <h3 className="font-mukta font-semibold text-sm mb-3" style={{ color:'var(--text)' }}>💧 Water Sample Quality — Ghat-wise</h3>
        <table className="data-table">
          <thead><tr><th>Zone/Ghat</th><th>Contamination</th><th>Last Tested</th><th>Risk</th><th>Action</th></tr></thead>
          <tbody>
            {WATER_QUALITY.map((w,i)=>(
              <tr key={i}>
                <td><strong style={{ color:'var(--text)' }}>{w.zone}</strong></td>
                <td style={{ color:'var(--text2)' }}>{w.level}</td>
                <td className="font-grotesk" style={{ color:'var(--text3)' }}>{w.tested}</td>
                <td><span className={w.risk==='critical'?'pill-critical':w.risk==='watch'?'pill-high':'pill-safe'}>{w.risk.toUpperCase()}</span></td>
                <td>
                  <button className="text-xs px-2 py-0.5 rounded" style={{ background:'rgba(249,115,22,.12)', color:'var(--orange)', border:'1px solid rgba(249,115,22,.3)' }}>
                    {w.risk==='critical' ? '🚨 Quarantine' : 'Monitor'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
