"use client";

import { useState, useMemo } from "react";
import Calendar from "@/components/Calendar";
import ReadingDetailModal from "@/components/ReadingDetailModal";
import { generateBibleReadingPlan, BibleReading, ReadingPlan, generateAdventBibleReadingPlan } from "@/data/bible-reading-plan";

export default function BibleReadingPlanPage() {
  const [selectedReading, setSelectedReading] = useState<BibleReading | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [readingPlan] = useState<ReadingPlan>(generateBibleReadingPlan());
  
  // Combine readings: include both regular readings and Advent readings for December 1-25
  const readings = useMemo(() => {
    const currentYear = new Date().getFullYear();
    const planYear = readingPlan.year;
    const readingsList: BibleReading[] = [];
    
    // First, add all regular readings
    readingsList.push(...readingPlan.readings);
    
    // Then, add Advent readings for December 1-25 (they will appear alongside regular readings)
    const years = new Set([currentYear, planYear]);
    years.forEach(year => {
      const adventPlan = generateAdventBibleReadingPlan(year);
      
      // If advent reading fall on a day that already has bible reading add advent reading to the existing reading
      adventPlan.readings.forEach(reading => {
        const existingReading = readingsList.find(r => r.date === reading.date);
        if (existingReading) {
          existingReading.advent = {
            reference: reading.readings[0]?.reference || '',
            description: reading.readings[0]?.description || ''
          };
        } else {
          // Add the advent reading to the readings list
          readingsList.push(reading);
        }
      });
    });

    // Sort by date
    return readingsList.sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );
  }, [readingPlan]);

  const handleReadingClick = (reading: BibleReading) => {
    setSelectedReading(reading);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedReading(null);
  };

  // Calculate progress statistics based on calendar weeks and days
  const stats = useMemo(() => {
    const totalReadings = 260; //readings.length;
    const today = new Date();
    console.log(readingPlan.startDate);
    const planStartDate = new Date(readingPlan.startDate);
    
    // Calculate how many weeks have passed since start
    const weeksSinceStart = Math.floor((today.getTime() - planStartDate.getTime()) / (1000 * 60 * 60 * 24 * 7));
    const totalWeeks = 52; // 52 weeks in the plan
    const weekProgress = Math.min(weeksSinceStart, totalWeeks);
    const weekPercentage = Math.round((weekProgress / totalWeeks) * 100);
    // console.log(weekProgress, totalWeeks, weekPercentage);
    // Calculate how many readings should have been completed by now
    const readingsPerWeek = 5; // 5 readings per week
    const expectedReadingsCompleted = Math.min(weekProgress * readingsPerWeek, totalReadings);
    const readingPercentage = Math.round((expectedReadingsCompleted / totalReadings) * 100);
    // console.log(expectedReadingsCompleted, totalReadings, readingPercentage);
    
    // Calculate current week progress
    const currentWeekStart = new Date(planStartDate);
    currentWeekStart.setDate(planStartDate.getDate() + (weekProgress * 7));
    const currentWeekEnd = new Date(currentWeekStart);
    currentWeekEnd.setDate(currentWeekStart.getDate() + 6);
    
    const currentWeekReadings = readings.filter(reading => {
      const readingDate = new Date(reading.date);
      return readingDate >= currentWeekStart && readingDate <= currentWeekEnd;
    });
    
    const currentWeekCompleted = Math.min(
      Math.max(0, Math.floor((today.getTime() - currentWeekStart.getTime()) / (1000 * 60 * 60 * 24))),
      currentWeekReadings.length
    );
    
    return {
      totalReadings,
      expectedReadingsCompleted,
      readingPercentage,
      weekProgress,
      totalWeeks,
      weekPercentage,
      currentWeekReadings: currentWeekReadings.length,
      currentWeekCompleted,
      currentWeekPercentage: currentWeekReadings.length > 0 
        ? Math.round((currentWeekCompleted / currentWeekReadings.length) * 100) 
        : 0
    };
  }, [readings, readingPlan.startDate]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            {readingPlan.name}
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto mb-6">
            {readingPlan.description}
          </p>
          <div className="mb-6">
            <a 
              href={readingPlan.source} 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              View Original Reading Plan PDF
            </a>
          </div>
        </div>

        {/* Progress Statistics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Reading Progress</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                  {stats.expectedReadingsCompleted}/{stats.totalReadings}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {stats.readingPercentage}% expected
                </p>
              </div>
            </div>
            <div className="mt-4">
              <div className="bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${stats.readingPercentage}%` }}
                />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Week Progress</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                  {stats.weekProgress}/{stats.totalWeeks}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {stats.weekPercentage}% of year
                </p>
              </div>
            </div>
            <div className="mt-4">
              <div className="bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-green-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${stats.weekPercentage}%` }}
                />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">This Week</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                  {stats.currentWeekCompleted}/{stats.currentWeekReadings}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {stats.currentWeekPercentage}% of week
                </p>
              </div>
            </div>
            <div className="mt-4">
              <div className="bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${stats.currentWeekPercentage}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Calendar */}
        <Calendar 
          readings={readings} 
          onReadingClick={handleReadingClick}
        />

        {/* Reading Detail Modal */}
        <ReadingDetailModal
          reading={selectedReading}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
        />

        {/* Help Section */}
        <div className="mt-8 sm:mt-12 bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 sm:p-6">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
            How to Use This Reading Plan
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                📅 Calendar Views
              </h3>
              <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                <li>• <strong>Month View:</strong> See all readings for the month</li>
                <li>• <strong>Week View:</strong> Focus on current week&apos;s readings</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                ✅ Tracking Progress
              </h3>
              <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                <li>• Click on any reading to view details</li>
                <li>• Progress is based on calendar weeks and days</li>
                <li>• Plan starts on the Monday of the week containing January 1st</li>
                <li>• Track expected progress automatically</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
