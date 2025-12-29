"use client";

import { useEffect, useRef } from 'react';

interface ContentSection {
  title?: string;
  htmlContent: string;
}

interface ContentRendererProps {
  content: ContentSection[];
}

export default function ContentRenderer({ content }: ContentRendererProps) {
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!contentRef.current) return;

    // Find all pre > code elements and replace them with our custom component
    const preElements = contentRef.current.querySelectorAll('pre > code');
    preElements.forEach((codeElement) => {
      const preElement = codeElement.parentElement;
      if (!preElement) return;

      // Get the code content and language
      const codeContent = codeElement.textContent || '';
      const language = codeElement.className.replace('language-', '') || 'text';
      
      // Create a wrapper div for our custom component
      const wrapper = document.createElement('div');
      wrapper.className = 'code-block-wrapper';
      
      // Create the custom code block structure
      wrapper.innerHTML = `
        <div class="relative group my-6">
          <div class="absolute top-0 right-0 z-10">
            <div class="bg-gray-800 dark:bg-gray-700 text-gray-300 text-xs px-3 py-1 rounded-bl-lg font-mono">
              ${language}
            </div>
          </div>
          
          <button class="copy-btn absolute top-2 right-12 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-gray-700 dark:bg-gray-600 hover:bg-gray-600 dark:hover:bg-gray-500 text-white p-2 rounded-md text-sm font-medium" title="Copy code">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
            </svg>
          </button>

          <div class="bg-gray-900 dark:bg-gray-800 rounded-lg overflow-hidden shadow-lg border border-gray-700 dark:border-gray-600">
            <pre class="p-4 overflow-x-auto"><code class="language-${language} text-gray-100 text-sm leading-relaxed">${codeContent}</code></pre>
          </div>
        </div>
      `;

      // Add click handler for copy functionality
      const copyBtn = wrapper.querySelector('.copy-btn');
      if (copyBtn) {
        copyBtn.addEventListener('click', async () => {
          try {
            await navigator.clipboard.writeText(codeContent);
            
            // Show success state
            const originalHTML = copyBtn.innerHTML;
            copyBtn.innerHTML = `
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
              </svg>
            `;
            copyBtn.classList.add('bg-green-600');
            
            setTimeout(() => {
              copyBtn.innerHTML = originalHTML;
              copyBtn.classList.remove('bg-green-600');
            }, 2000);
          } catch (err) {
            console.error('Failed to copy code:', err);
          }
        });
      }

      // Replace the original pre element with our custom wrapper
      preElement.parentNode?.replaceChild(wrapper, preElement);
    });
  }, [content]);

  return (
    <article className="prose prose-lg dark:prose-invert max-w-none">
      {content.map((section, sectionIndex) => (
        <section key={sectionIndex} className="mb-12">
          {section.title && (
            <h2 className="text-2xl font-bold mb-6">{section.title}</h2>
          )}
          <div 
            ref={contentRef}
            dangerouslySetInnerHTML={{ __html: section.htmlContent }}
          />
        </section>
      ))}
    </article>
  );
} 