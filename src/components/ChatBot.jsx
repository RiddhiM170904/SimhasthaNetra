import { useState, useRef, useEffect } from 'react';

const SYSTEM_CTX = `You are NetraBot, the AI assistant for SimhasthaNetra — command center for Simhastha Mahakumbh 2028, Ujjain.
Current status: 75 lakh pilgrims today. Shahi Snan in 4 hours. Critical zones: Ramghat (87%), Mahakal (91%).
You understand Hindi, Hinglish, and English. Be concise — 2-3 sentences max per response.
Key ghats: Ram Ghat, Triveni Sangam, Mangalnath Ghat, Bhukhi Mata Ghat, Dutta Akhara Ghat.`;

const API_KEY = import.meta.env.VITE_ANTHROPIC_API_KEY || '';

const QUICK_Q = [
  'Ramghat ki current crowd density kya hai?',
  'Shahi Snan preparation status?',
  'Kaunsa zone critical hai abhi?',
  'Medical emergency protocol kya hai?',
];

const MOCK_RESPONSES = {
  default: 'Simhastha 2028 mein aaj 75 lakh pilgrims expected hain. Abhi Ramghat (87%) aur Mahakal Mandir (91%) critical zone mein hain. Koi specific information chahiye?',
  crowd:   'वर्तमान में Ramghat 87% और Mahakal Mandir 91% capacity पर हैं — दोनों Critical। Backup forces deploy करें और alternate routes activate करें।',
  shahi:   'Shahi Snan 4 घंटे में है। Ramghat aur Triveni Sangam par special barricading active hai. 580 extra volunteers deployed hain. All systems ready.',
  medical: 'Medical emergency ke liye: 1) Zone control ko alert karein 2) Nearest ambulance dispatch karein 3) Medical helpline: 1800-XXX-XXXX. Dutta Akhara mein abhi 3 diarrhea cases under watch hain.',
  transport: 'Malwa Express (2,847 pilgrims) 14:35 pe arrive karegi. Route R-07 Tower Chowk ke paas blocked hai — R-12 bypass activate karein. 642/780 buses active hain.',
  ghat:    'Main ghats for Simhastha: 1) Ram Ghat — primary Shahi Snan site 2) Triveni Sangam — holy confluence 3) Mangalnath Ghat — astronomical significance 4) Bhukhi Mata Ghat 5) Dutta Akhara Ghat.',
};

function getKeyword(msg) {
  const m = msg.toLowerCase();
  if (m.includes('crowd') || m.includes('bheed') || m.includes('density')) return 'crowd';
  if (m.includes('shahi') || m.includes('snan') || m.includes('bath')) return 'shahi';
  if (m.includes('medical') || m.includes('doctor') || m.includes('hospital') || m.includes('ambulance')) return 'medical';
  if (m.includes('transport') || m.includes('bus') || m.includes('train') || m.includes('route')) return 'transport';
  if (m.includes('ghat') || m.includes('sangam') || m.includes('ramghat')) return 'ghat';
  return 'default';
}

async function callClaude(messages) {
  if (!API_KEY) {
    await new Promise(r => setTimeout(r, 800));
    const last = messages[messages.length - 1].content;
    return MOCK_RESPONSES[getKeyword(last)] || MOCK_RESPONSES.default;
  }
  try {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': API_KEY,
        'anthropic-version': '2023-06-01',
        'anthropic-dangerous-direct-browser-access': 'true',
      },
      body: JSON.stringify({
        model: 'claude-opus-4-5',
        max_tokens: 256,
        system: SYSTEM_CTX,
        messages,
      }),
    });
    const data = await res.json();
    return data.content?.[0]?.text || MOCK_RESPONSES.default;
  } catch {
    return MOCK_RESPONSES[getKeyword(messages[messages.length - 1].content)];
  }
}

