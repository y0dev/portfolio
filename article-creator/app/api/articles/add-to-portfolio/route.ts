import { NextRequest, NextResponse } from 'next/server';
import { isDevelopmentEnvironment, isProductionEnvironment } from '@/lib/utils';
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

/**
 * Strips code-block-wrapper divs and removes styling from pre/code elements
 * The portfolio's ContentRenderer expects just plain <pre><code> elements and adds styling dynamically
 */
function stripCodeBlockWrappers(html: string): string {
  let cleaned = html;
  
  // Pattern to match code-block-wrapper divs
  const wrapperPattern = /<div[^>]*class="[^"]*code-block-wrapper[^"]*"[^>]*>([\s\S]*?)<\/div>/gi;
  
  // Keep processing until no more wrappers are found (handle nested cases)
  let previousLength = 0;
  while (cleaned.length !== previousLength) {
    previousLength = cleaned.length;
    cleaned = cleaned.replace(wrapperPattern, (match, inner) => {
      // Try to extract just the <pre><code> elements from the inner content
      // Remove any nested wrappers first
      let preContent = inner;
      
      // Remove nested code-block-wrapper divs
      const nestedPattern = /<div[^>]*class="[^"]*code-block-wrapper[^"]*"[^>]*>([\s\S]*?)<\/div>/gi;
      while (nestedPattern.test(preContent)) {
        preContent = preContent.replace(nestedPattern, '$1');
      }
      
      // Try to find the <pre> element - it might be nested in other divs
      const preMatch = preContent.match(/<pre[^>]*>[\s\S]*?<\/pre>/i);
      if (preMatch && preMatch.length > 0) {
        let preHtml = preMatch[0];
        
        // Remove all attributes from <pre> element (class, style, etc.)
        preHtml = preHtml.replace(/<pre[^>]*>/, '<pre>');
        
        // Remove all attributes from <code> element but keep language class
        // The portfolio's ContentRenderer needs the language class
        preHtml = preHtml.replace(/<code([^>]*)>/gi, (_match: string, attrs: string) => {
          // Extract language from class attribute if present
          const langMatch = attrs.match(/class="[^"]*language-(\w+)[^"]*"/i) || attrs.match(/class='[^']*language-(\w+)[^']*'/i);
          if (langMatch && langMatch[1]) {
            return `<code class="language-${langMatch[1]}">`;
          }
          return '<code>';
        });
        
        return preHtml;
      }
      
      // If no pre found, try to find it by removing wrapper divs
      // Remove common wrapper div classes
      preContent = preContent.replace(/<div[^>]*class="[^"]*relative[^"]*group[^"]*"[^>]*>/gi, '');
      preContent = preContent.replace(/<div[^>]*class="[^"]*bg-gray-900[^"]*"[^>]*>/gi, '');
      
      // Count divs to balance closing tags
      const openDivs = (preContent.match(/<div[^>]*>/gi) || []).length;
      let closeDivs = 0;
      while (closeDivs < openDivs && preContent.includes('</div>')) {
        preContent = preContent.replace(/<\/div>/, '');
        closeDivs++;
      }
      
      // Now try to find pre again
      const preMatch2 = preContent.match(/<pre[^>]*>[\s\S]*?<\/pre>/i);
      if (preMatch2 && preMatch2.length > 0) {
        let preHtml = preMatch2[0];
        
        // Remove all attributes from <pre> element
        preHtml = preHtml.replace(/<pre[^>]*>/, '<pre>');
        
        // Remove all attributes from <code> element but keep language class
        preHtml = preHtml.replace(/<code([^>]*)>/gi, (_match: string, attrs: string) => {
          const langMatch = attrs.match(/class="[^"]*language-(\w+)[^"]*"/i) || attrs.match(/class='[^']*language-(\w+)[^']*'/i);
          if (langMatch && langMatch[1]) {
            return `<code class="language-${langMatch[1]}">`;
          }
          return '<code>';
        });
        
        return preHtml;
      }
      
      // If still no pre found, return empty (something went wrong)
      return '';
    });
  }
  
  // Also handle pre elements that are not wrapped in code-block-wrapper but have styling
  // Remove all attributes from pre elements, keeping only language class on code
  cleaned = cleaned.replace(/<pre[^>]*>([\s\S]*?)<\/pre>/gi, (_match: string, inner: string) => {
    // Remove all attributes from code elements but keep language class
    const cleanedInner = inner.replace(/<code([^>]*)>/gi, (_codeMatch: string, attrs: string) => {
      const langMatch = attrs.match(/class="[^"]*language-(\w+)[^"]*"/i) || attrs.match(/class='[^']*language-(\w+)[^']*'/i);
      if (langMatch && langMatch[1]) {
        return `<code class="language-${langMatch[1]}">`;
      }
      return '<code>';
    });
    return `<pre>${cleanedInner}</pre>`;
  });
  
  // Clean up any remaining empty wrapper remnants
  cleaned = cleaned.replace(/<div[^>]*class="[^"]*relative[^"]*group[^"]*"[^>]*>\s*<\/div>/gi, '');
  cleaned = cleaned.replace(/<div[^>]*class="[^"]*bg-gray-900[^"]*"[^>]*>\s*<\/div>/gi, '');
  
  return cleaned;
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

