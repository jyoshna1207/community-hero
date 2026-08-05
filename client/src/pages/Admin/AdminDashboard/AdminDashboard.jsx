import React from 'react';
import { 
  FaUsers, FaUserShield, FaUserTie, FaExclamationCircle, 
  FaClock, FaCheckCircle, FaTasks, FaTimesCircle, FaShieldAlt,
  FaChartPie, FaChartBar, FaChartLine 
} from 'react-icons/fa';
import { dummyActivities, dummyIssues } from '../../../services/dummyData';

export default function AdminDashboard() {
  const summaryCards = [
    { title: "Total Users", count: "1,245", icon: <FaUsers />, color: "#4f46e5" },
    { title: "Total Citizens", count: "1,120", icon: <FaUsers />, color: "#3b82f6" },
    { title: "Ward Officers", count: "85", icon: <FaUserTie />, color: "#10b981" },
    { title: "Department Officers", count: "40", icon: <FaUserShield />, color: "#8b5cf6" },
    { title: "Total Issues", count: "3,420", icon: <FaExclamationCircle />, color: "#f59e0b" },
    { title: "Pending Issues", count: "142", icon: <FaClock />, color: "#ef4444" },
    { title: "Verified Issues", count: "210", icon: <FaShieldAlt />, color: "#6366f1" },
    { title: "Assigned Issues", count: "350", icon: <FaTasks />, color: "#06b6d4" },
    { title: "Resolved Issues", count: "2,540", icon: <FaCheckCircle />, color: "#10b981" },
    { title: "Closed Issues", count: "178", icon: <FaTimesCircle />, color: "#64748b" },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
      <div>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 700, color: '#1e293b' }}>Administrator Dashboard</h1>
        <p style={{ color: '#475569', fontSize: '0.9rem' }}>Real-time hyperlocal civic metrics and system overview.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}>
        {summaryCards.map((c, i) => (
          <div key={i} className="card" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ background: `${c.color}20`, color: c.color, width: '50px', height: '50px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' }}>
              {c.icon}
            </div>
            <div>
              <div style={{ fontSize: '0.8rem', color: '#475569', fontWeight: 600 }}>{c.title}</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#1e293b', marginTop: '4px' }}>{c.count}</div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
        <div className="card" style={{ padding: '20px', height: '300px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 600 }}>Issue Status Overview</h3>
            <FaChartPie style={{ color: '#4f46e5', fontSize: '1.2rem' }} />
          </div>
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc', borderRadius: '12px', border: '2px dashed #cbd5e1', color: '#475569' }}>
            [Pie Chart Placeholder]
          </div>
        </div>

        <div className="card" style={{ padding: '20px', height: '300px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 600 }}>Department Performance</h3>
            <FaChartBar style={{ color: '#10b981', fontSize: '1.2rem' }} />
          </div>
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc', borderRadius: '12px', border: '2px dashed #cbd5e1', color: '#475569' }}>
            [Bar Chart Placeholder]
          </div>
        </div>

        <div className="card" style={{ padding: '20px', height: '300px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 600 }}>Monthly Trend Line</h3>
            <FaChartLine style={{ color: '#3b82f6', fontSize: '1.2rem' }} />
          </div>
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc', borderRadius: '12px', border: '2px dashed #cbd5e1', color: '#475569' }}>
            [Line Chart Placeholder]
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px' }}>
        <div className="card" style={{ padding: '20px' }}>
          <h3 style={{ fontSize: '1.1rem', marginBottom: '16px', fontWeight: 600 }}>Recent Complaints</h3>
          <div className="table-container">
            <table className="modern-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Category</th>
                  <th>Ward</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {dummyIssues.slice(0, 4).map(issue => (
                  <tr key={issue.id}>
                    <td><strong>{issue.title}</strong></td>
                    <td>{issue.category}</td>
                    <td>{issue.ward}</td>
                    <td><span className={`badge badge-${issue.status.toLowerCase().replace(/\s+/g, '')}`}>{issue.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="card" style={{ padding: '20px' }}>
          <h3 style={{ fontSize: '1.1rem', marginBottom: '16px', fontWeight: 600 }}>Recent Activities</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {dummyActivities.map(act => (
              <div key={act.id} style={{ padding: '10px', background: '#f8fafc', borderRadius: '8px', fontSize: '0.85rem' }}>
                <div style={{ fontWeight: 600, color: '#1e293b' }}>{act.action}</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px', color: '#475569', fontSize: '0.75rem' }}>
                  <span>By: {act.user}</span>
                  <span>{act.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}