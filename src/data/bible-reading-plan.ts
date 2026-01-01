export interface BibleReading {
  id: string;
  date: string;
  day: number;
  week: number;
  month: number;
  year: number;
  readings: {
    title: string;
    reference: string;
    description?: string;
    text?: string;
  }[];
  ot?: {
    reference: string;
    description: string;
  };
  psalm?: {
    reference: string;
    description: string;
  } | null;
  nt?: {
    reference: string;
    description: string;
  };
  advent?: {
    reference: string;
    description: string;
  };
  notes?: string;
  completed?: boolean;
}

export interface AdventBibleReading {
  id: string;
  date: string;
  day: number;
  week: number;
  month: number;
  year: number;
}

export interface ReadingPlan {
  name: string;
  description: string;
  year: number;
  startDate: string;
  readings: BibleReading[];
  source: string;
}

// Import reading plan data from JSON
import readingPlanData from './bible-reading-plan.json';
import { getISOWeeksOfYear } from '@/utils';
import adventReadingPlanData from './advent-bible-reading-plan.json';

// Helper function to get ISO week number for a given date
function getISOWeek(date: Date): number {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
}

export function generateAdventBibleReadingPlan(year?: number): ReadingPlan {
  const readings: BibleReading[] = [];
  let targetYear = year || new Date().getFullYear();

   // If we're in the last few weeks of the current year (week 52 or later), use next year's plan
   const now = new Date();
   if (targetYear === now.getFullYear()) {
     const currentWeek = getISOWeek(now);
     // If we're in week 52 or 53 (last weeks of the year), use next year's plan
     if (currentWeek == 1) {
       targetYear = targetYear + 1;
     }
   }
  
  // Advent starts on December 1st and ends on December 25th (25 days)
  const startDate = new Date(targetYear, 11, 1); // Month 11 = December (0-indexed)
  const endDate = new Date(targetYear, 11, 25); // December 25th
  
  let dayCounter = 1;
  const currentDate = new Date(startDate);

  // Calculate which week of December we're in (for week numbering)
  const firstDayOfMonth = new Date(targetYear, 11, 1);
  const firstDayOfWeek = firstDayOfMonth.getDay(); // 0 = Sunday, 1 = Monday, etc.
  const daysFromMonday = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1; // Convert to Monday = 0
  const weekNumber = Math.floor((1 + daysFromMonday) / 7) + 1;
  
  while (currentDate <= endDate) {
    // Get the Advent reading for this day (day 1 = Dec 1, day 25 = Dec 25)
    const adventDay = dayCounter;
    const planEntry = adventReadingPlanData[adventDay - 1]; // Array is 0-indexed
    
    if (planEntry && planEntry.reading) {
      const { reading } = planEntry;
      
      // Calculate current week number
      const daysSinceStart = Math.floor((currentDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
      const currentWeek = weekNumber + Math.floor(daysSinceStart / 7);
      
      // Combine all readings into a single reference string
      const referenceParts = reading.readings.map(r => r.reference);
      const combinedReference = referenceParts.join('; ');
      
      // Combine descriptions
      const descriptionParts = reading.readings.map(r => r.description).filter(Boolean);
      const combinedDescription = descriptionParts.join(', ');
      
      readings.push({
        id: `advent-reading-${dayCounter}`,
        date: currentDate.toISOString().split('T')[0],
        day: dayCounter,
        week: currentWeek,
        month: 12, // December
        year: targetYear,
        readings: reading.readings.map(r => ({
          title: reading.title,
          reference: r.reference,
          description: r.description
        })),
        advent: {
          reference: reading.readings[0]?.reference || '',
          description: reading.readings[0]?.description || ''
        },
        completed: false
      });
    }
    
    dayCounter++;
    // Move to next day
    currentDate.setDate(currentDate.getDate() + 1);
  }
  
  return {
    name: "Advent Bible Reading Plan",
    description: "A 25-day Advent Bible reading plan that walks through the promises, prophecies, and foreshadowings in Scripture that help us understand who our Savior Jesus is and the significance of His incarnation.",
    year: targetYear,
    startDate: startDate.toISOString().split('T')[0],
    readings,
    source: "https://www.precept.org/2025/11/advent-bible-reading-plan-for-2025/"
  };
}

// Generate 5-day Bible reading plan where each calendar date has the same reading each year
export function generateBibleReadingPlan(year?: number): ReadingPlan {
  const readings: BibleReading[] = [];
  let targetYear = year || new Date().getFullYear();

  // If we're in the last few weeks of the current year (week 52 or later), use next year's plan
  // const now = new Date();
  // if (targetYear === now.getFullYear()) {
  //   const currentWeek = getISOWeek(now);
  //   // If we're in week 52 or 53 (last weeks of the year), use next year's plan
  //   if (currentWeek == 1) {
  //     targetYear = targetYear + 1;
  //   }
  // }

  // Get ISO weeks for this year and next year to ensure rollover
  const { firstWeekStart } = getISOWeeksOfYear(targetYear);
  const { firstWeekStart: nextYearFirstWeek, lastWeekNumber: nextYearLastWeek } = getISOWeeksOfYear(targetYear + 1);
  
  // Calculate start date: Monday of the first ISO week of target year
  const startDate = new Date(firstWeekStart);
  
  // Calculate end date: Friday of the last ISO week of next year
  // This ensures readings rollover into the next year
  // Last week starts at: nextYearFirstWeek + (nextYearLastWeek - 1) * 7 days
  // Friday of last week: nextYearFirstWeek + (nextYearLastWeek - 1) * 7 + 4 days
  const endDate = new Date(nextYearFirstWeek);
  endDate.setDate(nextYearFirstWeek.getDate() + (nextYearLastWeek - 1) * 7 + 4);
  
  let dayCounter = 1;
  let weekCounter = 1;
  const currentDate = new Date(startDate);
  
  // Track which weekday we're on (1-5, Monday-Friday)
  let weekdayIndex = 0;
  // Sequential reading day counter (1-260) - increments for each weekday
  let readingDayCounter = 1;
  
  while (currentDate <= endDate) {
    const dayOfWeek = currentDate.getDay();
    
    // Skip weekends (Saturday and Sunday) for 5-day plan
    if (dayOfWeek !== 0 && dayOfWeek !== 6) { // Not Sunday (0) or Saturday (6)
      // Use sequential reading day counter to index into reading plan
      // Cycle through 260 readings - if we exceed 260 (53 weeks = 265 days), roll over to next year's readings
      // The modulo operator ensures we cycle back to reading 1 after reading 260
      const patternIndex = (readingDayCounter - 1) % readingPlanData.length;
      
      // Rollover happens when readingDayCounter > 260 (e.g., reading 261 becomes reading 1, 262 becomes 2, etc.)
      // This ensures years with 53 ISO weeks (265 reading days) continue with readings from the next year
      
      const planEntry = readingPlanData[patternIndex];
      const { reading } = planEntry;
      
      // Determine week number based on weekday index
      // Every 5 weekdays = 1 week
      if (weekdayIndex % 5 === 0 && weekdayIndex > 0) {
        weekCounter++;
      }
      
      // Combine OT, Psalm, and NT into a single reference string
      const referenceParts: string[] = [];
      if (reading.ot) {
        referenceParts.push(reading.ot.reference);
      }
      if (reading.psalm) {
        referenceParts.push(reading.psalm.reference);
      }
      if (reading.nt) {
        referenceParts.push(reading.nt.reference);
      }
      const combinedReference = referenceParts.join('; ');
      
      // Combine descriptions
      const descriptionParts: string[] = [];
      if (reading.ot) {
        descriptionParts.push(reading.ot.description);
      }
      if (reading.psalm) {
        descriptionParts.push(reading.psalm.description);
      }
      if (reading.nt) {
        descriptionParts.push(reading.nt.description);
      }
      const combinedDescription = descriptionParts.join(', ');
      
      // Generate title from references
      const titleParts: string[] = [];
      if (reading.ot) {
        const otBook = reading.ot.reference.split(' ')[0];
        titleParts.push(otBook);
      }
      if (reading.psalm) {
        titleParts.push('Psalms');
      }
      if (reading.nt) {
        const ntBook = reading.nt.reference.split(' ')[0];
        titleParts.push(ntBook);
      }
      const title = titleParts.join(' & ');
      
      readings.push({
        id: `reading-${dayCounter}`,
        date: currentDate.toISOString().split('T')[0],
        day: dayCounter,
        week: weekCounter,
        month: currentDate.getMonth() + 1,
        year: currentDate.getFullYear(),
        readings: [{
          title: title,
          reference: combinedReference,
          description: combinedDescription
        }],
        ot: reading.ot || undefined,
        psalm: reading.psalm || null,
        nt: reading.nt || undefined,
        completed: false
      });
      
      dayCounter++;
      weekdayIndex++;
      readingDayCounter++;
    }
    
    // Move to next day
    currentDate.setDate(currentDate.getDate() + 1);
  }
  
  return {
    name: "5-Day Bible Reading Plan",
    description: "A comprehensive Bible reading plan that covers the entire Bible in one year, reading 5 days per week.",
    year: targetYear,
    startDate: startDate.toISOString().split('T')[0],
    readings,
    source: "https://www.fivedaybiblereading.com/wp-content/uploads/2025/12/2026-5-Day-Bible-Reading-Schedule.pdf"
  };
}

// Legacy reading patterns removed - now using JSON data

export const bibleReadingPlan = generateBibleReadingPlan();
