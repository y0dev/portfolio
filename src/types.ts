export interface Article {
  id: string;
  title: string;
  description?: string;
  date: string | number;
  tags: string[];
  type: "article" | "note";
  content: {
    title?: string;
    htmlContent: string;
  }[];
} 