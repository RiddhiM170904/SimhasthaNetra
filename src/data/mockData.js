// ── ZONES ─────────────────────────────────────────────────────────
export const ZONES = [
  { id:'ramghat',    name:'Ramghat',          density:87, status:'critical', capacity:80000, current:69600, lat:23.18, lng:75.77, reports:14, volunteers:420, ambulances:3 },
  { id:'mahakal',   name:'Mahakal Mandir',   density:91, status:'critical', capacity:60000, current:54600, lat:23.18, lng:75.77, reports:21, volunteers:580, ambulances:4 },
  { id:'mangalnath',name:'Mangalnath',        density:62, status:'watch',    capacity:50000, current:31000, lat:23.16, lng:75.76, reports:6,  volunteers:280, ambulances:2 },
  { id:'freeganj',  name:'Freeganj',          density:45, status:'safe',     capacity:40000, current:18000, lat:23.19, lng:75.79, reports:3,  volunteers:150, ambulances:1 },
  { id:'dutta',     name:'Dutta Akhara',      density:73, status:'watch',    capacity:45000, current:32850, lat:23.17, lng:75.76, reports:8,  volunteers:310, ambulances:2 },
  { id:'bhukhi',    name:'Bhukhi Mata Ghat',  density:38, status:'safe',     capacity:35000, current:13300, lat:23.16, lng:75.78, reports:2,  volunteers:120, ambulances:1 },
  { id:'nanakheda', name:'Nanakheda',          density:55, status:'watch',    capacity:40000, current:22000, lat:23.20, lng:75.79, reports:5,  volunteers:200, ambulances:2 },
  { id:'tower',     name:'Tower Chowk',       density:48, status:'safe',     capacity:30000, current:14400, lat:23.18, lng:75.78, reports:4,  volunteers:180, ambulances:1 },
  { id:'dewas',     name:'Dewas Naka',        density:41, status:'safe',     capacity:30000, current:12300, lat:23.21, lng:75.80, reports:2,  volunteers:130, ambulances:1 },
];

// ── INCIDENTS ──────────────────────────────────────────────────────
export const INITIAL_INCIDENTS = [
  { id:1, zone:'Ramghat',        severity:'high',   category:'Crowd Surge',     time:'09:42', unit:'Alpha-3', status:'active',   text:'Bheed bahut zyada hai, log ghat par aa rahe hain tezi se.' },
  { id:2, zone:'Mahakal Mandir', severity:'high',   category:'Medical',         time:'10:15', unit:'Med-7',   status:'active',   text:'Ek aurat behosh ho gayi, ambulance chahiye turant.' },
  { id:3, zone:'Dutta Akhara',   severity:'medium', category:'Health Alert',    time:'10:28', unit:'Health-2',status:'active',   text:'3 diarrhea cases in 90 min — investigate water source.' },
  { id:4, zone:'Freeganj',       severity:'low',    category:'Lost Person',     time:'08:30', unit:'Vol-12',  status:'resolved', text:'Bachchi mil gayi, parents ke saath hai.' },
  { id:5, zone:'Nanakheda',      severity:'medium', category:'Route Block',     time:'09:10', unit:'Traffic-4',status:'resolved',text:'Route 7 blocked near Tower Chowk due to breakdown.' },
];

// ── TRAINS ────────────────────────────────────────────────────────
export const TRAINS = [
  { name:'Malwa Express',     from:'Indore',    eta:'14:35', passengers:2847, status:'on-time'  },
  { name:'Avantika Express',  from:'Mumbai',    eta:'15:10', passengers:1923, status:'on-time'  },
  { name:'Intercity Express', from:'Bhopal',    eta:'13:48', passengers:1540, status:'delayed'  },
  { name:'Narmada Express',   from:'Jabalpur',  eta:'16:20', passengers:2100, status:'on-time'  },
  { name:'Ujjayini Express',  from:'Delhi',     eta:'17:05', passengers:3200, status:'on-time'  },
  { name:'Shipra Express',    from:'Nagpur',    eta:'18:30', passengers:1780, status:'on-time'  },
];

