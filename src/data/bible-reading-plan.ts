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
  notes?: string;
  completed?: boolean;
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

// Generate 5-day Bible reading plan where each calendar date has the same reading each year
export function generateBibleReadingPlan(year?: number): ReadingPlan {
  const readings: BibleReading[] = [];
  const targetYear = year || new Date().getFullYear();
  
  // Start from January 1st of the target year
  const startDate = new Date(targetYear, 0, 1);
  const endDate = new Date(targetYear, 11, 31); // December 31st
  
  let dayCounter = 1;
  let weekCounter = 1;
  const currentDate = new Date(startDate);
  
  // Track which weekday we're on (1-5, Monday-Friday)
  let weekdayIndex = 0;
  
  while (currentDate <= endDate) {
    const dayOfWeek = currentDate.getDay();
    
    // Skip weekends (Saturday and Sunday) for 5-day plan
    if (dayOfWeek !== 0 && dayOfWeek !== 6) { // Not Sunday (0) or Saturday (6)
      // Calculate day of year (1-365/366) to ensure same reading for same date each year
      const startOfYear = new Date(targetYear, 0, 1);
      const dayOfYear = Math.floor((currentDate.getTime() - startOfYear.getTime()) / (1000 * 60 * 60 * 24)) + 1;
      
      // Use day of year to determine reading pattern (cycles through 260 readings)
      const patternIndex = (dayOfYear - 1) % readingPlanData.length;
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
    source: "https://www.fivedaybiblereading.com/wp-content/uploads/2024/12/2025-5-Day-Bible-Reading.pdf"
  };
}

// Legacy reading patterns removed - now using JSON data

export const bibleReadingPlan = generateBibleReadingPlan();
