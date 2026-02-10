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