"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import TimelineSection from "@/components/TimelineSection";

// Register ScrollTrigger plugin
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function Home() {
  const heroRef = useRef<HTMLDivElement>(null);
  const aboutRef = useRef<HTMLDivElement>(null);
  const featuredRef = useRef<HTMLDivElement>(null);

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

    gsap.from(".timeline-item", {
      opacity: 0,
      y: 40,
      duration: 0.6,
      stagger: 0.2,
      scrollTrigger: {
        trigger: ".timeline-item",
        start: "top 80%",
        toggleActions: "play none none reverse"
      }
    });

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
      <section ref={heroRef} className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <h1 className="hero-title text-4xl sm:text-6xl font-bold text-gray-900 dark:text-white mb-6">
              Hi, I&apos;m <span className="text-blue-600 dark:text-blue-400">Devontae Reid</span>
            </h1>
            <p className="hero-subtitle text-xl sm:text-2xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
              Full-stack developer and creative technologist passionate about building 
              innovative solutions that make a difference.
            </p>
            <div className="hero-buttons flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/projects"
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
              >
                View My Work
              </Link>
              <Link
                href="/articles"
                className="border border-gray-300 dark:border-gray-600 hover:border-blue-600 dark:hover:border-blue-400 text-gray-700 dark:text-gray-300 px-8 py-3 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
              >
                Read My Articles
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section ref={aboutRef} className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="about-content">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
                About Me
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
                I&apos;m a passionate developer with expertise in modern web technologies. 
                I love creating elegant solutions to complex problems and sharing my 
                knowledge through writing and open source contributions.
              </p>
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
                When I&apos;m not coding, you can find me exploring new technologies, 
                contributing to open source projects, or writing about my experiences 
                in software development.
              </p>
              <div className="flex flex-wrap gap-4">
                <span className="skill-tag bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-full text-sm font-medium cursor-pointer hover:scale-110 transition-transform duration-200">
                  React
                </span>
                <span className="skill-tag bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 px-3 py-1 rounded-full text-sm font-medium cursor-pointer hover:scale-110 transition-transform duration-200">
                  Node.js
                </span>
                <span className="skill-tag bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-200 px-3 py-1 rounded-full text-sm font-medium cursor-pointer hover:scale-110 transition-transform duration-200">
                  TypeScript
                </span>
                <span className="skill-tag bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200 px-3 py-1 rounded-full text-sm font-medium cursor-pointer hover:scale-110 transition-transform duration-200">
                  Python
                </span>
              </div>
            </div>
            <div className="about-image relative">
              <div className="w-full h-96 bg-gradient-to-br from-blue-400 to-purple-600 rounded-lg flex items-center justify-center transform hover:scale-105 transition-transform duration-300 shadow-lg hover:shadow-xl">
                <div className="text-white text-center">
                  <div className="floating-emoji text-6xl mb-4">👨‍💻</div>
                  <p className="text-xl font-medium">Developer & Creator</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Section */}
      <section ref={featuredRef} className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-12 text-center">
            Featured Work
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Featured Project */}
            <div className="featured-card bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden transition-all duration-300 cursor-pointer">
              <div className="h-48 bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <div className="text-white text-center">
                  <div className="text-4xl mb-2">🚀</div>
                  <p className="font-medium">Project Preview</p>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  Featured Project
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  A showcase of my latest work and technical achievements.
                </p>
                <Link
                  href="/projects"
                  className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
                >
                  View Project →
                </Link>
              </div>
            </div>

            {/* Featured Article */}
            <div className="featured-card bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden transition-all duration-300 cursor-pointer">
              <div className="h-48 bg-gradient-to-br from-green-500 to-blue-600 flex items-center justify-center">
                <div className="text-white text-center">
                  <div className="text-4xl mb-2">📝</div>
                  <p className="font-medium">Article Preview</p>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  Latest Article
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  Insights and thoughts on modern web development.
                </p>
                <Link
                  href="/articles"
                  className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
                >
                  Read Article →
                </Link>
              </div>
            </div>

            {/* Contact */}
            <div className="featured-card bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden transition-all duration-300 cursor-pointer">
              <div className="h-48 bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center">
                <div className="text-white text-center">
                  <div className="text-4xl mb-2">💬</div>
                  <p className="font-medium">Let&apos;s Connect</p>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  Get In Touch
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  Interested in working together? Let&apos;s discuss your project.
                </p>
                <a
                  href="mailto:hello@devontaereid.com"
                  className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
                >
                  Send Email →
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <TimelineSection/>

    </div>
  );
}
