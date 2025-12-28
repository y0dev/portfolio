'use client';

import { useState, useEffect, useRef } from 'react';
import { slugifyTitle, getTagsForCategory, getImageForCategory, getAllCategories, parseMarkdownFile } from '@/lib/utils';

interface ArticleFormData {
  type: 'article' | 'note';
  id: string;
  title: string;
  description: string;
  date: string;
  category: string;
  tags: string;
  imagePath: string;
  imageAlt: string;
}

interface ArticleFormProps {
  onSubmit: (data: ArticleFormData) => void;
  onChange?: (data: ArticleFormData) => void;
  initialData?: Partial<ArticleFormData>;
  onMarkdownImport?: (markdown: string) => void;
}

export default function ArticleForm({ onSubmit, onChange, initialData, onMarkdownImport }: ArticleFormProps) {
  const [formData, setFormData] = useState<ArticleFormData>({
    type: initialData?.type || 'article',
    id: initialData?.id || '',
    title: initialData?.title || '',
    description: initialData?.description || '',
    date: initialData?.date || new Date().toISOString().split('T')[0],
    category: initialData?.category || '',
    tags: initialData?.tags || '',
    imagePath: initialData?.imagePath || '',
    imageAlt: initialData?.imageAlt || '',
  });

  const [idManuallyEdited, setIdManuallyEdited] = useState(false);
  const [isFocusedOnIdField, setIsFocusedOnIdField] = useState(false);

  // Update form data when initialData changes (e.g., on import)
  const prevDataRef = useRef<string>('');
  useEffect(() => {
    if (initialData) {
      // Create a string representation to detect changes
      const dataKey = JSON.stringify({
        title: initialData.title,
        description: initialData.description,
        date: initialData.date,
        category: initialData.category,
        type: initialData.type,
        id: initialData.id,
        tags: initialData.tags,
        imagePath: initialData.imagePath,
        imageAlt: initialData.imageAlt,
      });
      
      // Only update if data actually changed
      if (dataKey !== prevDataRef.current) {
        setFormData(prev => ({
          type: initialData.type !== undefined ? initialData.type : prev.type,
          id: initialData.id !== undefined ? initialData.id : prev.id,
          title: initialData.title !== undefined ? initialData.title : prev.title,
          description: initialData.description !== undefined ? initialData.description : prev.description,
          date: initialData.date !== undefined ? initialData.date : prev.date,
          category: initialData.category !== undefined ? initialData.category : prev.category,
          tags: initialData.tags !== undefined ? initialData.tags : prev.tags,
          imagePath: initialData.imagePath !== undefined ? initialData.imagePath : prev.imagePath,
          imageAlt: initialData.imageAlt !== undefined ? initialData.imageAlt : prev.imageAlt,
        }));
        
        // Reset manual edit flags when title is imported
        if (initialData.title) {
          setIdManuallyEdited(false);
        }
        
        prevDataRef.current = dataKey;
      }
    }
  }, [
    initialData?.title,
    initialData?.description,
    initialData?.date,
    initialData?.category,
    initialData?.type,
    initialData?.id,
    initialData?.tags,
    initialData?.imagePath,
    initialData?.imageAlt,
  ]);

  // Sync form data to parent whenever it changes
  useEffect(() => {
    if (onChange) {
      onChange(formData);
    }
  }, [formData, onChange]);

  // Auto-generate slug from title
  useEffect(() => {
    if (!isFocusedOnIdField && !idManuallyEdited && formData.title) {
      const slug = slugifyTitle(formData.title);
      setFormData(prev => ({ ...prev, id: slug }));
    }
  }, [formData.title, isFocusedOnIdField, idManuallyEdited]);

  // Auto-populate tags and image when category changes
  useEffect(() => {
    if (formData.category) {
      const tags = getTagsForCategory(formData.category);
      const image = getImageForCategory(formData.category);
      setFormData(prev => ({ 
        ...prev, 
        tags: tags.join(', '),
        imagePath: image.name,
        imageAlt: image.alt
      }));
    }
  }, [formData.category]);

  const handleChange = (field: keyof ArticleFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Track manual edits to ID field
    if (field === 'id') {
      const expectedSlug = slugifyTitle(formData.title);
      if (value !== expectedSlug) {
        setIdManuallyEdited(true);
      } else {
        setIdManuallyEdited(false);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const regenerateSlug = () => {
    if (formData.title) {
      const slug = slugifyTitle(formData.title);
      setFormData(prev => ({ ...prev, id: slug }));
      setIdManuallyEdited(false);
    }
  };

  const handleImportMarkdown = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.md')) {
      alert('Please select a markdown (.md) file');
      return;
    }

    try {
      const fileContent = await file.text();
      const parsed = parseMarkdownFile(fileContent);
      
      // Update form data
      const newFormData: ArticleFormData = {
        type: parsed.type,
        id: slugifyTitle(parsed.title),
        title: parsed.title,
        description: parsed.description,
        date: parsed.date || new Date().toISOString().split('T')[0],
        category: parsed.category,
        tags: parsed.category ? getTagsForCategory(parsed.category).join(', ') : '',
        imagePath: parsed.category ? getImageForCategory(parsed.category).name : '',
        imageAlt: parsed.category ? getImageForCategory(parsed.category).alt : '',
      };
      
      setFormData(newFormData);
      setIdManuallyEdited(false);
      
      // Notify parent about markdown content
      if (onMarkdownImport) {
        onMarkdownImport(parsed.content);
      }
      
      alert('Markdown file imported successfully!');
    } catch (error) {
      alert(`Failed to import markdown file: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
    
    // Reset file input
    event.target.value = '';
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Import Markdown */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Import from Markdown File
        </label>
        <label className="block w-full px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors cursor-pointer text-center">
          Import Markdown File
          <input
            type="file"
            accept=".md"
            onChange={handleImportMarkdown}
            className="hidden"
          />
        </label>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          Import a markdown file with Blog/Note Info section to populate all fields.
        </p>
      </div>

      {/* Type Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Type
        </label>
        <select
          value={formData.type}
          onChange={(e) => handleChange('type', e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
        >
          <option value="article">Article</option>
          <option value="note">Note</option>
        </select>
      </div>

      {/* ID */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          ID (URL slug) <span className="text-xs text-gray-500 dark:text-gray-400">(auto-generated from title)</span>
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={formData.id}
            onChange={(e) => handleChange('id', e.target.value)}
            onFocus={() => setIsFocusedOnIdField(true)}
            onBlur={() => {
              setIsFocusedOnIdField(false);
              const expectedSlug = slugifyTitle(formData.title);
              if (formData.id === expectedSlug) {
                setIdManuallyEdited(false);
              }
            }}
            required
            className={`flex-1 px-4 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
              idManuallyEdited
                ? 'border-yellow-400 dark:border-yellow-600'
                : 'border-gray-300 dark:border-gray-600'
            }`}
            placeholder="my-article-slug"
          />
          <button
            type="button"
            onClick={regenerateSlug}
            className="px-4 py-2 bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium transition-colors"
            title="Regenerate slug from title"
          >
            ↻
          </button>
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          Automatically generated from title. You can edit it manually or regenerate it.
        </p>
      </div>

      {/* Title */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Title
        </label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => handleChange('title', e.target.value)}
          required
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          placeholder="Article Title"
        />
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Description
        </label>
        <textarea
          value={formData.description}
          onChange={(e) => handleChange('description', e.target.value)}
          rows={3}
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          placeholder="Brief description of the article/note"
        />
      </div>

      {/* Date */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Date
        </label>
        <input
          type="date"
          value={formData.date}
          onChange={(e) => handleChange('date', e.target.value)}
          required
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
        />
      </div>

      {/* Category */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Category <span className="text-xs text-gray-500 dark:text-gray-400">(auto-fills tags and image)</span>
        </label>
        <select
          value={formData.category}
          onChange={(e) => handleChange('category', e.target.value)}
          required
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
        >
          <option value="">-- Select Category --</option>
          {getAllCategories().map(category => (
            <option key={category.name} value={category.name}>
              {category.name.split(' ').map(word => 
                word.charAt(0).toUpperCase() + word.slice(1)
              ).join(' ')}
            </option>
          ))}
        </select>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          Selecting a category will automatically fill in tags and image information.
        </p>
      </div>

      {/* Tags */}
      {formData.category && (
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Tags (auto-filled from category)
          </label>
          <div className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700/50 text-gray-900 dark:text-gray-300">
            {formData.tags || 'No tags'}
          </div>
        </div>
      )}

      {/* Image Path */}
      {formData.category && (
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Image Path (auto-filled from category)
          </label>
          <div className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700/50 text-gray-900 dark:text-gray-300">
            {formData.imagePath || 'No image path'}
          </div>
        </div>
      )}

      {/* Image Alt */}
      {formData.category && (
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Image Alt Text (auto-filled from category)
          </label>
          <div className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700/50 text-gray-900 dark:text-gray-300">
            {formData.imageAlt || 'No alt text'}
          </div>
        </div>
      )}
    </form>
  );
}

