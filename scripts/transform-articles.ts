import fs from "fs";
import path from "path";
import { marked } from "marked";

interface ArticleMetadata {
  id: string;
  title: string;
  description?: string;
  date: string | number;
  tags: string[];
  type: "article" | "note";
  image?: { alt: string; name: string };
}

interface ContentSection {
      title?: string;
  htmlContent: string;
}

interface TransformedArticle extends ArticleMetadata {
  content: ContentSection[];
}

/**
 * Category to tags mapping (from category_mapper.py)
 */
const CATEGORY_TAGS: Record<string, string[]> = {
  theology: ["Theology", "God", "Gospel", "Reformed"],
  covenant: ["Christ", "Covenant", "Reformed", "Gospel"],
  thankful: ["Christ", "Salvation", "Love", "Thankful"],
  health: ["Health", "Fitness"],
  tech: ["Technology", "Engineer"],
  technology: ["Technology", "Engineer"],
  embedded: ["Technology", "Embedded", "Engineer"],
  quantum: ["Technology", "Quantum"],
  algo: ["Data Structures", "Algorithms", "Tech Interview"],
  algorithm: ["Data Structures", "Algorithms", "Tech Interview"],
  "system design": ["System Design", "Technology", "Tech Interview"],
  security: ["Cybersecurity", "Encryption", "Network Security"],
  cloud: ["Cloud Computing", "AWS", "Azure", "GCP"],
  ai: ["Artificial Intelligence", "Machine Learning", "Deep Learning"],
  "risc-v": ["RISC-V", "Embedded Systems", "Microcontrollers"],
  linux: ["Linux", "Operating Systems", "Kernel Development"],
  docker: ["Docker", "Containers", "DevOps"],
  kubernetes: ["Kubernetes", "Container Orchestration", "DevOps"],
  networking: ["Networking", "TCP/IP", "Protocols"],
  database: ["Database", "SQL", "NoSQL"],
  "system programming": ["Low-Level Programming", "Assembly", "Embedded"],
  "web development": ["HTML", "CSS", "JavaScript", "ReactJS", "NodeJS"],
  cryptography: ["Cryptography", "Randomness Testing", "Security", "Encryption"],
  default: ["Template", "Info", "Beginner"],
};

/**
 * Category to image mapping (from category_mapper.py)
 */
const CATEGORY_IMAGES: { [key: string]: { alt: string; name: string } } = {
  theology: { alt: "bible-icon", name: "images/bible-icon.png" },
  covenant: { alt: "bible-icon", name: "images/bible-icon.png" },
  thankful: { alt: "thankful-icon", name: "images/thankful.png" },
  family: { alt: "family-image", name: "images/family.png" },
  health: { alt: "health-img", name: "images/heart_strength.png" },
  tech: { alt: "web-dev-img", name: "images/web-dev.png" },
  technology: { alt: "web-dev-img", name: "images/web-dev.png" },
  code: { alt: "web-dev-img", name: "images/web-dev.png" },
  "system design": { alt: "web-dev-img", name: "images/web-dev.png" },
  algo: { alt: "algo-img", name: "images/algorithm.png" },
  algorithm: { alt: "algo-img", name: "images/algorithm.png" },
  embedded: { alt: "binary-code-img", name: "images/binary-code.png" },
  quantum: { alt: "physics-img", name: "images/physics-icon.png" },
  docker: { alt: "docker-image", name: "images/docker.png" },
  jenkins: { alt: "jenkins-image", name: "images/jenkins.png" },
  cryptography: { alt: "crypto-img", name: "images/crypto.png" },
};

function getTagsForCategory(category: string): string[] {
  const key = category.toLowerCase();
  return CATEGORY_TAGS[key] || CATEGORY_TAGS["default"];
}

function getImageForCategory(category: string): { alt: string; name: string } {
  const key = category.toLowerCase();
  return CATEGORY_IMAGES[key] || { alt: "image-title", name: "images/image.png" };
}

/**
 * Cleans up HTML content by properly handling escaped characters and formatting
 * Converts escaped newlines to actual line breaks and fixes HTML entities
 */
function cleanHtmlContent(html: string): string {
  return html
    // Convert escaped newlines to actual line breaks
    .replace(/\\n/g, '\n')
    // Fix common HTML entities
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    // Clean up extra whitespace around line breaks
    .replace(/\n\s*\n/g, '\n\n')
    // Remove leading/trailing whitespace
    .trim();
}

