import { NextRequest, NextResponse } from 'next/server';
import { getAllArticles, getArticleById, createArticle, updateArticle, deleteArticle, initDatabase } from '@/lib/db';
import type { Article } from '@/types';

// Initialize database on first API call
let dbInitialized = false;

async function ensureDbInitialized() {
  if (!dbInitialized) {
    try {
      await initDatabase();
      dbInitialized = true;
    } catch (error) {
      console.error('Database initialization error:', error);
      throw error;
    }
  }
}

// GET - Get all articles or a specific article
export async function GET(request: NextRequest) {
  try {
    await ensureDbInitialized();
    
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');
    
    if (id) {
      const article = await getArticleById(id);
      if (!article) {
        return NextResponse.json({ error: 'Article not found' }, { status: 404 });
      }
      return NextResponse.json(article);
    }
    
    const articles = await getAllArticles();
    return NextResponse.json(articles);
  } catch (error) {
    console.error('Error fetching articles:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// POST - Create a new article
export async function POST(request: NextRequest) {
  try {
    await ensureDbInitialized();
    
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
    
    // Check if article already exists
    const existing = await getArticleById(articleData.id);
    if (existing) {
      return NextResponse.json(
        { error: `Article with ID "${articleData.id}" already exists. Use PUT to update.` },
        { status: 400 }
      );
    }
    
    await createArticle(articleData);
    
    return NextResponse.json({
      success: true,
      message: 'Article created successfully',
      article: articleData,
    });
  } catch (error) {
    console.error('Error creating article:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// PUT - Update an existing article
export async function PUT(request: NextRequest) {
  try {
    await ensureDbInitialized();
    
    const articleData: Article = await request.json();
    
    // Validate required fields
    if (!articleData.id || !articleData.title || !articleData.date) {
      return NextResponse.json(
        { error: 'Missing required fields: id, title, and date are required' },
        { status: 400 }
      );
    }
    
    // Check if article exists
    const existing = await getArticleById(articleData.id);
    if (!existing) {
      return NextResponse.json(
        { error: `Article with ID "${articleData.id}" not found. Use POST to create.` },
        { status: 404 }
      );
    }
    
    await updateArticle(articleData.id, articleData);
    
    return NextResponse.json({
      success: true,
      message: 'Article updated successfully',
      article: articleData,
    });
  } catch (error) {
    console.error('Error updating article:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// DELETE - Delete an article
export async function DELETE(request: NextRequest) {
  try {
    await ensureDbInitialized();
    
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { error: 'Article ID is required' },
        { status: 400 }
      );
    }
    
    // Check if article exists
    const existing = await getArticleById(id);
    if (!existing) {
      return NextResponse.json(
        { error: 'Article not found' },
        { status: 404 }
      );
    }
    
    await deleteArticle(id);
    
    return NextResponse.json({
      success: true,
      message: 'Article deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting article:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

