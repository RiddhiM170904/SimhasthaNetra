import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
         LineChart, Line, CartesianGrid, PieChart, Pie, Cell, Legend } from 'recharts';

const RESOURCES = [
  { category:'Medical Kits',    total:5000, used:3200, unit:'kits',    icon:'🧰', alert:false },
  { category:'Water Tankers',   total:120,  used:98,   unit:'units',   icon:'💧', alert:true  },
  { category:'Tents/Shelters',  total:2400, used:1980, unit:'tents',   icon:'⛺', alert:false },
  { category:'Food Packets',    total:50000,used:38000,unit:'packets', icon:'🍱', alert:false },
  { category:'Generators',      total:85,   used:72,   unit:'units',   icon:'⚡', alert:true  },
  { category:'Ambulances',      total:32,   used:24,   unit:'vehicles',icon:'🚑', alert:false },
  { category:'Fire Engines',    total:18,   used:14,   unit:'vehicles',icon:'🚒', alert:false },
  { category:'Sanitation Units',total:600,  used:520,  unit:'units',   icon:'🚽', alert:true  },
];

const USAGE_TREND = [
  { h:'06:00', medical:45,  water:62, food:30 },
  { h:'08:00', medical:72,  water:80, food:55 },
  { h:'10:00', medical:88,  water:91, food:72 },
  { h:'12:00', medical:82,  water:87, food:89 },
  { h:'14:00', medical:91,  water:95, food:82 },
  { h:'16:00', medical:78,  water:88, food:70 },
  { h:'18:00', medical:60,  water:72, food:55 },
];

const CATEGORY_DIST = [
  { name:'Medical',    value:28, color:'#22c55e' },
  { name:'Food',       value:24, color:'#f97316' },
  { name:'Shelter',    value:18, color:'#3b82f6' },
  { name:'Water',      value:16, color:'#60a5fa' },
  { name:'Transport',  value:14, color:'#a855f7' },
];

const ZONE_ALLOC = [
  { zone:'Ramghat',      medical:580, water:18, food:8200  },
  { zone:'Mahakal',      medical:720, water:22, food:10500 },
  { zone:'Dutta Akhara', medical:310, water:12, food:5400  },
  { zone:'Mangalnath',   medical:245, water:9,  food:4200  },
  { zone:'Nanakheda',    medical:190, water:7,  food:3100  },
];

