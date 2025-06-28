import React, { useEffect, useRef } from 'react';
import sportsData from '../assets/json/sports_favorites.json';
import './css/favorites_section.css';

// Helper function to render team achievements
export const renderTeamAchievements = (type, value) => {
  switch (type) {
    case "trophies":
      return value ? "🏆".repeat(Math.min(value, 10)) : "🏆 x0";
    case "rings":
      return value ? "💍".repeat(Math.min(value, 10)) : "💍 x0";
    case "established":
      return `Established in ${value}`;
    default:
      return "";
  }
};

function FavoriteTeam({ name, logo, link, achievements }) {
  return (
    <a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      className="favorite-team-card"
    >
      {/* Hover overlay */}
      <div className="team-hover-overlay" />
      
      <div className="team-card-content">
        {/* Logo with glow effect */}
        <div className="team-logo-container">
          <div className="team-logo-glow" />
          <div className="team-logo-wrapper">
            <img 
              src={logo} 
              alt={`${name} Logo`} 
              className="team-logo"
            />
          </div>
        </div>
        
        <h4 className="team-name">
          {name}
        </h4>
        
        {/* Achievements with animation */}
        <div className="team-achievements">
          {renderTeamAchievements("trophies", achievements.trophies || 0)}
        </div>
        
        {/* Stats preview */}
        <div className="team-stats">
          {Object.entries(achievements.achievements).slice(0, 2).map(([key, val], i) => (
            <div key={i} className="team-stat-item">
              <span className="stat-label">{key}:</span>
              <span className="stat-value">{val}</span>
            </div>
          ))}
        </div>
        
        {/* Visit link indicator */}
        <div className="team-visit-link">
          <span>Visit Team</span>
          <svg className="visit-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </div>
      </div>
    </a>
  );
}

function FavoritePlayer({ name, image, achievements }) {
  return (
    <div className="favorite-player-card">
      {/* Hover overlay */}
      <div className="player-hover-overlay" />
      
      <div className="player-card-content">
        {/* Player image and name */}
        <div className="player-header">
          <div className="player-image-container">
            <div className="player-image-glow" />
            <div className="player-image-wrapper">
              <img 
                src={image} 
                alt={name} 
                className="player-image"
              />
            </div>
          </div>
          <h3 className="player-name">
            {name}
          </h3>
        </div>
        
        {/* Rings with animation */}
        <div className="player-rings">
          {renderTeamAchievements("rings", achievements.rings || 0)}
        </div>
        
        {/* Stats preview */}
        <div className="player-stats">
          {Object.entries(achievements.achievements).slice(0, 3).map(([key, val], i) => (
            <div key={i} className="player-stat-item">
              <span className="stat-label">{key}:</span>
              <span className="stat-value">{val}</span>
            </div>
          ))}
        </div>
        
        {/* Player status indicator */}
        <div className="player-status">
          <div className="status-indicator">
            <div className="status-dot"></div>
            <span>Active Player</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function FavoritesSection() {
  const sectionRef = useRef(null);
  const teamsRef = useRef(null);
  const playersRef = useRef(null);

  useEffect(() => {
    // Simple scroll animations using CSS classes
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
        }
      });
    }, observerOptions);

    // Observe elements for animation
    const elementsToAnimate = document.querySelectorAll('.sports-title, .team-card, .player-card');
    elementsToAnimate.forEach(el => observer.observe(el));

    return () => {
      elementsToAnimate.forEach(el => observer.unobserve(el));
    };
  }, []);

  return (
    <section ref={sectionRef} className="favorites-section">
      {/* Background decoration */}
      <div className="section-background">
        <div className="bg-decoration bg-decoration-1"></div>
        <div className="bg-decoration bg-decoration-2"></div>
        <div className="bg-decoration bg-decoration-3"></div>
      </div>
      
      <div className="section-container">
        {/* Section Header */}
        <div className="section-header">
          <h2 className="sports-title">
            My Favorite Sports
          </h2>
          <p className="section-description">
            A celebration of the teams I passionately support and the athletes who inspire me with their 
            <span className="highlight highlight-excellence"> excellence</span>, 
            <span className="highlight highlight-dedication"> dedication</span>, and 
            <span className="highlight highlight-achievements"> unforgettable achievements</span>.
          </p>
        </div>

        {/* Teams Section */}
        <div ref={teamsRef} className="teams-section">
          <div className="section-subheader">
            <div className="subheader-content">
              <div className="subheader-icon">🏈</div>
              <h3 className="subheader-title">My Teams</h3>
              <div className="subheader-icon">⚾</div>
            </div>
          </div>
          <div className="teams-grid">
            {sportsData.teams.map((team) => (
              <div key={team.name} className="team-card">
                <FavoriteTeam {...team} />
              </div>
            ))}
          </div>
        </div>

        {/* Players Section */}
        <div ref={playersRef} className="players-section">
          <div className="section-subheader">
            <div className="subheader-content">
              <div className="subheader-icon">🏀</div>
              <h3 className="subheader-title">My Players</h3>
              <div className="subheader-icon">⭐</div>
            </div>
          </div>
          <div className="players-grid">
            {sportsData.players.map((player) => (
              <div key={player.name} className="player-card">
                <FavoritePlayer {...player} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
