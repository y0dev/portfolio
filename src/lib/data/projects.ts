import { getPool, dbToProject } from '../db';
import { projects as staticProjects } from '@/data/projects';
import { safeDataLoad } from '../data-loader';

/**
 * Get all projects from database or static files
 * Respects USE_DATABASE environment variable (defaults to static)
 * 
 * Note: For static export builds, always uses static files regardless of USE_DATABASE
 */
export async function getProjects(): Promise<typeof staticProjects> {
  return safeDataLoad(
    async () => {
      const pool = getPool();
      const [rows] = await pool.query('SELECT * FROM projects ORDER BY featured DESC, id DESC');
      return (rows as any[]).map(dbToProject);
    },
    () => staticProjects
  );
}

/**
 * Get featured projects from database or static files
 */
export async function getFeaturedProjects(): Promise<typeof staticProjects> {
  const allProjects = await getProjects();
  return allProjects.filter(p => p.featured);
}

