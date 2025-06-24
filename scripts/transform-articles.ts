import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { marked } from "marked";

interface ArticleMetadata {
  id: string;
  title: string;
  description?: string;
  date: string | number;
  tags: string[];
  type: "article" | "note";
}

interface ContentSection {
  title?: string;
  htmlContent: string;
}

interface TransformedArticle extends ArticleMetadata {
  content: ContentSection[];
}

function parseMarkdown(markdownContent: string): ContentSection[] {
  const { content } = matter(markdownContent);
  const sections = content.split('---').map(s => s.trim()).filter(Boolean);
  
  return sections.map(section => {
    const lines = section.split('\\n');
    const titleLine = lines.find(line => line.toLowerCase().startsWith('title:'));
    const title = titleLine ? titleLine.replace(/title:/i, '').trim() : undefined;
    
    const markdown = lines.filter(line => !line.toLowerCase().startsWith('title:')).join('\\n');
    const htmlContent = marked(markdown) as string;
    
    return {
      title,
      htmlContent,
    };
  });
}

function processArticle(dir: string): TransformedArticle | null {
  const metadataPath = path.join(dir, 'metadata.json');
  const markdownPath = path.join(dir, 'index.md');

  if (!fs.existsSync(metadataPath) || !fs.existsSync(markdownPath)) {
    return null;
  }

  const metadata: ArticleMetadata = JSON.parse(fs.readFileSync(metadataPath, "utf-8"));
  const markdownFileContent = fs.readFileSync(markdownPath, "utf-8");
  const content = parseMarkdown(markdownFileContent);

  return { ...metadata, content };
}

function main() {
  const articlesDir = path.resolve(__dirname, '..', 'content', 'articles');
  const outputPath = path.resolve(__dirname, '..', 'src', 'data', 'articles.ts');

  if (!fs.existsSync(articlesDir)) {
    console.log("No 'content/articles' directory found. Skipping transformation.");
    return;
  }

  const articleDirs = fs.readdirSync(articlesDir)
    .map(name => path.join(articlesDir, name))
    .filter(source => fs.lstatSync(source).isDirectory());

  const articles = articleDirs.map(processArticle).filter((article): article is TransformedArticle => article !== null);
  
  const tsContent = `/* eslint-disable */
import type { Article } from '@/types';

export const articles: Article[] = ${JSON.stringify(articles, null, 2)};
`;

  fs.writeFileSync(outputPath, tsContent);
  console.log('✅ Successfully transformed articles!');
}

main();