/**
 * Pre-processes markdown to ensure proper parsing of block elements
 * Converts template placeholders to proper markdown syntax
 */
function preprocessMarkdown(markdown: string): string {
  return markdown
    // Convert template placeholders to proper markdown
    .replace(/\[([^\]]+)\]/g, '**$1**') // Convert [text] to **text**
    // Ensure proper spacing for headers
    .replace(/^(\s*)(#{1,6})\s*/gm, '$1$2 ')
    // Ensure proper spacing for lists
    .replace(/^(\s*)[-*+]\s*/gm, '$1- ')
    // Ensure proper spacing for numbered lists
    .replace(/^(\s*)\d+\.\s*/gm, '$1$&')
    // Clean up multiple consecutive newlines
    .replace(/\n{3,}/g, '\n\n')
    // Ensure proper line breaks
    .replace(/\n\s*\n/g, '\n\n')
    // Handle markdown syntax within headers (convert **text** to <strong>text</strong>)
    .replace(/^#{1,6}\s+(.+)$/gm, (match, content) => {
      const headerMatch = match.match(/^(#{1,6})\s/);
      if (!headerMatch) return match;
      const headerLevel = headerMatch[1];
      const processedContent = content
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        .replace(/`(.*?)`/g, '<code>$1</code>');
      return `${headerLevel} ${processedContent}`;
    });
}

/**
 * Enhances code blocks with syntax highlighting classes
 * Adds language-specific classes and highlight.js compatibility
 */
function enhanceCodeBlocks(html: string): string {
  // Add syntax highlighting classes to code blocks
  return html.replace(
    /<pre><code(?: class="language-(\w+)")?>/g,
    (match, language) => {
      const lang = language || 'text';
      return `<pre><code class="language-${lang} hljs">`;
    }
  );
}

function enhanceTables(html: string): string {
  return html
    .replace(/<table>/g, '<table class="w-full border-collapse my-6 text-sm" style="border-color: var(--dr-border);">')
    .replace(/<thead>/g, '<thead style="background: var(--dr-surface);">')
    .replace(/<th>/g, '<th class="px-4 py-2 text-left font-semibold border-b" style="border-color: var(--dr-border); color: var(--dr-text);">')
    .replace(/<td>/g, '<td class="px-4 py-2 border-b" style="border-color: var(--dr-border); color: var(--dr-text-muted);">');
}

function enhanceImages(html: string): string {
  return html.replace(
    /<img([^>]*)>/g,
    '<img$1 class="rounded shadow-sm max-w-full h-auto my-4" loading="lazy">'
  );
}

function enhanceUnorderedLists(html: string): string {
  return html.replace(
    /<ul([^>]*)>/g,
    '<ul$1 class="mb-4 space-y-2 pl-5 list-disc">'
  );
}

function enhanceOrderedLists(html: string): string {
  return html.replace(
    /<ol([^>]*)>/g,
    '<ol$1 class="list-decimal mb-4 space-y-2 pl-6">'
  );
}

function enhanceListItems(html: string): string {
  return html.replace(
    /<li([^>]*)>/g,
    '<li$1 class="mb-1 hover:text-dr-amber-deep transition-colors duration-200" style="color: var(--dr-text-muted);">'
  );
}

function enhanceHeadings(html: string): string {
  return html
    .replace(/<h1([^>]*)>/g, '<h1$1 class="text-4xl md:text-5xl font-bold mb-6 mt-8" style="color: var(--dr-text);">')
    .replace(/<h2([^>]*)>/g, '<h2$1 class="text-3xl md:text-4xl font-bold mb-5 mt-7" style="color: var(--dr-text);">')
    .replace(/<h3([^>]*)>/g, '<h3$1 class="text-2xl md:text-3xl font-semibold mb-4 mt-6" style="color: var(--dr-text);">')
    .replace(/<h4([^>]*)>/g, '<h4$1 class="text-xl md:text-2xl font-semibold mb-3 mt-5" style="color: var(--dr-text);">')
    .replace(/<h5([^>]*)>/g, '<h5$1 class="text-lg md:text-xl font-medium mb-2 mt-4" style="color: var(--dr-text-muted);">')
    .replace(/<h6([^>]*)>/g, '<h6$1 class="text-base md:text-lg font-medium mb-2 mt-4" style="color: var(--dr-text-muted);">');
}

function enhanceParagraphs(html: string): string {
  return html.replace(
    /<p([^>]*)>/g,
    '<p$1 class="leading-relaxed mb-4" style="color: var(--dr-text-muted);">'
  );
}

function enhanceStrongText(html: string): string {
  return html.replace(
    /<strong([^>]*)>/g,
    '<strong$1 class="font-bold" style="color: var(--dr-text);">'
  );
}

function enhanceEmphasizedText(html: string): string {
  return html.replace(
    /<em([^>]*)>/g,
    '<em$1 class="italic" style="color: var(--dr-text);">'
  );
}

function enhanceBlockquotes(html: string): string {
  return html.replace(
    /<blockquote([^>]*)>/g,
    '<blockquote$1 class="border-l-4 pl-6 py-4 my-6 italic" style="border-color: var(--dr-amber); background: var(--dr-amber-pale); color: var(--dr-text-muted);">'
  );
}

/**
 * Enhances links with better styling and hover effects
 * Adds consistent link colors and transition effects
 */
function enhanceLinks(html: string): string {
  return html.replace(
    /<a([^>]*)>/g,
    '<a$1 class="underline hover:no-underline transition-colors duration-200" style="color: var(--dr-amber-deep);">'
  );
}

/**
 * Enhances inline code with better styling
 * Adds background, padding, and monospace font
 */
function enhanceInlineCode(html: string): string {
  return html.replace(
    /<code([^>]*)>/g,
    '<code$1 class="px-2 py-1 rounded text-sm font-mono" style="background: var(--dr-amber-pale); color: var(--dr-amber-deep);">'
  );
}

/**
 * Enhances horizontal rules with better styling
 * Adds consistent spacing and visual appeal
 */
function enhanceHorizontalRules(html: string): string {
  return html.replace(
    /<hr([^>]*)>/g,
    '<hr$1 class="my-8" style="border-color: var(--dr-border);">'
  );
}

function enhancePreformattedText(html: string): string {
  return html.replace(
    /<pre([^>]*)>/g,
    '<pre$1 class="p-4 rounded-lg overflow-x-auto my-4" style="background: var(--dr-code-surface);">'
  );
}

/**
 * Cleans up any remaining markdown syntax that wasn't processed
 * Converts remaining **text** and *text* to proper HTML
 */
function cleanupRemainingMarkdown(html: string): string {
  return html
    // Convert remaining **text** to <strong>text</strong>
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    // Convert remaining *text* to <em>text</em>
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    // Convert remaining `text` to <code>text</code>
    .replace(/`(.*?)`/g, '<code>$1</code>');
}

function parseMarkdown(markdownContent: string): { metadata: Partial<ArticleMetadata>, content: ContentSection[] } {
  const lines = markdownContent.replace(/\r\n/g, '\n').split('\n');
  const metadata: Partial<ArticleMetadata> = {};
  let contentStartIndex = 0;
  
  // console.log('Parsed lines:', lines);
  // Find the Blog/Note Info section
  for (let i = 0; i < lines.length; i++) {

    if (lines[i].trim() === '## Blog/Note Info') {
      contentStartIndex = i + 1;
      break;
    }
  }
  
  // Parse metadata from the Blog/Note Info section
  if (contentStartIndex > 0) {
    for (let i = contentStartIndex; i < lines.length; i++) {
      const line = lines[i].trim();
      
      // Stop when we hit the next section
      if (line.startsWith('##') && line !== '## Blog/Note Info') {
        contentStartIndex = i;
        break;
      }
      // console.log(line)
      // Parse metadata fields
      if (line.startsWith('- Title:')) {
        metadata.title = line.replace('- Title:', '').trim();
      } else if (line.startsWith('- Description:')) {
        metadata.description = line.replace('- Description:', '').trim();
      } else if (line.startsWith('- Date:')) {
        const dateStr = line.replace('- Date:', '').trim();
        metadata.date = dateStr;
      } else if (line.startsWith('- Category:')) {
        const category = line.replace('- Category:', '').trim();
        metadata.tags = getTagsForCategory(category);
        metadata.image = getImageForCategory(category);
      } else if (line.startsWith('- Type:')) {
        const type = line.replace('- Type:', '').trim().toLowerCase();
        metadata.type = type as "article" | "note";
      }
    }
  }
  
  // Extract content after the Blog/Note Info section
  const contentLines = lines.slice(contentStartIndex);
  const contentText = contentLines.join('\n');
  
  // Parse content into sections based on headers (### and ####)
  const sections = contentText.split(/(?=^#{3,4}\s)/m).map(s => s.trim()).filter(Boolean);
  
  const content: ContentSection[] = sections.map(section => {
    const lines = section.split('\n');
    const titleMatch = lines[0].match(/^#{3,4}\s+(.+)$/);
    const title = titleMatch ? titleMatch[1] : undefined;
    
    const markdown = lines.slice(1).join('\n');
    
    // Pre-process the markdown to ensure proper parsing
    const processedMarkdown = preprocessMarkdown(markdown);
    let htmlContent = marked(processedMarkdown) as string;
    
    // Clean up the HTML content first
    htmlContent = cleanHtmlContent(htmlContent);
    
    // Apply all enhancement functions
    htmlContent = enhanceParagraphs(htmlContent);
    htmlContent = enhanceTables(htmlContent);
    htmlContent = enhanceImages(htmlContent);
    htmlContent = enhanceUnorderedLists(htmlContent);
    htmlContent = enhanceOrderedLists(htmlContent);
    htmlContent = enhanceListItems(htmlContent);
    htmlContent = enhanceHeadings(htmlContent);
    htmlContent = enhanceCodeBlocks(htmlContent);
    htmlContent = enhanceStrongText(htmlContent);
    htmlContent = enhanceEmphasizedText(htmlContent);
    htmlContent = enhanceBlockquotes(htmlContent);
    htmlContent = enhanceLinks(htmlContent);
    htmlContent = enhanceInlineCode(htmlContent);
    htmlContent = enhanceHorizontalRules(htmlContent);
    htmlContent = enhancePreformattedText(htmlContent);
    
    // Clean up any remaining markdown syntax
    htmlContent = cleanupRemainingMarkdown(htmlContent);
    
    return {
      title,
      htmlContent,
    };
  });
  
  return { metadata, content };
}

function processNotesFromMarkdownParser(): TransformedArticle[] {
  const notesDir = path.resolve(__dirname, '..', 'markdown-parser-project', 'input_md');
  const articles: TransformedArticle[] = [];
  
  if (!fs.existsSync(notesDir)) {
    console.log("No 'markdown-parser-project/input_md' directory found. Skipping notes processing.");
    return articles;
  }
  
  const noteFiles = fs.readdirSync(notesDir)
    .filter(file => file.endsWith('.md') && !file.startsWith('.'))
    .map(file => path.join(notesDir, file));
  
  noteFiles.forEach(filePath => {
    try {
      const markdownContent = fs.readFileSync(filePath, "utf-8");
      // console.log(`File path: ${filePath}`)
      if (markdownContent.includes('## Blog/Note Info')) {
        const { metadata, content } = parseMarkdown(markdownContent);
        
        // Generate ID from filename (without extension)
        const id = path.basename(filePath, '.md');
        // console.log(`File path: ${filePath} \t\tID: ${id}`)
        
        // Ensure required fields
        if (!metadata.title || !metadata.date || !metadata.type) {
          console.warn(`Warning: Missing required metadata for ${id}`);
          return;
        }
        
        articles.push({
          id: id.replace('.','-'),
          title: metadata.title,
          description: metadata.description,
          date: metadata.date,
          tags: metadata.tags || [],
          type: metadata.type,
          image: metadata.image,
          content
        });
      }
    } catch (error) {
      console.error(`Error processing note file ${filePath}:`, error);
    }
  });
  
  return articles;
}

function main() {
  const outputPath = path.resolve(__dirname, '..', 'src', 'data', 'articles.ts');

  const allArticles: TransformedArticle[] = [];
  
  // Process notes from markdown-parser-project
  const notes = processNotesFromMarkdownParser();
  allArticles.push(...notes);
  
  // Sort articles by date (newest first)
  allArticles.sort((a, b) => {
    const dateA = new Date(a.date).getTime();
    const dateB = new Date(b.date).getTime();
    return dateB - dateA;
  });
  
  const tsContent = `/* eslint-disable */
import type { Article } from '@/types';

export const articles: Article[] = ${JSON.stringify(allArticles, null, 2)};
`;

  fs.writeFileSync(outputPath, tsContent);
  console.log(`✅ Successfully transformed ${allArticles.length} articles and notes!`);
  console.log(`📝 Articles: ${allArticles.filter(a => a.type === 'article').length}`);
  console.log(`📋 Notes: ${allArticles.filter(a => a.type === 'note').length}`);
}

main();