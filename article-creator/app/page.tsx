'use client';

import { useState } from 'react';
import ArticleForm from '@/components/ArticleForm';
import MarkdownEditor from '@/components/MarkdownEditor';
import AddToPortfolioModal from '@/components/AddToPortfolioModal';
import { parseMarkdownToSections, styleHTMLContent } from '@/lib/markdown';
import { generateNoteHTML, generateArticleHTML } from '@/lib/html-generator';
import { formatDate, slugifyTitle } from '@/lib/utils';
import { stripCodeBlockWrappers } from '@/lib/html-cleaner';
import type { Article } from '@/types';

/**
 * Sample Markdown
 * @description This is the introduction section of your article or note. You can write content here without a section title, or add sections below.
 * 
 * Section Title will always have ## at the beginning of the line
 * 
 * Subsection Title will always have ### at the beginning of the line
 */
const SAMPLE_MARKDOWN = `This is the introduction section of your article or note. You can write content here without a section title, or add sections below.

## Section Title

You can add sections with titles using ## or ###. Each section will be split automatically.

- Bullet point 1
- Bullet point 2
- Bullet point 3

### Subsection

You can also use ### for subsections.

\`\`\`javascript
// Code blocks are supported
function example() {
    return "Hello, World!";
}
\`\`\`

**Bold text** and *italic text* are supported.

## Tables

Tables are supported with alignment options:

| Tables   |      Are      |  Cool |
|----------|:-------------:|------:|
| col 1 is |  left-aligned | $1600 |
| col 2 is |    centered   |   $12 |
| col 3 is | right-aligned |    $1 |

## Another Section

More content can go here.`;

