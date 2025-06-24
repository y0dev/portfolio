import { notFound } from "next/navigation";
import { articles } from "@/data/articles";
import Link from "next/link";
import { formatDate, parseDate } from "@/utils";
import type { Metadata } from "next";

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  return articles
    .filter(article => article.type === "article")
    .map((article) => ({
      slug: article.id,
    }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = articles.find(a => a.id === slug && a.type === "article");

  if (!article) {
    return {
      title: "Article Not Found",
      description: "The requested article could not be found.",
    };
  }

  return {
    title: `${article.title} | Devontae Reid`,
    description: article.content[0]?.paragraphs?.[0]?.substring(0, 160) || "Blog post about technology and development insights.",
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
      description: article.content[0]?.paragraphs?.[0]?.substring(0, 160) || "Blog post about technology and development insights.",
      url: `https://www.devontaereid.com/article/${slug}`,
      siteName: "Devontae Reid",
      images: [
        {
          url: "https://www.devontaereid.com/images/logo.png",
          width: 1200,
          height: 630,
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
      description: article.content[0]?.paragraphs?.[0]?.substring(0, 160) || "Blog post about technology and development insights.",
      images: ["https://www.devontaereid.com/images/logo.png"],
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

export default async function ArticlePage({ params }: PageProps) {
  const { slug } = await params;
  const article = articles.find(a => a.id === slug && a.type === "article");

  if (!article) {
    notFound();
  }

  return (
    <div className="min-h-screen py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <Link href="/articles" className="text-blue-600 dark:text-blue-400 hover:underline">
            ← Back to Articles
          </Link>
        </nav>

        {/* Header */}
        <header className="mb-12">
          <div className="flex flex-wrap gap-2 mb-4">
            {article.tags.map((tag) => (
              <span
                key={tag}
                className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-full text-sm font-medium"
              >
                {tag}
              </span>
            ))}
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            {article.title}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg">{formatDate(article.date)}</p>
        </header>

        {/* Content */}
        <article className="prose prose-lg dark:prose-invert max-w-none">
          {article.content.map((section, sectionIndex) => {
            const images = section.images || [];
            const codeBlocks = section.code || [];
            const blockquotes = section.blockquotes || [];
            const links = section.links || [];
            const lists = section.lists || [];

            return (
              <section key={sectionIndex} className="mb-12">
                {/* Section title */}
                {section.title?.text && (
                  <h2 className="text-2xl font-bold mb-6">{section.title.text}</h2>
                )}

                {/* Paragraphs with placeholders */}
                {section.paragraphs?.map((paragraph: string, index: number) => {
                  // Placeholders
                  if (paragraph.startsWith(":imagePlace(")) {
                    const id = paragraph.match(/:imagePlace\((.*?)\)/)?.[1];
                    const image = images.find((img) => img.id === id);
                    if (!image) return null;
                    return (
                      <figure key={`image-${id}`} className="my-8">
                        <img
                          src={image.image || image.link}
                          alt={image.alt || image.title || "image"}
                          className="rounded-lg shadow-md"
                        />
                        {image.caption && (
                          <figcaption className="text-sm text-gray-500 dark:text-gray-400 mt-2 text-center">
                            {image.caption}
                          </figcaption>
                        )}
                      </figure>
                    );
                  }

                  if (paragraph.startsWith(":listPlace(")) {
                    const id = paragraph.match(/:listPlace\((.*?)\)/)?.[1];
                    const list = lists.find((l) => l.id === id);
                    if (!list) return null;
                    return list.list_type === "ordered" ? (
                      <ol key={`list-${id}`} className="list-decimal list-inside space-y-2 text-gray-700 dark:text-gray-300 my-4">
                        {list.items.map((item, i) => <li key={i}>{item}</li>)}
                      </ol>
                    ) : (
                      <ul key={`list-${id}`} className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300 my-4">
                        {list.items.map((item, i) => <li key={i}>{item}</li>)}
                      </ul>
                    );
                  }

                  if (paragraph.startsWith(":linkPlace(")) {
                    const id = paragraph.match(/:linkPlace\((.*?)\)/)?.[1];
                    const link = links.find((l) => l.id === id);
                    if (!link) return null;
                    return (
                      <div key={`link-${id}`} className="my-4">
                        <a
                          href={link.link || link.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
                        >
                          {link.text} →
                        </a>
                      </div>
                    );
                  }

                  return (
                    <p key={index} className="text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
                      {paragraph}
                    </p>
                  );
                })}

                {/* Code Blocks */}
                {codeBlocks.map((codeBlock) => (
                  <div key={codeBlock.id} className="my-8">
                    <div className="bg-gray-900 dark:bg-gray-800 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-gray-400 text-sm font-mono">
                          {codeBlock.language}
                        </span>
                      </div>
                      <pre className="text-gray-100 overflow-x-auto">
                        <code>{codeBlock.content}</code>
                      </pre>
                    </div>
                  </div>
                ))}

                {/* Blockquotes */}
                {blockquotes.map((blockquote) => (
                  <blockquote
                    key={blockquote.id}
                    className="border-l-4 border-blue-500 pl-6 my-8 italic text-gray-700 dark:text-gray-300"
                  >
                    &quot;{blockquote.content}&quot;
                  </blockquote>
                ))}
              </section>
            );
          })}
        </article>

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
    </div>
  );
}
