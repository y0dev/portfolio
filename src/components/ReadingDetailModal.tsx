"use client";

import { BibleReading } from "@/data/bible-reading-plan";
import { useEffect, useRef } from "react";

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
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    previousFocusRef.current = document.activeElement as HTMLElement;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    document.addEventListener('keydown', handleEscape);
    document.body.style.overflow = 'hidden';

    // Move focus into modal
    requestAnimationFrame(() => closeButtonRef.current?.focus());

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
      previousFocusRef.current?.focus();
    };
  }, [isOpen, onClose]);

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
          className="fixed inset-0 transition-opacity" style={{ background: "oklch(17% 0.01 72 / 0.5)" }}
          onClick={onClose}
        />
        
        {/* Modal */}
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-date-heading"
          className="relative rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden bg-dr-surface"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-dr-border">
            <div>
              <h2 id="modal-date-heading" className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                {formatDate(reading.date)}
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Day {reading.day} • Week {reading.week}
              </p>
            </div>
            <button
              ref={closeButtonRef}
              onClick={(e) => {
                e.stopPropagation();
                onClose();
              }}
              className="ml-4 p-2 rounded-full bg-dr-hover hover:bg-dr-border text-dr-text-faint hover:text-dr-text transition-colors focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2"
              aria-label="Close modal"
              type="button"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
            <div className="space-y-6">
              {reading.readings.map((readingItem, index) => (
                <div key={index} className="bg-dr-cream rounded-lg p-6">
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                      {readingItem.title}
                    </h3>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium" style={{ background: "var(--dr-amber-pale)", color: "var(--dr-amber-deep)" }}>
                      Reading {index + 1}
                    </span>
                  </div>
                  
                  <div className="mb-4">
                    <h4 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2">
                      Reference:
                    </h4>
                    <p className="text-lg font-semibold" style={{ color: "var(--dr-amber-deep)" }}>
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

                  <div className="bg-dr-surface rounded-md p-4 border border-dr-border">
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Reading Notes:
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 italic">
                      Take time to read the passage slowly and thoughtfully. Consider what God is revealing about Himself, His character, and His plan for humanity.
                    </p>
                  </div>
                </div>
              ))}

              {reading.advent && (
                <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-6 border border-green-200 dark:border-green-800">
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-lg font-semibold text-green-900 dark:text-green-100">
                      Advent Reading
                    </h3>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                      Advent
                    </span>
                  </div>
                  
                  <div className="mb-4">
                    <h4 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2">
                      Reference:
                    </h4>
                    <p className="text-lg font-semibold text-green-600 dark:text-green-400">
                      {reading.advent.reference}
                    </p>
                  </div>

                  {reading.advent.description && (
                    <div className="mb-4">
                      <h4 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2">
                        Description:
                      </h4>
                      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                        {reading.advent.description}
                      </p>
                    </div>
                  )}

                  <div className="bg-dr-surface rounded-md p-4 border border-dr-border">
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Reading Notes:
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 italic">
                      Take time to read the passage slowly and thoughtfully. Consider what God is revealing about Himself, His character, and His plan for humanity.
                    </p>
                  </div>
                </div>
              )}

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
          <div className="flex items-center justify-end p-6 border-t border-dr-border bg-dr-cream">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onClose();
              }}
              className="px-4 py-2 bg-dr-hover text-dr-text-muted rounded-md hover:bg-dr-border transition-colors"
              type="button"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
