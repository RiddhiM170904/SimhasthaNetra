import { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
         LineChart, Line, AreaChart, Area, Cell, Legend } from 'recharts';
import { TRAINS, BUS_ROUTES, CROWD_FLOW } from '../data/mockData.js';
import { getSurgePrediction } from '../services/claude.js';

const PARKING_DATA = [
  { area:'Dewas Naka P1',   capacity:5000, occupied:4200 },
  { area:'Nanakheda P2',    capacity:3500, occupied:3100 },
  { area:'Freeganj P3',     capacity:2000, occupied:1560 },
  { area:'Mangalnath P4',   capacity:1500, occupied:980  },
  { area:'Tower Chowk P5',  capacity:1200, occupied:1050 },
];

const FERRY_DATA = [
  { route:'Ramghat ↔ East Bank', trips:142, passengers:8500, status:'active' },
  { route:'Triveni ↔ Mangalnath',trips:98,  passengers:5800, status:'active' },
  { route:'Gau Ghat ↔ Bhukhi',   trips:65,  passengers:3900, status:'active' },
  { route:'Special Shahi Snan',  trips:34,  passengers:2100, status:'reserved' },
];

const TRANSPORT_METRICS = [
  { label:'Buses Running',  value:'642/780',   icon:'🚌', pct:82, color:'#f97316' },
  { label:'Trains Today',   value:'48 Arrivals',icon:'🚂', pct:86, color:'#3b82f6' },
  { label:'Ferry Trips',    value:'339 Done',  icon:'⛵', pct:73, color:'#22c55e' },
  { label:'Parking Used',   value:'68%',        icon:'🅿️', pct:68, color:'#a855f7' },
];

