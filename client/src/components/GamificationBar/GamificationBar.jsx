import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { FaShieldAlt, FaBolt, FaFire, FaTrophy, FaStar } from 'react-icons/fa';
import './GamificationBar.css';

export default function GamificationBar() {
  const { user } = useAuth();

  const points = user?.points || 350;
  const level = Math.floor(points / 150) + 1;
  const currentLevelXP = points % 150;
  const targetXP = 150;
  const progressPercent = Math.min(Math.round((currentLevelXP / targetXP) * 100), 100);

  const getTitleForLevel = (lvl) => {
    if (lvl >= 5) return '👑 Grand Champion Hero';
    if (lvl >= 4) return '🥇 Gold Community Guardian';
    if (lvl >= 3) return '🥈 Silver Neighborhood Guard';
    if (lvl >= 2) return '🥉 Bronze Civic Sentinel';
    return '🌱 Rookie Citizen Reporter';
  };

  const streakDays = user?.streakDays || 5;

  return (
    <div className="gamification-bar-container">
      <div className="gamification-bar-inner">
        {/* Level & Title Section */}
        <div className="hero-level-section">
          <div className="level-badge-avatar">
            <FaShieldAlt className="level-shield-icon" />
            <span className="level-number">{level}</span>
          </div>
          <div className="level-text-info">
            <span className="hero-title">{getTitleForLevel(level)}</span>
            <div className="xp-progress-wrapper">
              <div className="xp-progress-bar">
                <div
                  className="xp-progress-fill"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <span className="xp-progress-text">
                {currentLevelXP} / {targetXP} XP
              </span>
            </div>
          </div>
        </div>

        {/* Hero Points & Streak Section */}
        <div className="hero-stats-row">
          <div className="stat-chip points-chip">
            <FaBolt className="chip-icon text-amber" />
            <span className="stat-value">{points}</span>
            <span className="stat-label">Hero XP</span>
          </div>

          <div className="stat-chip streak-chip">
            <FaFire className="chip-icon text-orange" />
            <span className="stat-value">{streakDays}</span>
            <span className="stat-label">Day Streak</span>
          </div>

          <div className="stat-chip badge-chip-summary">
            <FaTrophy className="chip-icon text-emerald" />
            <span className="stat-value">{user?.badges?.length || 3}</span>
            <span className="stat-label">Badges</span>
          </div>
        </div>
      </div>
    </div>
  );
}
