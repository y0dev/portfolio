"use client";

import { BibleReading } from "@/data/bible-reading-plan";

interface ReadingDetailModalProps {
  reading: BibleReading | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function ReadingDetailModal({ 
  reading, 
  isOpen, 
  onClose
}: ReadingDetailModalProps) {

  if (!isOpen || !reading) return null;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        {/* Backdrop */}
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
          onClick={onClose}
        />
        
        {/* Modal */}
        <div className="relative bg-white dark:bg-gray-900 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                {formatDate(reading.date)}
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Day {reading.day} • Week {reading.week}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
            <div className="space-y-6">
              {reading.readings.map((readingItem, index) => (
                <div key={index} className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                      {readingItem.title}
                    </h3>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                      Reading {index + 1}
                    </span>
                  </div>
                  
                  <div className="mb-4">
                    <h4 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2">
                      Reference:
                    </h4>
                    <p className="text-lg font-semibold text-blue-600 dark:text-blue-400">
                      {readingItem.reference}
                    </p>
                  </div>

                  {readingItem.description && (
                    <div className="mb-4">
                      <h4 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2">
                        Description:
                      </h4>
                      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                        {readingItem.description}
                      </p>
                    </div>
                  )}

                  <div className="bg-white dark:bg-gray-700 rounded-md p-4 border border-gray-200 dark:border-gray-600">
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Reading Notes:
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 italic">
                      Take time to read the passage slowly and thoughtfully. Consider what God is revealing about Himself, His character, and His plan for humanity.
                    </p>
                  </div>
                </div>
              ))}

              {reading.notes && (
                <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4 border border-yellow-200 dark:border-yellow-800">
                  <h4 className="text-sm font-medium text-yellow-800 dark:text-yellow-200 mb-2">
                    Personal Notes:
                  </h4>
                  <p className="text-yellow-700 dark:text-yellow-300 text-sm">
                    {reading.notes}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
