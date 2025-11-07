"use client";

import { useState, useMemo } from "react";
import { BibleReading } from "@/data/bible-reading-plan";

interface CalendarProps {
  readings: BibleReading[];
  onReadingClick: (reading: BibleReading) => void;
}

type ViewMode = "month" | "week" | "day";

export default function Calendar({ readings, onReadingClick }: CalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<ViewMode>("month");

  const today = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();


  // Get reading for current day
  const currentDayReading = useMemo(() => {
    const todayStr = currentDate.toISOString().split('T')[0];
    return readings.find(reading => reading.date === todayStr);
  }, [readings, currentDate]);

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    if (direction === 'prev') {
      newDate.setMonth(currentMonth - 1);
    } else {
      newDate.setMonth(currentMonth + 1);
    }
    setCurrentDate(newDate);
  };

  const navigateWeek = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    if (direction === 'prev') {
      newDate.setDate(currentDate.getDate() - 7);
    } else {
      newDate.setDate(currentDate.getDate() + 7);
    }
    setCurrentDate(newDate);
  };

  const navigateDay = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    if (direction === 'prev') {
      newDate.setDate(currentDate.getDate() - 1);
    } else {
      newDate.setDate(currentDate.getDate() + 1);
    }
    setCurrentDate(newDate);
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getReadingForDate = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    return readings.find(reading => reading.date === dateStr);
  };

  const isToday = (date: Date) => {
    return date.toDateString() === today.toDateString();
  };

  const isCurrentMonth = (date: Date) => {
    return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
  };

  const truncateReference = (reference: string, maxLength: number = 20) => {
    if (!reference) return 'Reference';
    if (reference.length <= maxLength) return reference;
    const firstPart = reference.split(';')[0];
    return firstPart.length <= maxLength ? `${firstPart}...` : `${firstPart.substring(0, maxLength)}...`;
  };

  const truncateTitle = (title: string, maxWords: number = 2) => {
    if (!title) return 'Reading';
    const words = title.split(' ');
    if (words.length <= maxWords) return title;
    return `${words.slice(0, maxWords).join(' ')}...`;
  };

  const getResponsiveTruncation = (title: string) => {
    if (!title) return 'Reading';
    const words = title.split(' ');
    // Very conservative truncation to prevent overflow
    if (words.length <= 1) return title; // Mobile: 1 word
    if (words.length <= 2) return title; // Tablet: 2 words  
    if (words.length <= 3) return title; // Desktop: 3 words
    return `${words.slice(0, 3).join(' ')}...`; // Large screens: 3 words max
  };

  const renderMonthView = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const days = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(
        <div key={`empty-${i}`} className="h-16 sm:h-20 md:h-24 lg:h-28 xl:h-32 border-r border-b border-gray-200 dark:border-gray-700 bg-gray-50/30 dark:bg-gray-800/30"></div>
      );
    }

    /*
    * Description:
    * This function adds the days of the month to the calendar.
    * It loops through the days of the month and adds a div for each day.
    * The div is styled with the appropriate border and background color.
    * The div is also styled with the appropriate text color.
    * The div is also styled with the appropriate cursor and hover effect.
    * The div is also styled with the appropriate transition effect.
    * The div is also styled with the appropriate flex-col layout.
    * The div is also styled with the appropriate justify-between items-start flex-shrink-0 layout.
    * Add days of the month
    *
    */
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentYear, currentMonth, day);
      const reading = getReadingForDate(date);
      const isCurrentDay = isToday(date);
      const isWeekend = date.getDay() === 0 || date.getDay() === 6;
      console.log(day,reading?.readings[0]?.title);
      days.push(
        <div
          key={day}
          className={`h-16 sm:h-20 md:h-24 lg:h-28 xl:h-32 border-r border-b border-gray-200 dark:border-gray-700 p-1 sm:p-2 lg:p-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200 flex flex-col ${
            isCurrentDay ? 'bg-blue-50 dark:bg-blue-900/30 border-blue-200 dark:border-blue-700' : ''
          } ${isWeekend ? 'bg-gray-50/50 dark:bg-gray-800/50' : ''} ${
            !isCurrentMonth(date) ? 'text-gray-400 dark:text-gray-600 bg-gray-50/20 dark:bg-gray-800/20' : ''
          }`}
          onClick={() => reading && onReadingClick(reading)}
        >
          <div className="flex justify-between items-start flex-shrink-0">
            <span className={`text-xs sm:text-sm font-bold ${
              isCurrentDay ? 'text-blue-700 dark:text-blue-300' : 'text-gray-800 dark:text-gray-200'
            }`}>
              {day}
            </span>
            {reading && (
              <div className="w-2 h-2 bg-green-500 rounded-full opacity-70"></div>
            )}
          </div>
          {reading && reading.readings[0]?.title && (
            <div className="mt-0.5 text-xs sm:text-sm lg:text-base text-gray-700 dark:text-gray-300 font-semibold leading-tight overflow-hidden flex-1 min-h-0">
              <div className="truncate">
                {reading.readings[0].title}
              </div>
            </div>
          )}
        </div>
      );
    }

    /*
    * Description:
    * This function renders the month view of the calendar.
    * It renders the days of the month in a grid.
    * The grid is styled with the appropriate border and background color.
    * The grid is also styled with the appropriate text color.
    * The grid is also styled with the appropriate cursor and hover effect.
    * The grid is also styled with the appropriate transition effect.
    */
    return (
      <div className="grid grid-cols-7 gap-0 bg-white dark:bg-gray-900 rounded-lg overflow-hidden shadow-sm">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, index) => (
          <div key={day} className={`h-8 sm:h-10 md:h-12 lg:h-14 xl:h-16 border-r border-b border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 flex items-center justify-center font-bold text-xs sm:text-sm lg:text-base ${
            index === 6 ? 'border-r-0' : ''
          } ${
            index === 0 || index === 6 ? 'text-gray-600 dark:text-gray-400' : 'text-gray-800 dark:text-gray-200'
          }`}>
            {day}
          </div>
        ))}
        {days}
      </div>
    );
  };

  const renderWeekView = () => {
    const startOfWeek = new Date(currentDate);
    startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());
    
    const weekDays = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      const reading = getReadingForDate(date);
      const isCurrentDay = isToday(date);
      const isWeekend = i === 0 || i === 6; // Sunday or Saturday

      weekDays.push(
        <div
          key={i}
          className={`border-r border-gray-200 dark:border-gray-700 p-3 sm:p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200 ${
            isCurrentDay ? 'bg-blue-50 dark:bg-blue-900/30 border-blue-200 dark:border-blue-700' : ''
          } ${isWeekend ? 'bg-gray-50/50 dark:bg-gray-800/50' : ''} ${
            i === 6 ? 'border-r-0' : ''
          }`}
          onClick={() => reading && onReadingClick(reading)}
        >
          <div className={`text-xs sm:text-sm font-bold mb-2 ${
            isCurrentDay ? 'text-blue-700 dark:text-blue-300' : 'text-gray-800 dark:text-gray-200'
          }`}>
            {date.toLocaleDateString('en-US', { weekday: 'short' })}
          </div>
          <div className={`text-xs font-semibold mb-2 ${
            isCurrentDay ? 'text-blue-600 dark:text-blue-400' : 'text-gray-600 dark:text-gray-400'
          }`}>
            {date.getDate()}
          </div>
          {reading ? (
            <div className="space-y-0.5 sm:space-y-1 lg:space-y-1.5 overflow-hidden">
              <div className="text-xs sm:text-sm lg:text-base font-semibold text-gray-900 dark:text-gray-100 leading-tight truncate">
                {reading.readings[0]?.title || 'Reading'}
              </div>
              <div className="text-xs sm:text-sm lg:text-base text-gray-600 dark:text-gray-400 leading-tight font-medium truncate">
                {reading.readings[0]?.reference || 'Reference'}
              </div>
            </div>
          ) : (
            <div className="text-xs sm:text-sm lg:text-base text-gray-400 dark:text-gray-500 font-medium italic">
              Rest day
            </div>
          )}
        </div>
      );
    }

    return (
      <div className="grid grid-cols-7 gap-0 min-h-[450px] sm:min-h-[350px] bg-white dark:bg-gray-900 rounded-lg overflow-hidden">
        {weekDays}
      </div>
    );
  };

  const renderDayView = () => {
    const reading = currentDayReading;
    const isCurrentDay = isToday(currentDate);

    return (
      <div className={`border border-gray-200 dark:border-gray-700 p-6 sm:p-8 rounded-lg ${
        isCurrentDay ? 'bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-200 dark:border-blue-700' : 'bg-white dark:bg-gray-900'
      }`}>
        <div className="flex items-center justify-between mb-6">
          <div className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100">
            {formatDate(currentDate)}
          </div>
          {isCurrentDay && (
            <div className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm font-semibold">
              Today
            </div>
          )}
        </div>
        {reading ? (
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-lg">
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100 leading-tight">
                  {reading.readings[0]?.title}
                </h3>
                <div className="px-3 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-full text-xs font-semibold">
                  Week {reading.week}
                </div>
              </div>
              <p className="text-blue-600 dark:text-blue-400 font-bold mb-4 text-lg sm:text-xl">
                {reading.readings[0]?.reference}
              </p>
              {reading.readings[0]?.description && (
                <p className="text-gray-700 dark:text-gray-300 text-base sm:text-lg leading-relaxed">
                  {reading.readings[0].description}
                </p>
              )}
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => onReadingClick(reading)}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 text-base font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                View Full Reading
              </button>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Day {reading.day} of 260
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-lg sm:text-xl font-semibold text-gray-600 dark:text-gray-400 mb-2">
              Rest Day
            </h3>
            <p className="text-gray-500 dark:text-gray-500 text-sm sm:text-base">
              No reading scheduled for this day. Take time to reflect and rest.
            </p>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700">
      {/* Header */}
      <div className="p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 rounded-t-xl">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
          <div className="flex items-center space-x-2 sm:space-x-4">
            <h2 className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-gray-100">
              {viewMode === 'month' && formatDate(currentDate).split(' ').slice(0, 2).join(' ')}
              {viewMode === 'week' && `Week of ${formatDate(currentDate).split(' ').slice(0, 3).join(' ')}`}
              {viewMode === 'day' && formatDate(currentDate)}
            </h2>
            <button
              onClick={goToToday}
              className="px-3 py-1.5 text-xs sm:text-sm bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-800 transition-all duration-200 font-semibold"
            >
              Today
            </button>
          </div>
          
          <div className="flex items-center space-x-3">
            {/* View Mode Toggle */}
            <div className="flex bg-gray-200 dark:bg-gray-700 rounded-lg p-1">
              {(['month', 'week', 'day'] as ViewMode[]).map((mode) => (
                <button
                  key={mode}
                  onClick={() => setViewMode(mode)}
                  className={`px-3 py-1.5 text-xs sm:text-sm font-semibold rounded-md transition-all duration-200 capitalize ${
                    viewMode === mode
                      ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-gray-100 shadow-sm'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-600'
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>
            
            {/* Navigation */}
            <div className="flex items-center space-x-1">
              <button
                onClick={() => {
                  if (viewMode === 'month') navigateMonth('prev');
                  if (viewMode === 'week') navigateWeek('prev');
                  if (viewMode === 'day') navigateDay('prev');
                }}
                className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-all duration-200"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={() => {
                  if (viewMode === 'month') navigateMonth('next');
                  if (viewMode === 'week') navigateWeek('next');
                  if (viewMode === 'day') navigateDay('next');
                }}
                className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-all duration-200"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Calendar Content */}
      <div className="p-3 sm:p-6">
        {viewMode === 'month' && renderMonthView()}
        {viewMode === 'week' && renderWeekView()}
        {viewMode === 'day' && renderDayView()}
      </div>
    </div>
  );
}
