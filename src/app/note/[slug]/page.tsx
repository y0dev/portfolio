import { notFound } from "next/navigation";
import { articles } from "@/data/articles";
import {formatDate, parseDate} from "@/utils"
import Link from "next/link";
import type { Metadata } from "next";

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  return articles
    .filter(article => article.type === "note")
    .map((article) => ({
      slug: article.id,
    }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const note = articles.find(a => a.id === slug && a.type === "note");

  if (!note) {
    return {
      title: "Note Not Found",
      description: "The requested note could not be found.",
    };
  }

  return {
    title: `${note.title} | Devontae Reid`,
    description: note.content[0]?.paragraphs?.[0]?.substring(0, 160) || "Personal note and reflection.",
    metadataBase: new URL('https://www.devontaereid.com'),
    keywords: [...note.tags, "note", "reflection", "devontae reid", "personal"],
    authors: [{ name: "Devontae Reid" }],
    creator: "Devontae Reid",
    publisher: "Devontae Reid",
    category: "Personal",
    classification: "Note",
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    alternates: {
      canonical: `https://www.devontaereid.com/note/${slug}`,
    },
    openGraph: {
      title: note.title,
      description: note.content[0]?.paragraphs?.[0]?.substring(0, 160) || "Personal note and reflection.",
      url: `https://www.devontaereid.com/note/${slug}`,
      siteName: "Devontae Reid",
      images: [
        {
          url: "https://www.devontaereid.com/images/logo.png",
          width: 1200,
          height: 630,
          alt: note.title,
          type: "image/png",
        },
      ],
      locale: "en_US",
      type: "article",
      publishedTime: new Date(parseDate(note.date)).toISOString(),
      modifiedTime: new Date(parseDate(note.date)).toISOString(),
      authors: ["Devontae Reid"],
      tags: note.tags,
    },
    twitter: {
      card: "summary_large_image",
      title: note.title,
      description: note.content[0]?.paragraphs?.[0]?.substring(0, 160) || "Personal note and reflection.",
      images: ["https://www.devontaereid.com/images/logo.png"],
      site: "@_yodev_",
      creator: "@_yodev_",
    },
    other: {
      "article:author": "Devontae Reid",
      "article:section": "Personal",
      "article:tag": note.tags.join(", "),
      "article:published_time": new Date(parseDate(note.date)).toISOString(),
      "article:modified_time": new Date(parseDate(note.date)).toISOString(),
    },
  };
}

export default async function NotePage({ params }: PageProps) {
  const { slug } = await params;
  const note = articles.find(a => a.id === slug && a.type === "note");

  if (!note) {
    notFound();
  }

  return (
    <div className="min-h-screen py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <Link 
            href="/articles" 
            className="text-blue-600 dark:text-blue-400 hover:underline"
          >
            ← Back to Articles & Notes
          </Link>
        </nav>

        {/* Note Header */}
        <header className="mb-12">
          <div className="flex items-center gap-2 mb-4">
            <span className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 px-3 py-1 rounded-full text-sm font-medium">
              Note
            </span>
            <div className="flex flex-wrap gap-2">
              {note.tags.map((tag) => (
                <span
                  key={tag}
                  className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-full text-sm font-medium"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            {note.title}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg">{formatDate(note.date)}</p>
        </header>

        {/* Note Content */}
        <article className="prose prose-lg dark:prose-invert max-w-none">
          {note.content.map((section, sectionIndex) => (
            <section key={sectionIndex} className="mb-12">
              {/* Paragraphs */}
              {section.paragraphs.map((paragraph, index) => (
                <p key={index} className="text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
                  {paragraph}
                </p>
              ))}

              {/* Images */}
              {section.images?.map((image) => (
                <figure key={image.id} className="my-8">
                  <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-8 text-center">
                    <div className="text-4xl mb-4">🖼️</div>
                    <p className="text-gray-600 dark:text-gray-400">
                      Image: {image.title}
                    </p>
                    {image.caption && (
                      <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
                        {image.caption}
                      </p>
                    )}
                  </div>
                </figure>
              ))}

              {/* Code Blocks */}
              {section.code?.map((codeBlock) => (
                <div key={codeBlock.id} className="my-8">
                  <div className="bg-gray-900 dark:bg-gray-800 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-gray-400 text-sm font-mono">
                        {codeBlock.language}
                      </span>
                      <button className="text-gray-400 hover:text-white text-sm">
                        Copy
                      </button>
                    </div>
                    <pre className="text-gray-100 overflow-x-auto">
                      <code>{codeBlock.content}</code>
                    </pre>
                  </div>
                </div>
              ))}

              {/* Blockquotes */}
              {section.blockquotes?.map((blockquote) => (
                <blockquote
                  key={blockquote.id}
                  className="border-l-4 border-green-500 pl-6 my-8 italic text-gray-700 dark:text-gray-300 bg-green-50 dark:bg-green-900/20 py-4 rounded-r-lg"
                >
                  &quot;{blockquote.content}&quot;
                </blockquote>
              ))}

              {/* Links */}
              {section.links?.map((link) => (
                <div key={link.id} className="my-6">
                  <a
                    href={link.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
                  >
                    {link.text} →
                  </a>
                </div>
              ))}

              {/* Lists */}
              {section.lists?.map((list) => (
                <div key={list.id} className="my-6">
                  {list.list_type === "ordered" ? (
                    <ol className="list-decimal list-inside space-y-2 text-gray-700 dark:text-gray-300">
                      {list.items.map((item, index) => (
                        <li key={index}>{item}</li>
                      ))}
                    </ol>
                  ) : (
                    <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
                      {list.items.map((item, index) => (
                        <li key={index}>{item}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </section>
          ))}
        </article>

        {/* Note Footer */}
        <footer className="mt-16 pt-8 border-t border-gray-200 dark:border-gray-700">
          <div className="flex flex-wrap gap-4">
            <span className="text-gray-600 dark:text-gray-400">Tags:</span>
            {note.tags.map((tag) => (
              <Link
                key={tag}
                href={`/articles?tag=${tag}`}
                className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-3 py-1 rounded-full text-sm hover:bg-blue-100 dark:hover:bg-blue-900/30 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                {tag}
              </Link>
            ))}
          </div>
        </footer>
      </div>
    </div>
  );
} 