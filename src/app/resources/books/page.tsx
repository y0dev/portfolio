import Link from "next/link";
import Footer from "@/components/Footer";
import { resources } from "@/data/resources";
import type { Book } from "@/types";

export const metadata = {
  title: "Bookshelf | Devontae Reid",
  description: "Recommended books on technology, theology, and personal development",
};

function getStatusColor(status: Book["status"]) {
  switch (status) {
    case "Read":
      return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300";
    case "Reading":
      return "bg-amber-100 text-amber-800 dark:bg-amber-900/20 dark:text-amber-300";
    case "To Read":
      return "bg-dr-cream text-dr-text-muted border border-dr-border";
  }
}

function BookCard({ book }: { book: Book }) {
  const inner = (
    <>
      <div className="flex items-start gap-4 mb-4">
        <span className="text-3xl flex-shrink-0">{book.cover}</span>
        <div className="min-w-0">
          <h3 className="text-base font-bold text-gray-900 dark:text-white leading-snug mb-0.5">
            {book.title}
          </h3>
          <p className="text-sm font-medium" style={{ color: "var(--dr-amber-deep)" }}>
            by {book.author}
          </p>
        </div>
      </div>
      <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 flex-1 leading-relaxed">
        {book.description}
      </p>
      <div className="flex items-center justify-between mt-auto">
        <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(book.status)}`}>
          {book.status}
        </span>
        <span className="text-sm" style={{ color: "var(--dr-amber)" }}>
          {"★".repeat(book.rating)}{"☆".repeat(5 - book.rating)}
        </span>
      </div>
    </>
  );

  const className = "rounded-xl shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-1 border border-dr-border p-5 flex flex-col";
  const style = { background: "var(--dr-surface)" };

  if (book.link) {
    return (
      <a href={book.link} target="_blank" rel="noopener noreferrer" className={className} style={style}>
        {inner}
      </a>
    );
  }
  return <div className={className} style={style}>{inner}</div>;
}

export default function Bookshelf() {
  const reading = resources.books.filter(b => b.status === "Reading");
  const read = resources.books.filter(b => b.status === "Read");
  const toRead = resources.books.filter(b => b.status === "To Read");

  return (
    <div className="min-h-screen" style={{ background: "var(--dr-cream)" }}>
      {/* Hero */}
      <section className="py-20 px-4 sm:px-6 lg:px-8" style={{ background: "var(--dr-surface)" }}>
        <div className="max-w-7xl mx-auto">
          <nav className="mb-8 text-sm">
            <Link href="/resources" className="hover:underline" style={{ color: "var(--dr-amber-deep)" }}>
              ← Resources
            </Link>
          </nav>
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Bookshelf
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl">
            Books that have shaped how I think about engineering, theology, and craft. Organized by where I am with each one.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
        {reading.length > 0 && (
          <section>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
              <span className="inline-block w-2 h-2 rounded-full" style={{ background: "var(--dr-amber)" }} />
              Currently Reading
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {reading.map(book => <BookCard key={book.id} book={book} />)}
            </div>
          </section>
        )}

        {read.length > 0 && (
          <section>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
              <span className="inline-block w-2 h-2 rounded-full bg-green-500" />
              Read
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {read.map(book => <BookCard key={book.id} book={book} />)}
            </div>
          </section>
        )}

        {toRead.length > 0 && (
          <section>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
              <span className="inline-block w-2 h-2 rounded-full bg-gray-400 dark:bg-gray-500" />
              To Read
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {toRead.map(book => <BookCard key={book.id} book={book} />)}
            </div>
          </section>
        )}
      </div>

      <Footer />
    </div>
  );
}
