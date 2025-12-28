export interface Article {
  id: string;
  title: string;
  description?: string;
  date: string | number;
  tags: string[];
  type: "article" | "note";
  image: {
    alt: string;
    name: string;
  };
  content: {
    title?: string;
    htmlContent: string;
  }[];
}