export default function Transport() {
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);

  async function runPrediction() {
    setLoading(true);
    const res = await getSurgePrediction({ trains: TRAINS, buses: BUS_ROUTES, hour: 14 });
    setPrediction(res);
    setLoading(false);
  }

  return (
    <div className="p-4 h-full overflow-y-auto" style={{ background:'var(--bg)' }}>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="font-mukta font-bold text-xl" style={{ color:'var(--text)' }}>🚌 Transport & Crowd Flow</h2>
          <p className="text-xs mt-0.5" style={{ color:'var(--text3)' }}>Real-time transport coordination · Simhastha 2028</p>
        </div>
        <button onClick={runPrediction} disabled={loading}
          className="px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2"
          style={{ background:'var(--orange)', color:'white' }}>
          {loading ? <><span className="animate-spin">⚙️</span> Predicting…</> : '🤖 Surge Prediction'}
        </button>
      </div>

      {/* Metric cards */}
      <div className="grid grid-cols-4 gap-3 mb-4">
        {TRANSPORT_METRICS.map(m=>(
          <div key={m.label} className="rounded-xl p-3" style={{ background:'var(--card)', border:'1px solid var(--border)' }}>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xl">{m.icon}</span>
              <div>
                <div className="font-grotesk font-extrabold text-lg" style={{ color:m.color }}>{m.value}</div>
                <div className="text-xs" style={{ color:'var(--text3)' }}>{m.label}</div>
              </div>
            </div>
            <div className="h-1.5 rounded-full overflow-hidden" style={{ background:'var(--bg3)' }}>
              <div className="h-full rounded-full" style={{ width:`${m.pct}%`, background:m.color }} />
            </div>
          </div>
        ))}
      </div>

      {/* Surge warning */}
      <div className="rounded-xl p-3 mb-4 flex items-start gap-3"
           style={{ background:'rgba(245,158,11,.08)', border:'1px solid rgba(245,158,11,.3)' }}>
        <span className="text-lg flex-shrink-0 mt-0.5">🤖</span>
        <div>
          <p className="text-sm font-bold mb-0.5" style={{ color:'#f59e0b' }}>
            Predicted crowd surge from Nanakheda Station in 22 min
          </p>
          <p className="text-xs" style={{ color:'var(--text3)' }}>
            Malwa Express ({TRAINS[0].passengers.toLocaleString('en-IN')} pilgrims) + Avantika Express incoming → Ramghat route 87% full. Recommend activating bypass R-12.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        {/* Train table */}
        <div className="rounded-xl p-4" style={{ background:'var(--card)', border:'1px solid var(--border)' }}>
          <h3 className="font-mukta font-semibold text-sm mb-3" style={{ color:'var(--text)' }}>🚂 Train Arrivals — Indian Railways</h3>
          <table className="data-table">
            <thead><tr><th>Train</th><th>From</th><th>ETA</th><th>Pilgrims</th><th>Status</th></tr></thead>
            <tbody>
              {TRAINS.map((t,i)=>(
                <tr key={i}>
                  <td><strong style={{ color:'var(--text)' }}>{t.name}</strong></td>
                  <td style={{ color:'var(--text2)' }}>{t.from}</td>
                  <td className="font-grotesk">{t.eta}</td>
                  <td className="font-grotesk font-semibold">{t.passengers.toLocaleString('en-IN')}</td>
                  <td><span className={t.status==='on-time'?'pill-safe':'pill-high'}>{t.status==='on-time'?'✅ ON TIME':'⚠️ DELAYED'}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Bus routes */}
        <div className="rounded-xl p-4" style={{ background:'var(--card)', border:'1px solid var(--border)' }}>
          <h3 className="font-mukta font-semibold text-sm mb-3" style={{ color:'var(--text)' }}>🚌 Bus & Route Status</h3>
          <div className="space-y-1.5">
            {BUS_ROUTES.map(r=>(
              <div key={r.id} className="flex items-center gap-2 p-2 rounded-lg"
                   style={{ background: r.status==='blocked'?'rgba(239,68,68,.07)':'var(--bg3)', border:'1px solid var(--border)' }}>
                <div className={`w-2 h-2 rounded-full flex-shrink-0 ${r.status==='moving'?'bg-green-500 animate-pulse':'bg-red-500'}`} />
                <span className="text-xs flex-1 truncate" style={{ color:'var(--text2)' }}>{r.id} · {r.name}</span>
                <span className="font-grotesk text-xs font-bold" style={{ color: r.status==='blocked'?'#ef4444':'var(--text3)' }}>{r.load}</span>
                {r.status==='blocked' && <span className="pill-critical text-[9px]">BLOCKED</span>}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Crowd flow chart */}
      <div className="rounded-xl p-4 mb-4" style={{ background:'var(--card)', border:'1px solid var(--border)' }}>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-mukta font-semibold text-sm" style={{ color:'var(--text)' }}>📊 Pilgrim Ingress — Hourly (Today)</h3>
          <span className="text-xs px-2 py-0.5 rounded-full" style={{ background:'rgba(249,115,22,.12)', color:'var(--orange)' }}>🔱 Shahi Snan Peak Zone: 14:00–16:00</span>
        </div>
        <div style={{ height:200 }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={CROWD_FLOW}>
              <defs>
                <linearGradient id="crowdGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%"   stopColor="#f97316" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#f97316" stopOpacity="0.02" />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="rgba(255,255,255,.05)" />
              <XAxis dataKey="hour" tick={{ fontSize:10, fill:'#64748b' }} />
              <YAxis tickFormatter={v=>(v/100000).toFixed(0)+'L'} tick={{ fontSize:10, fill:'#64748b' }} />
              <Tooltip formatter={v=>[v.toLocaleString('en-IN'),'Pilgrims']}
                contentStyle={{ background:'var(--card2)', border:'1px solid var(--border)', borderRadius:8, fontSize:11 }} />
              <Area type="monotone" dataKey="count" stroke="#f97316" fill="url(#crowdGrad)" strokeWidth={2.5} name="Pilgrims" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        {/* Parking bar */}
        <div className="rounded-xl p-4" style={{ background:'var(--card)', border:'1px solid var(--border)' }}>
          <h3 className="font-mukta font-semibold text-sm mb-3" style={{ color:'var(--text)' }}>🅿️ Parking Zone Occupancy</h3>
          {PARKING_DATA.map(p=>{
            const pct=Math.round(p.occupied/p.capacity*100);
            return (
              <div key={p.area} className="mb-2">
                <div className="flex justify-between text-xs mb-0.5" style={{ color:'var(--text2)' }}>
                  <span>{p.area}</span>
                  <span className="font-grotesk font-bold">{pct}%</span>
                </div>
                <div className="h-2 rounded-full overflow-hidden" style={{ background:'var(--bg3)' }}>
                  <div className="h-full rounded-full transition-all" style={{ width:`${pct}%`, background: pct>85?'#ef4444':pct>70?'#f59e0b':'#22c55e' }} />
                </div>
              </div>
            );
          })}
        </div>

        {/* Ferry table */}
        <div className="rounded-xl p-4" style={{ background:'var(--card)', border:'1px solid var(--border)' }}>
          <h3 className="font-mukta font-semibold text-sm mb-3" style={{ color:'var(--text)' }}>⛵ Boat & Ferry Routes (Shipra)</h3>
          <table className="data-table">
            <thead><tr><th>Route</th><th>Trips</th><th>Pilgrims</th><th>Status</th></tr></thead>
            <tbody>
              {FERRY_DATA.map((f,i)=>(
                <tr key={i}>
                  <td style={{ color:'var(--text)' }}>{f.route}</td>
                  <td className="font-grotesk">{f.trips}</td>
                  <td className="font-grotesk">{f.passengers.toLocaleString()}</td>
                  <td><span className={f.status==='active'?'pill-safe':'pill-orange'}>{f.status.toUpperCase()}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Surge prediction result */}
      {prediction && (
        <div className="rounded-xl p-4 animate-fade-in" style={{ background:'rgba(249,115,22,.08)', border:'2px solid rgba(249,115,22,.3)' }}>
          <h3 className="font-mukta font-bold mb-3" style={{ color:'var(--orange)' }}>🤖 Surge Prediction — Next 2 Hours</h3>
          <div className="grid grid-cols-4 gap-3 mb-3">
            {[['Surge Prob.',prediction.surge_probability+'%'],['Peak Zone',prediction.peak_zone],
              ['Peak Time',prediction.peak_time],['Expected',prediction.expected_crowd]].map(([l,v])=>(
              <div key={l} className="rounded-xl p-3 text-center" style={{ background:'var(--card)' }}>
                <div className="text-xs mb-1" style={{ color:'var(--text3)' }}>{l}</div>
                <div className="font-grotesk font-bold" style={{ color:'var(--orange)' }}>{v}</div>
              </div>
            ))}
          </div>
          {prediction.timeline && (
            <div className="flex gap-3 mb-3">
              {prediction.timeline.map((t,i)=>(
                <div key={i} className={`flex-1 rounded-lg p-2 text-center text-xs border ${t.risk==='critical'?'border-red-500/40 bg-red-500/10':t.risk==='high'?'border-amber-500/40 bg-amber-500/10':'border-green-500/40 bg-green-500/10'}`}>
                  <div className="font-grotesk font-bold" style={{ color:'var(--text)' }}>{t.time}</div>
                  <div style={{ color:'var(--text3)' }}>{t.crowd}</div>
                  <span className={t.risk==='critical'?'pill-critical':t.risk==='high'?'pill-high':'pill-safe'}>{t.risk}</span>
                </div>
              ))}
            </div>
          )}
          {prediction.recommended_routes?.map((r,i)=>(
            <div key={i} className="flex gap-2 text-sm text-green-400"><span>→</span>{r}</div>
          ))}
        </div>
      )}
    </div>
  );
}
