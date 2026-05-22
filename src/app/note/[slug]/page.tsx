import { notFound } from "next/navigation";
import { getArticleBySlug, getArticlesSync } from "@/lib/data/articles";
import { formatDateFull, parseDate, calculateReadingTime } from "@/utils"
import Link from "next/link";
import Image from "next/image";
import ContentRenderer from "@/components/ContentRenderer";
import ShareButton from "@/components/ShareButton";
import Footer from "@/components/Footer";
import type { Metadata } from "next";

export async function generateStaticParams() {
  // For static export, use static files synchronously
  return getArticlesSync()
    .filter(article => article.type === "note")
    .map(article => ({ slug: article.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const note = await getArticleBySlug(slug);
  
  // Ensure it's a note type
  if (!note || note.type !== "note") {
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

export default async function NotePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const note = await getArticleBySlug(slug);

  if (!note || note.type !== "note") {
    notFound();
  }

  return (
    <div className="min-h-screen" style={{ background: "var(--dr-cream)" }}>
      <main className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Breadcrumb */}
          <nav className="mb-8">
            <Link 
              href="/articles" 
              className="hover:underline"
              style={{ color: "var(--dr-amber-deep)" }}
            >
              ← Back to Articles & Notes
            </Link>
          </nav>

          {/* Note Header */}
          <div className="post-hero">
            {/* Image, Badge, and Title Container */}
            <div className="post-hero-header">
              {note.image && (
                <div className="post-hero-visual">
                  <div className="post-hero-image">
                    <Image
                      src={`/assets/${note.image.name}`}
                      alt={note.image.alt}
                      width={200}
                      height={200}
                      className="post-header-image"
                    />
                  </div>
                </div>
              )}
              <div className="post-hero-title-section">
                <div className="post-meta-badge">
                  <span>Note</span>
                </div>
                <h1 id="post-header-title">{note.title}</h1>
              </div>
            </div>

            {/* Metadata */}
            <div className="post-header-meta">
              <div className="author-info">
                <Image
                  src="/assets/images/headshot.jpeg"
                  alt="Devontae Reid"
                  width={48}
                  height={48}
                  className="post-header-icon"
                />
                <div className="author-details">
                  <span className="author-name">Devontae Reid</span>
                  <div className="post-date flex items-center gap-3">
                    <span>{formatDateFull(note.date)}</span>
                    <span className="text-gray-400 dark:text-gray-500">•</span>
                    <span>{calculateReadingTime(note.content)} min read</span>
                  </div>
                </div>
              </div>
              <ShareButton />
            </div>

            {/* Tags */}
            <div className="post-header-tags">
              {note.tags.map((tag) => (
                <span key={tag} className="post-header-tag">
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Note Content */}
          <ContentRenderer content={note.content} />
        </div>
      </main>
      <Footer />
    </div>
  );
} 