import mysql from 'mysql2/promise';
import { getPool } from './db';
import { slugifyTitle } from './utils';
import type { Project } from '@/types';

// Convert Project to database format
export function projectToDb(project: Project): any {
  const slug = slugifyTitle(project.title) || `project-${project.id || Date.now()}`;
  
  return {
    title: project.title,
    slug: slug,
    description: project.description || null,
    technologies: JSON.stringify(project.technologies || []),
    image: project.image || null,
    link: project.link || null,
    github: project.github || null,
    is_emoji: project.isEmoji || false,
    featured: project.featured || false,
  };
}

// Convert database row to Project
export function dbToProject(row: any): Project {
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

// Project CRUD operations
export async function getAllProjects(): Promise<Project[]> {
  const pool = getPool();
  const [rows] = await pool.query('SELECT * FROM projects ORDER BY featured DESC, id DESC');
  return (rows as any[]).map(dbToProject);
}

export async function getProjectById(id: number): Promise<Project | null> {
  const pool = getPool();
  const [rows] = await pool.query('SELECT * FROM projects WHERE id = ?', [id]);
  const results = rows as any[];
  if (results.length === 0) return null;
  return dbToProject(results[0]);
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  const pool = getPool();
  const [rows] = await pool.query('SELECT * FROM projects WHERE slug = ?', [slug]);
  const results = rows as any[];
  if (results.length === 0) return null;
  return dbToProject(results[0]);
}

export async function getFeaturedProjects(): Promise<Project[]> {
  const pool = getPool();
  const [rows] = await pool.query('SELECT * FROM projects WHERE featured = TRUE ORDER BY id DESC');
  return (rows as any[]).map(dbToProject);
}

export async function createProject(project: Project): Promise<number> {
  const pool = getPool();
  const dbData = projectToDb(project);
  const [result] = await pool.query(
    `INSERT INTO projects (title, slug, description, technologies, image, link, github, is_emoji, featured)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      dbData.title,
      dbData.slug,
      dbData.description,
      dbData.technologies,
      dbData.image,
      dbData.link,
      dbData.github,
      dbData.is_emoji,
      dbData.featured,
    ]
  );
  return (result as mysql.ResultSetHeader).insertId;
}

export async function updateProject(id: number, project: Project): Promise<void> {
  const pool = getPool();
  const dbData = projectToDb(project);
  await pool.query(
    `UPDATE projects 
     SET title = ?, slug = ?, description = ?, technologies = ?, image = ?, 
         link = ?, github = ?, is_emoji = ?, featured = ?
     WHERE id = ?`,
    [
      dbData.title,
      dbData.slug,
      dbData.description,
      dbData.technologies,
      dbData.image,
      dbData.link,
      dbData.github,
      dbData.is_emoji,
      dbData.featured,
      id,
    ]
  );
}

export async function deleteProject(id: number): Promise<void> {
  const pool = getPool();
  await pool.query('DELETE FROM projects WHERE id = ?', [id]);
}

