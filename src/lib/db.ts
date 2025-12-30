import mysql from 'mysql2/promise';

// Database connection configuration
function getDbConfig() {
  return {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'portfolio',
    port: parseInt(process.env.DB_PORT || '3306'),
  };
}

// Create connection pool
let pool: mysql.Pool | null = null;

export function getPool(): mysql.Pool {
  if (!pool) {
    pool = mysql.createPool({
      ...getDbConfig(),
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    });
  }
  return pool;
}

/**
 * Check if database should be used (based on environment variable)
 * Defaults to false (use static files)
 */
export function shouldUseDatabase(): boolean {
  return process.env.USE_DATABASE === 'true';
}

/**
 * Convert database row to Article format
 */
export function dbToArticle(row: any): any {
  return {
    id: row.id,
    title: row.title,
    description: row.description || undefined,
    date: row.date,
    tags: JSON.parse(row.tags || '[]'),
    type: row.type,
    image: {
      alt: row.image_alt || '',
      name: row.image_name || '',
    },
    content: JSON.parse(row.content || '[]'),
  };
}

/**
 * Convert database row to Project format
 */
export function dbToProject(row: any): any {
  return {
    id: row.id,
    title: row.title,
    description: row.description || '',
    technologies: JSON.parse(row.technologies || '[]'),
    image: row.image || '',
    link: row.link || '',
    github: row.github || '',
    isEmoji: row.is_emoji || false,
    featured: row.featured || false,
  };
}

/**
 * Convert database row to ResourceBook format
 */
export function dbToResourceBook(row: any): any {
  return {
    id: row.id,
    title: row.title,
    author: row.author,
    category: row.category || '',
    description: row.description || '',
    cover: row.cover || '',
    rating: row.rating || 0,
    status: row.status || 'To Read',
    featured: row.featured || false,
    link: row.link || '',
    image: row.image || '',
  };
}

/**
 * Convert database row to resource format (tools, dev_resources, podcasts, etc.)
 */
export function dbToResource(row: any): any {
  return {
    id: row.id,
    name: row.name,
    category: row.category || '',
    description: row.description || '',
    url: row.url || '',
    icon: row.icon || '',
  };
}

