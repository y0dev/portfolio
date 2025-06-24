import { TeamProps, PlayerProps } from "@/types";

export const favoriteTeams: TeamProps[] = [
  {
    name: "Philadelphia Eagles",
    logo: "/teams/eagles.png",
    link: "https://www.philadelphiaeagles.com/",
    achievements: {
      trophies: 1,
      achievements: {
        "Super Bowl Champion": 2,
        "NFC Championships": 4,
        "Established": 1933
      }
    },
  },
  {
    name: "LA Dodgers",
    logo: "/teams/dodgers.png",
    link: "https://www.mlb.com/dodgers",
    achievements: {
      trophies: 7,
      achievements: {
        "World Series Titles": 7,
        "National League Pennants": 24,
        "Established": 1883
      }
    },
  },
];

export const favoritePlayers: PlayerProps[] = [
  {
    name: "LeBron James",
    image: "/players/lebron.png",
    achievements: {
      rings: 4,
      achievements: {
        "NBA MVP": 4,
        "NBA Championships": 4,
        "All-time Leading Scorer": 1
      }
    },
  },
  {
    name: "Derrick Rose",
    image: "/players/rose.png",
    achievements: {
      rings: 0,
      achievements: {
        "NBA MVP": 1,
        "NBA All-Star": 3
      }
    },
  },
  {
    name: "Shai Gilgeous-Alexander",
    image: "/players/sga.png",
    achievements: {
      rings: 1,
      achievements: {
        "NBA MVP": 1,
        "NBA Championships": 1,
        "All-NBA First Team": 1,
        "NBA All-Star": 1
      }
    },
  },
];
