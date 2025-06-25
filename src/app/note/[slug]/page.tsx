import { notFound } from "next/navigation";
import { articles } from "@/data/articles";
import {formatDate, parseDate} from "@/utils"
import Link from "next/link";
import Image from "next/image";
import ContentRenderer from "@/components/ContentRenderer";
import Footer from "@/components/Footer";
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
    description: note.description || "Personal note and reflection.",
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
      description: note.description || "Personal note and reflection.",
      url: `https://www.devontaereid.com/note/${slug}`,
      siteName: "Devontae Reid",
      images: [
        {
          url: "/logo512.png",
          width: 512,
          height: 512,
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
      description: note.description || "Personal note and reflection.",
      images: ["/logo512.png"],
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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <main className="py-20 px-4 sm:px-6 lg:px-8">
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
            <div className="flex items-center gap-4 mb-6">
              <span className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 px-3 py-1 rounded-full text-sm font-medium">
                Note
              </span>
              
              {/* Note Image */}
              {note.image && (
                <div className="relative w-16 h-16 rounded-xl overflow-hidden shadow-lg border-2 border-gray-200 dark:border-gray-700 flex-shrink-0 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-gray-800 dark:to-gray-700">
                  <Image
                    src={`/assets/${note.image.name}`}
                    alt={note.image.alt}
                    fill
                    className="object-cover hover:scale-110 transition-transform duration-300"
                    sizes="64px"
                  />
                </div>
              )}
              
              <div className="flex flex-wrap gap-2">
                {note.tags.map((tag) => (
                  <span
                    key={tag}
                    className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-full text-sm font-medium hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-4 leading-tight">
              {note.title}
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-lg flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              {formatDate(note.date)}
            </p>
          </header>

          {/* Note Content */}
          <ContentRenderer content={note.content} />
        </div>
      </main>
      <Footer />
    </div>
  );
} 