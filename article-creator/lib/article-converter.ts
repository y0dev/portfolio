import type { Article } from '@/types';
import { marked } from 'marked';
import { stripCodeBlockWrappers } from './html-cleaner';

// Configure marked to support GFM (GitHub Flavored Markdown) including tables
if (typeof marked !== 'undefined') {
  marked.setOptions({
    gfm: true,
    breaks: false
  });
}

// Old format types
interface OldArticleImage {
  id: string;
  alt: string;
  caption?: string;
  link: string;
}

interface OldArticleLink {
  id: string;
  text: string;
  website?: string;
  link?: string;
  video?: number;
}

interface OldArticleList {
  id: string;
  items: string[];
  list_type: 'ordered' | 'unordered';
  listType?: 'ordered' | 'unordered'; // Alternative property name
}

interface OldArticleCode {
  id: string;
  language: string;
  title?: string;
  content: string | string[];
}

interface OldContentSection {
  title?: {
    tag: string;
    text: string;
  };
  paragraphs?: string[];
  images?: OldArticleImage[];
  links?: OldArticleLink[];
  lists?: OldArticleList[];
  code?: OldArticleCode[];
}

interface OldArticle {
  title: string;
  description?: string;
  date: string | number;
  id: string;
  time?: {
    secs: string;
    mins: string;
    hours: string;
  };
  tags: string[];
  image: {
    name: string;
    alt: string;
  };
  content: OldContentSection[];
}

/**
 * Converts a timestamp (string or number) to a formatted date string
 */
function convertDate(date: string | number): string {
  const timestamp = typeof date === 'string' ? parseInt(date) : date;
  const dateObj = new Date(timestamp);
  
  // Format as YYYY-MM-DD
  const year = dateObj.getFullYear();
  const month = String(dateObj.getMonth() + 1).padStart(2, '0');
  const day = String(dateObj.getDate()).padStart(2, '0');
  
  return `${year}-${month}-${day}`;
}

/**
 * Processes code block content to remove special formatting markers
 */
function processCodeBlockContent(content: string | string[]): string {
  const lines = Array.isArray(content) ? content : content.split('\n');
  
  return lines.map(line => {
    // Remove code-specific markers
    line = line.replace(/:code-specific\s+/g, '');
    line = line.replace(/:code-specific-end/g, '');
    
    // Remove path markers (keep the path content)
    line = line.replace(/:path-start\s+/g, '');
    line = line.replace(/:path-end/g, '');
    
    // Remove bracket markers (keep the bracket content)
    line = line.replace(/:bracket-open\s+/g, '');
    line = line.replace(/:bracket-close/g, '');
    
    // Remove string markers (keep the string content)
    line = line.replace(/:string-open\s+/g, '');
    line = line.replace(/:string-close/g, '');
    
    // Remove user-defined code markers (keep the code content)
    line = line.replace(/:user-defined-code\s+/g, '');
    line = line.replace(/:end/g, '');
    
    // Remove comment markers (keep the comment content)
    line = line.replace(/^:comment\s+/, '');
    
    return line;
  }).join('\n');
}

/**
 * Converts code block to markdown format
 */
function convertCodeBlockToMarkdown(codeBlock: OldArticleCode): string {
  const language = codeBlock.language || '';
  const codeContent = processCodeBlockContent(codeBlock.content);
  
  if (language) {
    return `\`\`\`${language}\n${codeContent}\n\`\`\``;
  }
  return `\`\`\`\n${codeContent}\n\`\`\``;
}

/**
 * Converts special-text patterns to markdown formatting
 * Pattern: :special-text(key=<type>,<text>)special-text-end
 */
