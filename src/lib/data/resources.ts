import { getPool, dbToResourceBook, dbToResource } from '../db';
import staticResources from '@/data/resources.json';
import { safeDataLoad } from '../data-loader';

/**
 * Get all resources from database or static files
 * Respects USE_DATABASE environment variable (defaults to static)
 * 
 * Note: For static export builds, always uses static files regardless of USE_DATABASE
 */
export async function getResources(): Promise<typeof staticResources> {
  return safeDataLoad(
    async () => {
      const pool = getPool();
      
      // Fetch all resource types in parallel
      const [booksRows] = await pool.query('SELECT * FROM resource_books ORDER BY featured DESC, id DESC');
      const [toolsRows] = await pool.query('SELECT * FROM resource_tools ORDER BY id DESC');
      const [devResourcesRows] = await pool.query('SELECT * FROM resource_dev_resources ORDER BY id DESC');
      const [podcastsRows] = await pool.query('SELECT * FROM resource_podcasts ORDER BY id DESC');
      const [youtubeRows] = await pool.query('SELECT * FROM resource_youtube_channels ORDER BY id DESC');
      const [theologyRows] = await pool.query('SELECT * FROM resource_theology_resources ORDER BY id DESC');
      
      return {
        books: (booksRows as any[]).map(dbToResourceBook),
        tools: (toolsRows as any[]).map(dbToResource),
        dev_resources: (devResourcesRows as any[]).map(dbToResource),
        podcasts: (podcastsRows as any[]).map(dbToResource),
        youtube_channels: (youtubeRows as any[]).map(dbToResource),
        theology_resources: (theologyRows as any[]).map(dbToResource),
      };
    },
    () => staticResources
  );
}

