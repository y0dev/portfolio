"use client";

import { PlayerProps, TeamProps } from "@/types";
import { favoriteTeams, favoritePlayers } from "@/data/sports_favorites";
import Image from "next/image";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register ScrollTrigger plugin
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
      className="group relative overflow-hidden bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-200 dark:border-gray-700"
    >
      {/* Hover overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      <div className="relative p-6 flex flex-col items-center text-center">
        {/* Logo with glow effect */}
        <div className="relative mb-4">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full blur-lg opacity-0 group-hover:opacity-50 transition-opacity duration-300" />
          <div className="relative bg-white dark:bg-gray-800 rounded-full p-3 shadow-lg group-hover:scale-110 transition-transform duration-300">
            <Image 
              src={logo} 
              alt={`${name} Logo`} 
              width={80} 
              height={80} 
              className="rounded-full"
            />
          </div>
        </div>
        
        <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
          {name}
        </h4>
        
        {/* Achievements with animation */}
        <div className="text-2xl mb-3 transform group-hover:scale-110 transition-transform duration-300">
          {renderTeamAchievements("trophies", achievements.trophies || 0)}
        </div>
        
        {/* Stats preview */}
        <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
          {Object.entries(achievements.achievements).slice(0, 2).map(([key, val], i) => (
            <div key={i} className="flex justify-between items-center">
              <span className="font-medium">{key}:</span>
              <span className="text-blue-600 dark:text-blue-400 font-bold">{val}</span>
            </div>
          ))}
        </div>
        
        {/* Visit link indicator */}
        <div className="mt-4 flex items-center text-blue-600 dark:text-blue-400 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
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
    <div className="group relative overflow-hidden bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-200 dark:border-gray-700">
      {/* Hover overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      <div className="relative p-6">
        {/* Player image and name */}
        <div className="flex items-center gap-4 mb-4">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-blue-500 rounded-full blur-lg opacity-0 group-hover:opacity-50 transition-opacity duration-300" />
            <div className="relative bg-white dark:bg-gray-800 rounded-full p-2 shadow-lg group-hover:scale-110 transition-transform duration-300">
              <Image 
                src={image} 
                alt={name} 
                width={70} 
                height={70} 
                className="rounded-full"
              />
            </div>
          </div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors duration-300">
            {name}
          </h3>
        </div>
        
        {/* Rings with animation */}
        <div className="text-2xl mb-4 transform group-hover:scale-110 transition-transform duration-300">
          {renderTeamAchievements("rings", achievements.rings || 0)}
        </div>
        
        {/* Stats preview */}
        <div className="space-y-2">
          {Object.entries(achievements.achievements).slice(0, 3).map(([key, val], i) => (
            <div key={i} className="flex justify-between items-center p-2 bg-gray-100 dark:bg-gray-700 rounded-lg group-hover:bg-green-50 dark:group-hover:bg-green-900/20 transition-colors duration-300">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{key}:</span>
              <span className="text-green-600 dark:text-green-400 font-bold">{val}</span>
            </div>
          ))}
        </div>
        
        {/* Player status indicator */}
        <div className="mt-4 flex items-center justify-center">
          <div className={`flex items-center text-${retired ? "gray" : "green"}-600 dark:text-${retired ? "gray" : "green"}-400 text-sm font-medium`}>
            <div className={`w-2 h-2 bg-${retired ? "gray" : "green"}-500 rounded-full mr-2 animate-pulse`}></div>
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
    // Section title animation
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

    // Teams animation
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

    // Players animation
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

    // Cleanup function
    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return (
    <section ref={sectionRef} className="py-20 bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 left-10 w-32 h-32 bg-blue-500 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-40 h-40 bg-purple-500 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-green-500 rounded-full blur-3xl"></div>
      </div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="sports-title text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-green-600 bg-clip-text text-transparent">
            My Favorite Sports
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
            A celebration of the teams I passionately support and the athletes who inspire me with their 
            <span className="font-semibold text-blue-600 dark:text-blue-400"> excellence</span>, 
            <span className="font-semibold text-purple-600 dark:text-purple-400"> dedication</span>, and 
            <span className="font-semibold text-green-600 dark:text-green-400"> unforgettable achievements</span>.
          </p>
        </div>

        {/* Teams Section */}
        <div ref={teamsRef} className="mb-16">
          <div className="flex items-center justify-center mb-8">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-bold">🏈</span>
              </div>
              <h3 className="text-3xl font-bold text-gray-900 dark:text-white">My Teams</h3>
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-bold">⚾</span>
              </div>
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

        {/* Players Section */}
        <div ref={playersRef}>
          <div className="flex items-center justify-center mb-8">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-bold">🏀</span>
              </div>
              <h3 className="text-3xl font-bold text-gray-900 dark:text-white">My Players</h3>
              <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-bold">⭐</span>
              </div>
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
