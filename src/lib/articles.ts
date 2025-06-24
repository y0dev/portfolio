// lib/articles.ts
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const articlesDir = path.join(process.cwd(), 'content/articles');

export function getAllArticles() {
  const files = fs.readdirSync(articlesDir);

  return files.map((fileName) => {
    const slug = fileName.replace(/\.md$/, '');
    const filePath = path.join(articlesDir, fileName);
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const { data, content } = matter(fileContents);

    return {
      slug,
      ...data,
      content,
    };
  });
}
