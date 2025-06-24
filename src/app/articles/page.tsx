'use client';

import { useState, useEffect, SetStateAction } from 'react';
import Link from 'next/link';
import { articles } from '@/data/articles';
import { parseDate } from '@/utils';

const categories = [
  "All",
  "Theology",
  "Covenant",
  "Thankful",
  "Health",
  "Tech",
  "Technology",
  "Embedded",
  "Quantum",
  "Algo",
  "Algorithm",
  "System Design",
  "Security",
  "Cloud",
  "AI",
  "RISC-V",
  "Linux",
  "Docker",
  "Kubernetes",
  "Networking",
  "Database",
  "System Programming",
  "Web Development",
  "Cryptography",
];


export default function Articles() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [currentArticlePage, setCurrentArticlePage] = useState(1);
  const [currentNotePage, setCurrentNotePage] = useState(1);
  const itemsPerPage = 6;

  useEffect(() => {
    setCurrentArticlePage(1);
    setCurrentNotePage(1);
  }, [selectedCategory]);

  const filtered = articles.filter((article) =>
    selectedCategory === 'All' ? true : article.tags?.includes(selectedCategory)
  );

  const featuredArticles = filtered
    .filter(a => a.type === 'article')
    .sort((a, b) => parseDate(b.date) - parseDate(a.date))
    .slice(0, 2);

  const allArticles = filtered
    .filter(a => a.type === 'article')
    .sort((a, b) => parseDate(b.date) - parseDate(a.date))
    .slice(2);

  const notes = filtered
    .filter(a => a.type === 'note')
    .sort((a, b) => parseDate(b.date) - parseDate(a.date));

  const totalArticlesPages = Math.ceil(allArticles.length / itemsPerPage);
  const totalNotesPages = Math.ceil(notes.length / itemsPerPage);

  const paginatedArticles = allArticles.slice(
    (currentArticlePage - 1) * itemsPerPage,
    currentArticlePage * itemsPerPage
  );

  const paginatedNotes = notes.slice(
    (currentNotePage - 1) * itemsPerPage,
    currentNotePage * itemsPerPage
  );

  function withPrefix(description?: string, type?: "note" | "article") {
    if (!description) return null;

    const prefix =
      type === "note"
        ? "This note is"
        : type === "article"
        ? "This article is"
        : "This note/article is";

    return `${prefix} ${description}...`;
  }

  const renderPagination = (totalPages: number, currentPage: number, setPage: { (value: SetStateAction<number>): void; (value: SetStateAction<number>): void; (arg0: number): void; }, color = 'blue') => (
    <div className="mt-8 flex justify-center space-x-2">
      {Array.from({ length: totalPages }, (_, i) => (
        <button
          key={i + 1}
          onClick={() => setPage(i + 1)}
          className={`px-4 py-2 rounded text-sm font-medium border transition-colors duration-200 ${
            currentPage === i + 1
              ? `bg-${color}-600 text-white border-${color}-600`
              : `bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-${color}-100 dark:hover:bg-${color}-900/30`
          }`}
        >
          {i + 1}
        </button>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Articles & Notes
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Thoughts, tutorials, and insights on web development, technology, and the ever-evolving landscape of software engineering.
          </p>
        </div>

        {/* Categories */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === category
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-blue-100 dark:hover:bg-blue-900/30 hover:text-blue-600 dark:hover:text-blue-400'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Featured Articles */}
        {featuredArticles.length > 0 && (
          <section className="mb-16">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
              Featured Articles
            </h2>
            <div className="grid lg:grid-cols-2 gap-8">
              {featuredArticles.map((article) => (
                <article
                  key={article.id}
                  className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
                >
                  <div className="h-48 bg-gradient-to-br from-green-500 to-blue-600 flex items-center justify-center">
                    <div className="text-white text-center">
                      <div className="text-4xl mb-2">📝</div>
                      <p className="font-medium">Article</p>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                      {article.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                      {withPrefix(article.description, "article")}...
                    </p>
                    <Link
                      href={`/article/${article.id}`}
                      className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
                    >
                      Read More →
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}

        {/* All Articles */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">All Articles</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedArticles.map((article) => (
              <article
                key={article.id}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="h-32 bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
                  <div className="text-white text-center">
                    <div className="text-2xl mb-1">📄</div>
                    <p className="text-sm font-medium">Article</p>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{article.title}</h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-3 text-sm">
                    {withPrefix(article.description,"article")}...
                  </p>
                  <Link
                    href={`/article/${article.id}`}
                    className="text-blue-600 dark:text-blue-400 hover:underline text-sm font-medium"
                  >
                    Read →
                  </Link>
                </div>
              </article>
            ))}
          </div>
          {renderPagination(totalArticlesPages, currentArticlePage, setCurrentArticlePage, 'blue')}
        </section>

        {/* Notes Section */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">Notes & Quick Thoughts</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedNotes.map((note) => (
              <article
                key={note.id}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow border-l-4 border-green-500"
              >
                <div className="h-32 bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
                  <div className="text-white text-center">
                    <div className="text-2xl mb-1">📝</div>
                    <p className="text-sm font-medium">Note</p>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{note.title}</h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-3 text-sm">
                    {withPrefix(note.description, "note")}...
                  </p>
                  <Link
                    href={`/note/${note.id}`}
                    className="text-green-600 dark:text-green-400 hover:underline text-sm font-medium"
                  >
                    Read →
                  </Link>
                </div>
              </article>
            ))}
          </div>
          {renderPagination(totalNotesPages, currentNotePage, setCurrentNotePage, 'green')}
        </section>
      </div>
    </div>
  );
}
