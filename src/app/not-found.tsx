"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";

export default function NotFound() {
  const pageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const tl = gsap.timeline();

    tl.fromTo(".not-found-title",
      { y: -60, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, ease: "power3.out" }
    )
    .fromTo(".not-found-subtitle",
      { y: 40, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" }, "-=0.5"
    )
    .fromTo(".not-found-message",
      { y: 40, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" }, "-=0.3"
    )
    .fromTo(".not-found-buttons",
      { y: 24, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6, ease: "power3.out" }, "-=0.3"
    );
  }, []);

  return (
    <div
      ref={pageRef}
      className="min-h-screen"
      style={{ background: "var(--dr-cream)" }}
    >
      <div className="flex items-center justify-center min-h-screen px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          {/* 404 */}
          <div className="mb-8">
            <h1
              className="not-found-title text-8xl md:text-9xl lg:text-[12rem] font-black leading-none"
              style={{ color: "var(--dr-amber)" }}
            >
              404
            </h1>
          </div>

          <div className="mb-8">
            <h2 className="not-found-subtitle text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Page Not Found
            </h2>
            <p className="not-found-subtitle text-xl text-gray-600 dark:text-gray-300">
              But here&apos;s something even more important...
            </p>
          </div>

          {/* Gospel Message Card */}
          <div className="not-found-message mb-12">
            <div className="rounded-2xl p-8 md:p-12 shadow-lg border border-dr-border max-w-2xl mx-auto text-left" style={{ background: "var(--dr-surface)" }}>
              <div className="flex items-center justify-center gap-3 mb-8">
                <span className="text-4xl">✝️</span>
                <h3 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                  The Most Important Question
                </h3>
              </div>

              <div className="space-y-6 mb-8">
                <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                  If you were to die today, do you know for sure that you would go to heaven?
                  This page may be missing, but the answer to life&apos;s most important question is available to you right now.
                </p>

                <div className="rounded-xl p-6 border border-dr-border" style={{ background: "var(--dr-cream)" }}>
                  <p className="text-base md:text-lg text-gray-700 dark:text-gray-300 leading-relaxed italic">
                    Suppose you were to stand before God and He asked, &ldquo;Why should I let you into My heaven?&rdquo;
                    What would you say? The Bible offers a clear answer, and it&apos;s not about being &ldquo;good enough.&rdquo;
                  </p>
                </div>

                <div className="rounded-xl p-6 border border-dr-border" style={{ background: "var(--dr-cream)" }}>
                  <p className="text-base md:text-lg text-gray-700 dark:text-gray-300 italic leading-relaxed">
                    &ldquo;For God so loved the world, that he gave his only Son, that whoever believes in him should not perish but have eternal life.&rdquo;
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 text-right">John 3:16</p>
                </div>
              </div>

              <p className="text-base text-gray-700 dark:text-gray-300 text-center">
                The good news of the Gospel is a gift — not something we earn.
              </p>
            </div>
          </div>

          {/* Buttons */}
          <div className="not-found-buttons flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/gospel"
              className="group inline-flex items-center justify-center px-8 py-4 text-white text-lg font-semibold rounded-lg transition-opacity duration-200 hover:opacity-90"
              style={{ background: "var(--dr-amber)" }}
            >
              <span className="mr-3">Discover the Gospel</span>
              <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>

            <Link
              href="/"
              className="group inline-flex items-center justify-center px-8 py-4 text-gray-900 dark:text-white text-lg font-semibold rounded-lg shadow-sm hover:shadow-md transition-all duration-200 border border-dr-border"
              style={{ background: "var(--dr-surface)" }}
            >
              <svg className="w-5 h-5 mr-3 transform group-hover:-translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              <span>Back to Home</span>
            </Link>
          </div>

          <div className="not-found-buttons mt-8 flex flex-wrap justify-center gap-4 text-sm">
            <Link href="/articles" className="hover:underline transition-colors" style={{ color: "var(--dr-amber-deep)" }}>
              Articles
            </Link>
            <span className="text-gray-400">•</span>
            <Link href="/projects" className="hover:underline transition-colors" style={{ color: "var(--dr-amber-deep)" }}>
              Projects
            </Link>
            <span className="text-gray-400">•</span>
            <Link href="/resources" className="hover:underline transition-colors" style={{ color: "var(--dr-amber-deep)" }}>
              Resources
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
