import React from 'react';
import { FaFilePdf, FaFileExcel, FaPrint, FaChartBar, FaChartPie, FaChartArea } from 'react-icons/fa';
import { dummyReports } from '../../../services/dummyData';

export default function Reports() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 700, color: '#1e293b' }}>Reports & Analytics</h1>
          <p style={{ color: '#475569', fontSize: '0.9rem' }}>Generate comprehensive civic resolution summaries and performance reports.</p>
        </div>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <button className="btn btn-outline" onClick={() => alert('Exporting PDF... (UI Only)')}><FaFilePdf style={{ color: '#ef4444' }} /> Export PDF</button>
          <button className="btn btn-outline" onClick={() => alert('Exporting Excel... (UI Only)')}><FaFileExcel style={{ color: '#10b981' }} /> Export Excel</button>
          <button className="btn btn-primary" onClick={() => alert('Printing Report... (UI Only)')}><FaPrint /> Print Report</button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}>
        <div className="card" style={{ padding: '20px' }}>
          <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#475569' }}>Today's Reports</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 700, color: '#1e293b', margin: '8px 0' }}>{dummyReports.today.newIssues} New</div>
          <div style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: 600 }}>{dummyReports.today.resolved} Resolved today</div>
        </div>
        <div className="card" style={{ padding: '20px' }}>
          <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#475569' }}>Weekly Reports</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 700, color: '#1e293b', margin: '8px 0' }}>{dummyReports.weekly.newIssues} New</div>
          <div style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: 600 }}>{dummyReports.weekly.resolved} Resolved this week</div>
        </div>
        <div className="card" style={{ padding: '20px' }}>
          <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#475569' }}>Monthly Reports</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 700, color: '#1e293b', margin: '8px 0' }}>{dummyReports.monthly.newIssues} New</div>
          <div style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: 600 }}>{dummyReports.monthly.resolved} Resolved this month</div>
        </div>
        <div className="card" style={{ padding: '20px' }}>
          <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#475569' }}>Yearly Reports</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 700, color: '#1e293b', margin: '8px 0' }}>{dummyReports.yearly.newIssues} New</div>
          <div style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: 600 }}>{dummyReports.yearly.resolved} Resolved this year</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
        <div className="card" style={{ padding: '20px', height: '320px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 600 }}>Issue Distribution</h3>
            <FaChartPie style={{ color: '#4f46e5' }} />
          </div>
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc', borderRadius: '12px', border: '2px dashed #cbd5e1', color: '#475569' }}>
            [Bar Chart Placeholder]
          </div>
        </div>

        <div className="card" style={{ padding: '20px', height: '320px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 600 }}>Department Performance</h3>
            <FaChartBar style={{ color: '#10b981' }} />
          </div>
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc', borderRadius: '12px', border: '2px dashed #cbd5e1', color: '#475569' }}>
            [Bar Chart Placeholder]
          </div>
        </div>

        <div className="card" style={{ padding: '20px', height: '320px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 600 }}>Citizen Participation</h3>
            <FaChartArea style={{ color: '#3b82f6' }} />
          </div>
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc', borderRadius: '12px', border: '2px dashed #cbd5e1', color: '#475569' }}>
            [Area Chart Placeholder]
          </div>
        </div>
      </div>
    </div>
  );
}