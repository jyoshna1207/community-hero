import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaCrown, FaTrophy, FaMedal, FaFire, FaShieldAlt, FaStar, FaCheckCircle } from 'react-icons/fa';
import './Leaderboard.css';

export default function Leaderboard() {
  const [heroes, setHeroes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      setLoading(true);
      try {
        const res = await axios.get('http://localhost:5000/api/leaderboard');
        setHeroes(res.data);
      } catch (err) {
        console.error('Failed to load leaderboard:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  const topThree = heroes.slice(0, 3);
  const remaining = heroes.slice(3);

  return (
    <div className="leaderboard-page-container">
      <header className="leaderboard-header">
        <div className="header-icon-badge">
          <FaTrophy className="trophy-header-icon" />
        </div>
        <h1 className="leaderboard-title">Community Hero Hall of Fame</h1>
        <p className="leaderboard-subtitle">
          Celebrating citizens making the biggest impact in local neighborhood problem solving!
        </p>
      </header>

      {/* Quest of the Day Card */}
      <section className="quest-banner">
        <div className="quest-left">
          <span className="quest-tag">🎯 Daily Civic Quest</span>
          <h3 className="quest-title">Neighborhood Watcher Challenge</h3>
          <p className="quest-desc">Verify 2 reported issues in your ward today to earn +50 Hero XP and unlock the "Watcher" badge!</p>
        </div>
        <div className="quest-reward">
          <FaStar className="star-icon" />
          <span>+50 Hero XP</span>
        </div>
      </section>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 20px', color: '#94a3b8' }}>
          <p style={{ fontSize: '1.2rem' }}>Loading Champion Leaderboard...</p>
        </div>
      ) : (
        <>
          {/* Top 3 Podium Section */}
          <section className="podium-section">
            {topThree[1] && (
              <div className="podium-card silver-podium">
                <div className="podium-rank-badge rank-2">2</div>
                <div className="podium-avatar">
                  {topThree[1].name ? topThree[1].name.charAt(0) : 'U'}
                </div>
                <h3 className="hero-name">{topThree[1].name}</h3>
                <span className="hero-level-chip">{topThree[1].title || 'Silver Guard'}</span>
                <div className="hero-points-count">
                  <FaStar className="point-star" /> {topThree[1].points} XP
                </div>
                <div className="hero-streak">
                  <FaFire className="fire-icon" /> {topThree[1].streakDays} Day Streak
                </div>
              </div>
            )}

            {topThree[0] && (
              <div className="podium-card gold-podium champion-card">
                <div className="champion-crown">
                  <FaCrown />
                </div>
                <div className="podium-rank-badge rank-1">1</div>
                <div className="podium-avatar gold-avatar">
                  {topThree[0].name ? topThree[0].name.charAt(0) : 'U'}
                </div>
                <h3 className="hero-name">{topThree[0].name}</h3>
                <span className="hero-level-chip gold-chip">{topThree[0].title || 'Grand Champion'}</span>
                <div className="hero-points-count gold-points">
                  <FaStar className="point-star" /> {topThree[0].points} XP
                </div>
                <div className="hero-streak">
                  <FaFire className="fire-icon" /> {topThree[0].streakDays} Day Streak
                </div>
              </div>
            )}

            {topThree[2] && (
              <div className="podium-card bronze-podium">
                <div className="podium-rank-badge rank-3">3</div>
                <div className="podium-avatar">
                  {topThree[2].name ? topThree[2].name.charAt(0) : 'U'}
                </div>
                <h3 className="hero-name">{topThree[2].name}</h3>
                <span className="hero-level-chip">{topThree[2].title || 'Bronze Guard'}</span>
                <div className="hero-points-count">
                  <FaStar className="point-star" /> {topThree[2].points} XP
                </div>
                <div className="hero-streak">
                  <FaFire className="fire-icon" /> {topThree[2].streakDays} Day Streak
                </div>
              </div>
            )}
          </section>

          {/* Full Leaderboard Table */}
          <section className="leaderboard-table-card">
            <h2 className="table-heading">Top Citizen Champions</h2>
            <div className="table-responsive">
              <table className="leaderboard-table">
                <thead>
                  <tr>
                    <th>Rank</th>
                    <th>Hero Name</th>
                    <th>Rank Title</th>
                    <th>Level</th>
                    <th>Reports</th>
                    <th>Verifications</th>
                    <th>Streak</th>
                    <th>Hero XP</th>
                  </tr>
                </thead>
                <tbody>
                  {heroes.map((hero, index) => (
                    <tr key={hero._id || index} className={index < 3 ? 'top-rank-row' : ''}>
                      <td className="rank-col">
                        {index === 0 ? '🥇 #1' : index === 1 ? '🥈 #2' : index === 2 ? '🥉 #3' : `#${index + 1}`}
                      </td>
                      <td className="name-col">
                        <div className="table-user-info">
                          <div className="table-avatar">{hero.name ? hero.name.charAt(0) : 'U'}</div>
                          <span className="user-name-text">{hero.name}</span>
                        </div>
                      </td>
                      <td className="title-col">
                        <span className="title-chip">{hero.title || 'Civic Sentinel'}</span>
                      </td>
                      <td className="level-col">Lvl {hero.level || Math.floor((hero.points || 150) / 150) + 1}</td>
                      <td className="count-col">{hero.reportsCount || 0}</td>
                      <td className="count-col">{hero.verificationsCount || 0}</td>
                      <td className="streak-col">🔥 {hero.streakDays || 1}d</td>
                      <td className="xp-col">⚡ {hero.points} XP</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </>
      )}
    </div>
  );
}
