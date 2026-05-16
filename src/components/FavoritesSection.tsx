"use client";

import { PlayerProps, TeamProps } from "@/types";
import { favoriteTeams, favoritePlayers } from "@/data/sports_favorites";
import Image from "next/image";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

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
      className="group relative overflow-hidden rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-dr-border"
      style={{ background: "var(--dr-surface)" }}
    >
      <div className="relative p-6 flex flex-col items-center text-center">
        <div className="mb-4">
          <div className="rounded-full p-3 shadow-sm group-hover:scale-105 transition-transform duration-300" style={{ background: "var(--dr-cream)" }}>
            <Image
              src={logo}
              alt={`${name} Logo`}
              width={80}
              height={80}
              className="rounded-full"
            />
          </div>
        </div>

        <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
          {name}
        </h4>

        <div className="text-2xl mb-3">
          {renderTeamAchievements("trophies", achievements.trophies || 0)}
        </div>

        <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1 w-full">
          {Object.entries(achievements.achievements).slice(0, 2).map(([key, val], i) => (
            <div key={i} className="flex justify-between items-center">
              <span className="font-medium">{key}:</span>
              <span className="font-bold" style={{ color: "var(--dr-amber-deep)" }}>{val}</span>
            </div>
          ))}
        </div>

        <div
          className="mt-4 flex items-center text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{ color: "var(--dr-amber-deep)" }}
        >
          <span>Visit Team</span>
          <svg className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </div>
      </div>
    </a>
  );
}

function FavoritePlayer({ name, image, retired, achievements }: PlayerProps) {
  return (
    <div className="group relative overflow-hidden bg-dr-surface rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-dr-border">
      <div className="relative p-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="rounded-full p-2 shadow-sm group-hover:scale-105 transition-transform duration-300 flex-shrink-0" style={{ background: "var(--dr-cream)" }}>
            <Image
              src={image}
              alt={name}
              width={70}
              height={70}
              className="rounded-full"
            />
          </div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">
            {name}
          </h3>
        </div>

        <div className="text-2xl mb-4">
          {renderTeamAchievements("rings", achievements.rings || 0)}
        </div>

        <div className="space-y-2">
          {Object.entries(achievements.achievements).slice(0, 3).map(([key, val], i) => (
            <div key={i} className="flex justify-between items-center p-2 rounded-lg" style={{ background: "var(--dr-cream)" }}>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{key}:</span>
              <span className="font-bold" style={{ color: "var(--dr-amber-deep)" }}>{val}</span>
            </div>
          ))}
        </div>

        <div className="mt-4 flex items-center justify-center">
          <div
            className="flex items-center text-sm font-medium"
            style={{ color: retired ? "oklch(44% 0.025 70)" : "var(--dr-amber-deep)" }}
          >
            <div
              className={`w-2 h-2 rounded-full mr-2${retired ? "" : " animate-pulse"}`}
              style={{ background: retired ? "oklch(44% 0.025 70)" : "var(--dr-amber)" }}
            />
            <span>{retired ? "Retired Player" : "Active Player"}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function FavoritesSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const teamsRef = useRef<HTMLDivElement>(null);
  const playersRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    gsap.fromTo(".sports-title",
      { y: 50, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
          end: "bottom 20%",
          toggleActions: "play none none reverse"
        }
      }
    );

    gsap.fromTo(".team-card",
      { y: 100, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        stagger: 0.2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: teamsRef.current,
          start: "top 80%",
          end: "bottom 20%",
          toggleActions: "play none none reverse"
        }
      }
    );

    gsap.fromTo(".player-card",
      { y: 100, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        stagger: 0.2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: playersRef.current,
          start: "top 80%",
          end: "bottom 20%",
          toggleActions: "play none none reverse"
        }
      }
    );

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return (
    <section ref={sectionRef} className="py-20" style={{ background: "var(--dr-cream)" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="sports-title text-4xl md:text-5xl font-bold mb-6 text-gray-900 dark:text-white">
            My Favorite Sports
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
            The teams I support and the athletes who have earned genuine admiration.
          </p>
        </div>

        <div ref={teamsRef} className="mb-16">
          <div className="flex items-center justify-center mb-8 gap-3">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center"
              style={{ background: "var(--dr-amber)" }}
            >
              <span className="text-white text-sm">🏈</span>
            </div>
            <h3 className="text-3xl font-bold text-gray-900 dark:text-white">My Teams</h3>
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center"
              style={{ background: "var(--dr-amber)" }}
            >
              <span className="text-white text-sm">⚾</span>
            </div>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {favoriteTeams.map((team) => (
              <div key={team.name} className="team-card">
                <FavoriteTeam {...team} />
              </div>
            ))}
          </div>
        </div>

        <div ref={playersRef}>
          <div className="flex items-center justify-center mb-8 gap-3">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center"
              style={{ background: "var(--dr-amber)" }}
            >
              <span className="text-white text-sm">🏀</span>
            </div>
            <h3 className="text-3xl font-bold text-gray-900 dark:text-white">My Players</h3>
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center"
              style={{ background: "var(--dr-amber)" }}
            >
              <span className="text-white text-sm">⭐</span>
            </div>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {favoritePlayers.map((player) => (
              <div key={player.name} className="player-card">
                <FavoritePlayer {...player} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
