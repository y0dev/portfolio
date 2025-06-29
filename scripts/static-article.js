/**
 * Static Article Page JavaScript
 * 
 * This file provides all the interactive functionality for static article pages
 * including share functionality, mobile navigation, scroll effects, and animations.
 * 
 * @author Devontae Reid
 * @version 1.0
 */

(function() {
    'use strict';

    // DOM Ready
    document.addEventListener('DOMContentLoaded', function() {
        initializeArticlePage();
    });

    /**
     * Initialize all article page functionality
     */
    function initializeArticlePage() {
        initializeNavbar();
        initializeShareButtons();
        initializeScrollEffects();
        initializeAnimations();
        initializeCodeBlocks();
        initializeImages();
        initializeDarkMode();
        initializeReadingProgress();
        initializeFooter();
    }

    /**
     * Initialize navbar functionality
     */
    function initializeNavbar() {
        const navbar = document.querySelector('.navbar');
        const navbarToggle = document.querySelector('.navbar-toggle, .mobile-menu-toggle');
        const navbarMenu = document.querySelector('.navbar-menu, .mobile-dropdown');
        const themeToggle = document.querySelector('.theme-toggle');
        
        if (!navbar) return;

        // State management
        let isMenuOpen = false;
        let isScrolled = false;
        let currentTheme = 'light';

        // Initialize theme from localStorage or system preference
        const stored = localStorage.getItem('theme');
        if (stored === 'dark' || (!stored && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
            currentTheme = 'dark';
            document.documentElement.classList.add('dark-mode');
        } else {
            currentTheme = 'light';
            document.documentElement.classList.remove('dark-mode');
        }

        // Update theme toggle button
        if (themeToggle) {
            themeToggle.innerHTML = currentTheme === 'dark' ? '☀️' : '🌙';
        }

        // Navbar scroll effect
        const handleScroll = () => {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            const newIsScrolled = scrollTop > 20;
            
            if (newIsScrolled !== isScrolled) {
                isScrolled = newIsScrolled;
                navbar.classList.toggle('scrolled', isScrolled);
            }
        };

        window.addEventListener('scroll', handleScroll);
        handleScroll(); // Initial check

        // Theme toggle functionality
        if (themeToggle) {
            themeToggle.addEventListener('click', function() {
                const isCurrentlyDark = document.documentElement.classList.contains('dark-mode');
                
                if (isCurrentlyDark) {
                    // Switch to light mode
                    currentTheme = 'light';
                    document.documentElement.classList.remove('dark-mode');
                    localStorage.setItem('theme', 'light');
                    themeToggle.innerHTML = '🌙';
                } else {
                    // Switch to dark mode
                    currentTheme = 'dark';
                    document.documentElement.classList.add('dark-mode');
                    localStorage.setItem('theme', 'dark');
                    themeToggle.innerHTML = '☀️';
                }
            });
        }

        // Mobile menu toggle
        if (navbarToggle && navbarMenu) {
            navbarToggle.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                isMenuOpen = !isMenuOpen;
                
                navbarMenu.classList.toggle('open', isMenuOpen);
                navbar.classList.toggle('menu-open', isMenuOpen);
                
                // Update hamburger animation
                const hamburger = navbarToggle.querySelector('.hamburger');
                if (hamburger) {
                    hamburger.classList.toggle('open', isMenuOpen);
                }
                
                // Update aria-expanded
                navbarToggle.setAttribute('aria-expanded', isMenuOpen);
            });

            // Close menu when clicking outside
            document.addEventListener('click', function(e) {
                if (isMenuOpen && !navbar.contains(e.target)) {
                    isMenuOpen = false;
                    navbarMenu.classList.remove('open');
                    navbar.classList.remove('menu-open');
                    
                    const hamburger = navbarToggle.querySelector('.hamburger');
                    if (hamburger) {
                        hamburger.classList.remove('open');
                    }
                    
                    navbarToggle.setAttribute('aria-expanded', 'false');
                }
            });

            // Close menu when clicking on mobile nav links
            const mobileNavLinks = navbarMenu.querySelectorAll('.mobile-nav-link');
            mobileNavLinks.forEach(link => {
                link.addEventListener('click', function() {
                    isMenuOpen = false;
                    navbarMenu.classList.remove('open');
                    navbar.classList.remove('menu-open');
                    
                    const hamburger = navbarToggle.querySelector('.hamburger');
                    if (hamburger) {
                        hamburger.classList.remove('open');
                    }
                    
                    navbarToggle.setAttribute('aria-expanded', 'false');
                });
            });
        }

        // Active link highlighting
        const currentPath = window.location.pathname;
        const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');
        
        navLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href === currentPath || (href !== '/' && currentPath.startsWith(href))) {
                link.classList.add('active');
            }
        });

        // Add mobile menu overlay if it doesn't exist
        if (!document.querySelector('.mobile-menu-overlay')) {
            const overlay = document.createElement('div');
            overlay.className = 'mobile-menu-overlay';
            overlay.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.5);
                z-index: 998;
                opacity: 0;
                visibility: hidden;
                transition: all 0.3s ease;
            `;
            
            overlay.addEventListener('click', function() {
                isMenuOpen = false;
                navbarMenu.classList.remove('open');
                navbar.classList.remove('menu-open');
                
                const hamburger = navbarToggle.querySelector('.hamburger');
                if (hamburger) {
                    hamburger.classList.remove('open');
                }
                
                navbarToggle.setAttribute('aria-expanded', 'false');
            });
            
            document.body.appendChild(overlay);
        }

        // Update overlay visibility when menu opens/closes
        const overlay = document.querySelector('.mobile-menu-overlay');
        if (overlay) {
            const updateOverlay = () => {
                if (isMenuOpen) {
                    overlay.style.opacity = '1';
                    overlay.style.visibility = 'visible';
                } else {
                    overlay.style.opacity = '0';
                    overlay.style.visibility = 'hidden';
                }
            };
            
            // Initial state
            updateOverlay();
            
            // Watch for class changes
            const observer = new MutationObserver(updateOverlay);
            observer.observe(navbar, { attributes: true, attributeFilter: ['class'] });
        }
    }

    /**
     * Initialize share functionality
     */
    function initializeShareButtons() {
        const shareButtons = document.querySelectorAll('.post-header-shareButton, .post-footer-share');
        
        shareButtons.forEach(button => {
            button.addEventListener('click', function() {
                shareArticle();
            });
        });
    }

    /**
     * Share article functionality
     */
    function shareArticle() {
        const title = document.title;
        const url = window.location.href;
        const text = document.querySelector('#post-header-title')?.textContent || 'Check out this article';

        // Try native sharing first
        if (navigator.share) {
            navigator.share({
                title: title,
                text: text,
                url: url
            }).catch(console.error);
        } else {
            // Fallback to clipboard
            copyToClipboard(url);
            showShareFeedback();
        }
    }

    /**
     * Copy text to clipboard
     */
    function copyToClipboard(text) {
        if (navigator.clipboard) {
            navigator.clipboard.writeText(text).then(() => {
                showShareFeedback();
            }).catch(err => {
                console.error('Failed to copy: ', err);
                fallbackCopyToClipboard(text);
            });
        } else {
            fallbackCopyToClipboard(text);
        }
    }

    /**
     * Fallback copy method for older browsers
     */
    function fallbackCopyToClipboard(text) {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        
        try {
            document.execCommand('copy');
            showShareFeedback();
        } catch (err) {
            console.error('Fallback copy failed: ', err);
        }
        
        document.body.removeChild(textArea);
    }

    /**
     * Show share feedback
     */
    function showShareFeedback() {
        const shareButtons = document.querySelectorAll('.post-header-shareButton, .post-footer-share');
        
        shareButtons.forEach(button => {
            const originalText = button.innerHTML;
            button.innerHTML = '<span class="post-header-shareButton-icon">✓</span> Copied!';
            button.style.background = '#10b981';
            button.style.color = 'white';
            
            setTimeout(() => {
                button.innerHTML = originalText;
                button.style.background = '';
                button.style.color = '';
            }, 2000);
        });
    }

    /**
     * Initialize scroll effects
     */
    function initializeScrollEffects() {
        const articleNavigation = document.querySelector('.article-navigation');
        const latestArticlesSidebar = document.querySelector('.latest-articles-sidebar');
        
        if (articleNavigation) {
            // Sticky navigation with offset
            const navbarHeight = document.querySelector('.navbar')?.offsetHeight || 0;
            const observer = new IntersectionObserver(
                ([entry]) => {
                    if (entry.isIntersecting) {
                        articleNavigation.style.top = navbarHeight + 'px';
                    }
                },
                { threshold: 0 }
            );
            
            const sentinel = document.createElement('div');
            sentinel.style.height = '1px';
            sentinel.style.position = 'absolute';
            sentinel.style.top = '0';
            document.body.insertBefore(sentinel, articleNavigation);
            observer.observe(sentinel);
        }

        // Parallax effect for hero image
        const heroImage = document.querySelector('.post-hero-image');
        if (heroImage) {
            window.addEventListener('scroll', function() {
                const scrolled = window.pageYOffset;
                const rate = scrolled * -0.5;
                heroImage.style.transform = `translateY(${rate}px)`;
            });
        }
    }

    /**
     * Initialize animations
     */
    function initializeAnimations() {
        // Intersection Observer for fade-in animations
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
        const elementsToAnimate = document.querySelectorAll(
            '.post-hero, .post-content, .latest-article-card, .post-footer'
        );
        
        elementsToAnimate.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(20px)';
            el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(el);
        });

        // Add animation classes
        document.addEventListener('animationend', function(e) {
            if (e.target.classList.contains('animate-in')) {
                e.target.style.opacity = '1';
                e.target.style.transform = 'translateY(0)';
            }
        });
    }

    /**
     * Initialize code block functionality
     */
    function initializeCodeBlocks() {
        const codeBlocks = document.querySelectorAll('pre code');
        
        codeBlocks.forEach(block => {
            // Add copy button
            const copyButton = document.createElement('button');
            copyButton.className = 'code-copy-btn';
            copyButton.innerHTML = 'Copy';
            copyButton.style.cssText = `
                position: absolute;
                top: 8px;
                right: 8px;
                background: rgba(255, 255, 255, 0.1);
                color: #f9fafb;
                border: none;
                border-radius: 4px;
                padding: 4px 8px;
                font-size: 12px;
                cursor: pointer;
                transition: all 0.2s ease;
            `;
            
            copyButton.addEventListener('click', function() {
                copyToClipboard(block.textContent);
                copyButton.innerHTML = 'Copied!';
                copyButton.style.background = '#10b981';
                
                setTimeout(() => {
                    copyButton.innerHTML = 'Copy';
                    copyButton.style.background = 'rgba(255, 255, 255, 0.1)';
                }, 2000);
            });
            
            // Make pre container relative for absolute positioning
            const pre = block.closest('pre');
            if (pre) {
                pre.style.position = 'relative';
                pre.appendChild(copyButton);
            }
        });
    }

    /**
     * Initialize image functionality
     */
    function initializeImages() {
        const images = document.querySelectorAll('.post-content img');
        
        images.forEach(img => {
            // Lazy loading
            img.loading = 'lazy';
            
            // Click to enlarge
            img.style.cursor = 'pointer';
            img.addEventListener('click', function() {
                openImageModal(img.src, img.alt);
            });
            
            // Add loading animation
            img.addEventListener('load', function() {
                img.style.opacity = '1';
            });
            
            img.style.opacity = '0';
            img.style.transition = 'opacity 0.3s ease';
        });
    }

    /**
     * Open image modal
     */
    function openImageModal(src, alt) {
        const modal = document.createElement('div');
        modal.className = 'image-modal';
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.9);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
            cursor: pointer;
        `;
        
        const img = document.createElement('img');
        img.src = src;
        img.alt = alt;
        img.style.cssText = `
            max-width: 90%;
            max-height: 90%;
            object-fit: contain;
            border-radius: 8px;
        `;
        
        modal.appendChild(img);
        document.body.appendChild(modal);
        
        modal.addEventListener('click', function() {
            document.body.removeChild(modal);
        });
        
        // Close on escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                document.body.removeChild(modal);
            }
        });
    }

    /**
     * Initialize dark mode
     */
    function initializeDarkMode() {
        // Check for saved theme preference or default to system preference
        const savedTheme = localStorage.getItem('theme');
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        
        if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
            document.documentElement.classList.add('dark-mode');
        }
        
        // Add theme toggle functionality if needed
        const themeToggle = document.querySelector('.theme-toggle');
        if (themeToggle) {
            // Update initial button state
            const isDark = document.documentElement.classList.contains('dark-mode');
            themeToggle.innerHTML = isDark ? '☀️' : '🌙';
            
            themeToggle.addEventListener('click', function() {
                const isCurrentlyDark = document.documentElement.classList.contains('dark-mode');
                
                if (isCurrentlyDark) {
                    // Switch to light mode
                    document.documentElement.classList.remove('dark-mode');
                    localStorage.setItem('theme', 'light');
                    themeToggle.innerHTML = '🌙';
                } else {
                    // Switch to dark mode
                    document.documentElement.classList.add('dark-mode');
                    localStorage.setItem('theme', 'dark');
                    themeToggle.innerHTML = '☀️';
                }
            });
        }
    }

    /**
     * Initialize reading progress
     */
    function initializeReadingProgress() {
        const progressBar = document.createElement('div');
        progressBar.className = 'reading-progress';
        progressBar.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 0%;
            height: 3px;
            background: linear-gradient(90deg, #3b82f6, #8b5cf6);
            z-index: 10001;
            transition: width 0.1s ease;
        `;
        
        document.body.appendChild(progressBar);
        
        window.addEventListener('scroll', function() {
            const scrollTop = window.pageYOffset;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const scrollPercent = (scrollTop / docHeight) * 100;
            
            progressBar.style.width = scrollPercent + '%';
        });
    }

    /**
     * Initialize footer functionality
     */
    function initializeFooter() {
        initializeFooterSocialLinks();
        initializeFooterLinks();
        initializeFooterContact();
        initializeFooterBottom();
        initializeFooterAnimations();
    }

    /**
     * Initialize footer social links
     */
    function initializeFooterSocialLinks() {
        const socialLinks = document.querySelectorAll('.social-link');
        
        socialLinks.forEach(link => {
            // Add hover effects
            link.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-2px) scale(1.05)';
            });
            
            link.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0) scale(1)';
            });
            
            // Add click tracking (optional)
            link.addEventListener('click', function() {
                const platform = this.getAttribute('aria-label') || 'social';
                trackSocialClick(platform);
            });
        });
    }

    /**
     * Initialize footer navigation links
     */
    function initializeFooterLinks() {
        const footerLinks = document.querySelectorAll('.footer-link');
        
        footerLinks.forEach(link => {
            // Add hover animations
            link.addEventListener('mouseenter', function() {
                this.style.transition = 'all 0.2s ease';
            });
            
            // Add active state for current page
            const currentPath = window.location.pathname;
            const href = link.getAttribute('href');
            if (href === currentPath || (href !== '/' && currentPath.startsWith(href))) {
                link.classList.add('active');
            }
        });
    }

    /**
     * Initialize footer contact information
     */
    function initializeFooterContact() {
        const contactLinks = document.querySelectorAll('.contact-link');
        
        contactLinks.forEach(link => {
            // Handle email links
            if (link.href && link.href.startsWith('mailto:')) {
                link.addEventListener('click', function(e) {
                    const email = this.href.replace('mailto:', '');
                    trackContactClick('email', email);
                });
            }
            
            // Add copy functionality for contact info
            link.addEventListener('click', function(e) {
                if (!this.href || !this.href.startsWith('mailto:')) {
                    e.preventDefault();
                    const text = this.textContent.trim();
                    copyToClipboard(text);
                    showContactCopyFeedback(this);
                }
            });
        });
    }

    /**
     * Initialize footer bottom section
     */
    function initializeFooterBottom() {
        const footerBottomLinks = document.querySelectorAll('.footer-bottom-link');
        
        footerBottomLinks.forEach(link => {
            // Add hover effects
            link.addEventListener('mouseenter', function() {
                this.style.color = 'var(--color-text-inverse)';
            });
            
            link.addEventListener('mouseleave', function() {
                this.style.color = 'var(--color-text-light)';
            });
        });
        
        // Update copyright year dynamically
        const copyrightElement = document.querySelector('.copyright');
        if (copyrightElement) {
            const currentYear = new Date().getFullYear();
            const copyrightText = copyrightElement.textContent;
            if (copyrightText.includes('©')) {
                copyrightElement.textContent = copyrightText.replace(
                    /©\s*\d{4}/,
                    `© ${currentYear}`
                );
            }
        }
    }

    /**
     * Initialize footer animations
     */
    function initializeFooterAnimations() {
        const footer = document.querySelector('.footer');
        if (!footer) return;
        
        // Intersection Observer for footer animations
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('footer-visible');
                    
                    // Animate footer sections
                    const sections = entry.target.querySelectorAll('.footer-section');
                    sections.forEach((section, index) => {
                        setTimeout(() => {
                            section.classList.add('animate-in');
                        }, index * 100);
                    });
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });
        
        observer.observe(footer);
        
        // Add CSS for animations
        const style = document.createElement('style');
        style.textContent = `
            .footer-section {
                opacity: 0;
                transform: translateY(20px);
                transition: opacity 0.6s ease, transform 0.6s ease;
            }
            
            .footer-section.animate-in {
                opacity: 1;
                transform: translateY(0);
            }
            
            .footer-visible {
                animation: footerFadeIn 0.8s ease-out;
            }
            
            @keyframes footerFadeIn {
                from {
                    opacity: 0;
                    transform: translateY(30px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
        `;
        document.head.appendChild(style);
    }

    /**
     * Track social media clicks
     */
    function trackSocialClick(platform) {
        // Analytics tracking (if available)
        if (typeof gtag !== 'undefined') {
            gtag('event', 'click', {
                'event_category': 'social',
                'event_label': platform
            });
        }
        
        // Console log for debugging
        console.log(`Social link clicked: ${platform}`);
    }

    /**
     * Track contact clicks
     */
    function trackContactClick(type, value) {
        // Analytics tracking (if available)
        if (typeof gtag !== 'undefined') {
            gtag('event', 'click', {
                'event_category': 'contact',
                'event_label': type
            });
        }
        
        // Console log for debugging
        console.log(`Contact ${type} clicked: ${value}`);
    }

    /**
     * Show contact copy feedback
     */
    function showContactCopyFeedback(element) {
        const originalText = element.textContent;
        element.textContent = 'Copied!';
        element.style.color = 'var(--color-text-success)';
        
        setTimeout(() => {
            element.textContent = originalText;
            element.style.color = '';
        }, 2000);
    }

    /**
     * Utility function to debounce events
     */
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    /**
     * Utility function to throttle events
     */
    function throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    // Expose functions globally for debugging
    window.ArticlePage = {
        shareArticle,
        copyToClipboard,
        openImageModal
    };

})(); 