'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import ArticleForm from '@/components/ArticleForm';
import MarkdownEditor from '@/components/MarkdownEditor';
import { parseMarkdownToSections, styleHTMLContent } from '@/lib/markdown';
import { formatDate, slugifyTitle } from '@/lib/utils';
import { articleContentToMarkdown } from '@/lib/html-to-markdown';
import type { Article } from '@/types';

export default function EditArticlePage() {
  const params = useParams();
  const router = useRouter();
  const articleId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [article, setArticle] = useState<Article | null>(null);
  const [markdown, setMarkdown] = useState('');
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
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (articleId) {
      fetchArticle();
    }
  }, [articleId]);

  const fetchArticle = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`/api/articles/db?id=${articleId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch article');
      }
      const data: Article = await response.json();
      setArticle(data);
      
      // Populate form data
      setFormData({
        type: data.type,
        id: data.id,
        title: data.title,
        description: data.description || '',
        date: typeof data.date === 'string' ? data.date : new Date(data.date).toISOString().split('T')[0],
        category: data.tags[0] || '',
        tags: data.tags.join(', '),
        imagePath: data.image?.name || '',
        imageAlt: data.image?.alt || '',
      });

      // Convert HTML content back to markdown
      const markdownContent = articleContentToMarkdown(data.content);
      setMarkdown(markdownContent);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load article');
      console.error('Error fetching article:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);

      // Generate article from current form data
      const tags = formData.tags.split(',').map(t => t.trim()).filter(t => t);
      const sections = parseMarkdownToSections(markdown);
      const styledSections = sections.map(section => ({
        ...section,
        htmlContent: styleHTMLContent(section.htmlContent || ''),
      }));

      const updatedArticle: Article = {
        id: formData.id,
        title: formData.title,
        description: formData.description || undefined,
        date: formData.date,
        tags,
        type: formData.type,
        image: {
          alt: formData.imageAlt || (formData.type === 'note' ? 'Note image' : 'Article image'),
          name: formData.imagePath || 'images/image.png',
        },
        content: styledSections,
      };

      const response = await fetch('/api/articles/db', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedArticle),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to update article');
      }

      alert('Article updated successfully!');
      router.push('/articles');
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to update article');
      console.error('Error updating article:', err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="max-w-7xl mx-auto">
          <p>Loading article...</p>
        </div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="p-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            <p className="font-bold">Error:</p>
            <p>{error || 'Article not found'}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Edit Article</h1>
          <div className="flex gap-2">
            <button
              onClick={() => router.push('/articles')}
              className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <ArticleForm
              initialData={formData}
              onSubmit={(data) => setFormData(data)}
              onChange={(data) => setFormData(data)}
            />
          </div>
          <div>
            <MarkdownEditor
              value={markdown}
              onChange={setMarkdown}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