export default function Resources() {
  const alerts = RESOURCES.filter(r => r.used/r.total > 0.85);

  return (
    <div className="p-4 overflow-y-auto h-full" style={{ background:'var(--bg)' }}>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="font-mukta font-bold text-xl" style={{ color:'var(--text)' }}>📦 Resource Management</h2>
          <p className="text-xs mt-0.5" style={{ color:'var(--text3)' }}>Real-time inventory · Simhastha 2028 operations</p>
        </div>
        {alerts.length > 0 && (
          <div className="px-3 py-2 rounded-xl flex items-center gap-2"
               style={{ background:'rgba(239,68,68,.1)', border:'1px solid rgba(239,68,68,.3)' }}>
            <span>⚠️</span>
            <span className="text-xs font-semibold" style={{ color:'#ef4444' }}>{alerts.length} resources below 15% reserve</span>
          </div>
        )}
      </div>

      {/* Resource inventory cards */}
      <div className="grid grid-cols-4 gap-3 mb-4">
        {RESOURCES.map(r => {
          const pct = Math.round(r.used/r.total*100);
          const isLow = pct > 85;
          return (
            <div key={r.category} className="rounded-xl p-3"
                 style={{ background:'var(--card)', border:`1px solid ${isLow ? 'rgba(239,68,68,.4)' : 'var(--border)'}` }}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xl">{r.icon}</span>
                {isLow && <span className="pill-critical">LOW</span>}
              </div>
              <div className="font-mukta font-semibold text-xs mb-1" style={{ color:'var(--text2)' }}>{r.category}</div>
              <div className="font-grotesk font-extrabold text-lg" style={{ color:'var(--text)' }}>{r.used.toLocaleString()}</div>
              <div className="text-xs mb-2" style={{ color:'var(--text3)' }}>of {r.total.toLocaleString()} {r.unit}</div>
              <div className="h-1.5 rounded-full overflow-hidden" style={{ background:'var(--bg3)' }}>
                <div className="h-full rounded-full transition-all"
                     style={{ width:`${pct}%`, background: isLow ? '#ef4444' : pct>70 ? '#f59e0b' : '#22c55e' }} />
              </div>
              <div className="text-xs mt-1 font-grotesk" style={{ color: isLow?'#ef4444':'var(--text3)' }}>{pct}% used</div>
            </div>
          );
        })}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-3 gap-4 mb-4">
        {/* Usage trend line */}
        <div className="col-span-2 rounded-xl p-4" style={{ background:'var(--card)', border:'1px solid var(--border)' }}>
          <h3 className="font-mukta font-semibold text-sm mb-3" style={{ color:'var(--text)' }}>Resource Usage Trend (% of stock used)</h3>
          <div style={{ height:200 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={USAGE_TREND}>
                <CartesianGrid stroke="rgba(255,255,255,.05)" />
                <XAxis dataKey="h" tick={{ fontSize:10, fill:'#64748b' }} />
                <YAxis tick={{ fontSize:10, fill:'#64748b' }} domain={[0,100]} tickFormatter={v=>v+'%'} />
                <Tooltip contentStyle={{ background:'var(--card2)', border:'1px solid var(--border)', borderRadius:8, fontSize:11 }} />
                <Line type="monotone" dataKey="medical" stroke="#22c55e" strokeWidth={2} dot={false} name="Medical" />
                <Line type="monotone" dataKey="water"   stroke="#60a5fa" strokeWidth={2} dot={false} name="Water"   />
                <Line type="monotone" dataKey="food"    stroke="#f97316" strokeWidth={2} dot={false} name="Food"    />
                <Legend iconSize={8} wrapperStyle={{ fontSize:11 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category donut */}
        <div className="rounded-xl p-4" style={{ background:'var(--card)', border:'1px solid var(--border)' }}>
          <h3 className="font-mukta font-semibold text-sm mb-3" style={{ color:'var(--text)' }}>Budget Allocation</h3>
          <div style={{ height:200 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={CATEGORY_DIST} dataKey="value" cx="50%" cy="50%" innerRadius={52} outerRadius={80} paddingAngle={3}>
                  {CATEGORY_DIST.map((d,i)=><Cell key={i} fill={d.color} />)}
                </Pie>
                <Tooltip formatter={v=>[v+'%','']} contentStyle={{ background:'var(--card2)', border:'1px solid var(--border)', borderRadius:8, fontSize:11 }} />
                <Legend iconSize={8} iconType="circle" wrapperStyle={{ fontSize:'10px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Zone-wise allocation bar */}
      <div className="rounded-xl p-4" style={{ background:'var(--card)', border:'1px solid var(--border)' }}>
        <h3 className="font-mukta font-semibold text-sm mb-3" style={{ color:'var(--text)' }}>Zone-wise Resource Allocation</h3>
        <div style={{ height:200 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={ZONE_ALLOC} margin={{ top:4, right:8, left:0, bottom:0 }}>
              <XAxis dataKey="zone" tick={{ fontSize:10, fill:'#64748b' }} />
              <YAxis tick={{ fontSize:10, fill:'#64748b' }} />
              <Tooltip contentStyle={{ background:'var(--card2)', border:'1px solid var(--border)', borderRadius:8, fontSize:11 }} />
              <Bar dataKey="medical" fill="#22c55e" radius={[3,3,0,0]} name="Medical Kits" />
              <Bar dataKey="water"   fill="#60a5fa" radius={[3,3,0,0]} name="Water Units"  />
              <Legend iconSize={8} wrapperStyle={{ fontSize:11 }} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
