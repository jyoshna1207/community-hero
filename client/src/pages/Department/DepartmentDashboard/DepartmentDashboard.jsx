import React from 'react';
import { FaTasks, FaCheckCircle, FaSpinner, FaClock, FaExclamationTriangle, FaChartPie, FaChartBar, FaChartLine } from 'react-icons/fa';
import { departmentSummaryStats, departmentDeadlines } from '../../../services/DepartmentDummyData';

export default function DepartmentDashboard() {
  const statCards = [
    { title: "Assigned Issues", count: departmentSummaryStats.assignedIssues, icon: <FaTasks />, color: "#3b82f6" },
    { title: "Accepted Issues", count: departmentSummaryStats.acceptedIssues, icon: <FaCheckCircle />, color: "#0284c7" },
    { title: "Work In Progress", count: departmentSummaryStats.workInProgress, icon: <FaSpinner />, color: "#6366f1" },
    { title: "Completed Today", count: departmentSummaryStats.completedToday, icon: <FaCheckCircle />, color: "#10b981" },
    { title: "Total Completed", count: departmentSummaryStats.totalCompleted, icon: <FaClock />, color: "#059669" },
    { title: "Delayed Works", count: departmentSummaryStats.delayedWorks, icon: <FaExclamationTriangle />, color: "#ef4444" },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
      <div>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 700, color: '#1e293b' }}>Department Operations Dashboard</h1>
        <p style={{ color: '#64748b', fontSize: '0.9rem' }}>Real-time oversight of infrastructure deployment and field progress.</p>
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

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        <div style={{ background: '#fff', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
          <h3 style={{ fontSize: '1rem', color: '#1e293b', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}><FaClock /> Upcoming Deadlines</h3>
          {departmentDeadlines.map(d => (
            <div key={d.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #f1f5f9', fontSize: '0.85rem' }}>
              <div><strong>{d.id}</strong>: {d.title}</div>
              <div style={{ color: '#ef4444', fontWeight: 600 }}>Due in {d.timeLeft}</div>
            </div>
          ))}
        </div>
        <div style={{ background: '#fff', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}><h3 style={{ fontSize: '1rem', color: '#1e293b' }}>Resolution Efficiency</h3><FaChartLine style={{ color: '#10b981' }} /></div>
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc', borderRadius: '8px', border: '2px dashed #cbd5e1', color: '#64748b', marginTop: '10px', height: '100px' }}>[Performance Line Chart Placeholder]</div>
        </div>
      </div>
    </div>
  );
}