// ── BUS ROUTES ────────────────────────────────────────────────────
export const BUS_ROUTES = [
  { id:'R-01', name:'Nanakheda Stn → Ramghat',        status:'moving',  load:'87%', note:'' },
  { id:'R-02', name:'Dewas Naka → Mahakal',           status:'moving',  load:'92%', note:'' },
  { id:'R-03', name:'Freeganj → Ramghat',             status:'moving',  load:'65%', note:'' },
  { id:'R-04', name:'Tower Chowk → Mangalnath',       status:'moving',  load:'71%', note:'' },
  { id:'R-05', name:'Nanakheda → Bhukhi Mata Ghat',   status:'moving',  load:'55%', note:'' },
  { id:'R-06', name:'Dewas Naka → Dutta Akhara',      status:'moving',  load:'78%', note:'' },
  { id:'R-07', name:'Tower Chowk → Ramghat',          status:'blocked', load:'0%',  note:'Incident near Tower Chowk — divert via R-12' },
  { id:'R-08', name:'Civil Line → Mahakal Mandir',    status:'moving',  load:'88%', note:'' },
];

// ── HEALTH ────────────────────────────────────────────────────────
export const HEALTH_METRICS = { opd:847, critical:12, alerts:3, ambulances:24 };
export const DISEASE_DATA = [
  { name:'Fever',       value:33, color:'#f97316' },
  { name:'Respiratory', value:28, color:'#fb923c' },
  { name:'Diarrhea',    value:26, color:'#ef4444' },
  { name:'Other',       value:13, color:'#a3a3a3' },
];
export const WATER_QUALITY = [
  { zone:'Ramghat',         level:'Moderate', tested:'08:00', risk:'watch'    },
  { zone:'Mahakal Mandir',  level:'Good',     tested:'07:30', risk:'safe'     },
  { zone:'Dutta Akhara',    level:'Poor',     tested:'09:00', risk:'critical' },
  { zone:'Bhukhi Mata Ghat',level:'Good',     tested:'08:15', risk:'safe'     },
  { zone:'Nanakheda',       level:'Moderate', tested:'07:45', risk:'watch'    },
];

// ── CROWD FLOW (hourly) ───────────────────────────────────────────
export const CROWD_FLOW = [
  { hour:'06:00', count:120000 }, { hour:'07:00', count:280000 },
  { hour:'08:00', count:510000 }, { hour:'09:00', count:680000 },
  { hour:'10:00', count:750000 }, { hour:'11:00', count:720000 },
  { hour:'12:00', count:690000 }, { hour:'13:00', count:740000 },
  { hour:'14:00', count:800000 }, { hour:'15:00', count:820000 }, // projected surge
  { hour:'16:00', count:790000 }, { hour:'17:00', count:650000 },
  { hour:'18:00', count:420000 },
];

// ── ZONE SVG POSITIONS (for heatmap) ─────────────────────────────
export const ZONE_SVG = [
  { id:'ramghat',    x:120, y:200, w:100, h:60,  label:'Ramghat'         },
  { id:'mahakal',   x:240, y:160, w:110, h:70,  label:'Mahakal Mandir'  },
  { id:'mangalnath',x:80,  y:300, w:90,  h:55,  label:'Mangalnath'      },
  { id:'freeganj',  x:280, y:80,  w:80,  h:50,  label:'Freeganj'        },
  { id:'dutta',     x:190, y:280, w:100, h:55,  label:'Dutta Akhara'    },
  { id:'bhukhi',    x:60,  y:160, w:80,  h:50,  label:'Bhukhi Mata'     },
  { id:'nanakheda', x:360, y:120, w:90,  h:55,  label:'Nanakheda'       },
  { id:'tower',     x:310, y:220, w:80,  h:50,  label:'Tower Chowk'     },
  { id:'dewas',     x:400, y:250, w:80,  h:55,  label:'Dewas Naka'      },
];