export default function Home() {
  const [markdown, setMarkdown] = useState(SAMPLE_MARKDOWN);
  const [formData, setFormData] = useState({
    type: 'article' as 'article' | 'note',
    id: '',
    title: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
    category: '',
    tags: '',
    imagePath: '',
    imageAlt: '',
  });
  const [generatedHTML, setGeneratedHTML] = useState('');
  const [articleData, setArticleData] = useState<Article | null>(null);

  const handleFormSubmit = (data: typeof formData) => {
    setFormData(data);
    generateArticle(data);
  };

  const generateArticle = (data: typeof formData) => {
    // Validation - check trimmed values
    const trimmedId = data.id?.trim();
    const trimmedTitle = data.title?.trim();
    const trimmedDate = data.date?.trim();
    
    if (!trimmedId || !trimmedTitle || !trimmedDate) {
      alert('Please fill in required fields: ID, Title, and Date');
      return;
    }
    
    // Category is required since tags and image info depend on it
    if (!data.category || !data.category.trim()) {
      alert('Please select a category');
      return;
    }

    // Auto-format ID if it doesn't match slug format
    let id = trimmedId;
    if (!/^[a-z0-9-]+$/.test(id)) {
      const formattedId = slugifyTitle(id);
      if (formattedId) {
        id = formattedId;
      } else {
        alert('ID should only contain lowercase letters, numbers, and hyphens. Please enter a valid ID.');
        return;
      }
    }

    // Parse markdown into sections
    const sections = parseMarkdownToSections(markdown);
    
    // Style each section's HTML content (client-side only)
    const styledSections = sections.map(section => {
      if (section.htmlContent) {
        return {
          ...section,
          htmlContent: styleHTMLContent(section.htmlContent)
        };
      }
      return section;
    });

    // Format date
    const formattedDate = formatDate(data.date);

    // Generate HTML based on type
    const tags = data.tags.split(',').map(t => t.trim()).filter(t => t);
    let html: string;
    
    if (data.type === 'note') {
      html = generateNoteHTML(
        id,
        data.title,
        data.description,
        formattedDate,
        tags,
        data.imagePath,
        data.imageAlt,
        styledSections
      );
    } else {
      html = generateArticleHTML(
        id,
        data.title,
        data.description,
        formattedDate,
        tags,
        data.imagePath,
        data.imageAlt,
        styledSections
      );
    }

    setGeneratedHTML(html);
    
    // Generate JSON for portfolio (clean HTML - strip code wrappers and styling)
    // The portfolio's ContentRenderer expects plain <pre><code> elements
    const cleanedSections = styledSections.map(section => ({
      ...section,
      htmlContent: stripCodeBlockWrappers(section.htmlContent)
    }));
    
    const jsonData: Article = {
      id,
      title: data.title,
      description: data.description || undefined,
      date: formattedDate,
      tags,
      type: data.type,
      image: {
        alt: data.imageAlt || (data.type === 'note' ? 'Note image' : 'Article image'),
        name: data.imagePath || 'images/image.png'
      },
      content: cleanedSections
    };

    setArticleData(jsonData);
  };

  const handleGenerate = () => {
    generateArticle(formData);
  };

  const handlePreview = () => {
    if (!generatedHTML) {
      handleGenerate();
      return;
    }
    const previewWindow = window.open('', '_blank');
    if (previewWindow) {
      previewWindow.document.write(generatedHTML);
      previewWindow.document.close();
    }
  };

  const handleExportJSON = () => {
    if (!articleData) {
      alert('Please generate HTML first');
      return;
    }

    const blob = new Blob([JSON.stringify(articleData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${articleData.id}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleCopyHTML = () => {
    if (!generatedHTML) {
      alert('Please generate HTML first');
      return;
    }
    navigator.clipboard.writeText(generatedHTML);
    alert('HTML copied to clipboard!');
  };

  const [showAddToPortfolioModal, setShowAddToPortfolioModal] = useState(false);

  const handleAddToPortfolio = async () => {
    if (!articleData) {
      alert('Please generate HTML first');
      return;
    }

    setShowAddToPortfolioModal(true);
  };

  const handleConfirmAddToPortfolio = async () => {
    if (!articleData) return;

    try {
      const response = await fetch('/api/articles/add-to-portfolio', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(articleData)
      });

      const result = await response.json();
      if (response.ok) {
        const successMessage = result.message + (result.nextSteps ? `\n\n${result.nextSteps}` : '');
        // Return success to modal to display
        return { success: true, message: successMessage };
      } else {
        throw new Error(result.error || 'Failed to add article to portfolio');
      }
    } catch (error) {
      throw error; // Let modal handle the error
    }
  };

  const handleUpload = async () => {
    if (!articleData) {
      alert('Please generate HTML first');
      return;
    }

    const serverUrl = prompt('Enter server URL for upload (e.g., http://localhost:3000/api/articles):', 'http://localhost:3000/api/articles');
    if (!serverUrl) return;

    try {
      const response = await fetch(serverUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(articleData)
      });

      if (response.ok) {
        alert('Article uploaded successfully!');
      } else {
        const error = await response.text();
        alert(`Upload failed: ${error}`);
      }
    } catch (error) {
      alert(`Upload error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleMarkdownImport = (markdownContent: string) => {
    setMarkdown(markdownContent);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto p-8 max-w-7xl">
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">Article & Note Editor</h1>
          <p className="text-gray-600 dark:text-gray-400">Create and preview articles/notes matching your portfolio design</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Editor Form */}
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Article/Note Details</h2>
              <ArticleForm 
                onSubmit={handleFormSubmit} 
                onChange={setFormData}
                initialData={formData}
                onMarkdownImport={handleMarkdownImport}
              />
            </div>

            {/* Markdown Editor */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Content (Markdown)</h2>
              <MarkdownEditor value={markdown} onChange={setMarkdown} />
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                Use markdown syntax. Sections with titles will be automatically split.
              </p>
            </div>

            {/* Actions */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              <div className="flex flex-wrap gap-4">
                <button
                  onClick={handleGenerate}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
                >
                  Generate HTML
                </button>
                <button
                  onClick={handlePreview}
                  className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
                >
                  Preview
                </button>
                <button
                  onClick={handleExportJSON}
                  className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors"
                >
                  Export JSON
                </button>
                <button
                  onClick={handleAddToPortfolio}
                  className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
                >
                  Add to Portfolio
                </button>
                <button
                  onClick={handleUpload}
                  className="px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-medium transition-colors"
                >
                  Upload to Server
                </button>
              </div>
            </div>
          </div>
          
          {/* Add to Portfolio Modal */}
          {articleData && (
            <AddToPortfolioModal
              isOpen={showAddToPortfolioModal}
              onClose={() => setShowAddToPortfolioModal(false)}
              articleTitle={articleData.title}
              onConfirm={handleConfirmAddToPortfolio}
            />
          )}

          {/* Preview and Output */}
          <div className="space-y-6">
            {/* Preview */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Preview</h2>
              <div className="preview-content max-h-[600px] overflow-y-auto">
                {articleData ? (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        articleData.type === 'note'
                          ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200'
                          : 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200'
                      }`}>
                        {articleData.type === 'note' ? 'Note' : 'Article'}
                      </span>
                      {articleData.image.name && (
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          Image: {articleData.image.name}
                        </span>
                      )}
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{articleData.title}</h3>
                    {articleData.description && (
                      <p className="text-gray-600 dark:text-gray-400">{articleData.description}</p>
                    )}
                    <p className="text-sm text-gray-500 dark:text-gray-400">Date: {articleData.date}</p>
                    <div className="flex flex-wrap gap-2">
                      {articleData.tags.map(tag => (
                        <span
                          key={tag}
                          className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 px-2 py-1 rounded-full text-xs"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                      <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Content Sections: {articleData.content.length}
                      </p>
                      {articleData.content.map((section, idx) => (
                        <div key={idx} className="mb-2 p-2 bg-gray-50 dark:bg-gray-800 rounded">
                          <p className="text-xs text-gray-600 dark:text-gray-400">
                            Section {idx + 1}: {section.title || 'No title'}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-500 dark:text-gray-400">Preview will appear here...</p>
                )}
              </div>
            </div>

            {/* Generated HTML Output */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Generated HTML</h2>
              <textarea
                value={generatedHTML}
                readOnly
                rows={20}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white font-mono text-xs"
              />
              <button
                onClick={handleCopyHTML}
                className="mt-4 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg text-sm transition-colors"
              >
                Copy HTML
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
