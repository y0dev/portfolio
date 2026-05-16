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
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

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
      className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden"
      style={{ background: "var(--dr-cream)" }}
    >

      <div className="relative max-w-4xl mx-auto">
        <div ref={contentRef} className="gospel-content text-center">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-8 text-gray-900 dark:text-white leading-tight">
            The Most Important Question
            <span className="block text-2xl md:text-3xl lg:text-4xl mt-2 text-gray-600 dark:text-gray-400">
              You&apos;ll Ever Consider
            </span>
          </h2>

          {/* Question cards */}
          <div className="space-y-6 mb-10">
            <div className="gospel-text group">
              <div className="rounded-2xl p-6 shadow-lg border border-dr-border hover:shadow-xl transition-all duration-500 transform hover:-translate-y-1" style={{ background: "var(--dr-surface)" }}>
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
              <div className="rounded-2xl p-6 shadow-lg border border-dr-border hover:shadow-xl transition-all duration-500 transform hover:-translate-y-1" style={{ background: "var(--dr-surface)" }}>
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
            <div className="rounded-2xl p-6 border border-dr-border" style={{ background: "var(--dr-surface)" }}>
              <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300 italic leading-relaxed">
                These aren&apos;t easy questions. But they are life-changing. The Bible offers a clear answer, and it&apos;s not about being &ldquo;good enough.&rdquo;
              </p>
            </div>
          </div>

          {/* CTA Button */}
          <div className="gospel-button mb-8">
            <Link
              href="/gospel"
              className="group inline-flex items-center justify-center px-8 py-4 text-white text-lg font-semibold rounded-2xl transition-opacity duration-200 hover:opacity-90"
              style={{ background: "var(--dr-amber, oklch(71% 0.17 72))" }}
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
              <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: "var(--dr-amber)" }}></div>
              <p className="text-lg font-medium">
                The good news of the Gospel is a gift — not something we earn.
              </p>
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
