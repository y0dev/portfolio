import { shouldUseDatabase, getPool, dbToArticle } from '../db';
import { articles as staticArticles } from '@/data/articles';
import type { Article } from '@/types';
import { safeDataLoad } from '../data-loader';

/**
 * Get all articles from database or static files
 * Respects USE_DATABASE environment variable (defaults to static)
 * 
 * Note: For static export builds, always uses static files regardless of USE_DATABASE
 */
export async function getArticles(): Promise<Article[]> {
  return safeDataLoad(
    async () => {
      const pool = getPool();
      const [rows] = await pool.query('SELECT * FROM articles ORDER BY date DESC, created_at DESC');
      return (rows as any[]).map(dbToArticle);
    },
    () => staticArticles
  );
}

/**
 * Get article by ID from database or static files
 */
export async function getArticleById(id: string): Promise<Article | null> {
  return safeDataLoad(
    async () => {
      const pool = getPool();
      const [rows] = await pool.query('SELECT * FROM articles WHERE id = ?', [id]);
      const results = rows as any[];
      if (results.length === 0) return null;
      return dbToArticle(results[0]);
    },
    () => staticArticles.find(a => a.id === id) || null
  );
}

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

