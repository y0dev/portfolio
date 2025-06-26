import React from 'react';
import './css/aboutme.css';
import AboutMeSection from '../sections/about_me';
import TimelineSection from '../sections/experience';
import GospelTeaserSection from '../sections/gospel_teaser';
import Footer from '../components/footer';
import headshot from '../assets/images/headshot.jpeg';
// import TestimonialSection from '../sections/testimonials';

// Placeholder for FavoritesSection
function FavoritesSection() {
  return null;
}

function AboutMePage() {
  return (
    <div className="aboutme-landing">
      {/* Hero Section */}
      <section className="aboutme-hero-section">
        <div className="aboutme-hero-content">
          <img src={headshot} alt="Devontae Reid headshot" className="aboutme-hero-photo" />
          <h1 className="hero-title">
            Devontae Reid
            <span className="hero-subtitle">Software Engineer</span>
          </h1>
          <p className="aboutme-hero-desc">Full-stack developer with a passion for building innovative applications and exploring new technologies.</p>
          <div className="hero-buttons">
            <a
              href="/projects"
              className="btn-primary"
            >
              View My Work
            </a>
            <a
              href="/assets/Devontae+Reid+Resume.pdf"
              download
              className="btn-secondary"
            >
              <svg className="btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Download Resume
            </a>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="aboutme-about-section">
        <div className="aboutme-about-grid">
          <div className="about-content">
            <h2 className="aboutme-section-title">About Me</h2>
            <p className="aboutme-section-desc">
              I am a Software Engineer currently working in embedded systems. I started in iOS development and eventually grew to enjoy web development—both front-end and back-end. Who would have known that user interfaces would be a love/hate relationship? There's a constant battle between finding inspiration and enjoying the final product.
            </p>
            <p className="aboutme-section-desc">
              While trying to discover inspiration for web design, I often spend my time building RESTful APIs. I'm proficient in HTML, CSS, JavaScript, C/C++, and Python, and I work primarily in ReactJS and VueJS.
            </p>
            <p className="aboutme-section-desc">
              In my free time, I enjoy building interesting projects and experimenting with new technologies. Lately, I've been working on various Node.js APIs that integrate with browser extensions.
            </p>
            <p className="aboutme-section-desc">
              When I'm not programming, you'll find me reading my Bible or spending time with family. The Bible has given me so much wisdom in life and has taught me deeply about the grace of God. My personal library has grown to over 100 books. Some of my favorite study resources include:
            </p>
            <div className="aboutme-resource-links">
              <a href="https://www.desiringgod.org" target="_blank" rel="noopener noreferrer" className="resource-link resource-link-blue">
                <span className="resource-link-icon">📘</span> Desiring God
              </a>
              <a href="https://www.gty.org" target="_blank" rel="noopener noreferrer" className="resource-link resource-link-green">
                <span className="resource-link-icon">📗</span> Grace To You
              </a>
              <a href="https://www.truthforlife.org" target="_blank" rel="noopener noreferrer" className="resource-link resource-link-purple">
                <span className="resource-link-icon">📙</span> Truth For Life
              </a>
            </div>
            <div className="aboutme-skills">
              <span className="skill-tag skill-blue">React</span>
              <span className="skill-tag skill-green">Node.js</span>
              <span className="skill-tag skill-purple">TypeScript</span>
              <span className="skill-tag skill-yellow">Python</span>
            </div>
          </div>
          <div className="about-image">
            <div className="aboutme-image-card">
              <div className="floating-emoji">👨‍💻</div>
              <p className="aboutme-image-caption">Developer & Creator</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Section */}
      <section className="aboutme-featured-section">
        <h2 className="aboutme-section-title">Featured Work</h2>
        <div className="aboutme-featured-grid">
          {/* Featured Project */}
          <div className="featured-card">
            <div className="featured-card-img featured-card-img-1">
              <div className="featured-card-img-content">
                <div className="featured-card-icon">🚀</div>
                <p className="featured-card-img-text">Project Preview</p>
              </div>
            </div>
            <div className="featured-card-content">
              <h3 className="featured-card-title">Featured Project</h3>
              <p className="featured-card-desc">A showcase of my latest work and technical achievements.</p>
              <a href="/projects" className="featured-card-link">View Project →</a>
            </div>
          </div>
          {/* Featured Article */}
          <div className="featured-card">
            <div className="featured-card-img featured-card-img-2">
              <div className="featured-card-img-content">
                <div className="featured-card-icon">📝</div>
                <p className="featured-card-img-text">Article Preview</p>
              </div>
            </div>
            <div className="featured-card-content">
              <h3 className="featured-card-title">Latest Article</h3>
              <p className="featured-card-desc">Insights and thoughts on modern web development.</p>
              <a href="/articles" className="featured-card-link">Read Article →</a>
            </div>
          </div>
          {/* Contact */}
          <div className="featured-card">
            <div className="featured-card-img featured-card-img-3">
              <div className="featured-card-img-content">
                <div className="featured-card-icon">💬</div>
                <p className="featured-card-img-text">Let's Connect</p>
              </div>
            </div>
            <div className="featured-card-content">
              <h3 className="featured-card-title">Get In Touch</h3>
              <p className="featured-card-desc">Interested in working together? Let's discuss your project.</p>
              <a href="mailto:devontae.reid@gmail.com" className="featured-card-link">Send Email →</a>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <TimelineSection />
      {/* Gospel Teaser Section */}
      <GospelTeaserSection />
      {/* Favorites Section */}
      <FavoritesSection />
    </div>
  );
}

export default AboutMePage;