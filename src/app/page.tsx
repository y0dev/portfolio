"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import GospelTeaser from "@/components/GospelTeaser";
import TimelineSection from "@/components/TimelineSection";
// import TestimoniesSection from "@/components/TestimoniesSection";
import Footer from "@/components/Footer";
import FavoritesSection from "@/components/FavoritesSection";

// Register ScrollTrigger plugin
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function Home() {
  const heroRef = useRef<HTMLDivElement>(null);
  const aboutRef = useRef<HTMLDivElement>(null);
  const featuredRef = useRef<HTMLDivElement>(null);
  // const testimonialRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Hero section animations
    const heroTl = gsap.timeline();
    
    heroTl
      .fromTo(".hero-title", 
        { y: 100, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, ease: "power3.out" }
      )
      .fromTo(".hero-subtitle", 
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" }, "-=0.5"
      )
      .fromTo(".hero-buttons", 
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: "power3.out" }, "-=0.3"
      );

    // About section animations
    gsap.fromTo(".about-content",
      { x: -100, opacity: 0 },
      {
        x: 0,
        opacity: 1,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: aboutRef.current,
          start: "top 80%",
          end: "bottom 20%",
          toggleActions: "play none none reverse"
        }
      }
    );

    gsap.fromTo(".about-image",
      { x: 100, opacity: 0 },
      {
        x: 0,
        opacity: 1,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: aboutRef.current,
          start: "top 80%",
          end: "bottom 20%",
          toggleActions: "play none none reverse"
        }
      }
    );

    // Skills animation
    gsap.fromTo(".skill-tag",
      { scale: 0, opacity: 0 },
      {
        scale: 1,
        opacity: 1,
        duration: 0.5,
        stagger: 0.1,
        ease: "back.out(1.7)",
        scrollTrigger: {
          trigger: aboutRef.current,
          start: "top 70%",
          end: "bottom 20%",
          toggleActions: "play none none reverse"
        }
      }
    );

    // Floating animation for emoji
    gsap.to(".floating-emoji", {
      y: -10,
      duration: 2,
      ease: "power2.inOut",
      yoyo: true,
      repeat: -1,
      scrollTrigger: {
        trigger: aboutRef.current,
        start: "top 80%",
        end: "bottom 20%",
        toggleActions: "play none none reverse"
      }
    });

    // Featured section animations
    gsap.fromTo(".featured-card",
      { y: 100, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        stagger: 0.2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: featuredRef.current,
          start: "top 80%",
          end: "bottom 20%",
          toggleActions: "play none none reverse"
        }
      }
    );

    // Timeline animation - use timeline section as trigger
    // Only animate y position, keep opacity at 1 (items visible by default)
    const timelineSection = document.getElementById("timeline-section");
    if (timelineSection) {
      gsap.fromTo(".timeline-item", 
        { y: 40 },
        {
          y: 0,
          duration: 0.6,
          stagger: 0.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: timelineSection,
            start: "top 80%",
            end: "bottom 20%",
            toggleActions: "play none none reverse"
          }
        }
      );
    }

    // Card hover animations
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    gsap.utils.toArray(".featured-card").forEach((card: any) => {
      card.addEventListener("mouseenter", () => {
        gsap.to(card, {
          scale: 1.05,
          duration: 0.3,
          ease: "power2.out"
        });
      });
      
      card.addEventListener("mouseleave", () => {
        gsap.to(card, {
          scale: 1,
          duration: 0.3,
          ease: "power2.out"
        });
      });
    });

    // Cleanup function
    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section ref={heroRef} className="relative py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <h1 className="hero-title text-4xl sm:text-6xl font-extrabold text-gray-900 dark:text-white mb-6 tracking-tight">
              <span className="block">Devontae Reid</span>
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600 dark:from-blue-400 dark:to-purple-500 mt-2">
                Software Engineer
              </span>
            </h1>
            <p className="hero-subtitle max-w-xl mx-auto text-lg text-gray-600 dark:text-gray-300 mb-8">
              Full-stack developer with a passion for building innovative applications and exploring new technologies.
            </p>
            <div className="hero-buttons flex justify-center gap-4">
              <a
                href="/projects"
                className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
              >
                View My Work
              </a>
              <a
                href="/assets/Devontae+Reid+Resume.pdf"
                download
                className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 dark:border-gray-600 text-base font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Download Resume
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section ref={aboutRef} className="py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="about-content">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
                About Me
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
                I am a Software Engineer currently working in embedded systems. I started in iOS development and eventually grew to enjoy web development—both front-end and back-end. Who would have known that user interfaces would be a love/hate relationship? There&apos;s a constant battle between finding inspiration and enjoying the final product.
              </p>
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
                While trying to discover inspiration for web design, I often spend my time building RESTful APIs. I&apos;m proficient in HTML, CSS, JavaScript, C/C++, and Python, and I work primarily in ReactJS and VueJS.
              </p>
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
                In my free time, I enjoy building interesting projects and experimenting with new technologies. Lately, I&apos;ve been working on various Node.js APIs that integrate with browser extensions.
              </p>
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
                When I&apos;m not programming, you&apos;ll find me reading my Bible or spending time with family. The Bible has given me so much wisdom in life and has taught me deeply about the grace of God. My personal library has grown to over 100 books. Some of my favorite study resources include:
              </p>
              
              {/* Enhanced Study Resources Links */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <a 
                  href="https://www.desiringgod.org" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="group flex items-center p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg border border-blue-200 dark:border-blue-800 hover:from-blue-100 hover:to-indigo-100 dark:hover:from-blue-800/30 dark:hover:to-indigo-800/30 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className="flex-shrink-0 w-10 h-10 bg-blue-600 dark:bg-blue-500 rounded-lg flex items-center justify-center mr-3 group-hover:scale-110 transition-transform duration-300">
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-blue-900 dark:text-blue-100 group-hover:text-blue-700 dark:group-hover:text-blue-300 transition-colors">
                      Desiring God
                    </h4>
                    <p className="text-sm text-blue-700 dark:text-blue-300">John Piper&apos;s ministry</p>
                  </div>
                  <svg className="w-4 h-4 text-blue-600 dark:text-blue-400 ml-auto group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>

                <a 
                  href="https://www.gty.org" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="group flex items-center p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg border border-blue-200 dark:border-blue-800 hover:from-blue-100 hover:to-indigo-100 dark:hover:from-blue-800/30 dark:hover:to-indigo-800/30 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className="flex-shrink-0 w-10 h-10 bg-blue-600 dark:bg-blue-500 rounded-lg flex items-center justify-center mr-3 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-blue-900 dark:text-blue-100 group-hover:text-blue-700 dark:group-hover:text-blue-300 transition-colors">
                      Grace To You
                    </h4>
                    <p className="text-sm text-blue-700 dark:text-blue-300">John MacArthur&apos;s teaching</p>
                  </div>
                  <svg className="w-4 h-4 text-blue-600 dark:text-blue-400 ml-auto group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>

                <a 
                  href="https://www.truthforlife.org" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="group flex items-center p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg border border-blue-200 dark:border-blue-800 hover:from-blue-100 hover:to-indigo-100 dark:hover:from-blue-800/30 dark:hover:to-indigo-800/30 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className="flex-shrink-0 w-10 h-10 bg-blue-600 dark:bg-blue-500 rounded-lg flex items-center justify-center mr-3 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-blue-900 dark:text-blue-100 group-hover:text-blue-700 dark:group-hover:text-blue-300 transition-colors">
                      Truth For Life
                    </h4>
                    <p className="text-sm text-blue-700 dark:text-blue-300">Alistair Begg&apos;s ministry</p>
                  </div>
                  <svg className="w-4 h-4 text-blue-600 dark:text-blue-400 ml-auto group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              </div>

              <div className="flex flex-wrap gap-4">
                <span className="skill-tag bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-full text-sm font-medium cursor-pointer hover:scale-110 transition-transform duration-200">
                  C/C++
                </span>
                <span className="skill-tag bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-full text-sm font-medium cursor-pointer hover:scale-110 transition-transform duration-200">
                  Rust
                </span>
                <span className="skill-tag bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-full text-sm font-medium cursor-pointer hover:scale-110 transition-transform duration-200">
                  React
                </span>
                <span className="skill-tag bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-full text-sm font-medium cursor-pointer hover:scale-110 transition-transform duration-200">
                  Node.js
                </span>
                <span className="skill-tag bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-full text-sm font-medium cursor-pointer hover:scale-110 transition-transform duration-200">
                  TypeScript
                </span>
                <span className="skill-tag bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-full text-sm font-medium cursor-pointer hover:scale-110 transition-transform duration-200">
                  Python
                </span>
              </div>
            </div>

            <div className="about-image relative">
              <div className="w-full h-96 relative rounded-lg overflow-hidden transform hover:scale-105 transition-transform duration-300 shadow-lg hover:shadow-xl">
                <Image
                  src="/assets/images/headshot.jpeg"
                  alt="Devontae Reid"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Section */}
      <section ref={featuredRef} className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-12 text-center">
            Featured Work
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Featured Project */}
            <div className="featured-card bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-6 transition-all duration-300 hover:shadow-xl">
              <div className="text-4xl mb-4">🚀</div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Projects
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                A showcase of my latest work and technical achievements.
              </p>
              <Link
                href="/projects"
                className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
              >
                View Projects →
              </Link>
            </div>

            {/* Featured Article */}
            <div className="featured-card bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-6 transition-all duration-300 hover:shadow-xl">
              <div className="text-4xl mb-4">📝</div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Articles
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Insights and thoughts on modern web development.
              </p>
              <Link
                href="/articles"
                className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
              >
                Read Articles →
              </Link>
            </div>

            {/* Contact */}
            <div className="featured-card bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-6 transition-all duration-300 hover:shadow-xl">
              <div className="text-4xl mb-4">💬</div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Get In Touch
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Interested in working together? Let&apos;s discuss your project.
              </p>
              <a
                href="mailto:devontae.reid@gmail.com"
                className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
              >
                Send Email →
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonies Section */}
      {/* <TestimoniesSection /> */}

      {/* Timeline Section */}
      <TimelineSection />

      {/* Gospel Teaser Section */}
      <GospelTeaser />

      {/* Favorite Sports Section */}
      <FavoritesSection/>

      {/* Footer */}
      <Footer />
    </div>
  );
}
