import React from 'react';
import { FaClipboardCheck, FaCheckDouble, FaTasks, FaSpinner, FaCheckCircle, FaBan, FaChartPie, FaChartLine } from 'react-icons/fa';
import { officerSummaryStats, verificationQueueData, officerActivities } from '../../../services/OfficerDummyData';

export default function OfficerDashboard({ setActiveTab }) {
  const statCards = [
    { title: "Pending Verification", count: officerSummaryStats.pendingVerification, icon: <FaClipboardCheck />, color: "#f59e0b" },
    { title: "Verified Today", count: officerSummaryStats.verifiedToday, icon: <FaCheckDouble />, color: "#10b981" },
    { title: "Assigned Issues", count: officerSummaryStats.assignedIssues, icon: <FaTasks />, color: "#3b82f6" },
    { title: "Issues In Progress", count: officerSummaryStats.inProgress, icon: <FaSpinner />, color: "#6366f1" },
    { title: "Resolved Issues", count: officerSummaryStats.resolvedIssues, icon: <FaCheckCircle />, color: "#059669" },
    { title: "Rejected Reports", count: officerSummaryStats.rejectedReports, icon: <FaBan />, color: "#ef4444" },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
      <div>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 700, color: '#1e293b' }}>Ward 4 Officer Dashboard</h1>
        <p style={{ color: '#64748b', fontSize: '0.9rem' }}>Real-time hyperlocal oversight and municipal grievance triage.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
        {statCards.map((c, i) => (
          <div key={i} style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px', background: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
            <div style={{ background: `${c.color}15`, color: c.color, width: '48px', height: '48px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem' }}>
              {c.icon}
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>{c.title}</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#1e293b', marginTop: '4px' }}>{c.count}</div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
        <div style={{ padding: '20px', background: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', height: '260px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}><h3 style={{ fontSize: '1rem' }}>Issue Category Share</h3><FaChartPie style={{ color: '#4f46e5' }} /></div>
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc', borderRadius: '8px', border: '2px dashed #cbd5e1', color: '#64748b', marginTop: '10px' }}>[Pie Chart Placeholder]</div>
        </div>
        <div style={{ padding: '20px', background: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', height: '260px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}><h3 style={{ fontSize: '1rem' }}>Monthly Resolution Trend</h3><FaChartLine style={{ color: '#10b981' }} /></div>
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc', borderRadius: '8px', border: '2px dashed #cbd5e1', color: '#64748b', marginTop: '10px' }}>[Line Chart Placeholder]</div>
        </div>
      </div>
    </div>
  );
}