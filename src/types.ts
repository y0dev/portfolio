export interface Book {
  id: number;
  title: string;
  author: string;
  category: string;
  description: string;
  cover: string;
  rating: number;
  status: "Read" | "Reading" | "To Read";
  featured: boolean;
  link?: string;
  image?: string;
}

export interface Tool {
  name: string;
  category: string;
  description: string;
  icon: string;
}

export interface DevResource {
  name: string;
  category: string;
  description: string;
  url: string;
  icon: string;
}

export interface Podcast {
  name: string;
  description: string;
  url: string;
  icon: string;
}

export interface YoutubeChannel {
  name: string;
  description: string;
  url: string;
  icon: string;
}

export interface TheologyResource {
  name: string;
  category: string;
  description: string;
  url: string;
  icon: string;
}

export interface Resources {
  books: Book[];
  tools: Tool[];
  dev_resources: DevResource[];
  podcasts: Podcast[];
  youtube_channels: YoutubeChannel[];
  theology_resources: TheologyResource[];
}

export interface Project {
  id: number;
  title: string;
  description: string;
  technologies: string[];
  image: string;
  link?: string;
  github?: string;
  isEmoji?: boolean;
  featured: boolean;
}

export interface Article {
  id: string;
  title: string;
  description?: string;
  date: string | number;
  tags: string[];
  type: "article" | "note";
  image: {
      alt: string,
      name: string
  },
  content: {
    id?: string;
    title?: string;
    htmlContent: string;
  }[];
} 

export interface PlayerTeamAchievements {
  trophies?: number;
  rings?: number;
  achievements: object;
}

export interface TeamProps {
  name: string;
  logo: string;
  link: string;
  achievements: PlayerTeamAchievements;
}

export interface PlayerProps {
  name: string;
  image: string;
  retired: boolean;
  achievements: PlayerTeamAchievements;
}