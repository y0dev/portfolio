'use client';

import { useState, useEffect } from 'react';
import type { Article } from '@/types';
import { generateNoteHTML, generateArticleHTML } from '@/lib/html-generator';
import { styleHTMLContent } from '@/lib/markdown';
import { formatDate } from '@/lib/utils';

interface ArticlePreviewProps {
  article: Article;
  isOpen: boolean;
  onClose: () => void;
}

export default function ArticlePreview({ article, isOpen, onClose }: ArticlePreviewProps) {
  const [previewHTML, setPreviewHTML] = useState<string>('');

  useEffect(() => {
    if (isOpen && article) {
      // Style the HTML content for each section
      const styledSections = article.content.map(section => ({
        ...section,
        htmlContent: styleHTMLContent(section.htmlContent)
      }));

      // Format date
      const formattedDate = typeof article.date === 'string' 
        ? formatDate(article.date)
        : formatDate(new Date(article.date).toISOString().split('T')[0]);

      // Generate HTML based on type
      let html: string;
      if (article.type === 'note') {
        html = generateNoteHTML(
          article.id,
          article.title,
          article.description || '',
          formattedDate,
          article.tags,
          article.image.name,
          article.image.alt,
          styledSections
        );
      } else {
        html = generateArticleHTML(
          article.id,
          article.title,
          article.description || '',
          formattedDate,
          article.tags,
          article.image.name,
          article.image.alt,
          styledSections
        );
      }

      setPreviewHTML(html);
    }
  }, [isOpen, article]);

  const handleOpenPreview = () => {
    if (previewHTML) {
      const newWindow = window.open('', '_blank');
      if (newWindow) {
        newWindow.document.write(previewHTML);
        newWindow.document.close();
      }
    }
  };

  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => {
        document.removeEventListener('keydown', handleEscape);
      };
    }
  }, [isOpen, onClose]);

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
    >
      <div 
        className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
            Preview: {article.title}
          </h2>
          <div className="flex gap-2">
            <button
              onClick={handleOpenPreview}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Open in New Window
            </button>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
              aria-label="Close modal"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Preview Content */}
        <div className="flex-1 overflow-hidden">
          <iframe
            srcDoc={previewHTML}
            className="w-full h-full border-0"
            title="Article Preview"
          />
        </div>
      </div>
    </div>
  );
}

