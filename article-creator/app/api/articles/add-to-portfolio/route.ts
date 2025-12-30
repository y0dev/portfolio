import { NextRequest, NextResponse } from 'next/server';
import { isDevelopmentEnvironment, isProductionEnvironment } from '@/lib/utils';
import { stripCodeBlockWrappers } from '@/lib/html-cleaner';
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

    // Get the portfolio articles.ts file path (parent directory)
    const portfolioArticlesPath = path.join(process.cwd(), '..', 'src', 'data', 'articles.ts');
    
    try {
      if (isDevelopmentEnvironment()) {
        // Read the current articles.ts file
        const articlesFileContent = await fs.readFile(portfolioArticlesPath, 'utf-8');
        
        // Check if article with this ID already exists
        const articleIdRegex = new RegExp(`"id":\\s*"${articleData.id.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}"`, 'g');
        if (articleIdRegex.test(articlesFileContent)) {
          return NextResponse.json(
            { error: `Article with ID "${articleData.id}" already exists in articles.ts` },
            { status: 400 }
          );
        }
        
        // Strip code-block-wrapper divs before adding to portfolio
        // The portfolio's ContentRenderer will add them dynamically
        const cleanedArticleData = {
          ...articleData,
          content: articleData.content.map(section => ({
            ...section,
            htmlContent: stripCodeBlockWrappers(section.htmlContent)
          }))
        };
        
        // Convert article data to the format used in articles.ts
        // Need to format it as a JavaScript object, not JSON (handles quotes properly)
        const articleObject = formatArticleForTypeScript(cleanedArticleData);
        
        // Find the insertion point (after the opening bracket of the articles array)
        const arrayStartMatch = articlesFileContent.match(/export const articles: Article\[\] = \[/);
        if (!arrayStartMatch) {
          return NextResponse.json(
            { error: 'Could not find articles array in articles.ts file' },
            { status: 500 }
          );
        }
        
        const insertPosition = arrayStartMatch.index! + arrayStartMatch[0].length;
        
        // Insert the new article after the opening bracket, with proper formatting
        const beforeInsert = articlesFileContent.substring(0, insertPosition);
        let afterInsert = articlesFileContent.substring(insertPosition);
        
        // Clean up any leading comma or whitespace issues
        afterInsert = afterInsert.trim();
        
        // Check if there are existing articles (not just whitespace or closing bracket)
        const hasExistingArticles = afterInsert.length > 0 && !afterInsert.startsWith(']');
        
        // Format the insertion:
        // - Insert new article with proper indentation
        // - If there are existing articles, add comma after our new article
        // - Add proper spacing/indentation before existing articles
        const spacing = '\n  ';
        const commaAfter = hasExistingArticles ? ',' : '';
        const spacingAfter = hasExistingArticles ? spacing : '';
        
        const newContent = beforeInsert + spacing + articleObject + commaAfter + spacingAfter + afterInsert;
        
        // Write the updated file
        await fs.writeFile(portfolioArticlesPath, newContent, 'utf-8');
        
        return NextResponse.json({ 
          success: true, 
          message: `Article "${articleData.title}" added successfully to articles.ts`,
          articleId: articleData.id,
          filePath: portfolioArticlesPath
        });
      } else {
        if (isProductionEnvironment()) {
          // In production, send task to worker docker container
          const workerServiceUrl = process.env.WORKER_SERVICE_URL || 'http://worker:3001';
          const workerApiKey = process.env.WORKER_SERVICE_API_KEY || '';
          
          try {
            const workerResponse = await fetch(`${workerServiceUrl}/api/add-article`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                ...(workerApiKey && { 'X-API-Key': workerApiKey })
              },
              body: JSON.stringify({
                article: {
                  ...articleData,
                  // Strip code-block-wrapper divs before sending to worker
                  content: articleData.content.map(section => ({
                    ...section,
                    htmlContent: stripCodeBlockWrappers(section.htmlContent)
                  }))
                },
                portfolioPath: portfolioArticlesPath
              })
            });

            if (!workerResponse.ok) {
              const errorData = await workerResponse.json().catch(() => ({}));
              throw new Error(errorData.error || `Worker service returned status ${workerResponse.status}`);
            }

            const workerResult = await workerResponse.json();
            
            return NextResponse.json({
              success: true,
              message: `Article "${articleData.title}" added successfully via worker service`,
              articleId: articleData.id,
              filePath: portfolioArticlesPath,
              nextSteps: workerResult.nextSteps || 'The portfolio will be rebuilt automatically.'
            });
          } catch (workerError) {
            console.error('Worker service error:', workerError);
            return NextResponse.json({
              success: false,
              error: `Failed to communicate with worker service: ${workerError instanceof Error ? workerError.message : 'Unknown error'}`,
              articleId: articleData.id
            }, { status: 500 });
          }
        } else {
          return NextResponse.json({
            success: false,
            message: 'Article not added to portfolio - environment detection failed',
            articleId: articleData.id,
            filePath: portfolioArticlesPath
          }, { status: 500 });
        }
      }
    } catch (fileError: any) {
      if (fileError.code === 'ENOENT') {
        return NextResponse.json(
          { error: `articles.ts file not found at: ${portfolioArticlesPath}. Make sure article-creator is in the portfolio directory.` },
          { status: 404 }
        );
      }
      throw fileError;
    }
  } catch (error) {
    console.error('Error adding article to portfolio:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

function formatArticleForTypeScript(article: Article): string {
  // Format the article object as TypeScript/JavaScript code
  // This handles proper string escaping and formatting
  const escapeString = (str: string) => {
    return JSON.stringify(str);
  };
  
  const formatContent = (content: { title?: string; htmlContent: string }[]) => {
    return '[\n      ' + content.map(section => {
      const parts: string[] = [];
      if (section.title) {
        parts.push(`"title": ${escapeString(section.title)}`);
      }
      // HTML content is already cleaned (code-block-wrapper divs stripped) before calling this function
      // Use JSON.stringify for HTML content to handle all escaping properly
      parts.push(`"htmlContent": ${escapeString(section.htmlContent)}`);
      return '{ ' + parts.join(', ') + ' }';
    }).join(',\n      ') + '\n    ]';
  };
  
  const parts: string[] = [
    `"id": ${escapeString(article.id)}`,
    `"title": ${escapeString(article.title)}`
  ];
  
  if (article.description) {
    parts.push(`"description": ${escapeString(article.description)}`);
  }
  
  // Date is always a string in the format "Month DD, YYYY"
  parts.push(`"date": ${escapeString(String(article.date))}`);
  parts.push(`"tags": [${article.tags.map(t => escapeString(t)).join(', ')}]`);
  parts.push(`"type": ${escapeString(article.type)}`);
  parts.push(`"image": {\n        "alt": ${escapeString(article.image.alt)},\n        "name": ${escapeString(article.image.name)}\n      }`);
  parts.push(`"content": ${formatContent(article.content)}`);
  
  return '{\n    ' + parts.join(',\n    ') + '\n  }';
}

