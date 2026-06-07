import { useState, useEffect, useRef } from 'react';
import {
  Doughnut, Bar, Line,
} from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement, Tooltip, Legend,
  CategoryScale, LinearScale, BarElement,
  PointElement, LineElement, Filler,
} from 'chart.js';
import { ZONES, INITIAL_INCIDENTS } from '../data/mockData.js';
import { getAISujhav } from '../services/claude.js';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, PointElement, LineElement, Filler);
ChartJS.defaults.color = '#64748b';
ChartJS.defaults.font.family = 'Space Grotesk';

const ORANGE_PALETTE = ['#f97316','#fb923c','#fdba74','#fed7aa'];
const ZONE_STATUS_COLOR = { critical:'#ef4444', watch:'#f59e0b', safe:'#22c55e' };

// ── STAT CARD ──────────────────────────────────────────────────────
function StatCard({ icon, label, value, sub, subColor, variant = 'orange' }) {
  return (
    <div className={`stat-card ${variant}`}>
      <div className="stat-icon text-xl">{icon}</div>
      <div className="flex-1 min-w-0">
        <div className="text-xs mb-1" style={{ color:'var(--text3)' }}>{label}</div>
        <div className="font-grotesk font-extrabold text-xl leading-none" style={{ color:'var(--text)' }}>
          {value}
        </div>
        {sub && (
          <div className="text-xs mt-1 flex items-center gap-1" style={{ color: subColor || 'var(--green)' }}>
            {sub}
          </div>
        )}
      </div>
    </div>
  );
}

