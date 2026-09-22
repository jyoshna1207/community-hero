import React, { useState, useEffect } from 'react';
import { FaTasks, FaCheckCircle, FaSpinner, FaClock, FaExclamationTriangle, FaChartLine, FaArrowRight } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../../context/AuthContext';

export default function DepartmentDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    assignedIssues: 0,
    acceptedIssues: 0,
    workInProgress: 0,
    totalCompleted: 0,
    criticalWorks: 0,
  });
  const [recentTasks, setRecentTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDepartmentData = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/issues');
        const issues = Array.isArray(res.data) ? res.data : [];

        const assigned = issues.filter(i => {
          const s = (i.status || '').toUpperCase();
          return s === 'REPORTED' || s === 'UNSOLVED' || s === 'UNDER REVIEW' || s === 'ASSIGNED' || s === 'IN PROGRESS';
        }).length;

        const inProgress = issues.filter(i => (i.status || '').toUpperCase() === 'IN PROGRESS').length;
        const resolved = issues.filter(i => {
          const s = (i.status || '').toUpperCase();
          return s === 'RESOLVED' || s === 'SOLVED';
        }).length;

        const critical = issues.filter(i => (i.priority || i.aiSeverity || '').toUpperCase() === 'CRITICAL').length;

        setStats({
          assignedIssues: assigned || issues.length,
          acceptedIssues: Math.max(1, inProgress),
          workInProgress: inProgress,
          totalCompleted: resolved,
          criticalWorks: critical,
        });

        setRecentTasks(issues.slice(0, 5));
      } catch (err) {
        console.error('Error loading department dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDepartmentData();
  }, []);

  const statCards = [
    { title: "Assigned Issues", count: stats.assignedIssues, icon: <FaTasks />, color: "#3b82f6" },
    { title: "Active Deployments", count: stats.acceptedIssues, icon: <FaCheckCircle />, color: "#0284c7" },
    { title: "Work In Progress", count: stats.workInProgress, icon: <FaSpinner />, color: "#6366f1" },
    { title: "Total Resolved", count: stats.totalCompleted, icon: <FaCheckCircle />, color: "#10b981" },
    { title: "Critical Urgency", count: stats.criticalWorks, icon: <FaExclamationTriangle />, color: "#ef4444" },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* PURPOSE HERO BANNER */}
      <div className="portal-purpose-banner dept-theme">
        <div className="banner-left-content">
          <div className="banner-role-tag">
            <FaTasks /> Department Field Operations Hub
          </div>
          <h1>Infrastructure Repair & Field Task Force Execution</h1>
          <p>
            Execute work orders dispatched by Ward Officers for <strong>{user?.departmentName || 'Public Works Department'}</strong>, accept on-ground deployments, log field progress milestones (0–100%), and upload resolution proof photos.
          </p>
        </div>
        <div className="banner-actions">
          <Link to="/department/assigned-work" className="banner-btn-primary">
            <FaTasks /> View Assigned Work
          </Link>
          <Link to="/department/update-progress" className="banner-btn-secondary">
            <FaSpinner /> Update Progress
          </Link>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
        {statCards.map((c, i) => (
          <div key={i} style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px', background: '#fff', borderRadius: '14px', border: '1px solid #e2e8f0', boxShadow: '0 2px 6px rgba(0,0,0,0.02)' }}>
            <div style={{ background: `${c.color}15`, color: c.color, width: '50px', height: '50px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem' }}>
              {c.icon}
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>{c.title}</div>
              <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#1e293b', marginTop: '2px' }}>
                {loading ? '...' : c.count}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '20px' }}>
        <div style={{ background: '#fff', padding: '22px', borderRadius: '14px', border: '1px solid #e2e8f0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '1.05rem', color: '#1e293b', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
              <FaClock style={{ color: '#0284c7' }} /> Real-time Assigned Work Orders
            </h3>
            <Link to="/department/assigned-work" style={{ fontSize: '0.8rem', color: '#0284c7', fontWeight: 700, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>
              Manage All <FaArrowRight />
            </Link>
          </div>

          {recentTasks.length === 0 ? (
            <p style={{ fontSize: '0.875rem', color: '#64748b' }}>No pending tasks in department queue.</p>
          ) : (
            recentTasks.map(t => (
              <div key={t._id || t.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid #f1f5f9', fontSize: '0.85rem' }}>
                <div>
                  <div style={{ fontWeight: 700, color: '#1e293b' }}>{t.title}</div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b' }}>📍 {t.location} • <span style={{ fontWeight: 600, color: '#0284c7' }}>{t.category}</span></div>
                </div>
                <span style={{
                  padding: '4px 10px',
                  borderRadius: '6px',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  background: (t.priority || '').toUpperCase() === 'CRITICAL' ? '#fee2e2' : '#f0fdf4',
                  color: (t.priority || '').toUpperCase() === 'CRITICAL' ? '#991b1b' : '#166534',
                }}>
                  {t.priority || 'Normal'}
                </span>
              </div>
            ))
          )}
        </div>

        <div style={{ background: '#fff', padding: '22px', borderRadius: '14px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <h3 style={{ fontSize: '1.05rem', color: '#1e293b', fontWeight: 700, margin: 0 }}>Resolution Health & SLA</h3>
              <FaChartLine style={{ color: '#10b981', fontSize: '1.2rem' }} />
            </div>
            <p style={{ color: '#64748b', fontSize: '0.85rem', margin: '0 0 16px 0' }}>
              Field teams are meeting 94% on-time resolution compliance across municipal wards.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: 700, marginBottom: '4px' }}>
                  <span>Potholes & Roads Resolution Rate</span>
                  <span style={{ color: '#10b981' }}>96%</span>
                </div>
                <div style={{ height: '8px', background: '#f1f5f9', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ width: '96%', height: '100%', background: '#10b981' }} />
                </div>
              </div>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: 700, marginBottom: '4px' }}>
                  <span>Water Pipeline Repairs</span>
                  <span style={{ color: '#0284c7' }}>92%</span>
                </div>
                <div style={{ height: '8px', background: '#f1f5f9', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ width: '92%', height: '100%', background: '#0284c7' }} />
                </div>
              </div>
            </div>
          </div>

          <div style={{ marginTop: '20px', padding: '12px 14px', background: '#f0fdf4', borderRadius: '10px', border: '1px solid #bbf7d0', fontSize: '0.8rem', color: '#166534', fontWeight: 600 }}>
            🎉 Over 18,500 Liters of water preserved and 34 road hazards sealed this month.
          </div>
        </div>
      </div>
    </div>
  );
}