export function formatDate(date: string | number): string {
  if (!date) return "";

  let parsedDate: Date;

  if (typeof date === "string" && /^\d+$/.test(date)) {
    parsedDate = new Date(Number(date));
  } else if (typeof date === "number") {
    parsedDate = new Date(date);
  } else {
    parsedDate = new Date(Date.parse(date));
  }

  if (isNaN(parsedDate.getTime())) return String(date);

  return parsedDate.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric"
  });
}

/**
 * Calculate reading time in minutes from article content
 * Assumes average reading speed of 200 words per minute
 */
export function calculateReadingTime(content: { title?: string; htmlContent: string }[]): number {
  // Combine all content sections
  const fullText = content
    .map((section) => section.htmlContent)
    .join(' ');

  // Strip HTML tags and decode HTML entities
  const textContent = fullText
    .replace(/<[^>]*>/g, ' ') // Remove HTML tags
    .replace(/&[a-z]+;/gi, ' ') // Remove HTML entities (basic approach)
    .replace(/\s+/g, ' ') // Normalize whitespace
    .trim();

  // Count words (split by whitespace and filter empty strings)
  const wordCount = textContent.split(/\s+/).filter((word) => word.length > 0).length;

  // Calculate reading time (200 words per minute)
  const wordsPerMinute = 200;
  const readingTime = Math.ceil(wordCount / wordsPerMinute);

  // Return at least 1 minute
  return Math.max(1, readingTime);
}

export function formatDateFull(date: string | number): string {
  if (!date) return "";

  let parsedDate: Date;

  if (typeof date === "string" && /^\d+$/.test(date)) {
    parsedDate = new Date(Number(date));
  } else if (typeof date === "number") {
    parsedDate = new Date(date);
  } else {
    parsedDate = new Date(Date.parse(date));
  }

  if (isNaN(parsedDate.getTime())) return String(date);

  return parsedDate.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric"
  });
}

export function parseDate(date: string | number): number {
  if (!date) return 0;
  if (typeof date === 'string' && /^\d+$/.test(date)) return Number(date); // timestamp string
  if (typeof date === 'number') return date; // numeric timestamp
  const parsed = Date.parse(date);
  return isNaN(parsed) ? 0 : parsed; // fallback
}

/*
  * Returns the first week start date and the total number of ISO weeks in the given year.
  * ISO weeks start on Monday and the first week of the year is the one that contains the first Thursday.
  * A year can have either 52 or 53 ISO weeks.
  * Parameters:
    - year: The target year (e.g., 2023)
  * Returns:
    - An object containing:
      - firstWeekStart: Date object representing the start of the first ISO week
      - lastWeekNumber: Total number of ISO weeks in the year (52 or 53)
*/
export function getISOWeeksOfYear(year: number): { firstWeekStart: Date; lastWeekNumber: number } {
  // Create a date for January 4th of the target year
  const jan4 = new Date(year, 0, 4);

  // Find the Monday of that week — ISO week starts on Monday
  const dayOfWeek = jan4.getDay() || 7; // Sunday is 0, change to 7
  const firstWeekStart = new Date(jan4);
  firstWeekStart.setDate(jan4.getDate() - (dayOfWeek - 1));

  // Find the Monday of the week containing December 28th
  // December 28th is always in the last ISO week of the year (since it's always a Thursday or later)
  const dec28 = new Date(year, 11, 28);
  const dec28DayOfWeek = dec28.getDay() || 7; // Sunday is 0, change to 7
  const lastWeekMonday = new Date(dec28);
  lastWeekMonday.setDate(dec28.getDate() - (dec28DayOfWeek - 1));
  
  // Calculate week number by counting weeks from firstWeekStart to lastWeekMonday
  const daysDiff = Math.floor((lastWeekMonday.getTime() - firstWeekStart.getTime()) / (1000 * 60 * 60 * 24));
  const lastWeekNumber = Math.floor(daysDiff / 7) + 1;
  return {
    firstWeekStart,
    lastWeekNumber
  };
}

/* 
  * Returns the ISO week number for a given date.
  * ISO weeks start on Monday and the first week of the year is the one that contains the first Thursday.
  * Parameters:
    - date: The target date
  * Returns:
    - The ISO week number (1-52 or 1-53)
*/ 
export function getISOWeekNumber(date: Date): number {
  const target = new Date(date.valueOf());
  const dayNr = (date.getDay() + 6) % 7; // Make Monday=0
  target.setDate(target.getDate() - dayNr + 3); // Nearest Thursday
  const jan4 = new Date(target.getFullYear(), 0, 4);
  const dayDiff = (target.getTime() - jan4.getTime()) / 86400000;
  return 1 + Math.floor(dayDiff / 7);
}