"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";
import { resources } from "@/data/resources"
import Footer from "@/components/Footer";
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}


export default function ResourcesPage() {
  const pageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.fromTo(
      ".resource-section",
      {
        y: 50,
        opacity: 0,
      },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        stagger: 0.2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: pageRef.current,
          start: "top 80%",
          end: "bottom 20%",
          toggleActions: "play none none reverse",
        },
      }
    );

    gsap.fromTo(
      ".book-card",
      {
        scale: 0.9,
        opacity: 0,
      },
      {
        scale: 1,
        opacity: 1,
        duration: 0.6,
        stagger: 0.1,
        ease: "back.out(1.7)",
        scrollTrigger: {
          trigger: ".bookshelf-section",
          start: "top 80%",
          end: "bottom 20%",
          toggleActions: "play none none reverse",
        },
      }
    );

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Read":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300";
      case "Reading":
        return "bg-amber-100 text-amber-800 dark:bg-amber-900/20 dark:text-amber-300";
      case "To Read":
        return "bg-dr-cream text-dr-text-muted";
      default:
        return "bg-dr-cream text-dr-text-muted";
    }
  };

  return (
    <div ref={pageRef} className="min-h-screen" style={{ background: "var(--dr-cream)" }}>
      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8" style={{ background: "var(--dr-surface)" }}>
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl sm:text-6xl font-bold text-gray-900 dark:text-white mb-6">
            Resources
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            A curated collection of books, tools, and developer resources that
            have shaped my journey.
          </p>
        </div>
      </section>

      {/* Books Section Preview */}
      <section className="resource-section bookshelf-section py-20 px-4 sm:px-6 lg:px-8" style={{ background: "var(--dr-cream)" }}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              📚 Books
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-8">
              A few of my favorite books.{" "}
              <Link
                href="/resources/books"
                className="underline"
                style={{ color: "var(--dr-amber-deep)" }}
              >
                See all books →
              </Link>
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {resources.books
              .filter((book) => book.featured)
              .map((book) => (
                <a
                  key={book.id}
                  href={`https://www.amazon.com/s?k=${encodeURIComponent(
                    book.title
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="book-card bg-dr-surface rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-dr-border overflow-hidden p-6 flex flex-col"
                >
                  <div className="flex items-center mb-4">
                    <span className="text-3xl mr-4">{book.cover}</span>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
                        {book.title}
                      </h3>
                      <p className="font-medium text-sm" style={{ color: "var(--dr-amber-deep)" }}>
                        by {book.author}
                      </p>
                    </div>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 flex-1">
                    {book.description}
                  </p>
                  <div className="flex items-center justify-between mt-auto">
                    <span
                      className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                        book.status
                      )}`}
                    >
                      {book.status}
                    </span>
                    <span className="text-sm ml-2" style={{ color: "var(--dr-amber)" }}>
                      {"★".repeat(book.rating) + "☆".repeat(5 - book.rating)}
                    </span>
                  </div>
                </a>
              ))}
          </div>
        </div>
      </section>

      
      {/* Theology Resources Section */}
      <section className="resource-section py-20 px-4 sm:px-6 lg:px-8" style={{ background: "var(--dr-surface)" }}>
        <div className="max-w-7xl mx-auto">
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
              Theology Resources
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-xl">
              Biblical teaching, sermons, and apologetics that have shaped how I read the Bible and understand the faith
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {resources.theology_resources.map((resource, index) => (
              <a
                key={index}
                href={resource.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex gap-5 p-6 rounded-lg border border-dr-border hover:shadow-md transition-all duration-200 hover:-translate-y-0.5"
                style={{ background: "var(--dr-cream)" }}
              >
                <span className="text-3xl flex-shrink-0">{resource.icon}</span>
                <div className="min-w-0">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1 group-hover:text-amber-700 dark:group-hover:text-amber-300 transition-colors">
                    {resource.name}
                  </h3>
                  <span className="inline-block text-xs px-2 py-0.5 rounded mb-2" style={{ background: "var(--dr-amber-pale)", color: "var(--dr-amber-deep)" }}>
                    {resource.category}
                  </span>
                  <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                    {resource.description}
                  </p>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Developer Resources Section */}
      <section className="resource-section py-20 px-4 sm:px-6 lg:px-8" style={{ background: "var(--dr-cream)" }}>
        <div className="max-w-7xl mx-auto">
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
              Developer Resources
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-xl">
              Platforms and references I return to consistently
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {resources.dev_resources.map((resource, index) => (
              <a
                key={index}
                href={resource.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-start gap-4 p-5 rounded-lg border border-dr-border hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 bg-dr-surface"
              >
                <span className="text-2xl flex-shrink-0">{resource.icon}</span>
                <div className="min-w-0">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-0.5 group-hover:text-amber-700 dark:group-hover:text-amber-300 transition-colors">
                    {resource.name}
                  </h3>
                  <p className="text-xs mb-1.5" style={{ color: "var(--dr-amber-deep)" }}>{resource.category}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-300 leading-snug">{resource.description}</p>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Podcast Section */}
      <section className="resource-section py-20 px-4 sm:px-6 lg:px-8" style={{ background: "var(--dr-surface)" }}>
        <div className="max-w-4xl mx-auto">
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
              Podcasts
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              For the commute, the workout, and the long drive
            </p>
          </div>
          <div className="divide-y border-t border-b border-dr-border">
            {resources.podcasts.map((podcast, index) => (
              <a
                key={index}
                href={podcast.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-5 py-5 hover:bg-dr-cream px-4 -mx-4 transition-colors duration-150"
              >
                <span className="text-2xl flex-shrink-0 w-10 text-center">{podcast.icon}</span>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-amber-700 dark:group-hover:text-amber-300 transition-colors">
                    {podcast.name}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mt-0.5">{podcast.description}</p>
                </div>
                <svg className="w-4 h-4 text-gray-400 flex-shrink-0 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* YouTube Channels Section */}
      <section className="resource-section py-20 px-4 sm:px-6 lg:px-8" style={{ background: "var(--dr-cream)" }}>
        <div className="max-w-4xl mx-auto">
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
              YouTube Channels
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Channels worth subscribing to
            </p>
          </div>
          <div className="divide-y border-t border-b border-dr-border">
            {resources.youtube_channels.map((channel, index) => (
              <a
                key={index}
                href={channel.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-5 py-5 hover:bg-dr-surface px-4 -mx-4 transition-colors duration-150"
              >
                <span className="text-2xl flex-shrink-0 w-10 text-center">{channel.icon}</span>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-amber-700 dark:group-hover:text-amber-300 transition-colors">
                    {channel.name}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mt-0.5">{channel.description}</p>
                </div>
                <svg className="w-4 h-4 text-gray-400 flex-shrink-0 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            ))}
          </div>
        </div>
      </section>


      {/* Tools Section */}
      <section className="resource-section py-20 px-4 sm:px-6 lg:px-8" style={{ background: "var(--dr-surface)" }}>
        <div className="max-w-7xl mx-auto">
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
              Tools & Software
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-xl">
              What I reach for daily when building embedded systems and web applications
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {resources.tools.map((tool, index) => (
              <div
                key={index}
                className="flex items-start gap-4 p-4 rounded-lg border border-dr-border hover:bg-dr-cream transition-colors duration-200"
                style={{ background: "var(--dr-surface)" }}
              >
                <span className="text-2xl flex-shrink-0 mt-0.5">{tool.icon}</span>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-gray-900 dark:text-white text-sm">{tool.name}</h3>
                    <span className="text-xs px-1.5 py-0.5 rounded" style={{ background: "var(--dr-amber-pale)", color: "var(--dr-amber-deep)" }}>{tool.category}</span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300 leading-snug">{tool.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 px-4 sm:px-6 lg:px-8" style={{ background: "var(--dr-cream)" }}>
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Have a Resource to Share?
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
            I&apos;m always looking for new books, tools, and resources to explore. 
            Feel free to reach out with your recommendations!
          </p>
          <a
            href="mailto:devontae.reid@gmail.com"
            className="inline-flex items-center px-6 py-3 text-white font-medium rounded-lg transition-opacity duration-200 hover:opacity-90"
            style={{ background: "var(--dr-amber)" }}
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
            Share Resources
          </a>
        </div>
      </section>

      <Footer />
    </div>
  );
}