export default function ChatBot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'नमस्ते! मैं NetraBot हूँ। Simhastha 2028 operations में आपकी कैसे मदद करूँ?', time: new Date() }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    if (open) bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, open]);

  async function send(text) {
    const msg = text || input.trim();
    if (!msg) return;
    setInput('');

    const userMsg = { role: 'user', content: msg, time: new Date() };
    const apiMessages = [...messages.filter(m => m.role !== 'system'), userMsg]
      .map(m => ({ role: m.role, content: m.content }));

    setMessages(prev => [...prev, userMsg]);
    setLoading(true);

    const reply = await callClaude(apiMessages);
    setMessages(prev => [...prev, { role: 'assistant', content: reply, time: new Date() }]);
    setLoading(false);
  }

  function fmt(d) {
    return d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
  }

  return (
    <>
      {/* Floating button */}
      <button onClick={() => setOpen(o => !o)}
        className="fixed bottom-5 right-5 w-13 h-13 rounded-full flex items-center justify-center text-xl shadow-2xl z-50 transition-all duration-200"
        style={{ background: 'linear-gradient(135deg, var(--orange), #c2410c)', width: 52, height: 52,
          boxShadow: '0 4px 20px rgba(249,115,22,0.5)', transform: open ? 'scale(0.92)' : 'scale(1)' }}>
        {open ? '✕' : '🤖'}
        {!open && (
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2"
            style={{ borderColor: 'var(--bg2)' }} />
        )}
      </button>

      {/* Chat panel */}
      {open && (
        <div className="fixed bottom-20 right-5 w-80 rounded-2xl shadow-2xl z-50 flex flex-col overflow-hidden animate-slide-in"
             style={{ height: 460, background: 'var(--bg2)', border: '1px solid var(--border)' }}>

          {/* Header */}
          <div className="flex items-center gap-2 px-4 py-3 flex-shrink-0"
               style={{ background: 'linear-gradient(90deg, rgba(249,115,22,.15), rgba(249,115,22,.05))',
                borderBottom: '1px solid var(--border)' }}>
            <div className="w-8 h-8 rounded-lg flex items-center justify-center text-base"
                 style={{ background: 'rgba(249,115,22,.2)' }}>🤖</div>
            <div>
              <div className="text-sm font-bold font-mukta" style={{ color: 'var(--orange)' }}>NetraBot</div>
              <div className="flex items-center gap-1 text-[10px]" style={{ color: 'var(--text3)' }}>
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />AI Operations Assistant
              </div>
            </div>
            <button onClick={() => setMessages([messages[0]])} className="ml-auto text-xs" style={{ color: 'var(--text3)' }}>
              Clear
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-3 py-3 flex flex-col gap-2">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className="max-w-[85%]">
                  <div className={`text-xs px-3 py-2 rounded-xl font-mukta leading-relaxed`}
                       style={{
                         background: m.role === 'user' ? 'var(--orange)' : 'var(--card)',
                         color: m.role === 'user' ? 'white' : 'var(--text)',
                         borderBottomRightRadius: m.role === 'user' ? 4 : 12,
                         borderBottomLeftRadius: m.role === 'assistant' ? 4 : 12,
                       }}>
                    {m.content}
                  </div>
                  <div className="text-[9px] mt-0.5 px-1" style={{ color: 'var(--text3)', textAlign: m.role === 'user' ? 'right' : 'left' }}>
                    {fmt(m.time || new Date())}
                  </div>
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="px-3 py-2 rounded-xl text-xs" style={{ background: 'var(--card)' }}>
                  <span className="animate-pulse" style={{ color: 'var(--orange)' }}>NetraBot सोच रहा है…</span>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Quick suggestions */}
          {messages.length <= 2 && (
            <div className="px-3 py-2 flex flex-col gap-1 flex-shrink-0" style={{ borderTop: '1px solid var(--border)' }}>
              <div className="text-[9px] mb-1 font-semibold" style={{ color: 'var(--text3)' }}>QUICK QUESTIONS</div>
              {QUICK_Q.map((q, i) => (
                <button key={i} onClick={() => send(q)}
                  className="text-left text-[10px] px-2 py-1 rounded-lg transition-colors"
                  style={{ background: 'var(--bg3)', color: 'var(--text2)', border: '1px solid var(--border)' }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--orange)'}
                  onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}>
                  {q}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div className="px-3 pb-3 pt-2 flex gap-2 flex-shrink-0" style={{ borderTop: '1px solid var(--border)' }}>
            <input value={input} onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && !e.shiftKey && send()}
              placeholder="Hindi/English/Hinglish…"
              className="flex-1 text-xs px-3 py-2 rounded-lg outline-none"
              style={{ background: 'var(--bg3)', border: '1px solid var(--border)', color: 'var(--text)' }} />
            <button onClick={() => send()}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-sm flex-shrink-0"
              style={{ background: input.trim() ? 'var(--orange)' : 'var(--bg3)', color: 'white' }}>
              ➤
            </button>
          </div>
        </div>
      )}
    </>
  );
}
