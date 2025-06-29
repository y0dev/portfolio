import React from 'react';
import '../pages/css/gospel.css';

function GospelTeaserSection() {
  return (
    <section className="gospel-teaser-modern">
      {/* Background decorations */}
      <div className="gospel-bg-decor">
        <div className="gospel-bg-circle bg-circle-1"></div>
        <div className="gospel-bg-circle bg-circle-2"></div>
        <div className="gospel-bg-circle bg-circle-3"></div>
        <div className="gospel-bg-circle bg-circle-4"></div>
      </div>

      {/* Animated background elements */}
      <div className="gospel-bg-anim">
        <div className="gospel-ping ping-1"></div>
        <div className="gospel-ping ping-2"></div>
        <div className="gospel-ping ping-3"></div>
      </div>

      <div className="gospel-teaser-container">
        <div className="gospel-teaser-content">
          <h2 className="gospel-title">
            The Most Important Question
            <span className="gospel-title-sub">
              You'll Ever Consider
            </span>
          </h2>

          <div className="gospel-cards">
            <div className="gospel-text">
              <div className="gospel-teaser-card gospel-card-1">
                <div className="gospel-card-header">
                  <span className="floating-emoji">🌿</span>
                  <h3 className="gospel-card-title">
                    Life's Ultimate Question
                  </h3>
                </div>
                <p className="gospel-card-desc">
                  If you were to die today, do you know for sure that you would go to heaven?
                </p>
              </div>
            </div>

            <div className="gospel-text">
              <div className="gospel-teaser-card gospel-card-2">
                <div className="gospel-card-header">
                  <span className="floating-emoji">📖</span>
                  <h3 className="gospel-card-title">
                    The Divine Inquiry
                  </h3>
                </div>
                <p className="gospel-card-desc">
                  Suppose you were to stand before God and He asked, "Why should I let you into My heaven?" — What would you say?
                </p>
              </div>
            </div>
          </div>

          <div className="gospel-text">
            <div className="gospel-highlight">
              <p className="gospel-highlight-text">
                These aren't easy questions. But they are life-changing. The Bible offers a clear answer, and it's not about being "good enough."
              </p>
            </div>
          </div>

          <div className="gospel-button">
            <a
              href="/gospel"
              className="gospel-discover-btn"
            >
              <span className="btn-text">Discover the Answer</span>
              <svg className="btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </a>
          </div>

          <div className="gospel-text">
            <div className="gospel-status">
              <div className="status-dot"></div>
              <p className="status-text">
                The good news of the Gospel is a gift — not something we earn.
              </p>
              <div className="status-dot status-dot-delay"></div>
            </div>
          </div>

          {/* Decorative borders */}
          <div className="gospel-border-circle border-circle-1"></div>
          <div className="gospel-border-circle border-circle-2"></div>
          <div className="gospel-border-circle border-circle-3"></div>
          <div className="gospel-border-circle border-circle-4"></div>
        </div>
      </div>
    </section>
  );
}

export default GospelTeaserSection; 