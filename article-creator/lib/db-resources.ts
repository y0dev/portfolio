import mysql from 'mysql2/promise';
import { getPool } from './db';
import type {
  ResourceBook,
  ResourceTool,
  ResourceDevResource,
  ResourcePodcast,
  ResourceYouTubeChannel,
  ResourceTheologyResource,
} from '@/types';

// ============ Books ============
export function bookToDb(book: ResourceBook): any {
  return {
    title: book.title,
    author: book.author,
    category: book.category || null,
    description: book.description || null,
    cover: book.cover || null,
    rating: book.rating || 0,
    status: book.status || 'To Read',
    featured: book.featured || false,
    link: book.link || null,
    image: book.image || null,
  };
}

export function dbToBook(row: any): ResourceBook {
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

export async function getAllBooks(): Promise<ResourceBook[]> {
  const pool = getPool();
  const [rows] = await pool.query('SELECT * FROM resource_books ORDER BY featured DESC, id DESC');
  return (rows as any[]).map(dbToBook);
}

export async function getBookById(id: number): Promise<ResourceBook | null> {
  const pool = getPool();
  const [rows] = await pool.query('SELECT * FROM resource_books WHERE id = ?', [id]);
  const results = rows as any[];
  if (results.length === 0) return null;
  return dbToBook(results[0]);
}

export async function createBook(book: ResourceBook): Promise<number> {
  const pool = getPool();
  const dbData = bookToDb(book);
  const [result] = await pool.query(
    `INSERT INTO resource_books (title, author, category, description, cover, rating, status, featured, link, image)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      dbData.title,
      dbData.author,
      dbData.category,
      dbData.description,
      dbData.cover,
      dbData.rating,
      dbData.status,
      dbData.featured,
      dbData.link,
      dbData.image,
    ]
  );
  return (result as mysql.ResultSetHeader).insertId;
}

export async function updateBook(id: number, book: ResourceBook): Promise<void> {
  const pool = getPool();
  const dbData = bookToDb(book);
  await pool.query(
    `UPDATE resource_books 
     SET title = ?, author = ?, category = ?, description = ?, cover = ?, 
         rating = ?, status = ?, featured = ?, link = ?, image = ?
     WHERE id = ?`,
    [
      dbData.title,
      dbData.author,
      dbData.category,
      dbData.description,
      dbData.cover,
      dbData.rating,
      dbData.status,
      dbData.featured,
      dbData.link,
      dbData.image,
      id,
    ]
  );
}

export async function deleteBook(id: number): Promise<void> {
  const pool = getPool();
  await pool.query('DELETE FROM resource_books WHERE id = ?', [id]);
}

// ============ Tools ============
export function toolToDb(tool: ResourceTool): any {
  return {
    name: tool.name,
    category: tool.category || null,
    description: tool.description || null,
    icon: tool.icon || null,
  };
}

export function dbToTool(row: any): ResourceTool {
  return {
    id: row.id,
    name: row.name,
    category: row.category || '',
    description: row.description || '',
    icon: row.icon || '',
  };
}

export async function getAllTools(): Promise<ResourceTool[]> {
  const pool = getPool();
  const [rows] = await pool.query('SELECT * FROM resource_tools ORDER BY id DESC');
  return (rows as any[]).map(dbToTool);
}

export async function getToolById(id: number): Promise<ResourceTool | null> {
  const pool = getPool();
  const [rows] = await pool.query('SELECT * FROM resource_tools WHERE id = ?', [id]);
  const results = rows as any[];
  if (results.length === 0) return null;
  return dbToTool(results[0]);
}

export async function createTool(tool: ResourceTool): Promise<number> {
  const pool = getPool();
  const dbData = toolToDb(tool);
  const [result] = await pool.query(
    `INSERT INTO resource_tools (name, category, description, icon)
     VALUES (?, ?, ?, ?)`,
    [dbData.name, dbData.category, dbData.description, dbData.icon]
  );
  return (result as mysql.ResultSetHeader).insertId;
}

export async function updateTool(id: number, tool: ResourceTool): Promise<void> {
  const pool = getPool();
  const dbData = toolToDb(tool);
  await pool.query(
    `UPDATE resource_tools SET name = ?, category = ?, description = ?, icon = ? WHERE id = ?`,
    [dbData.name, dbData.category, dbData.description, dbData.icon, id]
  );
}

export async function deleteTool(id: number): Promise<void> {
  const pool = getPool();
  await pool.query('DELETE FROM resource_tools WHERE id = ?', [id]);
}

// ============ Dev Resources ============
export function devResourceToDb(resource: ResourceDevResource): any {
  return {
    name: resource.name,
    category: resource.category || null,
    description: resource.description || null,
    url: resource.url || null,
    icon: resource.icon || null,
  };
}

export function dbToDevResource(row: any): ResourceDevResource {
  return {
    id: row.id,
    name: row.name,
    category: row.category || '',
    description: row.description || '',
    url: row.url || '',
    icon: row.icon || '',
  };
}

export async function getAllDevResources(): Promise<ResourceDevResource[]> {
  const pool = getPool();
  const [rows] = await pool.query('SELECT * FROM resource_dev_resources ORDER BY id DESC');
  return (rows as any[]).map(dbToDevResource);
}

export async function getDevResourceById(id: number): Promise<ResourceDevResource | null> {
  const pool = getPool();
  const [rows] = await pool.query('SELECT * FROM resource_dev_resources WHERE id = ?', [id]);
  const results = rows as any[];
  if (results.length === 0) return null;
  return dbToDevResource(results[0]);
}

export async function createDevResource(resource: ResourceDevResource): Promise<number> {
  const pool = getPool();
  const dbData = devResourceToDb(resource);
  const [result] = await pool.query(
    `INSERT INTO resource_dev_resources (name, category, description, url, icon)
     VALUES (?, ?, ?, ?, ?)`,
    [dbData.name, dbData.category, dbData.description, dbData.url, dbData.icon]
  );
  return (result as mysql.ResultSetHeader).insertId;
}

export async function updateDevResource(id: number, resource: ResourceDevResource): Promise<void> {
  const pool = getPool();
  const dbData = devResourceToDb(resource);
  await pool.query(
    `UPDATE resource_dev_resources SET name = ?, category = ?, description = ?, url = ?, icon = ? WHERE id = ?`,
    [dbData.name, dbData.category, dbData.description, dbData.url, dbData.icon, id]
  );
}

export async function deleteDevResource(id: number): Promise<void> {
  const pool = getPool();
  await pool.query('DELETE FROM resource_dev_resources WHERE id = ?', [id]);
}

// ============ Podcasts ============
export function podcastToDb(podcast: ResourcePodcast): any {
  return {
    name: podcast.name,
    category: podcast.category || null,
    description: podcast.description || null,
    url: podcast.url || null,
    icon: podcast.icon || null,
  };
}

export function dbToPodcast(row: any): ResourcePodcast {
  return {
    id: row.id,
    name: row.name,
    category: row.category || '',
    description: row.description || '',
    url: row.url || '',
    icon: row.icon || '',
  };
}

export async function getAllPodcasts(): Promise<ResourcePodcast[]> {
  const pool = getPool();
  const [rows] = await pool.query('SELECT * FROM resource_podcasts ORDER BY id DESC');
  return (rows as any[]).map(dbToPodcast);
}

export async function getPodcastById(id: number): Promise<ResourcePodcast | null> {
  const pool = getPool();
  const [rows] = await pool.query('SELECT * FROM resource_podcasts WHERE id = ?', [id]);
  const results = rows as any[];
  if (results.length === 0) return null;
  return dbToPodcast(results[0]);
}

export async function createPodcast(podcast: ResourcePodcast): Promise<number> {
  const pool = getPool();
  const dbData = podcastToDb(podcast);
  const [result] = await pool.query(
    `INSERT INTO resource_podcasts (name, category, description, url, icon)
     VALUES (?, ?, ?, ?, ?)`,
    [dbData.name, dbData.category, dbData.description, dbData.url, dbData.icon]
  );
  return (result as mysql.ResultSetHeader).insertId;
}

export async function updatePodcast(id: number, podcast: ResourcePodcast): Promise<void> {
  const pool = getPool();
  const dbData = podcastToDb(podcast);
  await pool.query(
    `UPDATE resource_podcasts SET name = ?, category = ?, description = ?, url = ?, icon = ? WHERE id = ?`,
    [dbData.name, dbData.category, dbData.description, dbData.url, dbData.icon, id]
  );
}

export async function deletePodcast(id: number): Promise<void> {
  const pool = getPool();
  await pool.query('DELETE FROM resource_podcasts WHERE id = ?', [id]);
}

// ============ YouTube Channels ============
export function youtubeChannelToDb(channel: ResourceYouTubeChannel): any {
  return {
    name: channel.name,
    category: channel.category || null,
    description: channel.description || null,
    url: channel.url || null,
    icon: channel.icon || null,
  };
}

export function dbToYouTubeChannel(row: any): ResourceYouTubeChannel {
  return {
    id: row.id,
    name: row.name,
    category: row.category || '',
    description: row.description || '',
    url: row.url || '',
    icon: row.icon || '',
  };
}

export async function getAllYouTubeChannels(): Promise<ResourceYouTubeChannel[]> {
  const pool = getPool();
  const [rows] = await pool.query('SELECT * FROM resource_youtube_channels ORDER BY id DESC');
  return (rows as any[]).map(dbToYouTubeChannel);
}

export async function getYouTubeChannelById(id: number): Promise<ResourceYouTubeChannel | null> {
  const pool = getPool();
  const [rows] = await pool.query('SELECT * FROM resource_youtube_channels WHERE id = ?', [id]);
  const results = rows as any[];
  if (results.length === 0) return null;
  return dbToYouTubeChannel(results[0]);
}

export async function createYouTubeChannel(channel: ResourceYouTubeChannel): Promise<number> {
  const pool = getPool();
  const dbData = youtubeChannelToDb(channel);
  const [result] = await pool.query(
    `INSERT INTO resource_youtube_channels (name, category, description, url, icon)
     VALUES (?, ?, ?, ?, ?)`,
    [dbData.name, dbData.category, dbData.description, dbData.url, dbData.icon]
  );
  return (result as mysql.ResultSetHeader).insertId;
}

export async function updateYouTubeChannel(id: number, channel: ResourceYouTubeChannel): Promise<void> {
  const pool = getPool();
  const dbData = youtubeChannelToDb(channel);
  await pool.query(
    `UPDATE resource_youtube_channels SET name = ?, category = ?, description = ?, url = ?, icon = ? WHERE id = ?`,
    [dbData.name, dbData.category, dbData.description, dbData.url, dbData.icon, id]
  );
}

export async function deleteYouTubeChannel(id: number): Promise<void> {
  const pool = getPool();
  await pool.query('DELETE FROM resource_youtube_channels WHERE id = ?', [id]);
}

// ============ Theology Resources ============
export function theologyResourceToDb(resource: ResourceTheologyResource): any {
  return {
    name: resource.name,
    category: resource.category || null,
    description: resource.description || null,
    url: resource.url || null,
    icon: resource.icon || null,
  };
}

export function dbToTheologyResource(row: any): ResourceTheologyResource {
  return {
    id: row.id,
    name: row.name,
    category: row.category || '',
    description: row.description || '',
    url: row.url || '',
    icon: row.icon || '',
  };
}

export async function getAllTheologyResources(): Promise<ResourceTheologyResource[]> {
  const pool = getPool();
  const [rows] = await pool.query('SELECT * FROM resource_theology_resources ORDER BY id DESC');
  return (rows as any[]).map(dbToTheologyResource);
}

export async function getTheologyResourceById(id: number): Promise<ResourceTheologyResource | null> {
  const pool = getPool();
  const [rows] = await pool.query('SELECT * FROM resource_theology_resources WHERE id = ?', [id]);
  const results = rows as any[];
  if (results.length === 0) return null;
  return dbToTheologyResource(results[0]);
}

export async function createTheologyResource(resource: ResourceTheologyResource): Promise<number> {
  const pool = getPool();
  const dbData = theologyResourceToDb(resource);
  const [result] = await pool.query(
    `INSERT INTO resource_theology_resources (name, category, description, url, icon)
     VALUES (?, ?, ?, ?, ?)`,
    [dbData.name, dbData.category, dbData.description, dbData.url, dbData.icon]
  );
  return (result as mysql.ResultSetHeader).insertId;
}

export async function updateTheologyResource(id: number, resource: ResourceTheologyResource): Promise<void> {
  const pool = getPool();
  const dbData = theologyResourceToDb(resource);
  await pool.query(
    `UPDATE resource_theology_resources SET name = ?, category = ?, description = ?, url = ?, icon = ? WHERE id = ?`,
    [dbData.name, dbData.category, dbData.description, dbData.url, dbData.icon, id]
  );
}

export async function deleteTheologyResource(id: number): Promise<void> {
  const pool = getPool();
  await pool.query('DELETE FROM resource_theology_resources WHERE id = ?', [id]);
}

