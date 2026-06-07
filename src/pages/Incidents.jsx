import { useState } from 'react';
import { INITIAL_INCIDENTS, ZONES } from '../data/mockData.js';
import { triageIncident } from '../services/claude.js';

const SEV_PILL  = { high:'pill-critical', medium:'pill-high', low:'pill-safe' };
const STA_STYLE = {
  new:      'border-l-4 border-amber-500  bg-amber-500/5',
  active:   'border-l-4 border-red-500    bg-red-500/5',
  resolved: 'border-l-4 border-green-500  bg-green-500/5',
};

function IncidentCard({ inc, onResolve, onActivate }) {
  return (
    <div className={`rounded-xl p-3 mb-2 animate-fade-in ${STA_STYLE[inc.status]}`}
         style={{ background:'var(--card2)', border:'1px solid var(--border)' }}>
      <div className="flex justify-between mb-1">
        <span className={SEV_PILL[inc.severity] || 'pill-safe'}>{inc.severity?.toUpperCase()}</span>
        <span className="text-xs" style={{ color:'var(--text3)' }}>{inc.time}</span>
      </div>
      <p className="font-mukta font-semibold text-sm" style={{ color:'var(--text)' }}>{inc.category}</p>
      <p className="text-xs mb-1" style={{ color:'var(--text3)' }}>📍 {inc.zone} · {inc.unit}</p>
      {inc.ai_tag && (
        <div className="text-xs px-2 py-0.5 rounded mb-1" style={{ background:'rgba(249,115,22,.1)', color:'var(--orange)' }}>
          🤖 {inc.ai_tag}
        </div>
      )}
      <div className="flex gap-2 mt-1">
        {inc.status === 'new' && (
          <button onClick={() => onActivate(inc.id)}
            className="text-xs px-2 py-0.5 rounded" style={{ background:'rgba(239,68,68,.15)', color:'#ef4444' }}>
            ⚡ Activate
          </button>
        )}
        {inc.status === 'active' && (
          <button onClick={() => onResolve(inc.id)}
            className="text-xs px-2 py-0.5 rounded" style={{ background:'rgba(34,197,94,.15)', color:'#22c55e' }}>
            ✅ Resolve
          </button>
        )}
      </div>
    </div>
  );
}

