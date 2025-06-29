import React, { useState, useEffect } from 'react';
import data from '../assets/json/data.json';
import './css/navbar.css';
// import { Link } from "react-router-dom";
import logo from '../assets/images/logos/logo.png';

function NavBar() {
   const [theme, setTheme] = useState('light');
   const [isMenuOpen, setIsMenuOpen] = useState(false);
   const [isScrolled, setIsScrolled] = useState(false);
   const pathname = window.location.pathname;
   const personal = data.personal;

   useEffect(() => {
      // On mount, set theme from localStorage or system preference
      const stored = localStorage.getItem('theme');
      if (stored === 'dark' || (!stored && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
         setTheme('dark');
         document.documentElement.classList.add('dark-mode');
      } else {
         setTheme('light');
         document.documentElement.classList.remove('dark-mode');
      }

      // Handle scroll effect
      const handleScroll = () => {
         setIsScrolled(window.scrollY > 20);
      };

      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
   }, []);

   // Close mobile menu when clicking outside
   useEffect(() => {
      const handleClickOutside = (event) => {
         if (isMenuOpen && !event.target.closest('.navbar')) {
            setIsMenuOpen(false);
         }
      };

      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
   }, [isMenuOpen]);

   // Close mobile menu on route change
   useEffect(() => {
      setIsMenuOpen(false);
   }, [pathname]);

   const toggleTheme = () => {
      if (theme === 'dark') {
         setTheme('light');
         document.documentElement.classList.remove('dark-mode');
         localStorage.setItem('theme', 'light');
      } else {
         setTheme('dark');
         document.documentElement.classList.add('dark-mode');
         localStorage.setItem('theme', 'dark');
      }
   };

   const toggleMobileMenu = (e) => {
      e.preventDefault();
      e.stopPropagation();
      setIsMenuOpen(!isMenuOpen);
   };

   const navItems = [
      { href: '/', label: 'Home' },
      { href: '/projects', label: 'Projects' },
      { href: '/articles', label: 'Articles' },
      { href: '/gospel', label: 'Gospel' },
      { href: '/resources', label: 'Resources' },
   ];

   // Helper for desktop nav highlighting
   function isActiveNav(itemHref) {
      return pathname === itemHref || pathname.startsWith(itemHref + '/');
   }

      return (
      <nav className={`navbar ${isScrolled ? 'scrolled' : ''} ${isMenuOpen ? 'menu-open' : ''}`}>
         <div className="main-menu">
            <div className="menu-branding">
               <a href="/" className="brand-link">
                  <img src={logo} alt={`${personal.name} Logo`} className="brand-logo" />
                  <h3 className="brand-text">{personal.name.toUpperCase()}</h3>
               </a>
            </div>

            {/* Desktop Navigation */}
            <ul className="menu-list desktop-only">
               {navItems.map((item) => (
                  <li key={item.href} className="nav-item">
                     <a 
                        href={item.href}
                        className={`nav-link ${isActiveNav(item.href) ? 'active' : ''}`}
                     >
                        {item.label}
                     </a>
                  </li>
               ))}
                  </ul>

            {/* Right Side Controls */}
            <div className="nav-controls">
               {/* Theme Toggle - Always Visible */}
               <button
                  onClick={toggleTheme}
                  className="theme-toggle"
                  aria-label="Toggle theme"
               >
                  {theme === 'dark' ? '☀️' : '🌙'}
               </button>

               {/* Mobile Menu Toggle */}
               <button
                  onClick={toggleMobileMenu}
                  className="mobile-menu-toggle mobile-only"
                  aria-label="Toggle menu"
                  aria-expanded={isMenuOpen}
                  type="button"
               >
                  <span className={`hamburger ${isMenuOpen ? 'open' : ''}`}>
                     <span className="hamburger-line"></span>
                     <span className="hamburger-line"></span>
                     <span className="hamburger-line"></span>
                  </span>
               </button>
            </div>
               </div>

         {/* Mobile Dropdown Menu */}
         <div className={`mobile-dropdown ${isMenuOpen ? 'open' : ''}`}>
            <ul className="mobile-menu-list">
               {navItems.map((item) => (
                  <li key={item.href} className="mobile-nav-item">
                     <a 
                        href={item.href}
                        className={`mobile-nav-link ${pathname === item.href ? 'active' : ''}`}
                        onClick={() => setIsMenuOpen(false)}
                     >
                        {item.label}
                     </a>
                  </li>
               ))}
            </ul>
         </div>

         {/* Mobile Menu Overlay */}
         {isMenuOpen && (
            <div className="mobile-menu-overlay" onClick={() => setIsMenuOpen(false)} />
         )}
      </nav>
   );
}

export default NavBar;