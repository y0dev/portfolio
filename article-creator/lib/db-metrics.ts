import { getPool } from './db';

/**
 * Engagement metrics functions for articles
 * These are ready for future use when you switch to database-driven content
 */

export interface ArticleMetrics {
  post_likes: number;
  post_views: number;
  post_comments: number;
  post_shares: number;
  post_replies: number;
  post_reposts: number;
}

/**
 * Get engagement metrics for an article
 */
export async function getArticleMetrics(id: string): Promise<ArticleMetrics | null> {
  const pool = getPool();
  const [rows] = await pool.query(
    `SELECT post_likes, post_views, post_comments, post_shares, post_replies, post_reposts 
     FROM articles WHERE id = ?`,
    [id]
  );
  const results = rows as any[];
  if (results.length === 0) return null;
  
  return {
    post_likes: results[0].post_likes || 0,
    post_views: results[0].post_views || 0,
    post_comments: results[0].post_comments || 0,
    post_shares: results[0].post_shares || 0,
    post_replies: results[0].post_replies || 0,
    post_reposts: results[0].post_reposts || 0,
  };
}

/**
 * Increment a specific metric for an article
 */
export async function incrementMetric(
  id: string,
  metric: keyof ArticleMetrics,
  amount: number = 1
): Promise<void> {
  const pool = getPool();
  // Map metric keys to column names safely (whitelist approach)
  const columnMap: Record<keyof ArticleMetrics, string> = {
    post_likes: 'post_likes',
    post_views: 'post_views',
    post_comments: 'post_comments',
    post_shares: 'post_shares',
    post_replies: 'post_replies',
    post_reposts: 'post_reposts',
  };
  const columnName = columnMap[metric];
  if (!columnName) {
    throw new Error(`Invalid metric: ${metric}`);
  }
  // Use template literal with whitelisted column name (safe because it's from our map)
  await pool.query(
    `UPDATE articles SET \`${columnName}\` = \`${columnName}\` + ? WHERE id = ?`,
    [amount, id]
  );
}

/**
 * Update multiple metrics at once
 */
export async function updateMetrics(id: string, metrics: Partial<ArticleMetrics>): Promise<void> {
  const pool = getPool();
  // Map metric keys to column names safely (whitelist approach)
  const columnMap: Record<keyof ArticleMetrics, string> = {
    post_likes: 'post_likes',
    post_views: 'post_views',
    post_comments: 'post_comments',
    post_shares: 'post_shares',
    post_replies: 'post_replies',
    post_reposts: 'post_reposts',
  };
  
  const updates: string[] = [];
  const values: any[] = [];
  
  Object.entries(metrics).forEach(([key, value]) => {
    const columnName = columnMap[key as keyof ArticleMetrics];
    if (columnName) {
      // Use template literal with whitelisted column name (safe because it's from our map)
      updates.push(`\`${columnName}\` = ?`);
      values.push(value);
    }
  });
  
  if (updates.length > 0) {
    values.push(id);
    await pool.query(
      `UPDATE articles SET ${updates.join(', ')} WHERE id = ?`,
      values
    );
  }
}

/**
 * Get article by slug (for future SEO-friendly URLs)
 */
export async function getArticleBySlug(slug: string): Promise<any | null> {
  const pool = getPool();
  const [rows] = await pool.query('SELECT * FROM articles WHERE slug = ?', [slug]);
  const results = rows as any[];
  if (results.length === 0) return null;
  return results[0];
}

