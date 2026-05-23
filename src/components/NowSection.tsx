"use client";

import Link from "next/link";
import { resources } from "@/data/resources";
import { articles } from "@/data/articles";
import { formatDateFull, parseDate } from "@/utils";

export default function NowSection() {
  const currentlyReading = resources.books.filter(b => b.status === "Reading").slice(0, 3);
  const recentWriting = articles.slice(0, 3);

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8" style={{ background: "var(--dr-surface)" }}>
      <div className="max-w-5xl mx-auto">
        <div className="mb-12">
          <p className="text-xs font-semibold tracking-widest uppercase mb-3" style={{ color: "var(--dr-amber-deep)" }}>
            Right now
          </p>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            What I&apos;m up to
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Currently Reading */}
          <div>
            <h3 className="text-xs font-semibold tracking-widest uppercase mb-5 text-gray-400 dark:text-gray-500">
              Reading
            </h3>
            <div className="space-y-5">
              {currentlyReading.length > 0 ? currentlyReading.map(book => (
                <div key={book.id} className="flex gap-3">
                  <span className="text-2xl flex-shrink-0 mt-0.5">{book.cover}</span>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white text-sm leading-snug">{book.title}</p>
                    <p className="text-xs mt-0.5" style={{ color: "var(--dr-amber-deep)" }}>by {book.author}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 leading-snug">{book.description}</p>
                  </div>
                </div>
              )) : (
                <p className="text-sm text-gray-500 dark:text-gray-400">Nothing in the queue right now.</p>
              )}
            </div>
            <Link
              href="/resources/books"
              className="inline-block mt-6 text-xs font-medium transition-colors duration-200"
              style={{ color: "var(--dr-amber-deep)" }}
            >
              Full bookshelf →
            </Link>
          </div>

          {/* Recent Writing */}
          <div>
            <h3 className="text-xs font-semibold tracking-widest uppercase mb-5 text-gray-400 dark:text-gray-500">
              Writing
            </h3>
            <div className="space-y-5">
              {recentWriting.map(article => (
                <Link
                  key={article.id}
                  href={`/${article.type === "note" ? "note" : "article"}/${article.id}`}
                  className="block group"
                >
                  <p className="font-semibold text-gray-900 dark:text-white text-sm leading-snug group-hover:underline">
                    {article.title}
                  </p>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                    {formatDateFull(article.date)}
                  </p>
                </Link>
              ))}
            </div>
            <Link
              href="/articles"
              className="inline-block mt-6 text-xs font-medium transition-colors duration-200"
              style={{ color: "var(--dr-amber-deep)" }}
            >
              All articles →
            </Link>
          </div>

        </div>
      </div>
    </section>
  );
}
