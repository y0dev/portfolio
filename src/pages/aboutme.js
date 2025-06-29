import React, { useEffect, useRef, useState } from 'react';
import data from '../assets/json/data.json';
import headshot from '../assets/images/headshot.jpeg';
import './css/aboutme.css';
import TimelineSection from '../sections/experience';
import GospelTeaserSection from '../sections/gospel_teaser';
import FavoritesSection from '../sections/FavoritesSection';
// import TestimonialSection from '../sections/testimonials';

function AboutMePage() {
  const [currentText, setCurrentText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showCursor, setShowCursor] = useState(true);
  const sceneRef = useRef(null);
  const imageRef = useRef(null);
  const personal = data.personal;

  const texts = [
    "I'm a Software Engineer.",
    "I'm a Servant of Christ.",
    "I'm a Father.",
    "I'm a Creator."
  ];

  useEffect(() => {
    const typeSpeed = isDeleting ? 50 : 100;
    const deleteSpeed = 50;
    const pauseTime = 2000;

    const typeText = () => {
      const currentFullText = texts[currentIndex];
      
      if (isDeleting) {
        setCurrentText(currentFullText.substring(0, currentText.length - 1));
        if (currentText === '') {
          setIsDeleting(false);
          setCurrentIndex((prevIndex) => (prevIndex + 1) % texts.length);
        }
      } else {
        setCurrentText(currentFullText.substring(0, currentText.length + 1));
        if (currentText === currentFullText) {
          setTimeout(() => setIsDeleting(true), pauseTime);
        }
      }
    };

    const timer = setTimeout(typeText, isDeleting ? deleteSpeed : typeSpeed);
    return () => clearTimeout(timer);
  }, [currentText, isDeleting, currentIndex, texts]);

  useEffect(() => {
    const cursorTimer = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 500);

    return () => clearInterval(cursorTimer);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (sceneRef.current && imageRef.current) {
        const rect = sceneRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        
        const depth = 0.5;
        const moveX = x * depth;
        const moveY = y * depth;
        
        imageRef.current.style.transform = `translate3d(${moveX}px, ${moveY}px, 0px)`;
      }
    };

    const scene = sceneRef.current;
    if (scene) {
      scene.addEventListener('mousemove', handleMouseMove);
      return () => scene.removeEventListener('mousemove', handleMouseMove);
    }
  }, []);

  const handleScrollDown = (e) => {
    e.preventDefault();
    const aboutSection = document.getElementById('about');
    if (aboutSection) {
      aboutSection.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  return (
    <div className="aboutme-landing">
      {/* Modern Hero Section with Typing Animation */}
      <section className="modern-hero-section">
        <div className="hero-container">
          <div className="hero-content">
            <div className="text-center">
              <div className="typed-strings" style={{ display: 'none' }}>
                <p>I'm a Software Engineer.</p>
                <p>I'm a Web Developer.</p>
                <p>I'm a Problem Solver.</p>
                <p>I'm a Creator.</p>
              </div>
              <p className="hero-greeting">
                Hello, <span className="typed-text">{currentText}</span>
                <span className={`typed-cursor ${showCursor ? 'visible' : ''}`}>|</span>
              </p>
              {/* Parallax Mouse Move */}
              <div 
                ref={sceneRef}
                className="parallax-scene"
                data-relative-input="true"
              >
                <div 
                  ref={imageRef}
                  data-depth="0.5"
                  className="parallax-image"
                >
                  <img 
                    className="hero-profile-image" 
                    src={headshot} 
                    alt={personal.name} 
                  />
                </div>
              </div>
              {/* Parallax Mouse Move End */}
              <div className="hero-name-container">
                <h1 className="hero-name">
                  {personal.name.split(' ').map((name, index) => (
                    <React.Fragment key={index}>
                      {name}
                      {index < personal.name.split(' ').length - 1 && <br />}
                    </React.Fragment>
                  ))}
                </h1>
              </div>
              <p className="hero-location">based in {personal.location}.</p>
            </div>
          </div>
        </div>
        <a href="#about" className="scroll-down-arrow" onClick={handleScrollDown}>
          <span className="animated">
            <i className="scroll-icon"></i>
          </span>
        </a>
      </section>

      {/* About Section */}
      <section id="about" className="aboutme-about-section">
        <div className="aboutme-about-grid">
          <div className="about-content">
            <h2 className="aboutme-section-title">About Me</h2>
            <p className="aboutme-section-desc">
              {personal.bio}
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
              {personal.skills.slice(0, 4).map((skill, index) => (
                <span key={index} className={`skill-tag skill-${['blue', 'green', 'purple', 'yellow'][index % 4]}`}>
                  {skill}
                </span>
              ))}
            </div>
          </div>
          <div className="about-image">
            <div className="aboutme-image-card">
              <div className="floating-emoji">👨🏾‍💻</div>
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
              <a href={`mailto:${personal.email}`} className="featured-card-link">Send Email →</a>
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