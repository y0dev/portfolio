"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";
import resources from "@/data/resources.json"
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
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200";
      case "Reading":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-200";
      case "To Read":
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-200";
    }
  };

  return (
    <div ref={pageRef} className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-purple-50 to-blue-100 dark:from-gray-800 dark:to-gray-900">
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
      <section className="resource-section bookshelf-section py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              📚 Books
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-8">
              A few of my favorite books.{" "}
              <Link
                href="/resources/books"
                className="text-blue-600 dark:text-blue-400 underline"
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
                  className="book-card bg-white dark:bg-gray-700 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 dark:border-gray-600 overflow-hidden p-6 flex flex-col"
                >
                  <div className="flex items-center mb-4">
                    <span className="text-3xl mr-4">{book.cover}</span>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
                        {book.title}
                      </h3>
                      <p className="text-blue-600 dark:text-blue-400 font-medium text-sm">
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
                    <span className="text-yellow-400 text-sm ml-2">
                      {"★".repeat(book.rating) + "☆".repeat(5 - book.rating)}
                    </span>
                  </div>
                </a>
              ))}
          </div>
        </div>
      </section>

      {/* Tools Section */}
      <section className="resource-section py-20 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              🛠️ Tools & Software
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Essential tools and software I use in my daily development workflow
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {resources.tools.map((tool, index) => (
              <div
                key={index}
                className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100 dark:border-gray-700"
              >
                <div className="text-center">
                  <div className="text-3xl mb-3">{tool.icon}</div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                    {tool.name}
                  </h3>
                  <p className="text-sm text-blue-600 dark:text-blue-400 mb-2">
                    {tool.category}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {tool.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Developer Resources Section */}
      <section className="resource-section py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              🌐 Developer Resources
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-8">
              Websites and platforms I frequently visit for learning and development
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {resources.dev_resources.map((resource, index) => (
              <a
                key={index}
                href={resource.url}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white dark:bg-gray-700 rounded-lg p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100 dark:border-gray-600 block"
              >
                <div className="text-center">
                  <div className="text-3xl mb-3">{resource.icon}</div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                    {resource.name}
                  </h3>
                  <p className="text-sm text-blue-600 dark:text-blue-400 mb-2">
                    {resource.category}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {resource.description}
                  </p>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Podcast Section */}
      <section className="resource-section py-20 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              🎙️ Podcasts
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-8">
              Podcasts I recommend for developers and lifelong learners
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {resources.podcasts.map((podcast, index) => (
              <a
                key={index}
                href={podcast.url}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white dark:bg-gray-700 rounded-lg p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100 dark:border-gray-600 block"
              >
                <div className="text-center">
                  <div className="text-3xl mb-3">{podcast.icon}</div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                    {podcast.name}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {podcast.description}
                  </p>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* YouTube Channels Section */}
      <section className="resource-section py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              📺 YouTube Channels
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-8">
              YouTube channels I recommend for learning and inspiration
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {resources.youtube_channels.map((channel, index) => (
              <a
                key={index}
                href={channel.url}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white dark:bg-gray-700 rounded-lg p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100 dark:border-gray-600 block"
              >
                <div className="text-center">
                  <div className="text-3xl mb-3">{channel.icon}</div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                    {channel.name}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {channel.description}
                  </p>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Theology Resources Section */}
      <section className="resource-section py-20 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              ⛪ Theology Resources
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-8">
              Biblical teaching, sermons, evangelism, and apologetics resources
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {resources.theology_resources.map((resource, index) => (
              <a
                key={index}
                href={resource.url}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white dark:bg-gray-700 rounded-lg p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100 dark:border-gray-600 block"
              >
                <div className="text-center">
                  <div className="text-3xl mb-3">{resource.icon}</div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                    {resource.name}
                  </h3>
                  <p className="text-sm text-blue-600 dark:text-blue-400 mb-2">
                    {resource.category}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {resource.description}
                  </p>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-800 dark:to-gray-900">
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
            className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200 transform hover:scale-105"
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