export default function Incidents() {
  const [incidents, setIncidents] = useState(INITIAL_INCIDENTS);
  const [form, setForm] = useState({ text:'', zone: ZONES[0].name, severity:'medium' });
  const [triaging, setTriaging] = useState(false);
  const [triage, setTriage] = useState(null);
  const [newIncId, setNewIncId] = useState(null);
  const [filter, setFilter] = useState('all');

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.text.trim()) return;

    // 1. Add to "Naya" column immediately
    const id = Date.now();
    const newInc = {
      id,
      zone: form.zone,
      severity: form.severity,
      category: 'Pending Triage…',
      time: new Date().toLocaleTimeString('en-IN', { hour:'2-digit', minute:'2-digit' }),
      unit: 'Unassigned',
      status: 'new',
      text: form.text,
    };
    setIncidents(prev => [newInc, ...prev]);
    setNewIncId(id);
    setTriage(null);
    setTriaging(true);

    // 2. Run Claude triage
    const res = await triageIncident(form.text);
    setTriage(res);
    setTriaging(false);

    // 3. Update category + AI tag on the new incident
    setIncidents(prev => prev.map(i => i.id === id
      ? { ...i, category: res.category || i.category, severity: res.severity || i.severity, ai_tag: res.category, zone: res.zone || i.zone }
      : i
    ));
  }

  function handleSabBhejo() {
    if (!triage || !newIncId) return;
    setIncidents(prev => prev.map(i => i.id === newIncId ? { ...i, status: 'active' } : i));
    setTriage(null);
    setNewIncId(null);
    setForm({ text:'', zone: ZONES[0].name, severity:'medium' });
  }

  function resolve(id)   { setIncidents(prev => prev.map(i => i.id === id ? { ...i, status:'resolved' } : i)); }
  function activate(id)  { setIncidents(prev => prev.map(i => i.id === id ? { ...i, status:'active'   } : i)); }

  const filtered = filter === 'all' ? incidents : incidents.filter(i => i.status === filter);
  const byStatus = s => filtered.filter(i => i.status === s);

  const COL = [
    { key:'new',      label:'🆕 Naya',    style:'bg-amber-500/10 text-amber-400' },
    { key:'active',   label:'⚡ Active',  style:'bg-red-500/10 text-red-400'     },
    { key:'resolved', label:'✅ Resolved', style:'bg-green-500/10 text-green-400' },
  ];

  return (
    <div className="flex h-full overflow-hidden gap-0">

      {/* ── LEFT FORM ── */}
      <div className="w-80 border-r flex-shrink-0 overflow-y-auto p-4"
           style={{ borderColor:'var(--border)', background:'var(--bg2)' }}>
        <h2 className="font-mukta font-bold text-xl mb-0.5" style={{ color:'var(--text)' }}>Incident Report</h2>
        <p className="text-xs mb-4" style={{ color:'var(--text3)' }}>Hindi/English/Hinglish — सब चलेगा</p>

        <form onSubmit={handleSubmit} className="space-y-3">
          <textarea value={form.text} onChange={e => setForm(f=>({...f,text:e.target.value}))}
            placeholder={"क्या हो रहा है? Kya ho raha hai?\n\nE.g. Ramghat par bheed bahut zyada hai, log push kar rahe hain..."}
            className="w-full h-36 rounded-xl p-3 text-sm font-mukta resize-none outline-none"
            style={{ background:'var(--bg3)', border:'1px solid var(--border)', color:'var(--text)' }}
            required />

          <div>
            <label className="text-xs font-medium mb-1 block" style={{ color:'var(--text3)' }}>Zone</label>
            <select value={form.zone} onChange={e=>setForm(f=>({...f,zone:e.target.value}))}
              className="w-full rounded-lg px-3 py-2 text-sm outline-none"
              style={{ background:'var(--bg3)', border:'1px solid var(--border)', color:'var(--text)' }}>
              {ZONES.map(z=><option key={z.id}>{z.name}</option>)}
            </select>
          </div>

          <div>
            <label className="text-xs font-medium mb-1 block" style={{ color:'var(--text3)' }}>Severity</label>
            <div className="flex gap-2">
              {['low','medium','high'].map(s=>(
                <button type="button" key={s} onClick={()=>setForm(f=>({...f,severity:s}))}
                  className="flex-1 py-1.5 rounded-lg text-xs font-semibold border transition-all"
                  style={{ background: form.severity===s ? (s==='high'?'#ef4444':s==='medium'?'#f59e0b':'#22c55e') : 'var(--bg3)',
                    borderColor: form.severity===s ? 'transparent':'var(--border)',
                    color: form.severity===s ? 'white':'var(--text2)' }}>
                  {s.charAt(0).toUpperCase()+s.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <button type="submit" disabled={triaging}
            className="w-full py-2.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2"
            style={{ background:'var(--orange)', color:'white' }}>
            {triaging ? <><span className="animate-spin">⚙️</span> NetraBot padh raha hai…</> : '🚨 Submit & Triage'}
          </button>
        </form>

        {/* TRIAGE RESULT */}
        {triage && (
          <div className="mt-4 rounded-xl p-4 animate-fade-in"
               style={{ background:'rgba(249,115,22,.08)', border:'2px solid rgba(249,115,22,.3)' }}>
            <div className="flex items-center gap-2 mb-2">
              <span>🤖</span>
              <h4 className="font-mukta font-bold text-sm" style={{ color:'var(--orange)' }}>NetraBot Triage</h4>
              <span className={SEV_PILL[triage.severity]}>{triage.severity?.toUpperCase()}</span>
            </div>
            <p className="text-sm mb-3 font-mukta" style={{ color:'var(--text2)' }}>{triage.hindi_summary}</p>

            {[['🚓 Police', triage.draft_police_alert], ['🏥 Health', triage.draft_health_alert], ['🔵 NDRF', triage.draft_ndrf_alert]].map(([org,msg])=>(
              <div key={org} className="rounded-lg p-2 mb-2" style={{ background:'var(--bg3)', border:'1px solid var(--border)' }}>
                <div className="text-xs font-bold mb-1" style={{ color:'var(--orange)' }}>{org}</div>
                <p className="text-xs" style={{ color:'var(--text2)' }}>{msg}</p>
              </div>
            ))}

            <button onClick={handleSabBhejo}
              className="w-full py-2.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 mt-2"
              style={{ background:'var(--orange)', color:'white' }}>
              📡 सब भेजो — Send All Alerts
            </button>
          </div>
        )}
      </div>

      {/* ── KANBAN BOARD ── */}
      <div className="flex-1 p-4 overflow-hidden flex flex-col" style={{ background:'var(--bg)' }}>
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-mukta font-bold text-xl" style={{ color:'var(--text)' }}>Incident Board</h2>
          <div className="flex gap-2">
            {['all','new','active','resolved'].map(f=>(
              <button key={f} onClick={()=>setFilter(f)}
                className="text-xs px-3 py-1 rounded-full transition-all"
                style={{ background: filter===f?'var(--orange)':'var(--card)', color: filter===f?'white':'var(--text2)',
                  border: '1px solid '+(filter===f?'var(--orange)':'var(--border)') }}>
                {f.charAt(0).toUpperCase()+f.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 grid grid-cols-3 gap-3 overflow-hidden">
          {COL.map(col=>(
            <div key={col.key} className="flex flex-col overflow-hidden">
              <div className={`text-xs font-bold mb-2 px-3 py-1.5 rounded-lg text-center ${col.style}`}>
                {col.label} ({byStatus(col.key).length})
              </div>
              <div className="flex-1 overflow-y-auto pr-0.5">
                {byStatus(col.key).map(inc=>(
                  <IncidentCard key={inc.id} inc={inc} onResolve={resolve} onActivate={activate} />
                ))}
                {byStatus(col.key).length===0 && (
                  <div className="text-center text-xs mt-8" style={{ color:'var(--text3)' }}>
                    {col.key==='new' ? 'Submit a report to add incidents' : 'कोई incident नहीं'}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
