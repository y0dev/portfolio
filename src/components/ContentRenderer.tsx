"use client";

import { useEffect, useRef, useState } from 'react';

interface ContentSection {
  title?: string;
  htmlContent: string;
}

interface ContentRendererProps {
  content: ContentSection[];
}

// Function to process HTML content (images, videos, lists, code blocks)
function processHTMLContent(html: string): string {
  if (typeof document === 'undefined') {
    return html; // Server-side, return as-is
  }

  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = html;

  // Process images and captions
  const images = Array.from(tempDiv.querySelectorAll('img')).reverse();
  images.forEach((img) => {
    if (img.closest('.article-image-wrapper')) {
      return;
    }

    img.classList.add('article-image');

    const imgParent = img.parentElement;
    if (!imgParent) return;

    // Find next sibling - walk through all children of tempDiv
    let nextSibling: HTMLElement | null = null;
    if (imgParent.parentNode === tempDiv) {
      // Image parent is a direct child of tempDiv, find next sibling
      const allChildren = Array.from(tempDiv.children);
      const currentIndex = allChildren.indexOf(imgParent);
      if (currentIndex >= 0 && currentIndex < allChildren.length - 1) {
        nextSibling = allChildren[currentIndex + 1] as HTMLElement;
      }
    } else {
      // Image parent is nested, check its next sibling
      nextSibling = imgParent.nextElementSibling as HTMLElement | null;
    }

    let captionText: string | null = null;
    if (nextSibling?.tagName === 'P') {
      const italicElement = nextSibling.querySelector('em');
      if (italicElement) {
        captionText = italicElement.textContent || nextSibling.textContent || null;
      }
    }

    const wrapper = document.createElement('div');
    wrapper.className = 'article-image-wrapper';

    if (imgParent.tagName === 'P') {
      imgParent.removeChild(img);
      wrapper.appendChild(img);
      
      if (captionText && nextSibling) {
        const captionDiv = document.createElement('div');
        captionDiv.className = 'article-image-caption';
        captionDiv.textContent = captionText;
        wrapper.appendChild(captionDiv);
      }
      
      if (imgParent.parentNode) {
        imgParent.parentNode.replaceChild(wrapper, imgParent);
      }

      if (captionText && nextSibling && nextSibling.parentNode) {
        nextSibling.parentNode.removeChild(nextSibling);
      }
    } else {
      imgParent.removeChild(img);
      wrapper.appendChild(img);
      
      if (captionText && nextSibling) {
        const captionDiv = document.createElement('div');
        captionDiv.className = 'article-image-caption';
        captionDiv.textContent = captionText;
        wrapper.appendChild(captionDiv);
      }
      
      if (imgParent.parentNode) {
        imgParent.parentNode.insertBefore(wrapper, imgParent.nextSibling);
      } else {
        imgParent.appendChild(wrapper);
      }
      
      if (captionText && nextSibling && nextSibling.parentNode) {
        nextSibling.parentNode.removeChild(nextSibling);
      }
    }
  });

  // Process videos
  const videos = tempDiv.querySelectorAll('video');
  videos.forEach((video) => {
    if (video.closest('.article-video-wrapper')) {
      return;
    }
    
    video.classList.add('article-video');
    const wrapper = document.createElement('div');
    wrapper.className = 'article-video-wrapper';
    video.parentNode?.replaceChild(wrapper, video);
    wrapper.appendChild(video);
  });

  // Process YouTube embeds and iframes
  const iframes = tempDiv.querySelectorAll('iframe');
  iframes.forEach((iframe) => {
    const src = iframe.getAttribute('src') || '';
    const isYouTube = src.includes('youtube.com/embed/') || src.includes('youtu.be/') || src.includes('youtube-nocookie.com/embed/');

    if (isYouTube && !iframe.closest('.article-youtube-embed')) {
      const wrapper = document.createElement('div');
      wrapper.className = 'article-youtube-embed';
      iframe.parentNode?.replaceChild(wrapper, iframe);
      wrapper.appendChild(iframe);
    } else if (!iframe.closest('.article-video-wrapper') && !iframe.closest('.article-youtube-embed')) {
      const wrapper = document.createElement('div');
      wrapper.className = 'article-video-wrapper';
      iframe.parentNode?.replaceChild(wrapper, iframe);
      wrapper.appendChild(iframe);
    }
  });

  // Process lists to ensure they're visible
  const lists = tempDiv.querySelectorAll('ol, ul');
  lists.forEach((list) => {
    if (list instanceof HTMLOListElement || list instanceof HTMLUListElement) {
      list.style.display = 'block';
      list.style.marginTop = '1rem';
      list.style.marginBottom = '1rem';
      list.style.paddingLeft = '1.5rem';
      
      const items = list.querySelectorAll('li');
      items.forEach((item) => {
        item.style.display = 'list-item';
        item.style.marginBottom = '0.5rem';
        item.style.color = '';
      });
    }
  });

  // Process links to make them visible and distinguishable
  const links = tempDiv.querySelectorAll('a');
  links.forEach((link) => {
    link.classList.add('article-link');
    // Add external link indicator if link is external
    const href = link.getAttribute('href') || '';
    if (href.startsWith('http://') || href.startsWith('https://')) {
      // Check if it's an external link (doesn't start with known internal domains)
      const isExternal = !href.startsWith('https://www.devontaereid.com') && 
                         !href.startsWith('http://www.devontaereid.com') &&
                         !href.startsWith('https://devontaereid.com') &&
                         !href.startsWith('http://devontaereid.com') &&
                         !href.startsWith('/'); // Internal relative links
      if (isExternal) {
        link.setAttribute('target', '_blank');
        link.setAttribute('rel', 'noopener noreferrer');
        link.setAttribute('aria-label', `${link.textContent || 'External link'} (opens in new tab)`);
      }
    } else if (href.startsWith('/') || href.startsWith('#')) {
      // Internal link - don't add target="_blank"
      link.setAttribute('rel', '');
    }
  });

  return tempDiv.innerHTML;
}

