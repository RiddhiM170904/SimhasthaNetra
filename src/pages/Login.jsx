import { useNavigate } from 'react-router-dom';
import { useRole, ROLES } from '../context/RoleContext.jsx';

// Marigold SVG Logo
function NetraLogo({ size = 56 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 56 56" fill="none">
      {/* Marigold petals */}
      {[...Array(12)].map((_, i) => (
        <ellipse key={i} cx="28" cy="8" rx="4" ry="8" fill="#fb923c" opacity="0.7"
          transform={`rotate(${i * 30} 28 28)`} />
      ))}
      {/* Inner circle */}
      <circle cx="28" cy="28" r="14" fill="#f97316" />
      {/* Eye */}
      <ellipse cx="28" cy="28" rx="9" ry="5.5" fill="white" />
      <circle cx="28" cy="28" r="3.5" fill="#7c2d12" />
      <circle cx="29.2" cy="26.8" r="1" fill="white" />
    </svg>
  );
}

function RoleCard({ role, onSelect }) {
  return (
    <div onClick={() => onSelect(role)}
      className="rounded-2xl p-0 cursor-pointer transition-all duration-300 group text-center overflow-hidden flex flex-col"
      style={{ background:'var(--card)', border:'1px solid var(--border)' }}
      onMouseEnter={e => { e.currentTarget.style.borderColor='var(--orange)'; e.currentTarget.style.transform='translateY(-4px)'; e.currentTarget.style.boxShadow='0 12px 40px rgba(249,115,22,0.2)'; }}
      onMouseLeave={e => { e.currentTarget.style.borderColor='var(--border)'; e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.boxShadow='none'; }}>
      {role.img ? (
        <div className="h-32 w-full bg-cover bg-center border-b" style={{ backgroundImage: `url(${role.img})`, borderColor:'var(--border)' }} />
      ) : (
        <div className="text-5xl mt-6 mb-2">{role.icon}</div>
      )}
      <div className="p-5 flex-1 flex flex-col">
        <h3 className="font-mukta font-bold text-xl mb-1" style={{ color:'var(--text)' }}>{role.label}</h3>
        <p className="text-sm mb-3 flex-1" style={{ color:'var(--text3)' }}>{role.org}</p>
        <div className="mb-4">
          <span className="text-xs font-bold px-2.5 py-0.5 rounded-full" style={{ background:'rgba(249,115,22,.15)', color:'var(--orange)' }}>
            ● Live Demo
          </span>
        </div>
        <div className="mt-auto text-sm font-semibold py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200"
             style={{ background:'var(--orange)', color:'white' }}>
          Login as {role.label} →
        </div>
      </div>
    </div>
  );
}

export default function Login() {
  const { setRole, ROLES } = useRole();
  const navigate = useNavigate();

  function handleSelect(role) {
    setRole(role);
    if (role.id === 'health') {
      navigate('/dashboard/health');
    } else if (role.id === 'transport') {
      navigate('/dashboard/transport');
    } else {
      navigate('/dashboard');
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 relative overflow-hidden"
         style={{ background:'var(--bg)' }}>
      
      {/* Background Image & Overlays */}
      <div className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-15"
           style={{ backgroundImage: 'url(https://www.ercotravels.com/blog/wp-content/uploads/2016/01/groupofsadhus.jpg)' }} />
      <div className="absolute inset-0 z-0" 
           style={{ background: 'linear-gradient(to bottom, var(--bg) 0%, transparent 40%, var(--bg) 100%), radial-gradient(circle at center, transparent 0%, var(--bg) 80%)' }} />

      {/* Content */}
      <div className="z-10 w-full flex flex-col items-center">
        {/* Logo */}
      <div className="flex flex-col items-center mb-10 animate-fade-in">
        <NetraLogo size={80} />
        <h1 className="font-mukta font-extrabold text-4xl mt-4 tracking-tight" style={{ color:'var(--text)' }}>
          SimhasthaNetra
        </h1>
        <p className="font-mukta text-lg mt-1 text-center" style={{ color:'var(--orange)' }}>
          हर पल की नज़र — Simhastha 2028, Ujjain
        </p>
        <div className="flex items-center gap-2 mt-3 px-3 py-1 rounded-full" style={{ background:'rgba(34,197,94,.1)' }}>
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span className="text-green-400 text-sm font-medium">Live Operations Active</span>
        </div>
      </div>

      {/* Role cards */}
      <div className="w-full max-w-3xl">
        <p className="text-center text-sm mb-6 font-mukta" style={{ color:'var(--text3)' }}>
          अपनी भूमिका चुनें — Choose your role to continue
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {Object.values(ROLES).map(role => (
            <RoleCard key={role.id} role={role} onSelect={handleSelect} />
          ))}
        </div>
      </div>

      {/* Integration logos */}
      <div className="mt-10 text-center">
        <p className="text-xs mb-3 uppercase tracking-widest" style={{ color:'var(--text3)' }}>Integrated with</p>
        <div className="flex flex-wrap justify-center gap-3 text-sm font-medium">
          {['🚂 Indian Railways', '🌤️ IMD Weather', '🔵 NDRF', '🏥 MP Health'].map(l => (
            <span key={l} className="px-3 py-1.5 rounded-full text-xs"
              style={{ background:'var(--card)', border:'1px solid var(--border)', color:'var(--text2)' }}>{l}</span>
          ))}
        </div>
      </div>
      </div>
    </div>
  );
}
