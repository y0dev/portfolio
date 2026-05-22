"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { articles } from "@/data/articles";
import { formatDate } from "@/utils";
import type { Article } from "@/types";
import Footer from "@/components/Footer";

export default function ArticlesPage() {
  const [filter, setFilter] = useState<"all" | "article" | "note">("all");
  const [tagFilter, setTagFilter] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const ITEMS_PER_PAGE = 12;

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

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (article) =>
          article.title.toLowerCase().includes(query) ||
          (article.description && article.description.toLowerCase().includes(query)) ||
          article.tags.some((tag) => tag.toLowerCase().includes(query))
      );
    }

    return result.sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return dateB - dateA;
    });
  }, [filter, tagFilter, searchQuery]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filter, tagFilter, searchQuery]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredArticles.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedArticles = filteredArticles.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;
    
    if (totalPages <= maxVisible) {
      // Show all pages if total is less than max visible
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);
      
      if (currentPage > 3) {
        pages.push('...');
      }
      
      // Show pages around current page
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
      
      if (currentPage < totalPages - 2) {
        pages.push('...');
      }
      
      // Always show last page
      pages.push(totalPages);
    }
    
    return pages;
  };

  return (
    <div className="min-h-screen" style={{ background: "var(--dr-cream)" }}>
      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 text-center" style={{ background: "var(--dr-surface)" }}>
        <h1 className="text-4xl sm:text-6xl font-bold text-gray-900 dark:text-white mb-4">
          Articles & Notes
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
          Insights on technology, faith, and personal growth.
        </p>
      </section>

      <main className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        {/* Search and Filters */}
        <div className="mb-12">
          {/* Search Bar */}
          <div className="mb-6">
            <div className="relative max-w-2xl mx-auto">
              <input
                type="text"
                placeholder="Search articles and notes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-3 pl-10 pr-4 border border-dr-border rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:border-transparent shadow-md"
                style={{ background: "var(--dr-surface)", ["--tw-ring-color" as string]: "var(--dr-amber)" }}
              />
              <svg
                className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>

          {/* Filters and Count */}
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between mb-4">
            {/* Type Filter */}
            <div className="flex items-center space-x-2 p-2 rounded-lg shadow-md" style={{ background: "var(--dr-surface)" }}>
              {(["all", "article", "note"] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    filter === f
                      ? "text-white"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  }`}
                  style={filter === f ? { background: "var(--dr-amber)" } : undefined}
                >
                  {f === "all" ? "All" : f === "article" ? "Articles" : "Notes"}
                </button>
              ))}
            </div>
            {/* Tag Filter and Count */}
            <div className="flex items-center gap-4">
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {filteredArticles.length} of {articles.length} articles
              </div>
              <div className="relative">
                <select
                  onChange={(e) => setTagFilter(e.target.value || null)}
                  value={tagFilter || ""}
                  className="appearance-none border border-dr-border rounded-lg py-2 pl-4 pr-10 text-sm font-medium text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400 shadow-md"
                  style={{ background: "var(--dr-surface)" }}
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
          </div>
          {(tagFilter || searchQuery) && (
            <div className="mt-4 text-center sm:text-left">
              {(tagFilter || searchQuery) && (
                <div className="flex flex-wrap gap-2 items-center">
                  {tagFilter && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium" style={{ background: "var(--dr-amber-pale)", color: "var(--dr-amber-deep)" }}>
                      Tag: {tagFilter}
                      <button
                        onClick={() => setTagFilter(null)}
                        className="ml-2 hover:opacity-70"
                        style={{ color: "var(--dr-amber-deep)" }}
                      >
                        &times;
                      </button>
                    </span>
                  )}
                  {searchQuery && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium" style={{ background: "var(--dr-amber-pale)", color: "var(--dr-amber-deep)" }}>
                      Search: {searchQuery}
                      <button
                        onClick={() => setSearchQuery("")}
                        className="ml-2 hover:opacity-70"
                        style={{ color: "var(--dr-amber-deep)" }}
                      >
                        &times;
                      </button>
                    </span>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Articles Grid */}
        {filteredArticles.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-lg text-gray-600 dark:text-gray-400">
              No articles found. Try adjusting your search or filters.
            </p>
          </div>
        ) : (
          <>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {paginatedArticles.map((article) => (
              <Link
                key={article.id}
                href={`/${article.type}/${article.id}`}
                className="group block rounded-lg shadow-md hover:shadow-lg transition-all duration-300 border border-dr-border overflow-hidden"
              style={{ background: "var(--dr-surface)" }}
              >
                {/* Article Image */}
                {article.image && (
                  <div className="relative w-full h-32 overflow-hidden">
                    <Image
                      src={`/assets/${article.image.name}`}
                      alt={article.image.alt}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300 ease-out"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  </div>
                )}
                
                <div className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <span
                      className="inline-block px-2 py-1 rounded text-xs font-medium"
                      style={{ background: "var(--dr-amber-pale)", color: "var(--dr-amber-deep)" }}
                    >
                      {article.type.charAt(0).toUpperCase() + article.type.slice(1)}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {formatDate(article.date)}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-amber-700 dark:group-hover:text-amber-300 transition-colors line-clamp-2">
                    {article.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-3 line-clamp-2">
                    {article.description || ""}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {article.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="inline-block text-gray-700 dark:text-gray-300 px-2 py-0.5 rounded text-xs"
                        style={{ background: "var(--dr-cream)" }}
                      >
                        {tag}
                      </span>
                    ))}
                    {article.tags.length > 3 && (
                      <span className="inline-block text-gray-500 dark:text-gray-400 text-xs px-2">
                        +{article.tags.length - 3}
                      </span>
                    )}
                  </div>
                </div>
              </Link>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-12 flex flex-col items-center gap-4">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                      currentPage === 1
                        ? "text-gray-400 dark:text-gray-600 cursor-not-allowed"
                        : "text-gray-700 dark:text-gray-300 hover:bg-dr-hover border border-dr-border"
                    }`}
                    style={{ background: "var(--dr-surface)" }}
                  >
                    Previous
                  </button>

                  <div className="flex items-center gap-1">
                    {getPageNumbers().map((page, index) => {
                      if (page === '...') {
                        return (
                          <span
                            key={`ellipsis-${index}`}
                            className="px-3 py-2 text-gray-500 dark:text-gray-400"
                          >
                            ...
                          </span>
                        );
                      }

                      const pageNum = page as number;
                      return (
                        <button
                          key={pageNum}
                          onClick={() => handlePageChange(pageNum)}
                          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                            currentPage === pageNum
                              ? "text-white"
                              : "text-gray-700 dark:text-gray-300 hover:bg-dr-hover border border-dr-border"
                          }`}
                          style={currentPage === pageNum ? { background: "var(--dr-amber)" } : { background: "var(--dr-surface)" }}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                  </div>

                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                      currentPage === totalPages
                        ? "text-gray-400 dark:text-gray-600 cursor-not-allowed"
                        : "text-gray-700 dark:text-gray-300 hover:bg-dr-hover border border-dr-border"
                    }`}
                    style={{ background: "var(--dr-surface)" }}
                  >
                    Next
                  </button>
                </div>

                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Page {currentPage} of {totalPages} ({filteredArticles.length} {filteredArticles.length === 1 ? 'article' : 'articles'})
                </div>
              </div>
            )}
          </>
        )}
      </main>
      <Footer />
    </div>
  );
}
