"use client";

import { useState } from "react";
import { BibleReading } from "@/data/bible-reading-plan";

interface CalendarProps {
  readings: BibleReading[];
  onReadingClick: (reading: BibleReading) => void;
}

type ViewMode = "month" | "week";

export default function Calendar({ readings, onReadingClick }: CalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<ViewMode>("month");
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showDayDetails, setShowDayDetails] = useState(false);

  const today = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();

  const handlePrevPeriod = () => {
    if (viewMode === 'month') {
      setCurrentDate(new Date(currentYear, currentMonth - 1));
    } else {
      setCurrentDate(new Date(currentDate.getTime() - 7 * 24 * 60 * 60 * 1000));
    }
  };

  const handleNextPeriod = () => {
    if (viewMode === 'month') {
      setCurrentDate(new Date(currentYear, currentMonth + 1));
    } else {
      setCurrentDate(new Date(currentDate.getTime() + 7 * 24 * 60 * 60 * 1000));
    }
  };

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const getWeekStart = (date: Date) => {
    const start = new Date(date);
    const day = start.getDay();
    start.setDate(start.getDate() - day);
    return start;
  };

  const getWeekDays = (startDate: Date) => {
    const days = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(startDate);
      day.setDate(startDate.getDate() + i);
      days.push(day);
    }
    return days;
  };

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const getReadingForDate = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    return readings.find(reading => reading.date === dateStr);
  };

  const isToday = (date: Date) => {
    return date.toDateString() === today.toDateString();
  };

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    setShowDayDetails(true);
  };

  // Month view data
  const daysInMonth = getDaysInMonth(currentDate);
  const firstDay = getFirstDayOfMonth(currentDate);
  const monthDays = [];

  // Add empty cells for days before the first day of the month
  for (let i = 0; i < firstDay; i++) {
    monthDays.push(null);
  }

  // Add days of the month
  for (let i = 1; i <= daysInMonth; i++) {
    monthDays.push(i);
  }

  // Week view data
  const weekStart = getWeekStart(currentDate);
  const weekDays = getWeekDays(weekStart);

  // Statistics
  const completedReadings = readings.filter(r => r.completed).length;
  const totalReadings = readings.length;
  const progressPercentage = totalReadings > 0 ? Math.round((completedReadings / totalReadings) * 100) : 0;
  const thisWeekReadings = readings.filter(r => {
    const readingDate = new Date(r.date);
    return readingDate >= weekStart && readingDate < new Date(weekStart.getTime() + 7 * 24 * 60 * 60 * 1000);
  });

  return (
    <div className="dash-container">
      <div>
        <div>
          {/* Header Section */}
          <div className="flex flex-col gap-4 mb-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-xl font-bold text-gray-800 dark:text-gray-200 sm:text-2xl">
                Bible Reading Calendar
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400 sm:text-base">
                Track your daily Bible readings and progress
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-3">
              {/* View Mode Toggle */}
              <div className="flex items-center bg-white rounded-lg border border-gray-200 p-1 shadow-sm dark:bg-gray-800 dark:border-gray-700">
                <button
                  onClick={() => setViewMode('month')}
                  className={`px-2 py-1 text-xs font-medium rounded-md transition-colors sm:px-3 sm:text-sm ${
                    viewMode === 'month'
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200'
                  }`}
                >
                  Month
                </button>
                <button
                  onClick={() => setViewMode('week')}
                  className={`px-2 py-1 text-xs font-medium rounded-md transition-colors sm:px-3 sm:text-sm ${
                    viewMode === 'week'
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200'
                  }`}
                >
                  Week
                </button>
              </div>

              {/* Period Navigation */}
              <div className="flex items-center gap-1 bg-white rounded-lg border border-gray-200 p-1 shadow-sm dark:bg-gray-800 dark:border-gray-700 sm:gap-2 sm:p-2">
                <button
                  onClick={handlePrevPeriod}
                  className="inline-flex items-center justify-center w-7 h-7 rounded-md text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 sm:w-8 sm:h-8"
                >
                  <i className="bx bx-chevron-left text-sm sm:text-lg"></i>
                </button>

                <div className="flex flex-col items-center px-2 sm:px-3">
                  <span className="text-xs font-medium text-gray-900 dark:text-white sm:text-sm">
                    {viewMode === 'month' 
                      ? `${monthNames[currentMonth]} ${currentYear}`
                      : `Week of ${weekStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`
                    }
                  </span>
                </div>

                <button
                  onClick={handleNextPeriod}
                  className="inline-flex items-center justify-center w-7 h-7 rounded-md text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 sm:w-8 sm:h-8"
                >
                  <i className="bx bx-chevron-right text-sm sm:text-lg"></i>
                </button>
              </div>
            </div>
          </div>

          {/* Calendar Grid */}
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm dark:bg-gray-800 dark:border-gray-700">
            {/* Calendar Header */}
            <div className="grid grid-cols-7 border-b border-gray-200 dark:border-gray-700">
              {dayNames.map((day) => (
                <div key={day} className="p-2 text-center text-xs font-medium text-gray-500 dark:text-gray-400 sm:p-4 sm:text-sm">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Body */}
            <div className="grid grid-cols-7">
              {viewMode === 'month' ? (

                // Month View
                monthDays.map((day, index) => {
                  const dayDate = day ? new Date(currentYear, currentMonth, day) : null;
                  const reading = dayDate ? getReadingForDate(dayDate) : null;
                  const isCurrentDay = dayDate ? isToday(dayDate) : false;
                  const isWeekend = dayDate ? (dayDate.getDay() === 0 || dayDate.getDay() === 6) : false;
                  // console.log(reading);

                  return (
                    <div
                      key={index}
                      className={`min-h-[80px] p-1 border-r border-b border-gray-200 dark:border-gray-700 sm:min-h-[120px] sm:p-2 ${
                        day === null 
                          ? 'bg-gray-50 dark:bg-gray-900' 
                          : isCurrentDay
                          ? 'bg-blue-50 dark:bg-blue-900/30 cursor-pointer hover:bg-blue-100 dark:hover:bg-blue-900/40'
                          : 'hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer'
                      }`}
                      onClick={() => dayDate && handleDateClick(dayDate)}
                    >
                      {day && (
                        <div className="flex flex-col h-full">
                          <div className="flex justify-between items-center mb-1">
                            <div className={`text-xs font-medium sm:text-sm ${
                              isCurrentDay 
                                ? 'text-blue-700 dark:text-blue-300' 
                                : 'text-gray-900 dark:text-white'
                            }`}>
                              {day}
                            </div>
                            {reading && (
                              <div className={`w-2 h-2 rounded-full ${
                                reading.completed 
                                  ? 'bg-green-500' 
                                  : 'bg-blue-500 opacity-50'
                              }`}></div>
                            )}
                          </div>
                          <div className="flex-1 space-y-1">
                            {reading && (
                              <div className="space-y-0.5">
                                {reading.ot && (
                                  <div
                                    className={`text-xs p-0.5 rounded cursor-pointer hover:opacity-80 transition-all duration-200 ${
                                      reading.completed
                                        ? 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400 hover:bg-orange-200 dark:hover:bg-orange-900/30'
                                        : 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400 hover:bg-orange-200 dark:hover:bg-orange-900/30'
                                    }`}
                                    title={`OT: ${reading.ot.reference}`}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      onReadingClick(reading);
                                    }}
                                  >
                                    <span className="truncate text-[10px] sm:text-xs">OT</span>
                                  </div>
                                )}
                                {reading.psalm && (
                                  <div
                                    className={`text-xs p-0.5 rounded cursor-pointer hover:opacity-80 transition-all duration-200 ${
                                      reading.completed
                                        ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400 hover:bg-purple-200 dark:hover:bg-purple-900/30'
                                        : 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400 hover:bg-purple-200 dark:hover:bg-purple-900/30'
                                    }`}
                                    title={`Psalm: ${reading.psalm.reference}`}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      onReadingClick(reading);
                                    }}
                                  >
                                    <span className="truncate text-[10px] sm:text-xs">P</span>
                                  </div>
                                )}
                                {reading.nt && (
                                  <div
                                    className={`text-xs p-0.5 rounded cursor-pointer hover:opacity-80 transition-all duration-200 ${
                                      reading.completed
                                        ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-900/30'
                                        : 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-900/30'
                                    }`}
                                    title={`NT: ${reading.nt.reference}`}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      onReadingClick(reading);
                                    }}
                                  >
                                    <span className="truncate text-[10px] sm:text-xs">NT</span>
                                  </div>
                                )}
                                {reading.advent && (
                                  <div
                                  className={`text-xs p-0.5 rounded cursor-pointer hover:opacity-80 transition-all duration-200 ${
                                    reading.completed
                                      ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400 hover:bg-green-200 dark:hover:bg-green-900/30'
                                      : 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400 hover:bg-green-200 dark:hover:bg-green-900/30'
                                  }`}
                                  title={`Advent: ${reading.advent?.reference}`}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    onReadingClick(reading);
                                  }}
                                >
                                  <span className="truncate text-[10px] sm:text-xs">Advent Reading</span>
                                </div>
                                )}
                              </div>
                            )}
                            {!reading && !isWeekend && (
                              <div className="text-xs text-gray-400 dark:text-gray-500 italic">
                                Rest day
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })
              ) : (
                // Week View
                weekDays.map((day, index) => {
                  const reading = getReadingForDate(day);
                  const isCurrentDay = isToday(day);
                  // console.log("Reading for date:", day, reading);
                  
                  // This is the week view
                  return (
                    <div
                      key={index}
                      className={`min-h-[150px] p-2 border-r border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 sm:min-h-[200px] sm:p-3 cursor-pointer ${
                        isCurrentDay ? 'bg-blue-50 dark:bg-blue-900/30' : ''
                      }`}
                      onClick={() => handleDateClick(day)}
                    >
                      <div className="flex flex-col h-full">
                        <div className="flex justify-between items-center mb-2">
                          <div className={`text-xs font-medium sm:text-sm ${
                            isCurrentDay 
                              ? 'text-blue-700 dark:text-blue-300' 
                              : 'text-gray-900 dark:text-white'
                          }`}>
                            {day.getDate()}
                          </div>
                          {reading && (
                            <div className={`w-2 h-2 rounded-full ${
                              reading.completed 
                                ? 'bg-green-500' 
                                : 'bg-blue-500 opacity-50'
                            }`}></div>
                          )}
                        </div>
                        <div className="flex-1 space-y-1 sm:space-y-2">
                          {reading ? (
                            <div className="space-y-1">
                              {reading.ot && (
                                <div
                                  className={`text-xs p-1 rounded cursor-pointer hover:opacity-80 transition-all duration-200 sm:p-2 ${
                                    reading.completed
                                      ? 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400 hover:bg-orange-200 dark:hover:bg-orange-900/30'
                                      : 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400 hover:bg-orange-200 dark:hover:bg-orange-900/30'
                                  }`}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    onReadingClick(reading);
                                  }}
                                >
                                  <div className="font-medium truncate">OT: {reading.ot.reference}</div>
                                  <div className="text-xs opacity-75 truncate">{reading.ot.description}</div>
                                </div>
                              )}
                              {reading.psalm && (
                                <div
                                  className={`text-xs p-1 rounded cursor-pointer hover:opacity-80 transition-all duration-200 sm:p-2 ${
                                    reading.completed
                                      ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400 hover:bg-purple-200 dark:hover:bg-purple-900/30'
                                      : 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400 hover:bg-purple-200 dark:hover:bg-purple-900/30'
                                  }`}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    onReadingClick(reading);
                                  }}
                                >
                                  <div className="font-medium truncate">Psalm: {reading.psalm.reference}</div>
                                  <div className="text-xs opacity-75 truncate">{reading.psalm.description}</div>
                                </div>
                              )}
                              {reading.nt && (
                                <div
                                  className={`text-xs p-1 rounded cursor-pointer hover:opacity-80 transition-all duration-200 sm:p-2 ${
                                    reading.completed
                                      ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-900/30'
                                      : 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-900/30'
                                  }`}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    onReadingClick(reading);
                                  }}
                                >
                                  <div className="font-medium truncate">NT: {reading.nt.reference}</div>
                                  <div className="text-xs opacity-75 truncate">{reading.nt.description}</div>
                                </div>
                              )}
                              {reading.advent && (
                                <div
                                  className={`text-xs p-1 rounded cursor-pointer hover:opacity-80 transition-all duration-200 sm:p-2 ${
                                    reading.completed
                                      ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400 hover:bg-green-200 dark:hover:bg-green-900/30'
                                      : 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400 hover:bg-green-200 dark:hover:bg-green-900/30'
                                  }`}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    onReadingClick(reading);
                                  }}
                                >
                                  <div className="font-medium truncate">Advent: {reading.advent?.reference || 'Reading'}</div>
                                  <div className="text-xs opacity-75 truncate">{reading.advent?.description || 'Advent reading'}</div>
                                </div>
                              )}
                            </div>
                          ) : (
                            <div className="text-xs text-gray-400 dark:text-gray-500 italic">
                              Rest day
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Summary Cards */}
          <div className="mt-4 grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-3">
            {/* Progress Summary */}
            <div className="bg-white rounded-lg border border-gray-200 p-4 dark:bg-gray-800 dark:border-gray-700 sm:p-6">
              <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-3 sm:text-lg sm:mb-4">
                Reading Progress
              </h3>
              <div className="space-y-2 sm:space-y-3">
                <div className="flex flex-col gap-1 sm:flex-row sm:justify-between sm:items-center">
                  <span className="text-xs text-gray-600 dark:text-gray-400 sm:text-sm">Completed</span>
                  <span className="text-xs font-medium text-green-600 dark:text-green-400 sm:text-sm">
                    {completedReadings} / {totalReadings}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                  <div 
                    className="bg-green-600 h-2 rounded-full transition-all duration-300 dark:bg-green-500"
                    style={{ width: `${progressPercentage}%` }}
                  ></div>
                </div>
                <div className="flex flex-col gap-1 sm:flex-row sm:justify-between sm:items-center">
                  <span className="text-xs text-gray-600 dark:text-gray-400 sm:text-sm">Progress</span>
                  <span className="text-xs font-medium text-gray-900 dark:text-white sm:text-sm">
                    {progressPercentage}%
                  </span>
                </div>
              </div>
            </div>

            {/* This Week's Readings */}
            <div className="bg-white rounded-lg border border-gray-200 p-4 dark:bg-gray-800 dark:border-gray-700 sm:p-6">
              <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-3 sm:text-lg sm:mb-4">
                This Week
              </h3>
              {thisWeekReadings.length === 0 ? (
                <p className="text-xs text-gray-500 dark:text-gray-400 sm:text-sm">No readings scheduled</p>
              ) : (
                <div className="space-y-2">
                  {thisWeekReadings.slice(0, 3).map((reading) => {
                    const readingDate = new Date(reading.date);
                    const isPast = readingDate < today;
                    
                    return (
                      <div 
                        key={reading.id} 
                        className={`flex flex-col gap-1 p-2 rounded-lg sm:flex-row sm:justify-between sm:items-center ${
                          reading.completed
                            ? 'bg-green-50 dark:bg-green-900/20'
                            : isPast
                            ? 'bg-yellow-50 dark:bg-yellow-900/20'
                            : 'bg-blue-50 dark:bg-blue-900/20'
                        }`}
                      >
                        <div>
                          <p className="text-xs font-medium text-gray-900 dark:text-white sm:text-sm">
                            {reading.readings[0]?.title || 'Reading'}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {readingDate.toLocaleDateString()}
                          </p>
                        </div>
                        <span className={`text-xs font-medium sm:text-sm ${
                          reading.completed
                            ? 'text-green-600 dark:text-green-400'
                            : isPast
                            ? 'text-yellow-600 dark:text-yellow-400'
                            : 'text-blue-600 dark:text-blue-400'
                        }`}>
                          {reading.completed ? '✓ Done' : isPast ? 'Pending' : 'Upcoming'}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-lg border border-gray-200 p-4 dark:bg-gray-800 dark:border-gray-700 sm:p-6">
              <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-3 sm:text-lg sm:mb-4">
                Recent Activity
              </h3>
              {readings.length === 0 ? (
                <p className="text-xs text-gray-500 dark:text-gray-400 sm:text-sm">No recent activity</p>
              ) : (
                <div className="space-y-2">
                  {readings
                    .filter(r => r.completed)
                    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                    .slice(0, 3)
                    .map((reading) => (
                      <div key={reading.id} className="flex flex-col gap-1 p-2 bg-gray-50 rounded-lg dark:bg-gray-700 sm:flex-row sm:justify-between sm:items-center">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-green-500"></div>
                          <div>
                            <p className="text-xs font-medium text-gray-900 dark:text-white sm:text-sm">
                              {reading.readings[0]?.title || 'Reading'}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {new Date(reading.date).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <span className="text-xs font-medium text-green-600 dark:text-green-400 sm:text-sm">
                          Week {reading.week}
                        </span>
                      </div>
                    ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Day Details Modal */}
      {showDayDetails && selectedDate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-hidden dark:bg-gray-800">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                {selectedDate.toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </h2>
              <button
                onClick={() => setShowDayDetails(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <i className="bx bx-x text-2xl"></i>
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto max-h-[60vh]">
              {(() => {
                const reading = getReadingForDate(selectedDate);
                
                if (!reading) {
                  return (
                    <div className="text-center py-8">
                      <i className="bx bx-calendar text-4xl text-gray-400 mb-4"></i>
                      <p className="text-gray-500 dark:text-gray-400">No reading scheduled for this day</p>
                      <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">Take time to reflect and rest</p>
                    </div>
                  );
                }
                
                return (
                  <div className="space-y-4">
                    {/* Reading Details */}
                    <div className="bg-gray-50 rounded-lg p-4 dark:bg-gray-700">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Week {reading.week}, Day {reading.day}</span>
                        {reading.completed && (
                          <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full dark:bg-green-900/20 dark:text-green-400">
                            Completed
                          </span>
                        )}
                      </div>
                    </div>
                    
                    {/* Reading Content */}
                    <div className="space-y-3">
                      {/* Old Testament */}
                      {reading.ot && (
                        <div
                          className="flex items-center justify-between p-4 border border-orange-200 rounded-lg hover:bg-orange-50 dark:border-orange-600 dark:hover:bg-orange-900/20 cursor-pointer transition-colors duration-200 bg-orange-50 dark:bg-orange-900/10"
                          onClick={() => {
                            setShowDayDetails(false);
                            onReadingClick(reading);
                          }}
                        >
                          <div className="flex items-center space-x-3">
                            <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                            <div>
                              <h3 className="font-medium text-orange-900 dark:text-orange-100">Old Testament</h3>
                              <p className="text-sm text-orange-700 dark:text-orange-300 font-semibold mt-1">
                                {reading.ot.reference}
                              </p>
                              {reading.ot.description && (
                                <p className="text-sm text-orange-600 dark:text-orange-400 mt-1">{reading.ot.description}</p>
                              )}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-xs text-orange-500 dark:text-orange-400">
                              Click to view
                            </div>
                          </div>
                        </div>
                      )}
                      {/* Psalm */}
                      {reading.psalm && (
                        <div
                          className="flex items-center justify-between p-4 border border-purple-200 rounded-lg hover:bg-purple-50 dark:border-purple-600 dark:hover:bg-purple-900/20 cursor-pointer transition-colors duration-200 bg-purple-50 dark:bg-purple-900/10"
                          onClick={() => {
                            setShowDayDetails(false);
                            onReadingClick(reading);
                          }}
                        >
                          <div className="flex items-center space-x-3">
                            <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                            <div>
                              <h3 className="font-medium text-purple-900 dark:text-purple-100">Psalm</h3>
                              <p className="text-sm text-purple-700 dark:text-purple-300 font-semibold mt-1">
                                {reading.psalm.reference}
                              </p>
                              {reading.psalm.description && (
                                <p className="text-sm text-purple-600 dark:text-purple-400 mt-1">{reading.psalm.description}</p>
                              )}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-xs text-purple-500 dark:text-purple-400">
                              Click to view
                            </div>
                          </div>
                        </div>
                      )}

                      {/* New Testament */}
                      {reading.nt && (
                        <div
                          className="flex items-center justify-between p-4 border border-blue-200 rounded-lg hover:bg-blue-50 dark:border-blue-600 dark:hover:bg-blue-900/20 cursor-pointer transition-colors duration-200 bg-blue-50 dark:bg-blue-900/10"
                          onClick={() => {
                            setShowDayDetails(false);
                            onReadingClick(reading);
                          }}
                        >
                          <div className="flex items-center space-x-3">
                            <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                            <div>
                              <h3 className="font-medium text-blue-900 dark:text-blue-100">New Testament</h3>
                              <p className="text-sm text-blue-700 dark:text-blue-300 font-semibold mt-1">
                                {reading.nt.reference}
                              </p>
                              {reading.nt.description && (
                                <p className="text-sm text-blue-600 dark:text-blue-400 mt-1">{reading.nt.description}</p>
                              )}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-xs text-blue-500 dark:text-blue-400">
                              Click to view
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Advent */}
                      {reading.advent && (
                        <div className="flex items-center justify-between p-4 border border-green-200 rounded-lg hover:bg-green-50 dark:border-green-600 dark:hover:bg-green-900/20 cursor-pointer transition-colors duration-200 bg-green-50 dark:bg-green-900/10"
                            onClick={() => {
                              setShowDayDetails(false);
                              onReadingClick(reading);
                            }}  
                        >
                          <div className="flex items-center space-x-3">
                            <div className="w-3 h-3 rounded-full bg-green-500"></div>
                            <div>
                              <h3 className="font-medium text-green-900 dark:text-green-100">Advent Reading</h3>
                              <p className="text-sm text-green-700 dark:text-green-300 font-semibold mt-1">
                                {reading.advent?.reference}
                              </p>
                              <p className="text-sm text-green-600 dark:text-green-400 mt-1">
                                {reading.advent?.description}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-xs text-green-500 dark:text-green-400">
                              Click to view
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
