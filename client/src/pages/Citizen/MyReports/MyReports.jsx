import React, { useState, useEffect } from 'react';
import { 
  FiSearch, FiTrash2, FiClock, FiMapPin, FiPlusCircle, 
  FiCheckCircle, FiActivity, FiChevronRight, FiAlertCircle, FiArrowRight
} from 'react-icons/fi';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../../context/AuthContext';
import { useLanguage } from '../../../context/LanguageContext';
import './MyReports.css';

export default function MyReports() {
  const navigate = useNavigate();
  const { user, token } = useAuth();
  const { t, language } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadReports = async () => {
      setLoading(true);
      let combined = [];

      // 1. Load locally saved reports submitted by user
      try {
        const local = JSON.parse(localStorage.getItem('my_submitted_reports') || '[]');
        combined = [...local];
      } catch (e) {
        console.error("Local storage error:", e);
      }

      // 2. Load API reports if authenticated
      if (token) {
        try {
          const res = await axios.get('http://localhost:5000/api/issues/my-reports', {
            headers: { Authorization: `Bearer ${token}` }
          });
          if (res.data && res.data.length > 0) {
            const apiMapped = res.data.map(item => ({
              id: item._id,
              _id: item._id,
              title: item.title,
              category: item.category,
              status: item.status || 'Reported',
              priority: item.aiSeverity || 'High',
              location: item.location,
              image: item.image || `https://picsum.photos/seed/${item.id || item._id || 'myreport'}/400/300`,
              date: new Date(item.createdAt || item.reportedDate || Date.now()).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
            }));

            const existingIds = new Set(combined.map(r => r.id));
            apiMapped.forEach(item => {
              if (!existingIds.has(item.id)) {
                combined.push(item);
              }
            });
          }
        } catch (err) {
          console.error("Fetch my reports error:", err);
        }
      }

      setReports(combined);
      setLoading(false);
    };

    loadReports();
  }, [token]);

  const handleDelete = (id) => {
    if (window.confirm(t('deleteReportConfirm'))) {
      const updated = reports.filter(r => r.id !== id && r._id !== id);
      setReports(updated);
      try {
        const local = JSON.parse(localStorage.getItem('my_submitted_reports') || '[]');
        const filteredLocal = local.filter(r => r.id !== id && r._id !== id);
        localStorage.setItem('my_submitted_reports', JSON.stringify(filteredLocal));
      } catch (e) {
        console.error("Delete local storage error:", e);
      }
    }
  };

  const getProgressPercentage = (status) => {
    if (status === 'Resolved' || status === 'Solved') return 100;
    if (status === 'In Progress' || status === 'Assigned') return 60;
    if (status === 'Under Review') return 30;
    return 15;
  };

  const filteredReports = reports.filter(r => {
    const titleMatch = (r.title || '').toLowerCase().includes(searchTerm.toLowerCase());
    const locMatch = (r.location || '').toLowerCase().includes(searchTerm.toLowerCase());
    const catMatch = (r.category || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSearch = titleMatch || locMatch || catMatch;
    const matchesStatus = statusFilter === 'All' || r.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const myTotal = reports.length;
  const myInProgress = reports.filter(r => r.status === 'In Progress' || r.status === 'Under Review').length;
  const myResolved = reports.filter(r => r.status === 'Resolved' || r.status === 'Solved').length;

  return (
    <div className="my-reports-clean-page">
      {/* 1. CLEAN HERO HEADER */}
      <header className="reports-clean-header">
        <div className="reports-header-text">
          <span className="reports-eyebrow">
            👤 {language === 'te' ? 'మీ ఖాతా కార్యకలాపాలు' : language === 'hi' ? 'आपकी गतिविधियाँ' : 'Citizen Portfolio'}
          </span>
          <h1>{t('myReportsTitle')}</h1>
          <p>
            {language === 'te' 
              ? 'మీరు నివేదించిన సమస్యల పరిష్కార పురోగతి మరియు అధికారుల చర్యలను ఇక్కడ ట్రాక్ చేయండి.'
              : language === 'hi'
              ? 'आपके द्वारा दर्ज की गई समस्याओं की लाइव प्रगति और स्थिति यहां देखें।'
              : 'Track live progress, municipal verification, and field repairs for all issues you reported.'}
          </p>
        </div>

        <button className="btn-new-report" onClick={() => navigate('/report-issue')}>
          <FiPlusCircle /> {t('bannerReportBtn')}
        </button>
      </header>

      {/* 2. MINIMAL 3-STAT STRIP */}
      <div className="reports-stats-strip">
        <div className="report-stat-pill">
          <span className="stat-indicator blue" />
          <div className="stat-text-group">
            <strong>{myTotal}</strong>
            <span>{t('kpiReported')}</span>
          </div>
        </div>

        <div className="stat-sep" />

        <div className="report-stat-pill">
          <span className="stat-indicator orange" />
          <div className="stat-text-group">
            <strong>{myInProgress}</strong>
            <span>{t('kpiInProgress')}</span>
          </div>
        </div>

        <div className="stat-sep" />

        <div className="report-stat-pill">
          <span className="stat-indicator green" />
          <div className="stat-text-group">
            <strong>{myResolved}</strong>
            <span>{t('kpiResolved')}</span>
          </div>
        </div>
      </div>

      {/* 3. SLEEK SEARCH & PILL FILTER TABS */}
      <div className="reports-filter-bar">
        <div className="reports-search-box">
          <FiSearch className="search-icon" />
          <input 
            type="text" 
            placeholder={t('searchMyReportsPlaceholder')} 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="status-filter-pills">
          <button 
            type="button"
            className={`filter-pill ${statusFilter === 'All' ? 'active' : ''}`}
            onClick={() => setStatusFilter('All')}
          >
            {t('allStatuses')} ({myTotal})
          </button>
          <button 
            type="button"
            className={`filter-pill ${statusFilter === 'Reported' ? 'active' : ''}`}
            onClick={() => setStatusFilter('Reported')}
          >
            {t('statusReported')} ({reports.filter(r => r.status === 'Reported').length})
          </button>
          <button 
            type="button"
            className={`filter-pill ${statusFilter === 'In Progress' ? 'active' : ''}`}
            onClick={() => setStatusFilter('In Progress')}
          >
            {t('statusInProgress')} ({myInProgress})
          </button>
          <button 
            type="button"
            className={`filter-pill ${statusFilter === 'Resolved' ? 'active' : ''}`}
            onClick={() => setStatusFilter('Resolved')}
          >
            {t('statusResolved')} ({myResolved})
          </button>
        </div>
      </div>

      {/* 4. CLEAN CARD FEED (NO CLUMSY TABLE) */}
      <div className="reports-feed-container">
        {loading ? (
          <div className="reports-empty-box">
            <p>Loading your reports...</p>
          </div>
        ) : filteredReports.length === 0 ? (
          <div className="reports-empty-box">
            <FiAlertCircle size={40} style={{ color: '#94A3B8', marginBottom: '8px' }} />
            <h3>{t('noMyReports')}</h3>
            <p>
              {language === 'te' 
                ? 'మీరు ఇంకా ఏ సమస్యనూ నివేదించలేదు లేదా ఫిల్టర్‌కు సరిపోయే రిపోర్టులు లేవు.' 
                : language === 'hi' 
                ? 'आपने अभी तक कोई समस्या दर्ज नहीं की है।' 
                : 'You have not reported any issues yet, or none match the active filter.'}
            </p>
            <button className="btn-new-report" onClick={() => navigate('/report-issue')}>
              <FiPlusCircle /> {t('bannerReportBtn')}
            </button>
          </div>
        ) : (
          <div className="reports-cards-list">
            {filteredReports.map((rep) => {
              const progressPct = getProgressPercentage(rep.status);

              return (
                <div key={rep.id || rep._id} className="report-item-card">
                  {/* Image Thumbnail */}
                  <div className="report-card-image">
                    <img src={rep.image} alt={rep.title} />
                  </div>

                  {/* Body Content */}
                  <div className="report-card-body">
                    <div className="report-card-headline">
                      <h3>{rep.title}</h3>
                      <div className="report-badge-cluster">
                        <span className={`clean-status-pill ${
                          rep.status === 'Resolved' || rep.status === 'Solved' ? 'resolved' :
                          rep.status === 'In Progress' ? 'in-progress' : 'pending'
                        }`}>
                          {rep.status === 'Resolved' || rep.status === 'Solved' ? `🟢 ${t('statusResolved')}` :
                           rep.status === 'In Progress' ? `🔵 ${t('statusInProgress')}` : `🟠 ${t('statusReported')}`}
                        </span>
                        <span className="report-category-pill">{rep.category}</span>
                      </div>
                    </div>

                    <div className="report-meta-row">
                      <span>{rep.date}</span>
                      <span className="meta-dot">•</span>
                      <span className="meta-loc">{rep.location}</span>
                    </div>
                  </div>

                  {/* Actions Column */}
                  <div className="report-card-actions">
                    <Link to={`/track-report/${rep.id || rep._id}`} className="btn-clean-track-icon" title={t('trackDetails')}>
                      <FiArrowRight />
                    </Link>

                    <button 
                      type="button"
                      onClick={() => handleDelete(rep.id || rep._id)} 
                      className="btn-delete-action-icon"
                      title="Delete Report"
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}