export default function ContentRenderer({ content }: ContentRendererProps) {
  const [processedContent, setProcessedContent] = useState<ContentSection[]>(content);
  const [isClient, setIsClient] = useState(false);
  const containerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    setIsClient(true);
    // Process HTML on client side
    const processed = content.map(section => ({
      ...section,
      htmlContent: processHTMLContent(section.htmlContent)
    }));
    setProcessedContent(processed);
  }, [content]);

  useEffect(() => {
    if (!containerRef.current || !isClient) return;

    // Process tables to add card versions for mobile
    const tables = containerRef.current.querySelectorAll('table.custom-table, table');
    tables.forEach((table) => {
      if (table.closest('.table-responsive-wrapper')) {
        return; // Already processed
      }

      const thead = table.querySelector('thead');
      const tbody = table.querySelector('tbody');
      if (!thead || !tbody) return;

      // Get header cells
      const headerCells = Array.from(thead.querySelectorAll('th')).map(th => th.textContent?.trim() || '');
      
      // Create card container
      const cardContainer = document.createElement('div');
      cardContainer.className = 'table-card-container';
      
      // Create cards for each row
      const rows = Array.from(tbody.querySelectorAll('tr'));
      rows.forEach((row) => {
        const cells = Array.from(row.querySelectorAll('td'));
        const card = document.createElement('div');
        card.className = 'table-card';
        
        cells.forEach((cell, index) => {
          if (headerCells[index]) {
            const cardItem = document.createElement('div');
            cardItem.className = 'table-card-item';
            
            const label = document.createElement('div');
            label.className = 'table-card-label';
            label.textContent = headerCells[index];
            
            const value = document.createElement('div');
            value.className = 'table-card-value';
            value.innerHTML = cell.innerHTML;
            
            cardItem.appendChild(label);
            cardItem.appendChild(value);
            card.appendChild(cardItem);
          }
        });
        
        cardContainer.appendChild(card);
      });

      // Wrap table and cards in a container
      const wrapper = document.createElement('div');
      wrapper.className = 'table-responsive-wrapper';
      table.parentNode?.insertBefore(wrapper, table);
      wrapper.appendChild(table);
      wrapper.appendChild(cardContainer);
    });

    // Find all pre > code elements and replace them with our custom component
    const preElements = containerRef.current.querySelectorAll('pre > code');
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
            <div class="language-badge bg-gray-800 dark:bg-gray-700 text-gray-300 text-xs px-3 py-1 rounded-bl-lg font-mono">
              ${language}
            </div>
          </div>
          
          <button class="copy-btn absolute top-2 right-12 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-gray-700 dark:bg-gray-600 hover:bg-gray-600 dark:hover:bg-gray-500 text-white p-2 rounded-md text-sm font-medium" title="Copy code">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
            </svg>
          </button>

          <div class="bg-gray-100 dark:bg-gray-900 rounded-lg overflow-hidden shadow-lg border border-gray-200 dark:border-gray-700">
            <pre class="p-4 overflow-x-auto"><code class="language-${language} text-gray-100 dark:text-gray-100 text-sm leading-relaxed">${codeContent}</code></pre>
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
  }, [processedContent, isClient]);

  // Use processed content on client, original on server to avoid hydration mismatch
  const contentToRender = isClient ? processedContent : content;

  return (
    <article ref={containerRef} className="prose prose-lg dark:prose-invert max-w-none">
      {contentToRender.map((section, sectionIndex) => (
        <section key={sectionIndex} className="mb-12">
          {section.title && (
            <h2 className="text-2xl font-bold mb-6">{section.title}</h2>
          )}
          <div 
            dangerouslySetInnerHTML={{ __html: section.htmlContent }}
            suppressHydrationWarning
          >
          </div>
        </section>
      ))}
    </article>
  );
} 