// ── CROWD DONUT ────────────────────────────────────────────────────
function CrowdDonut({ filter }) {
  const datasets = {
    now:     [340000, 180000, 160000, 92500],
    morning: [210000, 120000, 90000,  60000],
    evening: [420000, 200000, 170000, 100000],
  };
  const vals = datasets[filter] || datasets.now;
  const total = vals.reduce((a,b) => a+b, 0);
  const labels = ['Sangam','Ram Ghat','Triveni','Others'];

  const data = {
    labels,
    datasets: [{ data: vals, backgroundColor: ORANGE_PALETTE, borderWidth: 0, hoverOffset: 5 }],
  };
  const opts = {
    cutout: '72%',
    plugins: { legend: { display: false }, tooltip: { callbacks: { label: c => ` ${c.label}: ${c.raw.toLocaleString('en-IN')}` } } },
    animation: { duration: 600 },
  };

  return (
    <div className="card-dark flex flex-col h-full">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-mukta font-semibold text-sm" style={{ color:'var(--text)' }}>Crowd Distribution</h3>
        <select value={filter} className="text-xs px-2 py-1 rounded-lg outline-none cursor-pointer"
          style={{ background:'var(--bg3)', border:'1px solid var(--border)', color:'var(--text2)' }}>
          <option value="now">Live Now</option>
          <option value="morning">Morning</option>
          <option value="evening">Evening</option>
        </select>
      </div>
      {/* Donut */}
      <div className="relative flex items-center justify-center my-2" style={{ height:180 }}>
        <Doughnut data={data} options={opts} />
        <div className="absolute text-center pointer-events-none">
          <div className="font-grotesk font-extrabold text-xl" style={{ color:'var(--text)' }}>8.4L</div>
          <div className="text-xs" style={{ color:'var(--text3)' }}>Total</div>
        </div>
      </div>
      {/* Legend */}
      <div className="flex flex-col gap-1.5 mt-2">
        {labels.map((l,i) => (
          <div key={l} className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: ORANGE_PALETTE[i] }} />
              <span style={{ color:'var(--text2)' }}>{l}</span>
            </div>
            <span className="font-grotesk font-bold" style={{ color:'var(--text)' }}>
              {Math.round(vals[i]/total*100)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── ZONE BAR CHART ────────────────────────────────────────────────
function ZoneBar() {
  const labels = ZONES.map(z => z.name.split(' ')[0]);
  const pct    = ZONES.map(z => Math.round(z.current/z.capacity*100));
  const data = {
    labels,
    datasets: [{
      label: 'Utilization %',
      data: pct,
      backgroundColor: pct.map(p => p>85?'rgba(239,68,68,.8)':p>65?'rgba(245,158,11,.8)':'rgba(249,115,22,.7)'),
      borderRadius: 5,
      borderSkipped: false,
    }],
  };
  const opts = {
    responsive: true, maintainAspectRatio: false,
    plugins: { legend: { display: false }, tooltip: { callbacks: { label: c => ' ' + c.raw + '%' } } },
    scales: {
      x: { grid: { color:'rgba(255,255,255,.04)' }, ticks: { font:{ size:10 } } },
      y: { grid: { color:'rgba(255,255,255,.04)' }, min:0, max:100, ticks: { callback: v=>v+'%', font:{ size:10 } } },
    },
  };
  return (
    <div className="card-dark flex flex-col h-full">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-mukta font-semibold text-sm" style={{ color:'var(--text)' }}>Zone Capacity Utilization</h3>
        <select className="text-xs px-2 py-1 rounded-lg outline-none cursor-pointer"
          style={{ background:'var(--bg3)', border:'1px solid var(--border)', color:'var(--text2)' }}>
          <option>Last 8 Hours</option><option>Today</option>
        </select>
      </div>
      <div className="flex-1 min-h-0" style={{ height:200 }}>
        <Bar data={data} options={opts} />
      </div>
    </div>
  );
}

// ── INCIDENT LINE ─────────────────────────────────────────────────
function IncidentLine() {
  const data = {
    labels: ['06:00','07:00','08:00','09:00','10:00','11:00','12:00'],
    datasets: [
      { label:'Incidents', data:[1,2,1,3,4,2,3], borderColor:'#f97316', backgroundColor:'rgba(249,115,22,.1)', fill:true, tension:.4, pointBackgroundColor:'#f97316', pointRadius:4 },
      { label:'Resolved',  data:[0,1,1,2,3,2,2], borderColor:'#22c55e', backgroundColor:'rgba(34,197,94,.07)', fill:true, tension:.4, pointBackgroundColor:'#22c55e', pointRadius:4 },
    ],
  };
  const opts = {
    responsive:true, maintainAspectRatio:false,
    plugins: { legend: { labels: { boxWidth:10, font:{ size:10 }, color:'#94a3b8' } } },
    scales: {
      x: { grid:{ color:'rgba(255,255,255,.04)' }, ticks:{ font:{ size:9 }, color:'#64748b' } },
      y: { grid:{ color:'rgba(255,255,255,.04)' }, min:0,  ticks:{ font:{ size:9 }, color:'#64748b' } },
    },
  };
  return (
    <div className="card-dark flex flex-col h-full">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-mukta font-semibold text-sm" style={{ color:'var(--text)' }}>Incident Timeline</h3>
        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-semibold"
             style={{ background:'rgba(34,197,94,.1)', color:'var(--green)' }}>
          <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />Live
        </div>
      </div>
      <div className="flex-1 min-h-0" style={{ height:200 }}>
        <Line data={data} options={opts} />
      </div>
    </div>
  );
}

// ── ZONE TABLE ────────────────────────────────────────────────────
function ZoneTable() {
  return (
    <div className="card-dark">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-mukta font-semibold text-sm" style={{ color:'var(--text)' }}>Zone Status Overview</h3>
        <button className="text-xs font-medium" style={{ color:'var(--orange)' }}>View All →</button>
      </div>
      <div className="overflow-x-auto">
        <table className="data-table">
          <thead>
            <tr><th>Zone</th><th>Capacity</th><th>Current</th><th>Status</th><th>Action</th></tr>
          </thead>
          <tbody>
            {ZONES.map(z => {
              const pct = Math.round(z.current/z.capacity*100);
              const pillCls = z.status==='critical'?'pill-critical':z.status==='watch'?'pill-high':'pill-safe';
              return (
                <tr key={z.id}>
                  <td><strong style={{ color:'var(--text)' }}>{z.name}</strong></td>
                  <td>{z.capacity.toLocaleString('en-IN')}</td>
                  <td>{z.current.toLocaleString('en-IN')}</td>
                  <td>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background:'var(--bg3)', minWidth:'55px' }}>
                        <div className="h-full rounded-full" style={{ width:`${pct}%`, background: ZONE_STATUS_COLOR[z.status] }} />
                      </div>
                      <span className="font-grotesk text-xs" style={{ color:'var(--text2)' }}>{pct}%</span>
                      <span className={pillCls}>{z.status.charAt(0).toUpperCase()+z.status.slice(1)}</span>
                    </div>
                  </td>
                  <td>
                    <button className="text-xs px-3 py-1 rounded-lg font-semibold"
                      style={{ background:'rgba(249,115,22,.12)', color:'var(--orange)', border:'1px solid rgba(249,115,22,.3)' }}>
                      Dispatch
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ── LIVE ALERTS ───────────────────────────────────────────────────
const ALERTS = [
  { title:'Crowd surge at Sangam Ghat',         time:'2 min ago',  type:'critical', icon:'🔴' },
  { title:'Medical emergency – Hanuman Mandir', time:'8 min ago',  type:'critical', icon:'🏥' },
  { title:'Bus BUS-0042 delayed 12 min',        time:'15 min ago', type:'warn',     icon:'🚌' },
  { title:'Volunteer shift change – Zone C1',   time:'22 min ago', type:'info',     icon:'👤' },
];

function LiveAlerts() {
  return (
    <div className="card-dark flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h3 className="font-mukta font-semibold text-sm" style={{ color:'var(--text)' }}>Live Alerts</h3>
        <span className="pill-orange">3 New</span>
      </div>
      {ALERTS.map((a,i) => (
        <div key={i} className={`alert-item ${a.type}`}>
          <span className="text-base mt-0.5 flex-shrink-0">{a.icon}</span>
          <div>
            <div className="text-sm font-medium" style={{ color:'var(--text)' }}>{a.title}</div>
            <div className="text-xs mt-0.5" style={{ color:'var(--text3)' }}>{a.time}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

// ── QUICK ACTIONS ─────────────────────────────────────────────────
function QuickActions() {
  const actions = [
    { icon:'🚨', label:'Dispatch Alert' },
    { icon:'🙌', label:'Deploy Volunteers' },
    { icon:'🗺️', label:'Reroute Traffic' },
    { icon:'🤖', label:'AI Insights' },
  ];
  return (
    <div className="card-dark">
      <h3 className="font-mukta font-semibold text-sm mb-3" style={{ color:'var(--text)' }}>Quick Actions</h3>
      <div className="grid grid-cols-2 gap-2">
        {actions.map(a => (
          <button key={a.label} className="flex items-center gap-2 text-xs font-medium p-2.5 rounded-lg transition-all duration-200"
            style={{ background:'var(--bg3)', border:'1px solid var(--border)', color:'var(--text2)' }}
            onMouseEnter={e => { e.currentTarget.style.borderColor='var(--orange)'; e.currentTarget.style.color='var(--orange)'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor='var(--border)'; e.currentTarget.style.color='var(--text2)'; }}>
            <span>{a.icon}</span>{a.label}
          </button>
        ))}
      </div>
    </div>
  );
}

// ── TRANSPORT SUMMARY ─────────────────────────────────────────────
const TRANSPORT = [
  { label:'Buses',    icon:'🚌', active:642, total:780, pct:82 },
  { label:'Trains',   icon:'🚂', active:48,  total:56,  pct:86 },
  { label:'Boats',    icon:'⛵', active:124, total:150, pct:83 },
  { label:'Helis',    icon:'🚁', active:6,   total:8,   pct:75 },
];
function TransportSummary() {
  return (
    <div className="card-dark">
      <h3 className="font-mukta font-semibold text-sm mb-3" style={{ color:'var(--text)' }}>Transport Summary</h3>
      {TRANSPORT.map(t => (
        <div key={t.label} className="flex items-center gap-3 py-2 border-b" style={{ borderColor:'var(--border)' }}>
          <span className="text-base w-6 text-center">{t.icon}</span>
          <span className="text-xs flex-1" style={{ color:'var(--text2)' }}>{t.label}</span>
          <span className="font-grotesk font-bold text-xs" style={{ color:'var(--text)' }}>{t.active}/{t.total}</span>
          <div className="w-14 h-1.5 rounded-full overflow-hidden" style={{ background:'var(--bg3)' }}>
            <div className="h-full rounded-full" style={{ width:`${t.pct}%`, background:'var(--orange)' }} />
          </div>
        </div>
      ))}
    </div>
  );
}

// ── AI SUJHAV FEED ────────────────────────────────────────────────
function AISujhav() {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(false);

  async function fetch() {
    setLoading(true);
    const zoneState = ZONES.map(z => ({ name:z.name, density:z.density, status:z.status }));
    const res = await getAISujhav(zoneState);
    setCards(prev => [{ ...res, id:Date.now(), approved:false }, ...prev.slice(0,3)]);
    setLoading(false);
  }

  useEffect(() => { fetch(); const id = setInterval(fetch, 30000); return () => clearInterval(id); }, []);

  function approve(id) { setCards(prev => prev.map(c => c.id===id ? {...c, approved:true} : c)); }

  return (
    <div className="card-dark flex flex-col h-full">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-mukta font-semibold text-sm" style={{ color:'var(--orange)' }}>🤖 NetraBot — AI Sujhav</h3>
        {loading && <span className="text-xs animate-pulse" style={{ color:'var(--orange)' }}>Analyzing…</span>}
      </div>
      <div className="flex-1 overflow-y-auto flex flex-col gap-2 pr-0.5">
        {cards.map(c => (
          <div key={c.id} className="ai-card-enter rounded-xl p-3 border-l-4 transition-all duration-500"
               style={{ borderColor: c.approved?'#22c55e':c.severity==='high'?'#ef4444':c.severity==='medium'?'#f59e0b':'#3b82f6',
                        background: c.approved?'rgba(34,197,94,.06)':c.severity==='high'?'rgba(239,68,68,.06)':'rgba(249,115,22,.05)' }}>
            <div className="flex items-center gap-2 mb-1">
              <span className={c.severity==='high'?'pill-critical':c.severity==='medium'?'pill-high':'pill-safe'}>
                {c.severity?.toUpperCase()}
              </span>
              <span className="text-xs" style={{ color:'var(--text3)' }}>{c.zone}</span>
              {c.approved && <span className="pill-safe ml-auto">✅ Dispatched</span>}
            </div>
            <p className="text-xs mb-1" style={{ color:'var(--text2)' }}>{c.detected}</p>
            <p className="text-xs italic mb-2" style={{ color:'var(--text3)' }}>{c.recommendation}</p>
            {!c.approved && (
              <div className="flex gap-2">
                <button onClick={() => approve(c.id)}
                  className="flex-1 text-xs font-semibold py-1 rounded-lg"
                  style={{ background:'var(--orange)', color:'white' }}>✅ Approve</button>
                <button className="flex-1 text-xs font-semibold py-1 rounded-lg"
                  style={{ border:'1px solid var(--border)', color:'var(--text2)' }}>✏️ Edit</button>
              </div>
            )}
          </div>
        ))}
        {cards.length===0 && !loading && (
          <div className="text-center text-xs mt-6" style={{ color:'var(--text3)' }}>Loading AI data…</div>
        )}
      </div>
    </div>
  );
}

// ── QUICK STATS ───────────────────────────────────────────────────
function QuickStats() {
  const [pilgrims, setPilgrims] = useState(7500000);
  useEffect(() => {
    const id = setInterval(() => setPilgrims(p => p + Math.floor(Math.random()*50)), 3000);
    return () => clearInterval(id);
  }, []);

  const stats = [
    { label:'Pilgrims Today',    value: pilgrims.toLocaleString('en-IN'), icon:'🙏', extra:'↑ Live', extraColor:'var(--green)' },
    { label:'Active Incidents',  value: '3',    icon:'⚠️', extra:'2 critical', extraColor:'var(--red)' },
    { label:'Volunteers',        value: '2,370',icon:'🙌', extra:'94% on duty', extraColor:'var(--green)' },
    { label:'Ambulances',        value: '24',   icon:'🚑', extra:'Available', extraColor:'var(--green)' },
  ];

  return (
    <div className="flex flex-col gap-3">
      {stats.map(s => (
        <div key={s.label} className="card-dark flex items-center gap-3">
          <span className="text-2xl">{s.icon}</span>
          <div className="flex-1 min-w-0">
            <div className="text-xs" style={{ color:'var(--text3)' }}>{s.label}</div>
            <div className="font-grotesk font-extrabold text-xl leading-tight" style={{ color:'var(--text)' }}>{s.value}</div>
            <div className="text-xs mt-0.5" style={{ color: s.extraColor }}>{s.extra}</div>
          </div>
        </div>
      ))}
      {/* Recent reports */}
      <div className="card-dark">
        <h4 className="font-mukta font-semibold text-xs mb-2" style={{ color:'var(--text)' }}>Recent Reports</h4>
        {INITIAL_INCIDENTS.slice(0,4).map(inc => (
          <div key={inc.id} className="flex items-center gap-2 py-1.5 border-b" style={{ borderColor:'var(--border)' }}>
            <span className={inc.severity==='high'?'pill-critical':inc.severity==='medium'?'pill-high':'pill-safe'}>{inc.zone}</span>
            <span className="text-xs truncate flex-1" style={{ color:'var(--text2)' }}>{inc.category}</span>
            <span className="text-xs flex-shrink-0" style={{ color:'var(--text3)' }}>{inc.time}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── OVERVIEW PAGE ─────────────────────────────────────────────────
export default function Overview() {
  const [crowdFilter, setCrowdFilter] = useState('now');

  return (
    <div className="flex flex-col h-full overflow-y-auto" style={{ background:'var(--bg)' }}>
      {/* Shahi Snan Banner */}
      <div className="flex items-center justify-center gap-3 py-2 text-sm font-mukta font-semibold"
           style={{ background:'linear-gradient(90deg, var(--orange-dark,#ea580c), var(--orange))', color:'white' }}>
        <span className="animate-pulse">🔱</span>
        शाही स्नान — 4 घंटे बाकी · Extra protocols active
        <span className="animate-pulse">🔱</span>
      </div>

      <div className="p-4 md:p-5 flex flex-col gap-4">

        {/* ── STAT CARDS ROW ── */}
        <div className="stat-grid grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          <StatCard icon="👥" label="Total Crowd Now"       value="8,42,500" sub="↑ +12% since morning" variant="orange" />
          <StatCard icon="⚠️" label="Active Incidents"      value="3"        sub="● 2 critical"         subColor="var(--red)" variant="blue" />
          <StatCard icon="🙌" label="Volunteers Deployed"   value="12,340"   sub="↑ 94% on duty"        variant="orange" />
          <StatCard icon="🚌" label="Vehicles Active"       value="1,248"    sub="↑ 87% utilised"       variant="blue" />
          <StatCard icon="📍" label="Active Zones"          value="24"       sub="● 3 high density"     subColor="var(--yellow)" variant="orange" />
        </div>

        {/* ── MID ROW: 3 charts ── */}
        <div className="grid-mid grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Col 1: Donut */}
          <div style={{ minHeight:320 }}>
            <CrowdDonut filter={crowdFilter} />
          </div>
          {/* Col 2: Bar */}
          <div style={{ minHeight:320 }}>
            <ZoneBar />
          </div>
          {/* Col 3: Line */}
          <div style={{ minHeight:320 }}>
            <IncidentLine />
          </div>
        </div>

        {/* ── BOTTOM ROW: Table + Right Panel ── */}
        <div className="bottom-grid grid grid-cols-1 lg:grid-cols-3 gap-4">

          {/* Zone table — spans 2 cols */}
          <div className="lg:col-span-2">
            <ZoneTable />
          </div>

          {/* Right panel */}
          <div className="flex flex-col gap-4">
            <LiveAlerts />
            <QuickActions />
            <TransportSummary />
          </div>
        </div>

        {/* ── AI SUJHAV full width on mobile, otherwise overlay ── */}
        <div className="lg:hidden">
          <AISujhav />
        </div>
      </div>
    </div>
  );
}
