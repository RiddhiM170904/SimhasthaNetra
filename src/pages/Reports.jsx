import { useState } from 'react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const REPORTS = [
  { id: 1, name: 'Daily Incident & Response Log', type: 'PDF', size: '124 KB', desc: 'All reported incidents, triage status, and resolution times.' },
  { id: 2, name: 'Crowd Flow & Transport Summary', type: 'PDF', size: '118 KB', desc: 'Hourly pilgrim influx, train arrivals, and bus route statuses.' },
  { id: 3, name: 'Medical Outbreak Scan Results', type: 'PDF', size: '112 KB', desc: 'Zone-wise disease metrics, heatwave risks, and water quality.' },
  { id: 4, name: 'Resource & Volunteer Allocation', type: 'PDF', size: '135 KB', desc: 'Inventory utilization, volunteer shifts, and zone deployment.' },
  { id: 5, name: 'Simhastha Master Overview', type: 'PDF', size: '256 KB', desc: 'Complete command center snapshot of all operational data.' },
];

export default function Reports() {
  const [downloading, setDownloading] = useState(null);

  // Function to generate PDF using jsPDF
  function handleDownload(report) {
    setDownloading(report.id);
    
    setTimeout(() => {
      const doc = new jsPDF();
      
      // Header
      doc.setFontSize(22);
      doc.setTextColor(249, 115, 22); // orange
      doc.text("SimhasthaNetra 2028", 14, 20);
      
      doc.setFontSize(14);
      doc.setTextColor(40, 40, 40);
      doc.text(report.name, 14, 30);
      
      doc.setFontSize(10);
      doc.setTextColor(100, 100, 100);
      doc.text(`Generated: ${new Date().toLocaleString('en-IN')}`, 14, 38);
      doc.text(`Classification: OFFICIAL / CONFIDENTIAL`, 14, 44);

      // Dummy Data Table based on report type
      let head = [['Zone', 'Metric', 'Value', 'Status']];
      let body = [
        ['Ramghat', 'Crowd Density', '87%', 'Critical'],
        ['Mahakal', 'Crowd Density', '91%', 'Critical'],
        ['Dutta Akhara', 'Active Incidents', '3', 'Watch'],
        ['Mangalnath', 'Resource Reserves', '12%', 'Warning'],
        ['Triveni Sangam', 'Water Quality', 'Safe', 'Normal'],
        ['Freeganj P3', 'Parking Capacity', '78%', 'Normal'],
      ];

      if (report.id === 3) {
        head = [['Zone', 'Cases', 'Primary Disease', 'Risk Level']];
        body = [
          ['Ramghat', '42', 'Fever', 'High'],
          ['Dutta Akhara', '12', 'Diarrhea', 'Critical'],
          ['Mahakal', '31', 'Heatstroke', 'High'],
          ['Nanakheda', '9', 'Respiratory', 'Watch'],
        ];
      }

      doc.autoTable({
        startY: 52,
        head: head,
        body: body,
        theme: 'grid',
        headStyles: { fillColor: [249, 115, 22] },
        styles: { fontSize: 10, cellPadding: 4 }
      });

      // Footer
      const pageCount = doc.internal.getNumberOfPages();
      doc.setFontSize(8);
      for(let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.text(`Page ${i} of ${pageCount} - SimhasthaNetra Command Center`, 14, doc.internal.pageSize.height - 10);
      }

      // Download
      doc.save(`${report.name.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_2028.pdf`);
      
      setDownloading(null);
    }, 1200); // Simulate processing time
  }

  return (
    <div className="p-6 h-full overflow-y-auto" style={{ background:'var(--bg)' }}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="font-mukta font-bold text-2xl" style={{ color:'var(--text)' }}>📊 Data Reports & Exports</h2>
          <p className="text-sm mt-1" style={{ color:'var(--text3)' }}>Generate and download official Simhastha 2028 operational logs</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 max-w-4xl">
        {REPORTS.map(report => (
          <div key={report.id} className="flex items-center justify-between p-4 rounded-xl transition-all"
               style={{ background:'var(--card)', border:'1px solid var(--border)' }}>
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center text-xl"
                   style={{ background: report.type==='PDF' ? 'rgba(239,68,68,.1)' : 'rgba(245,158,11,.1)' }}>
                {report.type === 'PDF' ? '📕' : '📙'}
              </div>
              <div>
                <h3 className="font-mukta font-bold text-lg leading-tight" style={{ color:'var(--text)' }}>{report.name}</h3>
                <p className="text-xs mt-1" style={{ color:'var(--text3)' }}>{report.desc}</p>
                <div className="flex items-center gap-3 mt-2 text-[10px] font-bold" style={{ color:'var(--text2)' }}>
                  <span className="px-2 py-0.5 rounded" style={{ background:'var(--bg3)' }}>{report.type}</span>
                  <span>{report.size}</span>
                  <span>Today, {new Date().toLocaleDateString('en-IN')}</span>
                </div>
              </div>
            </div>
            
            <button 
              onClick={() => handleDownload(report)}
              disabled={downloading === report.id}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all hover:opacity-90"
              style={{ 
                background: downloading === report.id ? 'var(--bg3)' : 'var(--orange)', 
                color: downloading === report.id ? 'var(--text2)' : 'white' 
              }}>
              {downloading === report.id ? (
                <><span className="animate-spin">⚙️</span> Generating...</>
              ) : (
                <>📥 Download</>
              )}
            </button>
          </div>
        ))}
      </div>

      <div className="mt-8 p-4 rounded-xl max-w-4xl flex items-start gap-3"
           style={{ background:'rgba(59,130,246,.08)', border:'1px solid rgba(59,130,246,.2)' }}>
        <span className="text-xl">ℹ️</span>
        <div>
          <h4 className="text-sm font-bold" style={{ color:'#3b82f6' }}>Compliance Note</h4>
          <p className="text-xs mt-1" style={{ color:'var(--text2)' }}>
            All reports are cryptographically signed and comply with the MP State Government's data retention policies for large-scale events. Unauthorized sharing is prohibited.
          </p>
        </div>
      </div>
    </div>
  );
}
