import Link from "next/link";
import Image from "next/image";
import { articles } from "@/data/articles";
import { formatDate, parseDate } from "@/utils";
import type { Article } from "@/types";

interface ArticleSidebarProps {
  currentArticleId: string;
}

export default function ArticleSidebar({ currentArticleId }: ArticleSidebarProps) {
  // Get latest articles (excluding current one), sorted by date, limit to 2
  const latestArticles = articles
    .filter((article) => article.type === "article" && article.id !== currentArticleId)
    .sort((a, b) => {
      const dateA = typeof a.date === "string" ? parseDate(a.date) : (typeof a.date === "number" ? a.date : 0);
      const dateB = typeof b.date === "string" ? parseDate(b.date) : (typeof b.date === "number" ? b.date : 0);
      return dateB - dateA;
    })
    .slice(0, 2);

  // Don't render if there are no articles
  if (latestArticles.length === 0) {
    return null;
  }

  return (
    <aside className="hidden xl:block xl:sticky xl:top-24 xl:self-start xl:w-80 xl:ml-8">
      <div className="bg-dr-surface rounded-lg p-6 border border-dr-border">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
          Latest Articles
        </h2>
        <div className="space-y-4">
          {latestArticles.map((article) => (
            <Link
              key={article.id}
              href={`/article/${article.id}`}
              className="block group hover:opacity-80 transition-opacity"
            >
              <div className="flex gap-3">
                {article.image && (
                  <div className="flex-shrink-0 w-20 h-20 relative overflow-hidden rounded-md">
                    <Image
                      src={`/assets/${article.image.name}`}
                      alt={article.image.alt}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-200"
                    />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-semibold text-dr-text line-clamp-2 group-hover:text-amber-700 dark:group-hover:text-amber-300 transition-colors">
                    {article.title}
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {formatDate(article.date)}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </aside>
  );
}

