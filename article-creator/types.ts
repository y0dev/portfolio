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

export interface Project {
  id?: number;
  title: string;
  description: string;
  technologies: string[];
  image: string;
  link: string;
  github: string;
  isEmoji: boolean;
  featured: boolean;
}

export interface ResourceBook {
  id?: number;
  title: string;
  author: string;
  category: string;
  description: string;
  cover: string;
  rating: number;
  status: string;
  featured: boolean;
  link: string;
  image: string;
}

export interface ResourceTool {
  id?: number;
  name: string;
  category: string;
  description: string;
  icon: string;
}

export interface ResourceDevResource {
  id?: number;
  name: string;
  category: string;
  description: string;
  url: string;
  icon: string;
}

export interface ResourcePodcast {
  id?: number;
  name: string;
  category?: string;
  description: string;
  url: string;
  icon: string;
}

export interface ResourceYouTubeChannel {
  id?: number;
  name: string;
  category?: string;
  description: string;
  url: string;
  icon: string;
}

export interface ResourceTheologyResource {
  id?: number;
  name: string;
  category: string;
  description: string;
  url: string;
  icon: string;
}
