
// File path: src/pages/Citizen/Profile/Profile.jsx

import React from 'react';
import { 
  FiUser, 
  FiMail, 
  FiShield, 
  FiAward, 
  FiCalendar, 
  FiEdit, 
  FiLock, 
  FiLogOut, 
  FiClipboard, 
  FiCheckCircle 
} from 'react-icons/fi';
import { profileData } from './ProfileData';
import './Profile.css';

export default function Profile() {
  return (
    <div className="profile-page-container">
      <div className="profile-header-banner">
        <div className="profile-avatar-large">
          <FiUser />
        </div>
        <div className="profile-user-titles">
          <h2>{profileData.name}</h2>
          <p>{profileData.email}</p>
          <span className="role-badge">{profileData.role}</span>
        </div>
      </div>

      <div className="profile-stats-grid">
        <div className="dash-metric-card">
          <div className="metric-icon blue"><FiClipboard /></div>
          <div>
            <h3>{profileData.reportsSubmitted}</h3>
            <p>Reports Submitted</p>
          </div>
        </div>
        <div className="dash-metric-card">
          <div className="metric-icon green"><FiCheckCircle /></div>
          <div>
            <h3>{profileData.resolvedReports}</h3>
            <p>Resolved Reports</p>
          </div>
        </div>
        <div className="dash-metric-card">
          <div className="metric-icon purple"><FiAward /></div>
          <div>
            <h3>{profileData.communityScore}</h3>
            <p>Community Score</p>
          </div>
        </div>
        <div className="dash-metric-card">
          <div className="metric-icon orange"><FiCalendar /></div>
          <div>
            <h3>{profileData.memberSince}</h3>
            <p>Member Since</p>
          </div>
        </div>
      </div>

      <div className="profile-actions-box">
        <h3>Account Settings</h3>
        <div className="profile-buttons-flex">
          <button className="btn-primary"><FiEdit /> Edit Profile</button>
          <button className="btn-secondary-outline"><FiLock /> Change Password (UI only)</button>
          <button className="btn-danger-outline"><FiLogOut /> Logout</button>
        </div>
      </div>
    </div>
  );
}

