import { useState } from 'react';
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer,
         BarChart, Bar, XAxis, YAxis, Tooltip, Cell, PieChart, Pie, Legend } from 'recharts';

const VOLUNTEER_ZONES = [
  { zone:'Ramghat',        total:420, active:398, skills:'Crowd Mgmt', org:'MP Police', shift:'Morning' },
  { zone:'Mahakal Mandir', total:580, active:541, skills:'Medical Aid', org:'Red Cross',  shift:'Morning' },
  { zone:'Mangalnath',     total:280, active:260, skills:'First Aid',   org:'NCC',        shift:'Evening' },
  { zone:'Freeganj',       total:150, active:134, skills:'Transport',   org:'NSS',        shift:'Night'   },
  { zone:'Dutta Akhara',   total:310, active:295, skills:'Search & Rescue',org:'NDRF',   shift:'All Day' },
  { zone:'Bhukhi Mata',    total:120, active:108, skills:'Crowd Mgmt', org:'Volunteers', shift:'Morning' },
  { zone:'Nanakheda',      total:200, active:188, skills:'Transport',   org:'MSRTC',      shift:'Evening' },
  { zone:'Tower Chowk',    total:180, active:170, skills:'Traffic',     org:'Traffic Police',shift:'All Day'},
  { zone:'Dewas Naka',     total:130, active:121, skills:'Logistics',   org:'Army',       shift:'Morning' },
];

const SKILLS_DATA = [
  { name:'Crowd Mgmt',      value:32, color:'#f97316' },
  { name:'First Aid',       value:24, color:'#22c55e' },
  { name:'Search & Rescue', value:18, color:'#3b82f6' },
  { name:'Transport',       value:14, color:'#f59e0b' },
  { name:'Logistics',       value:12, color:'#a855f7' },
];

const RADAR_DATA = [
  { subject:'Crowd Mgmt',    score:90 },
  { subject:'Medical',       score:75 },
  { subject:'Rescue',        score:82 },
  { subject:'Transport',     score:68 },
  { subject:'Communication', score:88 },
  { subject:'Logistics',     score:71 },
];

const SHIFT_BAR = [
  { shift:'06–12 Morning', deployed:1200, available:280 },
  { shift:'12–18 Evening', deployed:980,  available:240 },
  { shift:'18–00 Night',   deployed:640,  available:180 },
  { shift:'00–06 Night2',  deployed:320,  available:120 },
];

