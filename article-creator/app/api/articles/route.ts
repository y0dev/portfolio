import { NextRequest, NextResponse } from 'next/server';
import type { Article } from '@/types';
import fs from 'fs/promises';
import path from 'path';

export async function POST(request: NextRequest) {
  try {
    const articleData: Article = await request.json();
    
    // Validate required fields
    if (!articleData.id || !articleData.title || !articleData.date) {
      return NextResponse.json(
        { error: 'Missing required fields: id, title, and date are required' },
        { status: 400 }
      );
    }

    // Validate type
    if (articleData.type !== 'article' && articleData.type !== 'note') {
      return NextResponse.json(
        { error: 'Type must be either "article" or "note"' },
        { status: 400 }
      );
    }

    // Create backup directory if it doesn't exist
    const backupDir = path.join(process.cwd(), 'article-backups');
    await fs.mkdir(backupDir, { recursive: true });
    
    // Save to backup JSON file
    const jsonPath = path.join(backupDir, `${articleData.id}.json`);
    await fs.writeFile(jsonPath, JSON.stringify(articleData, null, 2));
    
    // Return success with instructions
    return NextResponse.json({ 
      success: true, 
      message: 'Article saved to backup. Please manually add it to src/data/articles.ts',
      article: articleData,
      filePath: jsonPath
    });
  } catch (error) {
    console.error('Error processing article:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

