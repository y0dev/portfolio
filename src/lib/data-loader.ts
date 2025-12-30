/**
 * Data Loader Utility
 * 
 * This module provides utilities for loading data from either static files or database.
 * 
 * IMPORTANT: When using static export (output: "export" in next.config.ts), 
 * database access is NOT available at runtime. In this case, always use static files.
 * 
 * To use the database:
 * 1. Remove or comment out `output: "export"` in next.config.ts
 * 2. Set USE_DATABASE=true in your environment variables
 * 3. Configure DB_HOST, DB_USER, DB_PASSWORD, DB_NAME, DB_PORT
 * 
 * When USE_DATABASE is not set or false, static files are used (default behavior).
 */

import { shouldUseDatabase } from './db';

/**
 * Check if we should use database for data loading
 * Returns false for static export mode (which doesn't support runtime DB access)
 */
export function shouldUseDatabaseForData(): boolean {
  // If output is set to "export", we can't use DB at runtime
  // This will be checked at build time via next.config.ts
  // For now, we respect USE_DATABASE env var, but in static export mode,
  // Next.js will pre-render pages at build time, so DB won't be accessible anyway
  return shouldUseDatabase() && process.env.NEXT_OUTPUT_MODE !== 'export';
}

/**
 * Safe data loader wrapper that handles errors gracefully
 * Falls back to static files on any database error
 */
export async function safeDataLoad<T>(
  dbLoader: () => Promise<T>,
  staticLoader: () => T
): Promise<T> {
  if (!shouldUseDatabaseForData()) {
    return staticLoader();
  }

  try {
    return await dbLoader();
  } catch (error) {
    console.warn('Database load failed, falling back to static files:', error);
    return staticLoader();
  }
}

