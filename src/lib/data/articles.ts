import { shouldUseDatabase, getPool, dbToArticle } from '../db';
import { articles as staticArticles } from '@/data/articles';
import type { Article } from '@/types';
import { safeDataLoad } from '../data-loader';

/**
 * Get article by slug from database or static files
 */
export async function getArticleBySlug(slug: string): Promise<Article | null> {
  return safeDataLoad(
    async () => {
      const pool = getPool();
      const [rows] = await pool.query('SELECT * FROM articles WHERE slug = ?', [slug]);
      const results = rows as any[];
      if (results.length === 0) return null;
      return dbToArticle(results[0]);
    },
    () => staticArticles.find(a => a.id === slug) || null
  );
}

/**
 * Get all articles synchronously (for use in generateStaticParams)
 * Always uses static files for static export compatibility
 */
export function getArticlesSync(): Article[] {
  return staticArticles;
}

