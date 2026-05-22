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
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      const heroTl = gsap.timeline();
      heroTl
        .fromTo(".hero-title",
          { y: 60, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.9, ease: "power3.out" }
        )
        .fromTo(".hero-subtitle",
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.7, ease: "power3.out" }, "-=0.4"
        )
        .fromTo(".hero-buttons",
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.5, ease: "power3.out" }, "-=0.3"
        );

      gsap.fromTo(".about-content",
        { x: -60, opacity: 0 },
        {
          x: 0, opacity: 1, duration: 0.9, ease: "power3.out",
          scrollTrigger: { trigger: aboutRef.current, start: "top 80%", toggleActions: "play none none reverse" }
        }
      );

      gsap.fromTo(".about-image",
        { x: 60, opacity: 0 },
        {
          x: 0, opacity: 1, duration: 0.9, ease: "power3.out",
          scrollTrigger: { trigger: aboutRef.current, start: "top 80%", toggleActions: "play none none reverse" }
        }
      );

      gsap.fromTo(".skill-tag",
        { scale: 0.8, opacity: 0 },
        {
          scale: 1, opacity: 1, duration: 0.4, stagger: 0.08, ease: "power2.out",
          scrollTrigger: { trigger: aboutRef.current, start: "top 70%", toggleActions: "play none none reverse" }
        }
      );

      gsap.fromTo(".featured-card",
        { y: 40, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.6, stagger: 0.15, ease: "power3.out",
          scrollTrigger: { trigger: featuredRef.current, start: "top 80%", toggleActions: "play none none reverse" }
        }
      );

      const timelineSection = document.getElementById("timeline-section");
      if (timelineSection) {
        gsap.fromTo(".timeline-item",
          { y: 30 },
          {
            y: 0, duration: 0.5, stagger: 0.15, ease: "power3.out",
            scrollTrigger: { trigger: timelineSection, start: "top 80%", toggleActions: "play none none reverse" }
          }
        );
      }
    });

    return () => ctx.revert();
  }, []);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section
        ref={heroRef}
        className="relative py-24 px-4 sm:px-6 lg:px-8"
        style={{ background: "var(--dr-cream)" }}
      >
        <div className="max-w-5xl mx-auto">
          <div className="max-w-3xl">
            <p
              className="hero-subtitle text-xs font-semibold tracking-widest uppercase mb-6"
              style={{ color: "var(--dr-amber-deep)" }}
            >
              Devontae Reid
            </p>
            <h1 className="hero-title text-5xl sm:text-7xl font-bold text-gray-900 dark:text-white leading-tight mb-8 tracking-tight">
              Embedded systems.<br />
              Full-stack web.<br />
              <span style={{ color: "var(--dr-amber)" }}>Both.</span>
            </h1>
            <p className="hero-subtitle max-w-lg text-lg text-gray-600 dark:text-gray-300 mb-10 leading-relaxed">
              Software engineer working in embedded systems by day, building web applications by choice. I read extensively, write occasionally, and believe the gospel of Christ is worth your attention.
            </p>
            <div className="hero-buttons flex flex-wrap gap-4">
              <a
                href="/projects"
                className="inline-flex items-center justify-center px-6 py-3 text-base font-semibold text-white rounded-md transition-opacity duration-200 hover:opacity-90"
                style={{ background: "var(--dr-amber)" }}
              >
                View Projects
              </a>
              <a
                href="/assets/Devontae+Reid+Resume.pdf"
                download
                className="inline-flex items-center justify-center px-6 py-3 border border-dr-border text-base font-medium rounded-md text-gray-700 dark:text-gray-200 bg-dr-surface hover:bg-dr-hover transition-colors duration-200"
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
      <section ref={aboutRef} className="py-20 px-4 sm:px-6 lg:px-8" style={{ background: "var(--dr-surface)" }}>
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="about-content max-w-[70ch]">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
                About Me
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
                I am a Software Engineer currently working in embedded systems. I started in iOS development and eventually grew to enjoy web development — both front-end and back-end. Who would have known that user interfaces would be a love/hate relationship? There&apos;s a constant battle between finding inspiration and enjoying the final product.
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
                {[
                  { href: "https://www.desiringgod.org", title: "Desiring God", subtitle: "John Piper's ministry" },
                  { href: "https://www.gty.org", title: "Grace To You", subtitle: "John MacArthur's teaching" },
                  { href: "https://www.truthforlife.org", title: "Truth For Life", subtitle: "Alistair Begg's ministry" },
                ].map(({ href, title, subtitle }) => (
                  <a
                    key={href}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center p-4 rounded-lg border transition-all duration-200 hover:-translate-y-1 hover:shadow-md"
                    style={{
                      background: "var(--dr-amber-pale)",
                      borderColor: "oklch(88% 0.06 72)",
                    }}
                  >
                    <div
                      className="flex-shrink-0 w-9 h-9 rounded-lg flex items-center justify-center mr-3"
                      style={{ background: "var(--dr-amber)" }}
                    >
                      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-gray-900 dark:text-white text-sm">{title}</h4>
                      <p className="text-xs text-gray-600 dark:text-gray-400">{subtitle}</p>
                    </div>
                    <svg className="w-4 h-4 ml-2 shrink-0 text-gray-400 group-hover:translate-x-0.5 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                ))}
              </div>

              <div className="flex flex-wrap gap-3">
                {["C/C++", "Rust", "React", "Node.js", "TypeScript", "Python"].map((skill) => (
                  <span
                    key={skill}
                    className="skill-tag px-3 py-1 rounded-full text-sm font-medium border"
                    style={{
                      background: "var(--dr-amber-pale)",
                      color: "var(--dr-amber-deep)",
                      borderColor: "oklch(85% 0.06 72)",
                    }}
                  >
                    {skill}
                  </span>
                ))}
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
      <section ref={featuredRef} className="py-20 px-4 sm:px-6 lg:px-8" style={{ background: "var(--dr-cream)" }}>
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row md:gap-16">
            {/* Left: section label */}
            <div className="md:w-1/3 mb-10 md:mb-0">
              <p
                className="text-xs font-semibold tracking-widest uppercase mb-3"
                style={{ color: "var(--dr-amber-deep)" }}
              >
                What's here
              </p>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white leading-snug">
                Work, writing,<br />and a few<br />other things.
              </h2>
            </div>

            {/* Right: numbered list */}
            <div className="md:w-2/3 divide-y divide-gray-100 dark:divide-gray-800">
              <div className="featured-card py-8 first:pt-0">
                <div className="flex gap-6 items-start">
                  <span className="text-xs font-mono text-gray-400 dark:text-gray-500 mt-1 w-6 shrink-0">01</span>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Projects</h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-3 text-sm leading-relaxed">
                      Embedded firmware, browser extensions, web APIs, and whatever I&apos;m currently building.
                    </p>
                    <Link
                      href="/projects"
                      className="text-sm font-medium transition-colors duration-200"
                      style={{ color: "var(--dr-amber-deep)" }}
                    >
                      View Projects →
                    </Link>
                  </div>
                </div>
              </div>

              <div className="featured-card py-8">
                <div className="flex gap-6 items-start">
                  <span className="text-xs font-mono text-gray-400 dark:text-gray-500 mt-1 w-6 shrink-0">02</span>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Articles</h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-3 text-sm leading-relaxed">
                      Writing on embedded systems, web development, and things I&apos;m figuring out.
                    </p>
                    <Link
                      href="/articles"
                      className="text-sm font-medium transition-colors duration-200"
                      style={{ color: "var(--dr-amber-deep)" }}
                    >
                      Read Articles →
                    </Link>
                  </div>
                </div>
              </div>

              <div className="featured-card py-8">
                <div className="flex gap-6 items-start">
                  <span className="text-xs font-mono text-gray-400 dark:text-gray-500 mt-1 w-6 shrink-0">03</span>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Get in Touch</h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-3 text-sm leading-relaxed">
                      Working on something interesting? Open to conversations about work and collaboration.
                    </p>
                    <a
                      href="mailto:devontae.reid@gmail.com"
                      className="text-sm font-medium transition-colors duration-200"
                      style={{ color: "var(--dr-amber-deep)" }}
                    >
                      devontae.reid@gmail.com →
                    </a>
                  </div>
                </div>
              </div>
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
