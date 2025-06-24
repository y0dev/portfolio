"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { articles } from "@/data/articles";
import { formatDate } from "@/utils";
import type { Article } from "@/types";
import Footer from "@/components/Footer";

export default function ArticlesPage() {
  const [filter, setFilter] = useState<"all" | "article" | "note">("all");
  const [tagFilter, setTagFilter] = useState<string | null>(null);

  const allTags = useMemo(() => {
    const tags = new Set<string>();
    articles.forEach((article) => {
      article.tags.forEach((tag) => tags.add(tag));
    });
    return Array.from(tags);
  }, []);

  const filteredArticles = useMemo(() => {
    let result = articles as Article[];

    if (filter !== "all") {
      result = result.filter((article) => article.type === filter);
    }

    if (tagFilter) {
      result = result.filter((article) => article.tags.includes(tagFilter));
    }

    return result.sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return dateB - dateA;
    });
  }, [filter, tagFilter]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-purple-50 to-blue-100 dark:from-gray-800 dark:to-gray-900 text-center">
        <h1 className="text-4xl sm:text-6xl font-bold text-gray-900 dark:text-white mb-4">
          Articles & Notes
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
          Insights on technology, faith, and personal growth.
        </p>
      </section>

      <main className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        {/* Filters */}
        <div className="mb-12">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            {/* Type Filter */}
            <div className="flex items-center space-x-2 bg-white dark:bg-gray-800 p-2 rounded-lg shadow-md">
              <button
                onClick={() => setFilter("all")}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  filter === "all"
                    ? "bg-blue-600 text-white"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilter("article")}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  filter === "article"
                    ? "bg-blue-600 text-white"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
              >
                Articles
              </button>
              <button
                onClick={() => setFilter("note")}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  filter === "note"
                    ? "bg-blue-600 text-white"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
              >
                Notes
              </button>
            </div>
            {/* Tag Filter */}
            <div className="relative">
              <select
                onChange={(e) => setTagFilter(e.target.value || null)}
                value={tagFilter || ""}
                className="appearance-none bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg py-2 pl-4 pr-10 text-sm font-medium text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-md"
              >
                <option value="">All Tags</option>
                {allTags.map((tag) => (
                  <option key={tag} value={tag}>
                    {tag}
                  </option>
                ))}
              </select>
            </div>
          </div>
          {tagFilter && (
            <div className="mt-4 text-center sm:text-left">
              <span className="text-gray-600 dark:text-gray-400">
                Filtering by tag:
              </span>
              <span className="inline-flex items-center ml-2 px-3 py-1 rounded-full text-sm font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200">
                {tagFilter}
                <button
                  onClick={() => setTagFilter(null)}
                  className="ml-2 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200"
                >
                  &times;
                </button>
              </span>
            </div>
          )}
        </div>

        {/* Articles Grid */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {filteredArticles.map((article) => (
            <Link
              key={article.id}
              href={`/${article.type}/${article.id}`}
              className="group block bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 dark:border-gray-700"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                      article.type === "article"
                        ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-200"
                        : "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200"
                    }`}
                  >
                    {article.type.charAt(0).toUpperCase() + article.type.slice(1)}
                  </span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {formatDate(article.date)}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {article.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4 h-20 overflow-hidden">
                  {article.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  {article.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-block bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-1 rounded-md text-xs font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
