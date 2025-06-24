import fs from "fs";
import path from "path";

interface OldArticle {
  id: string;
  title: string;
  description?: string;
  date: string | number;
  tags: string[];
  image?: {
    name: string;
    alt: string;
  };
  time?: {
    hours: string;
    mins: string;
    secs: string;
  };
  type?: "article" | "note";
  content: Array<{
    title?: string | { tag?: string; text: string };
    paragraphs: string[];
    images?: Array<{
      id?: string;
      alt?: string;
      caption?: string;
      link?: string;
      image?: string;
      title?: string;
    }>;
    code?: Array<{
      id?: string;
      language?: string;
      content?: string;
    }>;
    blockquotes?: Array<{
      id?: string;
      content?: string;
    }>;
    links?: Array<{
      id?: string;
      text?: string;
      website?: string;
      link?: string;
      video?: boolean;
    }>;
    lists?: Array<{
      id?: string;
      items?: string[];
      list_type?: "ordered" | "unordered";
    }>;
  }>;
}

interface SectionTitle {
  tag?: string;
  text: string;
}

interface TransformedArticle {
  id: string;
  title: string;
  description?: string;
  date: string | number;
  tags: string[];
  image?: {
    name: string;
    alt: string;
  };
  time?: {
    hours: string;
    mins: string;
    secs: string;
  };
  type: "article" | "note";
  content: Array<{
    title?: SectionTitle;
    paragraphs: string[];
    images?: Array<{
      id?: string;
      alt?: string;
      caption?: string;
      link?: string;
      image?: string;
      title?: string;
    }>;
    code?: Array<{
      id?: string;
      language?: string;
      content?: string;
    }>;
    blockquotes?: Array<{
      id?: string;
      content?: string;
    }>;
    links?: Array<{
      id?: string;
      text?: string;
      website?: string;
      link?: string;
      video?: boolean;
    }>;
    lists?: Array<{
      id?: string;
      items?: string[];
      list_type?: "ordered" | "unordered";
    }>;
  }>;
}

function transformTitle(
  title: string | { tag?: string; text: string } | undefined
): SectionTitle | undefined {
  if (!title) return undefined;

  if (typeof title === "string") {
    return { text: title };
  } else if (typeof title === "object") {
    return { tag: title.tag, text: title.text };
  }
  return undefined;
}

function transformArticle(old: OldArticle): TransformedArticle {
  return {
    id: old.id,
    title: old.title,
    description: old.description,
    date: old.date,
    tags: old.tags,
    image: old.image,
    time: old.time,
    type: old.type ?? "note",
    content: old.content.map((section) => ({
      title: transformTitle(section.title),
      paragraphs: section.paragraphs || [],
      images: section.images,
      code: section.code,
      blockquotes: section.blockquotes,
      links: section.links,
      lists: section.lists,
    })),
  };
}

function main() {
  const inputPath = path.resolve(__dirname, '..', 'markdown-parser-project', 'json', 'notes.json');
  const outputPath = path.resolve(__dirname, "notes.ts");

  const oldData = JSON.parse(fs.readFileSync(inputPath, "utf-8")) as OldArticle[];
  const newArticles = oldData.map(transformArticle);

  const header = `/* eslint-disable */\n\nexport interface Blockquote {
  id: string;
  content: string;
}

export interface LinkItem {
  id: string;
  text: string;
  website?: string;
  link?: string;
  video?: boolean;
}

export interface List {
  id: string;
  items: string[];
  list_type: "ordered" | "unordered";
}

export interface SectionTitle {
  tag?: string;
  text: string;
}

export interface ContentSection {
  title?: SectionTitle;
  paragraphs: string[];
  images?: Image[];
  code?: CodeBlock[];
  blockquotes?: Blockquote[];
  links?: LinkItem[];
  lists?: List[];
}

export interface TimeMeta {
  hours: string;
  mins: string;
  secs: string;
}

export interface Article {
  id: string;
  title: string;
  description?: string;
  date: string | number;
  tags: string[];
  image?: {
    name: string;
    alt: string;
  };
  time?: TimeMeta;
  content: ContentSection[];
  type: "article" | "note";
}\n\n`;

  const output = `${header}export const articles: Article[] = ${JSON.stringify(
    newArticles,
    null,
    2
  )};\n`;

  fs.writeFileSync(outputPath, output, "utf-8");
  console.log(`✅ Converted articles written to ${outputPath}`);
}

main();