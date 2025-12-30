'use client';

import { useState } from 'react';
import { convertOldArticlesToNew } from '@/lib/article-converter';
import ArticlePreview from '@/components/ArticlePreview';
import type { Article } from '@/types';

export default function ConvertPage() {
  const [fileContent, setFileContent] = useState<string>('');
  const [convertedArticles, setConvertedArticles] = useState<Article[]>([]);
  const [error, setError] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [previewArticle, setPreviewArticle] = useState<Article | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setError('');
    setIsProcessing(true);

    try {
      const text = await file.text();
      setFileContent(text);
      
      // Try to parse JSON
      let jsonData;
      try {
        jsonData = JSON.parse(text);
      } catch (parseError) {
        throw new Error('Invalid JSON file. Please check the file format.');
      }

      // Convert old format to new format
      const converted = convertOldArticlesToNew(jsonData);
      setConvertedArticles(converted);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while processing the file');
      setConvertedArticles([]);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = (article: Article) => {
    const dataStr = JSON.stringify(article, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${article.id}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleDownloadAll = () => {
    const dataStr = JSON.stringify(convertedArticles, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'converted-articles.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Convert Old Article Format
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Upload a JSON file containing articles in the old format to convert them to the new format.
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Upload JSON File
          </label>
          <input
            type="file"
            accept=".json"
            onChange={handleFileUpload}
            className="block w-full text-sm text-gray-500 dark:text-gray-400
              file:mr-4 file:py-2 file:px-4
              file:rounded-full file:border-0
              file:text-sm file:font-semibold
              file:bg-blue-50 file:text-blue-700
              hover:file:bg-blue-100
              dark:file:bg-blue-900 dark:file:text-blue-300
              dark:hover:file:bg-blue-800"
            disabled={isProcessing}
          />
          {isProcessing && (
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Processing...
            </p>
          )}
        </div>

        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6">
            <p className="text-red-800 dark:text-red-300">{error}</p>
          </div>
        )}

        {convertedArticles.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Converted Articles ({convertedArticles.length})
              </h2>
              <button
                onClick={handleDownloadAll}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Download All as JSON
              </button>
            </div>

            <div className="space-y-4">
              {convertedArticles.map((article, index) => (
                <div
                  key={article.id || index}
                  className="border border-gray-200 dark:border-gray-700 rounded-lg p-4"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {article.title}
                      </h3>
                      {article.description && (
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          {article.description}
                        </p>
                      )}
                      <div className="flex flex-wrap gap-2 mt-2">
                        <span className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded">
                          {article.type}
                        </span>
                        <span className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded">
                          {article.date}
                        </span>
                        {article.tags.slice(0, 3).map(tag => (
                          <span
                            key={tag}
                            className="text-xs px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded"
                          >
                            {tag}
                          </span>
                        ))}
                        {article.tags.length > 3 && (
                          <span className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded">
                            +{article.tags.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setPreviewArticle(article);
                          setShowPreview(true);
                        }}
                        className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                      >
                        Preview
                      </button>
                      <button
                        onClick={() => handleDownload(article)}
                        className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                      >
                        Download
                      </button>
                    </div>
                  </div>
                  <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                    ID: {article.id} | Sections: {article.content.length}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Preview Modal */}
        {previewArticle && (
          <ArticlePreview
            article={previewArticle}
            isOpen={showPreview}
            onClose={() => {
              setShowPreview(false);
              setPreviewArticle(null);
            }}
          />
        )}
      </div>
    </div>
  );
}