export default function Volunteers() {
  const [search, setSearch] = useState('');
  const total   = VOLUNTEER_ZONES.reduce((a,z) => a+z.total, 0);
  const active  = VOLUNTEER_ZONES.reduce((a,z) => a+z.active, 0);

  const filtered = VOLUNTEER_ZONES.filter(z =>
    z.zone.toLowerCase().includes(search.toLowerCase()) ||
    z.skills.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-4 overflow-y-auto h-full" style={{ background:'var(--bg)' }}>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="font-mukta font-bold text-xl" style={{ color:'var(--text)' }}>🙌 Volunteer Management</h2>
          <p className="text-xs mt-0.5" style={{ color:'var(--text3)' }}>Simhastha 2028 · Real-time deployment tracking</p>
        </div>
        <div className="flex gap-3">
          {[['Total', total, 'var(--orange)'],['Active', active, '#22c55e'],['Standby', total-active, '#f59e0b']].map(([l,v,c])=>(
            <div key={l} className="text-center px-4 py-2 rounded-xl" style={{ background:'var(--card)', border:'1px solid var(--border)' }}>
              <div className="font-grotesk font-extrabold text-xl" style={{ color:c }}>{v.toLocaleString('en-IN')}</div>
              <div className="text-xs" style={{ color:'var(--text3)' }}>{l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-3 gap-4 mb-4">
        {/* Skills Donut */}
        <div className="rounded-xl p-4" style={{ background:'var(--card)', border:'1px solid var(--border)' }}>
          <h3 className="font-mukta font-semibold text-sm mb-3" style={{ color:'var(--text)' }}>Skills Breakdown</h3>
          <div style={{ height:180 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={SKILLS_DATA} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={45} outerRadius={72} paddingAngle={3}>
                  {SKILLS_DATA.map((d,i)=><Cell key={i} fill={d.color} />)}
                </Pie>
                <Tooltip formatter={v=>[v+'%','']} contentStyle={{ background:'var(--card2)', border:'1px solid var(--border)', borderRadius:8, fontSize:11 }} />
                <Legend iconSize={8} iconType="circle" wrapperStyle={{ fontSize:'10px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Radar */}
        <div className="rounded-xl p-4" style={{ background:'var(--card)', border:'1px solid var(--border)' }}>
          <h3 className="font-mukta font-semibold text-sm mb-3" style={{ color:'var(--text)' }}>Team Capability Radar</h3>
          <div style={{ height:180 }}>
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={RADAR_DATA}>
                <PolarGrid stroke="rgba(255,255,255,.1)" />
                <PolarAngleAxis dataKey="subject" tick={{ fill:'#64748b', fontSize:9 }} />
                <Radar dataKey="score" stroke="#f97316" fill="#f97316" fillOpacity={0.25} strokeWidth={2} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Shift Bar */}
        <div className="rounded-xl p-4" style={{ background:'var(--card)', border:'1px solid var(--border)' }}>
          <h3 className="font-mukta font-semibold text-sm mb-3" style={{ color:'var(--text)' }}>Shift-wise Deployment</h3>
          <div style={{ height:180 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={SHIFT_BAR} margin={{ top:4, right:0, left:-20, bottom:20 }}>
                <XAxis dataKey="shift" tick={{ fontSize:7, fill:'#64748b' }} angle={-30} textAnchor="end" />
                <YAxis tick={{ fontSize:9, fill:'#64748b' }} />
                <Tooltip contentStyle={{ background:'var(--card2)', border:'1px solid var(--border)', borderRadius:8, fontSize:11 }} />
                <Bar dataKey="deployed"  fill="#f97316" radius={[3,3,0,0]} name="Deployed" />
                <Bar dataKey="available" fill="#3b82f6" radius={[3,3,0,0]} name="Standby"  />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-xl p-4" style={{ background:'var(--card)', border:'1px solid var(--border)' }}>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-mukta font-semibold text-sm" style={{ color:'var(--text)' }}>Zone Deployment Details</h3>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search zone / skill…"
            className="text-xs px-3 py-1.5 rounded-lg outline-none"
            style={{ background:'var(--bg3)', border:'1px solid var(--border)', color:'var(--text)', width:180 }} />
        </div>
        <table className="data-table">
          <thead><tr><th>Zone</th><th>Total</th><th>Active</th><th>Utilisation</th><th>Skills</th><th>Org</th><th>Shift</th></tr></thead>
          <tbody>
            {filtered.map((z,i) => {
              const pct = Math.round(z.active/z.total*100);
              return (
                <tr key={i}>
                  <td><strong style={{ color:'var(--text)' }}>{z.zone}</strong></td>
                  <td className="font-grotesk">{z.total}</td>
                  <td className="font-grotesk text-green-400">{z.active}</td>
                  <td>
                    <div className="flex items-center gap-2">
                      <div className="w-20 h-1.5 rounded-full overflow-hidden" style={{ background:'var(--bg3)' }}>
                        <div className="h-full rounded-full" style={{ width:`${pct}%`, background: pct>90?'#22c55e':pct>75?'#f97316':'#f59e0b' }} />
                      </div>
                      <span className="font-grotesk text-xs" style={{ color:'var(--text2)' }}>{pct}%</span>
                    </div>
                  </td>
                  <td><span className="pill-orange">{z.skills}</span></td>
                  <td style={{ color:'var(--text2)' }}>{z.org}</td>
                  <td><span className="pill-blue text-[10px]">{z.shift}</span></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
