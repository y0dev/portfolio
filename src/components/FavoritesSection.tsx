import { PlayerProps, TeamProps } from "@/types";
import { favoriteTeams, favoritePlayers } from "@/data/sports_favorites";
import Image from "next/image";

export type TeamAchievementType = "trophies" | "rings" | "established";

export const renderTeamAchievements = (
  type: TeamAchievementType,
  value: number
): string => {
  switch (type) {
    case "trophies":
      return value ? "🏆".repeat(Math.min(value, 10)) : "🏆 x0";
    case "rings":
      return value ? "💍".repeat(Math.min(value, 10)) : "💍 x0";
    case "established":
      return `Established in ${value}`;
    default:
      return "";
  }
};

function FavoriteTeam({ name, logo, link, achievements }: TeamProps) {
  return (
    <a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      className="p-4 bg-white dark:bg-gray-800 rounded shadow hover:scale-105 transition flex flex-col items-center text-center"
    >
      <Image src={logo} alt={`${name} Logo`} width={60} height={60} className="mb-3" />
      <h4 className="text-lg font-semibold text-gray-800 dark:text-white">{name}</h4>
      <div className="mt-2 text-xl">
        {renderTeamAchievements("trophies", achievements.trophies || 0)}
      </div>
      {/* <ul className="text-sm mt-2 text-gray-700 dark:text-gray-300 list-disc list-inside">
        {Object.entries(achievements.achievements).map(([key, val], i) => (
          <li key={i}>
            {key}: {val}
          </li>
        ))}
      </ul> */}
    </a>
  );
}

function FavoritePlayer({ name, image, achievements }: PlayerProps) {
  return (
    <div className="p-4 bg-white dark:bg-gray-800 rounded shadow hover:shadow-lg transition">
      <div className="flex items-center gap-4 mb-3">
        <Image src={image} alt={name} width={60} height={60} className="rounded-full" />
        <h3 className="text-xl font-bold text-gray-900 dark:text-white">{name}</h3>
      </div>
      <div className="text-xl mb-2">
        {renderTeamAchievements("rings", achievements.rings || 0)}
      </div>
      {/* <ul className="list-disc ml-6 text-sm text-gray-700 dark:text-gray-300">
        {Object.entries(achievements.achievements).map(([key, val], i) => (
          <li key={i}>
            {key}: {val}
          </li>
        ))}
      </ul> */}
    </div>
  );
}

export default function FavoritesSection() {
  return (
    <section className="py-16 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-5xl mx-auto px-4">
        <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
          My Favorite Sports
              </h2>
              
        <p className="text-gray-600 dark:text-gray-300 mb-10 max-w-3xl">
            A quick look at the sports teams I root for and the athletes who’ve inspired me with their excellence, dedication, and unforgettable achievements.
        </p>

        {/* Teams */}
        <div className="mb-12">
          <h3 className="text-2xl font-semibold mb-4 text-blue-600">Teams</h3>
          <div className="grid md:grid-cols-3 gap-6">
            {favoriteTeams.map((team) => (
              <FavoriteTeam key={team.name} {...team} />
            ))}
          </div>
        </div>

        {/* Players */}
        <div>
          <h3 className="text-2xl font-semibold mb-4 text-green-600">Players</h3>
          <div className="grid md:grid-cols-3 gap-6">
            {favoritePlayers.map((player) => (
              <FavoritePlayer key={player.name} {...player} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
