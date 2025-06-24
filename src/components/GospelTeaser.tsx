// components/GospelTeaser.tsx
"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register ScrollTrigger plugin
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function GospelTeaser() {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Main content animation
    gsap.fromTo(".gospel-content",
      { y: 100, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 1.2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
          end: "bottom 20%",
          toggleActions: "play none none reverse"
        }
      }
    );

    // Staggered text animations
    gsap.fromTo(".gospel-text",
      { y: 50, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        stagger: 0.3,
        ease: "power3.out",
        scrollTrigger: {
          trigger: contentRef.current,
          start: "top 80%",
          end: "bottom 20%",
          toggleActions: "play none none reverse"
        }
      }
    );

    // Button animation
    gsap.fromTo(".gospel-button",
      { scale: 0.8, opacity: 0 },
      {
        scale: 1,
        opacity: 1,
        duration: 0.6,
        ease: "back.out(1.7)",
        scrollTrigger: {
          trigger: contentRef.current,
          start: "top 80%",
          end: "bottom 20%",
          toggleActions: "play none none reverse"
        }
      }
    );

    // Floating animation for emojis
    gsap.to(".floating-emoji", {
      y: -15,
      duration: 3,
      ease: "power2.inOut",
      yoyo: true,
      repeat: -1,
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top 80%",
        end: "bottom 20%",
        toggleActions: "play none none reverse"
      }
    });

    // Cleanup function
    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return (
    <section 
      ref={sectionRef} 
      className="relative py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900/20 dark:to-purple-900/20 overflow-hidden"
    >
      {/* Background decorations */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-40 h-40 bg-blue-400 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-60 h-60 bg-purple-400 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/3 w-32 h-32 bg-indigo-400 rounded-full blur-2xl"></div>
        <div className="absolute bottom-1/3 right-1/4 w-48 h-48 bg-blue-300 rounded-full blur-3xl"></div>
      </div>

      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-20 w-2 h-2 bg-blue-500 rounded-full animate-ping"></div>
        <div className="absolute top-40 right-32 w-3 h-3 bg-purple-500 rounded-full animate-ping" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-32 left-1/4 w-2 h-2 bg-indigo-500 rounded-full animate-ping" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="relative max-w-4xl mx-auto">
        <div ref={contentRef} className="gospel-content text-center">
          {/* Main heading with gradient */}
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-8 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent leading-tight">
            The Most Important Question
            <span className="block text-2xl md:text-3xl lg:text-4xl mt-2 text-gray-700 dark:text-gray-300">
              You&apos;ll Ever Consider
            </span>
          </h2>

          {/* Question cards */}
          <div className="space-y-6 mb-10">
            <div className="gospel-text group">
              <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-blue-200/50 dark:border-blue-700/50 hover:shadow-xl transition-all duration-500 transform hover:-translate-y-1">
                <div className="flex items-center justify-center gap-3 mb-3">
                  <span className="floating-emoji text-3xl">🌿</span>
                  <h3 className="text-xl md:text-2xl font-semibold text-gray-900 dark:text-white">
                    Life&apos;s Ultimate Question
                  </h3>
                </div>
                <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300 leading-relaxed">
                  If you were to die today, do you know for sure that you would go to heaven?
                </p>
              </div>
            </div>

            <div className="gospel-text group">
              <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-purple-200/50 dark:border-purple-700/50 hover:shadow-xl transition-all duration-500 transform hover:-translate-y-1">
                <div className="flex items-center justify-center gap-3 mb-3">
                  <span className="floating-emoji text-3xl">📖</span>
                  <h3 className="text-xl md:text-2xl font-semibold text-gray-900 dark:text-white">
                    The Divine Inquiry
                  </h3>
                </div>
                <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300 leading-relaxed">
                  Suppose you were to stand before God and He asked, &ldquo;Why should I let you into My heaven?&rdquo; — What would you say?
                </p>
              </div>
            </div>
          </div>

          {/* Reflection text */}
          <div className="gospel-text mb-10">
            <div className="bg-gradient-to-r from-blue-100/50 to-purple-100/50 dark:from-blue-900/30 dark:to-purple-900/30 rounded-2xl p-6 border-l-4 border-blue-500">
              <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300 italic leading-relaxed">
                These aren&apos;t easy questions. But they are life-changing. The Bible offers a clear answer, and it&apos;s not about being &ldquo;good enough.&rdquo;
              </p>
            </div>
          </div>

          {/* CTA Button */}
          <div className="gospel-button mb-8">
            <Link
              href="/gospel"
              className="group inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white text-lg font-semibold rounded-2xl shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 border-2 border-transparent hover:border-blue-400"
            >
              <span className="mr-3">Discover the Answer</span>
              <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>

          {/* Bottom message */}
          <div className="gospel-text">
            <div className="flex items-center justify-center gap-3 text-gray-600 dark:text-gray-400">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <p className="text-lg font-medium">
                The good news of the Gospel is a gift — not something we earn.
              </p>
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
            </div>
          </div>

          {/* Decorative elements */}
          <div className="absolute top-10 left-10 w-20 h-20 border-2 border-blue-300/30 rounded-full"></div>
          <div className="absolute bottom-10 right-10 w-16 h-16 border-2 border-purple-300/30 rounded-full"></div>
          <div className="absolute top-1/2 left-5 w-12 h-12 border-2 border-indigo-300/30 rounded-full"></div>
          <div className="absolute bottom-1/3 right-5 w-8 h-8 border-2 border-blue-300/30 rounded-full"></div>
        </div>
      </div>
    </section>
  );
}
