import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useRole } from '../context/RoleContext.jsx';
import { useState, useEffect } from 'react';
import ChatBot from '../components/ChatBot.jsx';

const NAV = [
  { path:'/dashboard',            icon:'⊞',  label:'Dashboard'     },
  { path:'/dashboard/crowd',      icon:'🗺️', label:'Crowd Monitor' },
  { path:'/dashboard/health',     icon:'🏥', label:'Medical Assistance' },
  { path:'/dashboard/transport',  icon:'🚌', label:'Transportation' },
  { path:'/dashboard/incidents',  icon:'⚠️', label:'Incidents',  badge:3 },
  { path:'/dashboard/volunteers', icon:'🙌', label:'Volunteers'    },
  { path:'/dashboard/resources',  icon:'📦', label:'Resources'     },
];
const NAV2 = [
  { path:'/dashboard/reports',  icon:'📊', label:'Reports'  },
  { path:'/dashboard/settings', icon:'⚙️', label:'Settings' },
];

function LiveClock() {
  const [t, setT] = useState(new Date());
  useEffect(() => { const id = setInterval(() => setT(new Date()), 1000); return () => clearInterval(id); }, []);
  const hindiFmt = 'वैशाख पूर्णिमा';
  return (
    <div className="hidden md:block text-center">
      <div className="font-grotesk font-bold text-sm leading-none" style={{ color:'var(--text)' }}>
        {t.toLocaleTimeString('en-IN', { hour:'2-digit', minute:'2-digit', second:'2-digit' })}
      </div>
      <div className="text-xs mt-0.5" style={{ color:'var(--text3)' }}>
        {hindiFmt} · {t.toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric' })}
      </div>
    </div>
  );
}

export default function DashboardLayout() {
  const { role, setRole } = useRole();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Close sidebar overlay on route change (mobile)
  useEffect(() => { setSidebarOpen(false); }, [location.pathname]);

  function NavLink({ item }) {
    const active = location.pathname === item.path;
    return (
      <a onClick={() => navigate(item.path)}
         className={`nav-item ${active ? 'active' : ''}`}>
        <span className="nav-icon text-base">{item.icon}</span>
        <span className="flex-1">{item.label}</span>
        {item.badge && (
          <span className="ml-auto bg-red-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
            {item.badge}
          </span>
        )}
      </a>
    );
  }

  return (
    <div className="flex min-h-screen" style={{ background:'var(--bg)' }}>

      {/* ── MOBILE OVERLAY ── */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/60 z-90 lg:hidden"
             onClick={() => setSidebarOpen(false)} />
      )}

      {/* ── SIDEBAR ── */}
      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        {/* Logo */}
        <div className="flex items-center gap-3 px-5 py-5 border-b" style={{ borderColor:'var(--border)' }}>
          <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white text-lg flex-shrink-0"
               style={{ background:'linear-gradient(135deg, var(--orange), var(--orange-dark, #ea580c))' }}>
            👁
          </div>
          <div>
            <div className="font-mukta font-extrabold text-sm leading-tight" style={{ color:'var(--text)' }}>SimhasthaNetra</div>
            <div className="text-[10px]" style={{ color:'var(--text3)' }}>Command Center</div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 flex flex-col gap-0.5">
          <div className="text-[10px] font-semibold tracking-widest px-2 mb-1" style={{ color:'var(--text3)' }}>MAIN</div>
          {NAV.map(n => <NavLink key={n.path} item={n} />)}

          <div className="text-[10px] font-semibold tracking-widest px-2 mt-4 mb-1" style={{ color:'var(--text3)' }}>SYSTEM</div>
          {NAV2.map(n => <NavLink key={n.path} item={n} />)}
        </nav>

        {/* Live status */}
        <div className="px-5 py-3 border-t flex items-center gap-2" style={{ borderColor:'var(--border)' }}>
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse flex-shrink-0" />
          <span className="text-xs" style={{ color:'var(--text3)' }}>Live Operations Active</span>
        </div>
      </aside>

      {/* ── MAIN WRAPPER ── */}
      <div className="main-wrapper flex-1 flex flex-col" style={{ marginLeft:'240px' }}>

        {/* ── TOPBAR ── */}
        <header className="topbar">
          <div className="flex items-center gap-3">
            {/* Hamburger */}
            <button onClick={() => setSidebarOpen(s => !s)}
              className="w-8 h-8 flex items-center justify-center rounded-lg transition-colors hover:bg-white/5"
              style={{ color:'var(--text2)' }}>
              ☰
            </button>
            <div>
              <h1 className="font-mukta font-bold text-lg leading-none" style={{ color:'var(--text)' }}>
                {NAV.concat(NAV2).find(n => n.path === location.pathname)?.label || 'Dashboard'}
              </h1>
              <p className="text-[11px] mt-0.5" style={{ color:'var(--text3)' }}>
                Simhastha 2028 · Ujjain · Real-time Overview
              </p>
            </div>
          </div>

          <LiveClock />

          <div className="flex items-center gap-2 md:gap-3">
            {/* Search */}
            <div className="search-box hidden sm:flex" style={{ minWidth:'180px' }}>
              <span style={{ color:'var(--text3)', fontSize:'13px' }}>🔍</span>
              <input placeholder="Search zones, incidents…" />
            </div>

            {/* Weather widget */}
            <div className="hidden md:flex items-center gap-1 px-3 py-1.5 rounded-lg border text-sm"
                 style={{ background:'var(--bg3)', borderColor:'var(--border)' }}>
              <span>☀️</span>
              <span className="font-grotesk font-bold text-yellow-400">41°C</span>
              <span className="text-xs ml-1" style={{ color:'var(--text3)' }}>Heat Alert</span>
            </div>

            {/* Notification bell */}
            <button className="relative w-9 h-9 flex items-center justify-center rounded-lg transition-colors"
                    style={{ background:'var(--bg3)', border:'1px solid var(--border)', color:'var(--text2)' }}>
              🔔
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-[9px] text-white flex items-center justify-center font-bold">3</span>
            </button>

            {/* AI button */}
            <button className="relative w-9 h-9 flex items-center justify-center rounded-lg transition-colors"
                    style={{ background:'var(--bg3)', border:'1px solid var(--border)', color:'var(--text2)' }}>
              🤖
              <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-saffron-500 rounded-full animate-pulse" />
            </button>

            {/* User */}
            {role && (
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg"
                   style={{ background:'var(--bg3)', border:'1px solid var(--border)' }}>
                <div className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-xs font-bold"
                     style={{ background:'linear-gradient(135deg, var(--orange), #c2410c)' }}>
                  {role.label.slice(0,2).toUpperCase()}
                </div>
                <div className="hidden md:block">
                  <div className="text-xs font-semibold leading-none" style={{ color:'var(--text)' }}>{role.label}</div>
                  <div className="text-[10px] mt-0.5" style={{ color:'var(--text3)' }}>Admin</div>
                </div>
              </div>
            )}
          </div>
        </header>

        {/* ── PAGE CONTENT ── */}
        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>

      {/* Mobile sidebar toggle - keep sidebar within CSS classes */}
      <style>{`
        @media (max-width: 1024px) {
          .main-wrapper { margin-left: 0 !important; }
        }
      `}</style>
      
      <ChatBot />
    </div>
  );
}
