import mysql from 'mysql2/promise';
import type { Article } from '@/types';
import { slugifyTitle } from '@/lib/utils';

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

// Initialize database and create all tables if they don't exist
export async function initDatabase(): Promise<void> {
  const connection = await mysql.createConnection(getDbConfig());
  
  try {
    // Create articles table if it doesn't exist
    await connection.query(`
      CREATE TABLE IF NOT EXISTS articles (
        id VARCHAR(255) PRIMARY KEY,
        title VARCHAR(500) NOT NULL,
        slug VARCHAR(500) NOT NULL,
        description TEXT,
        date VARCHAR(100) NOT NULL,
        tags JSON NOT NULL,
        type ENUM('article', 'note') NOT NULL,
        image_alt VARCHAR(500),
        image_name VARCHAR(500),
        content JSON NOT NULL,
        post_likes INT DEFAULT 0,
        post_views INT DEFAULT 0,
        post_comments INT DEFAULT 0,
        post_shares INT DEFAULT 0,
        post_replies INT DEFAULT 0,
        post_reposts INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_type (type),
        INDEX idx_date (date),
        INDEX idx_slug (slug)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    // Create projects table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS projects (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(500) NOT NULL,
        slug VARCHAR(500) NOT NULL,
        description TEXT,
        technologies JSON NOT NULL,
        image VARCHAR(500),
        link VARCHAR(500),
        github VARCHAR(500),
        is_emoji BOOLEAN DEFAULT FALSE,
        featured BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_featured (featured),
        INDEX idx_slug (slug)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    // Create resource_books table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS resource_books (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(500) NOT NULL,
        author VARCHAR(500) NOT NULL,
        category VARCHAR(200),
        description TEXT,
        cover VARCHAR(10),
        rating INT DEFAULT 0,
        status VARCHAR(50) DEFAULT 'To Read',
        featured BOOLEAN DEFAULT FALSE,
        link VARCHAR(500),
        image VARCHAR(500),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_category (category),
        INDEX idx_status (status),
        INDEX idx_featured (featured)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    // Create resource_tools table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS resource_tools (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(500) NOT NULL,
        category VARCHAR(200),
        description TEXT,
        icon VARCHAR(10),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_category (category)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    // Create resource_dev_resources table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS resource_dev_resources (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(500) NOT NULL,
        category VARCHAR(200),
        description TEXT,
        url VARCHAR(500),
        icon VARCHAR(10),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_category (category)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    // Create resource_podcasts table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS resource_podcasts (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(500) NOT NULL,
        category VARCHAR(200),
        description TEXT,
        url VARCHAR(500),
        icon VARCHAR(10),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_category (category)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    // Create resource_youtube_channels table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS resource_youtube_channels (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(500) NOT NULL,
        category VARCHAR(200),
        description TEXT,
        url VARCHAR(500),
        icon VARCHAR(10),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_category (category)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    // Create resource_theology_resources table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS resource_theology_resources (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(500) NOT NULL,
        category VARCHAR(200),
        description TEXT,
        url VARCHAR(500),
        icon VARCHAR(10),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_category (category)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
  } finally {
    await connection.end();
  }
}

// Convert Article to database format
export function articleToDb(article: Article): any {
  // Generate slug from title if not provided (for future use)
  const slug = slugifyTitle(article.title) || article.id;
  
  return {
    id: article.id,
    title: article.title,
    slug: slug,
    description: article.description || null,
    date: typeof article.date === 'string' ? article.date : new Date(article.date).toISOString(),
    tags: JSON.stringify(article.tags),
    type: article.type,
    image_alt: article.image?.alt || null,
    image_name: article.image?.name || null,
    content: JSON.stringify(article.content),
    // Engagement metrics default to 0 (for future use)
    post_likes: 0,
    post_views: 0,
    post_comments: 0,
    post_shares: 0,
    post_replies: 0,
    post_reposts: 0,
  };
}

// Convert database row to Article
export function dbToArticle(row: any): Article {
  return {
    id: row.id,
    title: row.title,
    description: row.description || undefined,
    date: row.date,
    tags: JSON.parse(row.tags),
    type: row.type,
    image: {
      alt: row.image_alt || '',
      name: row.image_name || '',
    },
    content: JSON.parse(row.content),
  };
}

// Article CRUD operations
export async function getAllArticles(): Promise<Article[]> {
  const pool = getPool();
  const [rows] = await pool.query('SELECT * FROM articles ORDER BY date DESC, created_at DESC');
  return (rows as any[]).map(dbToArticle);
}

export async function getArticleById(id: string): Promise<Article | null> {
  const pool = getPool();
  const [rows] = await pool.query('SELECT * FROM articles WHERE id = ?', [id]);
  const results = rows as any[];
  if (results.length === 0) return null;
  return dbToArticle(results[0]);
}

export async function createArticle(article: Article): Promise<void> {
  const pool = getPool();
  const dbData = articleToDb(article);
  await pool.query(
    `INSERT INTO articles (id, title, slug, description, date, tags, type, image_alt, image_name, content, post_likes, post_views, post_comments, post_shares, post_replies, post_reposts)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      dbData.id,
      dbData.title,
      dbData.slug,
      dbData.description,
      dbData.date,
      dbData.tags,
      dbData.type,
      dbData.image_alt,
      dbData.image_name,
      dbData.content,
      dbData.post_likes,
      dbData.post_views,
      dbData.post_comments,
      dbData.post_shares,
      dbData.post_replies,
      dbData.post_reposts,
    ]
  );
}

export async function updateArticle(id: string, article: Article): Promise<void> {
  const pool = getPool();
  const dbData = articleToDb(article);
  await pool.query(
    `UPDATE articles 
     SET title = ?, slug = ?, description = ?, date = ?, tags = ?, type = ?, 
         image_alt = ?, image_name = ?, content = ?
     WHERE id = ?`,
    [
      dbData.title,
      dbData.slug,
      dbData.description,
      dbData.date,
      dbData.tags,
      dbData.type,
      dbData.image_alt,
      dbData.image_name,
      dbData.content,
      id,
    ]
  );
}

export async function deleteArticle(id: string): Promise<void> {
  const pool = getPool();
  await pool.query('DELETE FROM articles WHERE id = ?', [id]);
}

