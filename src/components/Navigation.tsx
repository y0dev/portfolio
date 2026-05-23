"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function Navigation() {
  const pathname = usePathname();
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    // On mount, set theme from localStorage or system preference
    const stored = localStorage.getItem("theme");
    if (stored === "dark" || (!stored && window.matchMedia("(prefers-color-scheme: dark)").matches)) {
      setTheme("dark");
      document.documentElement.classList.add("dark");
    } else {
      setTheme("light");
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const toggleTheme = () => {
    const isDark = document.documentElement.classList.contains("dark");
    if (isDark) {
      setTheme("light");
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    } else {
      setTheme("dark");
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    }
  };

  const navItems = [
    { href: "/", label: "Home" },
    { href: "/projects", label: "Projects" },
    { href: "/articles", label: "Articles" },
    { href: "/gospel", label: "Gospel" },
    { href: "/bible-reading", label: "Bible Reading" },
    { href: "/resources", label: "Resources" },
  ];

  return (
    <nav
      className="sticky top-0 z-50 backdrop-blur-md border-b border-dr-border"
      style={{ background: "color-mix(in oklch, var(--dr-surface) 85%, transparent)" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center space-x-3 group">
            <Image
              src="/logo192.png"
              alt="Devontae Reid Logo"
              width={32}
              height={32}
              className="rounded-full group-hover:scale-110 transition-transform duration-300"
            />
            <span className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-amber-700 dark:group-hover:text-amber-300 transition-colors">
              DEVONTAE REID
            </span>
          </Link>

          
          <div className="hidden md:flex items-center space-x-6">
            {navItems.map((item) => {
              // Check if current path matches the nav item (exact match or starts with for sub-routes)
              const isActive = pathname ? (
                pathname === item.href || 
                (item.href !== "/" && pathname.startsWith(item.href + "/")) ||
                (item.href === "/articles" && (pathname.startsWith("/article/") || pathname.startsWith("/note/")))
              ) : false;
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300"
                      : "text-gray-700 dark:text-gray-300 hover:text-amber-700 dark:hover:text-amber-300"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
            
            {/* Theme toggle button */}
            <button
              onClick={toggleTheme}
              id="theme-toggle-button"
              aria-label="Toggle theme"
              className="ml-4 p-2 rounded-full transition-colors text-gray-700 dark:text-gray-300 hover:text-amber-700 dark:hover:text-amber-300" style={{ background: "var(--dr-cream)" }}
            >
              {theme === "dark" ? (
                // Sun icon
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <circle cx="12" cy="12" r="5" stroke="currentColor" strokeWidth="2" />
                  <path stroke="currentColor" strokeWidth="2" strokeLinecap="round" d="M12 1v2m0 18v2m11-11h-2M3 12H1m16.95 7.07l-1.41-1.41M6.34 6.34L4.93 4.93m12.02 0l-1.41 1.41M6.34 17.66l-1.41 1.41" />
                </svg>
              ) : (
                // Moon icon
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M21 12.79A9 9 0 1111.21 3a7 7 0 109.79 9.79z" />
                </svg>
              )}
            </button>
          </div>

          {/* Mobile menu and theme toggle */}
          <div className="md:hidden flex items-center">
            {/* Theme toggle button */}
            <button
              onClick={toggleTheme}
              id="theme-toggle-button-mobile"
              aria-label="Toggle theme"
              className="p-2 rounded-full transition-colors text-gray-700 dark:text-gray-300 hover:text-amber-700 dark:hover:text-amber-300" style={{ background: "var(--dr-cream)" }}
            >
              {theme === "dark" ? (
                // Sun icon
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <circle cx="12" cy="12" r="5" stroke="currentColor" strokeWidth="2" />
                  <path stroke="currentColor" strokeWidth="2" strokeLinecap="round" d="M12 1v2m0 18v2m11-11h-2M3 12H1m16.95 7.07l-1.41-1.41M6.34 6.34L4.93 4.93m12.02 0l-1.41 1.41M6.34 17.66l-1.41 1.41" />
                </svg>
              ) : (
                // Moon icon
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M21 12.79A9 9 0 1111.21 3a7 7 0 109.79 9.79z" />
                </svg>
              )}
            </button>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-expanded={isMenuOpen}
              aria-controls="mobile-menu"
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
              className="ml-2 text-gray-700 dark:text-gray-300 hover:text-amber-700 dark:hover:text-amber-300"
            >
              {isMenuOpen ? (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div id="mobile-menu" className="md:hidden" style={{ background: "color-mix(in oklch, var(--dr-surface) 95%, transparent)" }}>
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navItems.map((item) => {
              // Check if current path matches the nav item (exact match or starts with for sub-routes)
              const isActive = pathname ? (
                pathname === item.href || 
                (item.href !== "/" && pathname.startsWith(item.href + "/")) ||
                (item.href === "/articles" && (pathname.startsWith("/article/") || pathname.startsWith("/note/")))
              ) : false;
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMenuOpen(false)}
                  className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                    isActive
                      ? "bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300"
                      : "text-gray-700 dark:text-gray-300 hover:text-amber-700 dark:hover:text-amber-300"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </nav>
  );
} 