function processSpecialText(text: string): string {
  // Match pattern: :special-text(key=<type>,<text>)special-text-end
  const specialTextRegex = /:special-text\(key=([^,]+),\s*([^)]+)\)special-text-end/g;
  
  return text.replace(specialTextRegex, (match, key, content) => {
    const trimmedKey = key.trim().replace(/['"]/g, '');
    const trimmedContent = content.trim();
    
    switch (trimmedKey) {
      case 'bold':
        return `**${trimmedContent}**`;
      case 'italic':
        return `*${trimmedContent}*`;
      case 'underline':
        // Markdown doesn't have underline, use emphasis as fallback
        return `*${trimmedContent}*`;
      default:
        return trimmedContent;
    }
  });
}

/**
 * Converts user-defined-code markers to inline code backticks
 * Pattern: :user-defined-code <text>:end
 */
function processUserDefinedCode(text: string): string {
  // Match pattern: :user-defined-code <content>:end
  const userDefinedCodeRegex = /:user-defined-code\s+([^:]+):end/g;
  
  return text.replace(userDefinedCodeRegex, (match, content) => {
    return `\`${content.trim()}\``;
  });
}

/**
 * Converts old content section to markdown (content only, without title heading)
 */
function convertContentSectionToMarkdown(section: OldContentSection): string {
  let markdown = '';
  
  // Note: We don't include the title as a heading here because
  // the new format stores the title separately from htmlContent
  
  // Track which images, lists, and code blocks have been used
  const usedImages = new Set<string>();
  const usedLists = new Set<string>();
  const usedCodeBlocks = new Set<string>();
  
  // Convert paragraphs, replacing placeholders
  if (section.paragraphs && section.paragraphs.length > 0) {
    section.paragraphs.forEach(paragraph => {
      let processedParagraph = paragraph.trim();
      
      // Skip if paragraph is empty or only contains whitespace
      if (!processedParagraph) {
        return;
      }
      
      // Process special-text patterns first
      processedParagraph = processSpecialText(processedParagraph);
      
      // Process user-defined-code markers (for inline code in paragraphs)
      processedParagraph = processUserDefinedCode(processedParagraph);
      
      // Replace code placeholders
      if (section.code) {
        section.code.forEach(codeBlock => {
          const placeholder = `:codePlace(${codeBlock.id})`;
          if (processedParagraph.includes(placeholder)) {
            usedCodeBlocks.add(codeBlock.id);
            const codeMarkdown = convertCodeBlockToMarkdown(codeBlock);
            processedParagraph = processedParagraph.replace(placeholder, `\n\n${codeMarkdown}\n\n`);
          }
        });
      }
      
      // Replace image placeholders
      if (section.images) {
        section.images.forEach(img => {
          const placeholder = `:imagePlace(${img.id})`;
          if (processedParagraph.includes(placeholder)) {
            usedImages.add(img.id);
            // Replace with markdown image
            const imageMarkdown = img.caption
              ? `![${img.alt}](${img.link})\n\n*${img.caption}*`
              : `![${img.alt}](${img.link})`;
            processedParagraph = processedParagraph.replace(placeholder, imageMarkdown);
          }
        });
      }
      
      // Replace list placeholders
      if (section.lists) {
        section.lists.forEach(list => {
          const placeholder = `:listPlace(${list.id})`;
          if (processedParagraph.includes(placeholder)) {
            usedLists.add(list.id);
            // Convert list to markdown
            const listType = list.list_type || list.listType || 'unordered';
            const listMarkdown = list.items.map(item => {
              // Process special-text in list items
              let processedItem = processSpecialText(item);
              // Process user-defined code markers in list items
              processedItem = processUserDefinedCode(processedItem);
              const prefix = listType === 'ordered' ? '1. ' : '- ';
              return `${prefix}${processedItem}`;
            }).join('\n');
            processedParagraph = processedParagraph.replace(placeholder, `\n\n${listMarkdown}\n\n`);
          }
        });
      }
      
      // Replace link placeholders if they exist
      if (section.links) {
        section.links.forEach(link => {
          const placeholder = `:linkPlace(${link.id})`;
          if (processedParagraph.includes(placeholder)) {
            const linkUrl = link.link || link.website || '';
            const linkText = link.text || linkUrl;
            if (linkUrl) {
              const linkMarkdown = `[${linkText}](${linkUrl})`;
              processedParagraph = processedParagraph.replace(placeholder, linkMarkdown);
            } else {
              processedParagraph = processedParagraph.replace(placeholder, linkText);
            }
          }
        });
      }
      
      // Add paragraph (only if it has content after processing, or if it's not just a placeholder)
      const trimmedParagraph = processedParagraph.trim();
      if (trimmedParagraph && !trimmedParagraph.match(/^:imagePlace\(|^:listPlace\(|^:linkPlace\(|^:codePlace\(/)) {
        markdown += trimmedParagraph + '\n\n';
      }
    });
  }
  
  // Add any code blocks that weren't referenced in paragraphs
  if (section.code) {
    section.code.forEach(codeBlock => {
      if (!usedCodeBlocks.has(codeBlock.id)) {
        const codeMarkdown = convertCodeBlockToMarkdown(codeBlock);
        markdown += `${codeMarkdown}\n\n`;
      }
    });
  }
  
  // Add any images that weren't referenced in paragraphs
  if (section.images) {
    section.images.forEach(img => {
      if (!usedImages.has(img.id)) {
        const imageMarkdown = img.caption
          ? `![${img.alt}](${img.link})\n\n*${img.caption}*\n\n`
          : `![${img.alt}](${img.link})\n\n`;
        markdown += imageMarkdown;
      }
    });
  }
  
  // Add any lists that weren't referenced in paragraphs
  if (section.lists) {
    section.lists.forEach(list => {
      if (!usedLists.has(list.id)) {
        const listType = list.list_type || list.listType || 'unordered';
        const listMarkdown = list.items.map(item => {
          // Process special-text in list items
          let processedItem = processSpecialText(item);
          // Process user-defined code markers in list items
          processedItem = processUserDefinedCode(processedItem);
          const prefix = listType === 'ordered' ? '1. ' : '- ';
          return `${prefix}${processedItem}`;
        }).join('\n');
        markdown += `${listMarkdown}\n\n`;
      }
    });
  }
  
  return markdown.trim();
}

/**
 * Converts old article format to new article format
 */
export function convertOldArticleToNew(oldArticle: OldArticle): Article {
  // Convert date
  const formattedDate = convertDate(oldArticle.date);
  
  // Convert content sections to markdown and then to new format
  const content = oldArticle.content.map(section => {
    const markdown = convertContentSectionToMarkdown(section);
    
    // Parse markdown to HTML using marked
    let htmlContent = '';
    try {
      const parsed = marked.parse(markdown);
      htmlContent = typeof parsed === 'string' ? parsed : String(parsed);
      // Clean HTML for portfolio format (strip code wrappers and styling)
      htmlContent = stripCodeBlockWrappers(htmlContent);
    } catch (error) {
      console.error('Error parsing markdown:', error);
      htmlContent = markdown; // Fallback to markdown if parsing fails
    }
    
    return {
      title: section.title?.text,
      htmlContent,
    };
  });
  
  // Determine type - default to 'note' if we can't determine from title/description
  // You may want to add logic here to determine if it's an article or note
  const type: 'article' | 'note' = 'note';
  
  return {
    id: oldArticle.id,
    title: oldArticle.title,
    description: oldArticle.description,
    date: formattedDate,
    tags: oldArticle.tags,
    type,
    image: oldArticle.image,
    content,
  };
}

/**
 * Converts old articles (array or single object) to new format
 */
export function convertOldArticlesToNew(oldData: OldArticle | OldArticle[]): Article[] {
  const articles = Array.isArray(oldData) ? oldData : [oldData];
  return articles.map(convertOldArticleToNew);
}

