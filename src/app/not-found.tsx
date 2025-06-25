"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";

export default function NotFound() {
  const pageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Page entrance animation
    const tl = gsap.timeline();
    
    tl.fromTo(".404-title",
      { y: -100, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, ease: "power3.out" }
    )
    .fromTo(".404-subtitle",
      { y: 50, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" }, "-=0.5"
    )
    .fromTo(".404-message",
      { y: 50, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" }, "-=0.3"
    )
    .fromTo(".404-buttons",
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6, ease: "power3.out" }, "-=0.3"
    );

    // Floating animation for decorative elements
    gsap.to(".floating-cross", {
      y: -20,
      duration: 4,
      ease: "power2.inOut",
      yoyo: true,
      repeat: -1
    });

    gsap.to(".floating-heart", {
      y: -15,
      duration: 3,
      ease: "power2.inOut",
      yoyo: true,
      repeat: -1,
      delay: 1
    });

    // Cleanup function
    return () => {
      gsap.killTweensOf(".floating-cross");
      gsap.killTweensOf(".floating-heart");
    };
  }, []);

  return (
    <div 
      ref={pageRef}
      className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900/20 dark:to-purple-900/20 relative overflow-hidden"
    >
      {/* Background decorations */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-20 w-60 h-60 bg-blue-400 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-purple-400 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-400 rounded-full blur-3xl"></div>
      </div>

      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-32 left-32 w-3 h-3 bg-blue-500 rounded-full animate-ping"></div>
        <div className="absolute top-64 right-40 w-2 h-2 bg-purple-500 rounded-full animate-ping" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-40 left-1/3 w-4 h-4 bg-indigo-500 rounded-full animate-ping" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/3 right-1/4 w-2 h-2 bg-blue-400 rounded-full animate-ping" style={{ animationDelay: '3s' }}></div>
      </div>

      <div className="relative flex items-center justify-center min-h-screen px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          {/* 404 Number */}
          <div className="mb-8">
            <h1 className="404-title text-8xl md:text-9xl lg:text-[12rem] font-black bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent leading-none">
              404
            </h1>
          </div>

          {/* Main Message */}
          <div className="mb-8">
            <h2 className="404-subtitle text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Page Not Found
            </h2>
            <p className="404-subtitle text-xl md:text-2xl text-gray-600 dark:text-gray-300">
              But here&apos;s something even more important...
            </p>
          </div>

          {/* Gospel Message Card */}
          <div className="404-message mb-12">
            <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-3xl p-8 md:p-12 shadow-2xl border border-blue-200/50 dark:border-blue-700/50 max-w-3xl mx-auto">
              <div className="flex items-center justify-center gap-4 mb-6">
                <span className="floating-cross text-4xl">✝️</span>
                <h3 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                  The Most Important Question
                </h3>
                <span className="floating-heart text-4xl">❤️</span>
              </div>
              
              <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
                If you were to die today, do you know for sure that you would go to heaven? 
                This page may be missing, but the answer to life&apos;s most important question 
                is available to you right now.
              </p>
              
              <div className="bg-gradient-to-r from-blue-100/50 to-purple-100/50 dark:from-blue-900/30 dark:to-purple-900/30 rounded-2xl p-4 border-l-4 border-blue-500">
                <p className="text-lg text-gray-700 dark:text-gray-300 italic">
                  &ldquo;For God so loved the world, that he gave his only Son, that whoever believes in him should not perish but have eternal life.&rdquo; - John 3:16
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="404-buttons flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/gospel"
              className="group inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white text-lg font-semibold rounded-2xl shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 border-2 border-transparent hover:border-blue-400"
            >
              <span className="mr-3">Discover the Gospel</span>
              <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
            
            <Link
              href="/"
              className="group inline-flex items-center justify-center px-8 py-4 bg-white/80 dark:bg-gray-800/80 hover:bg-white dark:hover:bg-gray-700 text-gray-900 dark:text-white text-lg font-semibold rounded-2xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 border-2 border-gray-200 dark:border-gray-600"
            >
              <svg className="w-5 h-5 mr-3 transform group-hover:-translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              <span>Back to Home</span>
            </Link>
          </div>

          {/* Additional Navigation */}
          <div className="404-buttons mt-8">
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <Link href="/articles" className="text-blue-600 dark:text-blue-400 hover:underline transition-colors">
                Articles
              </Link>
              <span className="text-gray-400">•</span>
              <Link href="/projects" className="text-blue-600 dark:text-blue-400 hover:underline transition-colors">
                Projects
              </Link>
              <span className="text-gray-400">•</span>
              <Link href="/resources" className="text-blue-600 dark:text-blue-400 hover:underline transition-colors">
                Resources
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute top-20 left-20 w-24 h-24 border-2 border-blue-300/30 rounded-full"></div>
      <div className="absolute bottom-20 right-20 w-20 h-20 border-2 border-purple-300/30 rounded-full"></div>
      <div className="absolute top-1/2 left-10 w-16 h-16 border-2 border-indigo-300/30 rounded-full"></div>
      <div className="absolute bottom-1/3 right-10 w-12 h-12 border-2 border-blue-300/30 rounded-full"></div>
    </div>
  );
} 