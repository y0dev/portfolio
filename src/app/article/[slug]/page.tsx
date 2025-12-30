import { notFound } from "next/navigation";
import { articles as staticArticles } from "@/data/articles";
import { getArticleBySlug, getArticlesSync } from "@/lib/data/articles";
import Link from "next/link";
import Image from "next/image";
import { formatDateFull, parseDate, calculateReadingTime } from "@/utils";
import ContentRenderer from "@/components/ContentRenderer";
import ShareButton from "@/components/ShareButton";
import ArticleSidebar from "@/components/ArticleSidebar";
import type { Metadata } from "next";

export function generateStaticParams() {
  // For static export, use static files synchronously
  return getArticlesSync()
    .filter(article => article.type === "article")
    .map((article) => ({
      slug: article.id,
    }));
}


export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  
  // Ensure it's an article type
  if (!article || article.type !== "article") {
    return {
      title: "Article Not Found",
      description: "The requested article could not be found.",
    };
  }

  return {
    title: `${article.title} | Devontae Reid`,
    description: article.description || "Blog post about technology and development insights.",
    metadataBase: new URL('https://www.devontaereid.com'),
    keywords: [...article.tags, "blog", "article", "devontae reid", "technology", "development"],
    authors: [{ name: "Devontae Reid" }],
    creator: "Devontae Reid",
    publisher: "Devontae Reid",
    category: "Technology",
    classification: "Blog",
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
      canonical: `https://www.devontaereid.com/article/${slug}`,
    },
    openGraph: {
      title: article.title,
      description: article.description || "Blog post about technology and development insights.",
      url: `https://www.devontaereid.com/article/${slug}`,
      siteName: "Devontae Reid",
      images: [
        {
          url: "/logo512.png",
          width: 512,
          height: 512,
          alt: article.title,
          type: "image/png",
        },
      ],
      locale: "en_US",
      type: "article",
      publishedTime: new Date(parseDate(article.date)).toISOString(),
      modifiedTime: new Date(parseDate(article.date)).toISOString(),
      authors: ["Devontae Reid"],
      tags: article.tags,
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.description || "Blog post about technology and development insights.",
      images: ["/logo512.png"],
      site: "@_yodev_",
      creator: "@_yodev_",
    },
    other: {
      "article:author": "Devontae Reid",
      "article:section": "Technology",
      "article:tag": article.tags.join(", "),
      "article:published_time": new Date(parseDate(article.date)).toISOString(),
      "article:modified_time": new Date(parseDate(article.date)).toISOString(),
    },
  };
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article || article.type !== "article") {
    notFound();
  }

  return (
    <div className="min-h-screen py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col xl:flex-row">
          {/* Main Content */}
          <div className="flex-1 max-w-4xl">
            {/* Breadcrumb */}
            <nav className="mb-8">
              <Link href="/articles" className="text-blue-600 dark:text-blue-400 hover:underline">
                ← Back to Articles
              </Link>
            </nav>

            {/* Header */}
            <div className="post-hero">
              {/* Image, Badge, and Title Container */}
              <div className="post-hero-header">
                {article.image && (
                  <div className="post-hero-visual">
                    <div className="post-hero-image">
                      <Image
                        src={`/assets/${article.image.name}`}
                        alt={article.image.alt}
                        width={200}
                        height={200}
                        className="post-header-image"
                      />
                    </div>
                  </div>
                )}
                <div className="post-hero-title-section">
                  <div className="post-meta-badge">
                    <span>Article</span>
                  </div>
                  <h1 id="post-header-title">{article.title}</h1>
                </div>
              </div>

              {/* Metadata */}
              <div className="post-header-meta">
                <div className="author-info">
                  <Image
                    src="https://i.ibb.co/HY4dx9s/headshot.jpg"
                    alt="Devontae Reid"
                    width={48}
                    height={48}
                    className="post-header-icon"
                  />
                  <div className="author-details">
                    <span className="author-name">Devontae Reid</span>
                    <div className="post-date flex items-center gap-3">
                      <span>{formatDateFull(article.date)}</span>
                      <span className="text-gray-400 dark:text-gray-500">•</span>
                      <span>{calculateReadingTime(article.content)} min read</span>
                    </div>
                  </div>
                </div>
                <ShareButton />
              </div>

              {/* Tags */}
              <div className="post-header-tags">
                {article.tags.map((tag) => (
                  <span key={tag} className="post-header-tag">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Content */}
            <ContentRenderer content={article.content} />

            {/* Footer */}
            <footer className="mt-16 pt-8 border-t border-gray-200 dark:border-gray-700">
              <div className="flex flex-wrap gap-4">
                <span className="text-gray-600 dark:text-gray-400">Tags:</span>
                {article.tags.map((tag) => (
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

          {/* Sidebar */}
          <ArticleSidebar currentArticleId={article.id} />
        </div>
      </div>
    </div>
  );
}
