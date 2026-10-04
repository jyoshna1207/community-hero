import React from 'react';
import { FaFilePdf, FaFileExcel, FaPrint, FaChartBar, FaChartPie, FaChartArea } from 'react-icons/fa';
import { dummyReports } from '../../../services/dummyData';
import '../AdminStyles.css';

export default function Reports() {
  return (
    <div className="admin-page-container">
      {/* Top Header */}
      <div className="admin-top-header">
        <div className="admin-header-title">
          <h1>Reports & Analytics</h1>
          <p>Generate comprehensive civic resolution summaries, departmental metrics, and performance analytics.</p>
        </div>
        <div className="admin-header-actions">
          <button className="admin-btn-secondary" onClick={() => alert('Exporting PDF... (UI Only)')}>
            <FaFilePdf style={{ color: '#EF4444' }} /> Export PDF
          </button>
          <button className="admin-btn-secondary" onClick={() => alert('Exporting Excel... (UI Only)')}>
            <FaFileExcel style={{ color: '#10B981' }} /> Export Excel
          </button>
          <button className="admin-btn-primary" onClick={() => alert('Printing Report... (UI Only)')}>
            <FaPrint /> Print Summary
          </button>
        </div>
      </div>

      {/* KPI Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>
        <div className="admin-grid-card" style={{ padding: '20px' }}>
          <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>Today's Volume</div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#0F172A', margin: '6px 0' }}>{dummyReports.today.newIssues} <span style={{ fontSize: '1rem', fontWeight: 600, color: '#64748B' }}>New</span></div>
          <div style={{ fontSize: '0.8rem', color: '#16A34A', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
            ✓ {dummyReports.today.resolved} Resolved today
          </div>
        </div>

        <div className="admin-grid-card" style={{ padding: '20px' }}>
          <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>Weekly Volume</div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#0F172A', margin: '6px 0' }}>{dummyReports.weekly.newIssues} <span style={{ fontSize: '1rem', fontWeight: 600, color: '#64748B' }}>New</span></div>
          <div style={{ fontSize: '0.8rem', color: '#16A34A', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
            ✓ {dummyReports.weekly.resolved} Resolved this week
          </div>
        </div>

        <div className="admin-grid-card" style={{ padding: '20px' }}>
          <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>Monthly Volume</div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#0F172A', margin: '6px 0' }}>{dummyReports.monthly.newIssues} <span style={{ fontSize: '1rem', fontWeight: 600, color: '#64748B' }}>New</span></div>
          <div style={{ fontSize: '0.8rem', color: '#16A34A', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
            ✓ {dummyReports.monthly.resolved} Resolved this month
          </div>
        </div>

        <div className="admin-grid-card" style={{ padding: '20px' }}>
          <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>Yearly Volume</div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#0F172A', margin: '6px 0' }}>{dummyReports.yearly.newIssues} <span style={{ fontSize: '1rem', fontWeight: 600, color: '#64748B' }}>New</span></div>
          <div style={{ fontSize: '0.8rem', color: '#16A34A', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
            ✓ {dummyReports.yearly.resolved} Resolved this year
          </div>
        </div>
      </div>

      {/* Visual Analytics Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '20px' }}>
        <div className="admin-grid-card" style={{ padding: '24px', height: '340px', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>Issue Distribution</h3>
            <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: '#FFF7ED', color: '#EA580C', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #FED7AA' }}>
              <FaChartPie />
            </div>
          </div>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '14px', padding: '16px 0' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.825rem', fontWeight: 700, marginBottom: '4px' }}>
                <span>Roads & Potholes</span> <span style={{ color: '#EA580C' }}>45%</span>
              </div>
              <div style={{ height: '8px', background: '#F1F5F9', borderRadius: '10px', overflow: 'hidden' }}>
                <div style={{ width: '45%', height: '100%', background: 'linear-gradient(90deg, #FB923C, #EA580C)', borderRadius: '10px' }}></div>
              </div>
            </div>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.825rem', fontWeight: 700, marginBottom: '4px' }}>
                <span>Sanitation & Waste</span> <span style={{ color: '#F59E0B' }}>30%</span>
              </div>
              <div style={{ height: '8px', background: '#F1F5F9', borderRadius: '10px', overflow: 'hidden' }}>
                <div style={{ width: '30%', height: '100%', background: 'linear-gradient(90deg, #FDE68A, #F59E0B)', borderRadius: '10px' }}></div>
              </div>
            </div>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.825rem', fontWeight: 700, marginBottom: '4px' }}>
                <span>Water Supply & Drainage</span> <span style={{ color: '#10B981' }}>25%</span>
              </div>
              <div style={{ height: '8px', background: '#F1F5F9', borderRadius: '10px', overflow: 'hidden' }}>
                <div style={{ width: '25%', height: '100%', background: 'linear-gradient(90deg, #6EE7B7, #10B981)', borderRadius: '10px' }}></div>
              </div>
            </div>
          </div>
        </div>

        <div className="admin-grid-card" style={{ padding: '24px', height: '340px', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>Department Performance</h3>
            <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: '#F0FDF4', color: '#16A34A', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #BBF7D0' }}>
              <FaChartBar />
            </div>
          </div>
          <div style={{ flex: 1, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-around', padding: '20px 0', borderBottom: '2px solid #FED7AA' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#EA580C' }}>88%</span>
              <div style={{ width: '36px', height: '120px', background: 'linear-gradient(180deg, #FB923C 0%, #EA580C 100%)', borderRadius: '8px 8px 0 0' }}></div>
              <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#64748B' }}>Roads</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#10B981' }}>94%</span>
              <div style={{ width: '36px', height: '140px', background: 'linear-gradient(180deg, #34D399 0%, #10B981 100%)', borderRadius: '8px 8px 0 0' }}></div>
              <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#64748B' }}>Waste</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#F59E0B' }}>76%</span>
              <div style={{ width: '36px', height: '100px', background: 'linear-gradient(180deg, #FBBF24 0%, #D97706 100%)', borderRadius: '8px 8px 0 0' }}></div>
              <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#64748B' }}>Power</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#EA580C' }}>91%</span>
              <div style={{ width: '36px', height: '130px', background: 'linear-gradient(180deg, #F97316 0%, #C2410C 100%)', borderRadius: '8px 8px 0 0' }}></div>
              <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#64748B' }}>Water</span>
            </div>
          </div>
        </div>

        <div className="admin-grid-card" style={{ padding: '24px', height: '340px', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>Citizen Engagement Trend</h3>
            <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: '#FFFBEB', color: '#D97706', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #FDE68A' }}>
              <FaChartArea />
            </div>
          </div>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '12px', padding: '16px 0' }}>
            <div style={{ background: '#FFFBF7', border: '1px solid #FED7AA', borderRadius: '12px', padding: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#78350F' }}>Active Citizen Heroes:</span>
              <span style={{ fontSize: '1.15rem', fontWeight: 800, color: '#EA580C' }}>1,420+</span>
            </div>
            <div style={{ background: '#FFFBF7', border: '1px solid #FED7AA', borderRadius: '12px', padding: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#78350F' }}>Average Resolution Time:</span>
              <span style={{ fontSize: '1.15rem', fontWeight: 800, color: '#16A34A' }}>2.4 Days</span>
            </div>
            <div style={{ background: '#FFFBF7', border: '1px solid #FED7AA', borderRadius: '12px', padding: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#78350F' }}>Citizen Satisfaction:</span>
              <span style={{ fontSize: '1.15rem', fontWeight: 800, color: '#EA580C' }}>96.8%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}