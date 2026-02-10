import { marked } from 'marked';
import { slugifyTitle } from './utils';

// Configure marked to support GFM (GitHub Flavored Markdown) including tables
if (typeof marked !== 'undefined') {
  marked.setOptions({
    gfm: true,
    breaks: false
  });
}

export interface ContentSection {
  id?: string;
  level?: number;
  title?: string;
  htmlContent: string;
}

/**
 * Parse markdown to sections
 * Sections are defined by ## or ###
 * Sections are split automatically
 * Sections are processed for carousels
 * Sections are processed for code blocks
 * Sections are processed for images
 * Sections are processed for videos
 * Sections are processed for iframes
 * @param markdown - The markdown to parse
 * @returns The parsed sections
 */
export function parseMarkdownToSections(markdown: string): ContentSection[] {
  if (!markdown || markdown.trim() === '') {
    return [{ htmlContent: '' }];
  }

  const lines = markdown.split('\n');
  const sections: ContentSection[] = [];
  let currentSection: ContentSection | null = null;
  let currentLines: string[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    
    // Check if line is a heading (## or ###)
    const headingMatch = line.match(/^(#{2,4})\s+(.+)$/);
    if (headingMatch) {
      // Save previous section if it exists
      if (currentSection !== null) {
        if (currentLines.length > 0) {
          const htmlContent = processCarousels(currentLines.join('\n'));
          currentSection.htmlContent = typeof htmlContent === 'string' ? htmlContent : String(htmlContent);
          currentSection.htmlContent = currentSection.htmlContent.replace(/\[([^\]]+)\]\(#([^)]+)\)/g,'<a href="#$2">$1</a>');
          // console.log(currentSection.htmlContent);
          // console.log('--------------------------------');
        }
        sections.push(currentSection);
      }
      
      const level = headingMatch[1].length;
      // console.log(`Level: ${level}`);
      // Start new section
      const title = headingMatch[2].trim();
      // console.log(`Title: ${title}`);
      // console.log(`Title length: ${title.length}`);
      currentSection = { id: slugifyTitle(title), title, level, htmlContent: '' };
      currentLines = [];
    } else {
      currentLines.push(line);
    }
  }

  // Add last section
  if (currentSection !== null) {
    if (currentLines.length > 0) {
      const htmlContent = processCarousels(currentLines.join('\n'));
      currentSection.htmlContent = typeof htmlContent === 'string' ? htmlContent : String(htmlContent);
      currentSection.htmlContent = currentSection.htmlContent.replace(/\[([^\]]+)\]\(#([^)]+)\)/g,'<a href="#$2">$1</a>');
    }
    sections.push(currentSection);
  } else {
    // No sections with titles, create one section with all content
    if (currentLines.length > 0) {
      const htmlContent = processCarousels(currentLines.join('\n')).replace(/\[([^\]]+)\]\(#([^)]+)\)/g,'<a href="#$2">$1</a>');
      sections.push({ htmlContent: typeof htmlContent === 'string' ? htmlContent : String(htmlContent) });
    } else {
      sections.push({ htmlContent: '' });
    }
  }

  return sections;
}

/**
 * Process carousel blocks in markdown - convert to HTML before parsing
 * Carousel blocks are defined by :::carousel ... ::::
 * Images are defined by ![alt](src)
 * Captions are defined by *caption* or _caption_
 * Images and captions are grouped together
 * Images and captions are displayed in the order they appear in the markdown
 * Images and captions are displayed in a carousel
 * 
 * Example:
 * :::carousel
 * ![alt](src)
 * *caption*
 * :::
 * 
 * Will be converted to:
 * <div class="article-carousel" data-total="1"><div class="article-carousel-container"><div class="article-carousel-item" data-index="0"><img src="src" alt="alt" class="article-image"><div class="article-image-caption">caption</div></div></div><div class="article-carousel-controls"><button class="article-carousel-prev" aria-label="Previous image">‹</button><span class="article-carousel-counter"><span class="article-carousel-current">1</span> / <span class="article-carousel-total">1</span></span><button class="article-carousel-next" aria-label="Next image">›</button></div></div>
 * 
 * The carousel will be displayed in the order the images and captions appear in the markdown
 * The carousel will be displayed in a carousel
 * @param markdown - The markdown to process
 * @returns The processed markdown
 */
function processCarousels(markdown: string): string {
  // Match carousel blocks: :::carousel ... ::::
  const carouselRegex = /:::carousel\n([\s\S]*?)\n:::/g;
  
  // Replace carousel blocks with HTML (marked will pass HTML through)
  const processedMarkdown = markdown.replace(carouselRegex, (match, content) => {
    const carouselContent = content.trim();
    const lines = carouselContent.split('\n');
    
    // Parse images and captions from carousel content
    const images: Array<{ src: string; alt: string; caption?: string }> = [];
    let currentImage: { src: string; alt: string; caption?: string } | null = null;
    
    for (const line of lines) {
      // Check for image markdown: ![alt](src)
      const imageMatch = line.match(/!\[([^\]]*)\]\(([^)]+)\)/);
      if (imageMatch) {
        // Save previous image if exists
        if (currentImage) {
          images.push(currentImage);
        }
        currentImage = {
          alt: imageMatch[1] || '',
          src: imageMatch[2] || ''
        };
      } else if (currentImage) {
        // Check for caption (italic text on next line)
        const captionMatch = line.match(/^\*([^*]+)\*$|^_([^_]+)_$/);
        if (captionMatch) {
          currentImage.caption = captionMatch[1] || captionMatch[2] || '';
        } else if (line.trim() && !line.match(/^\s*$/)) {
          // If there's text but not a caption marker, still use it as caption
          currentImage.caption = line.trim();
        }
      }
    }
    
    // Add last image
    if (currentImage) {
      images.push(currentImage);
    }
    
    // Generate carousel HTML structure (marked.parse will pass HTML through)
    if (images.length > 0) {
      const carouselItems = images.map((img, index) => {
        const caption = img.caption ? `<div class="article-image-caption">${img.caption}</div>` : '';
        return `<div class="article-carousel-item" data-index="${index}"><img src="${img.src}" alt="${img.alt}" class="article-image">${caption}</div>`;
      }).join('');
      
      return `<div class="article-carousel" data-total="${images.length}"><div class="article-carousel-container">${carouselItems}</div><div class="article-carousel-controls"><button class="article-carousel-prev" aria-label="Previous image">‹</button><span class="article-carousel-counter"><span class="article-carousel-current">1</span> / <span class="article-carousel-total">${images.length}</span></span><button class="article-carousel-next" aria-label="Next image">›</button></div></div>`;
    }
    
    return match; // Return original if no images found
  });
  
  // Parse the markdown (carousel HTML will pass through)
  const parsedHTML = marked.parse(processedMarkdown);
  return typeof parsedHTML === 'string' ? parsedHTML : String(parsedHTML);
}

/**
 * Style HTML content
 * Paragraphs are styled with a space-y-2 mb-4 class
 * Headings are styled with a text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-5 mt-7 class for h2 and a text-2xl font-bold text-gray-900 dark:text-white mb-4 mt-6 class for other headings
 * Lists are styled with a mb-2 space-y-1 list-disc list-outside ml-6 class for ul and a mb-4 space-y-2 list-decimal list-outside ml-6 class for ol
 * Code blocks are styled with a p-4 rounded-lg overflow-x-auto class
 * Inline code is styled with a bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 px-2 py-1 rounded text-sm font-mono class
 * Blockquotes are styled with a border-l-4 border-blue-500 bg-blue-50 dark:bg-blue-900/20 pl-6 py-4 my-6 italic text-gray-700 dark:text-gray-300 class
 * Links are styled with a text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 underline hover:no-underline transition-colors duration-200 class
 * Strong and em are styled with a font-bold text-gray-900 dark:text-white class for strong and a italic text-gray-800 dark:text-gray-100 class for em
 * Tables are styled with a overflow-x-auto my-6 class
 * Horizontal rules are styled with a border-gray-300 dark:border-gray-600 my-8 class
 * Images are styled with a article-image class
 * Videos are styled with a article-video class
 * Iframes are styled with a article-iframe class
 * 
 * Example:
 * <p>This is a paragraph with a <strong>bold</strong> and <em>italic</em> text.</p>
 * 
 * Will be converted to:
 * <div class="space-y-2 mb-4"><p class="text-gray-700 dark:text-gray-300 leading-relaxed mb-2">This is a paragraph with a <strong class="font-bold text-gray-900 dark:text-white">bold</strong> and <em class="italic text-gray-800 dark:text-gray-100">italic</em> text.</p></div>
 * 
 * The paragraph will be styled with a space-y-2 mb-4 class
 * The bold text will be styled with a font-bold text-gray-900 dark:text-white class
 * The italic text will be styled with a italic text-gray-800 dark:text-gray-100 class
 * The paragraph will be displayed in a div with a space-y-2 mb-4 class
 * The bold text will be displayed in a strong element with a font-bold text-gray-900 dark:text-white class
 * The italic text will be displayed in a em element with a italic text-gray-800 dark:text-gray-100 class
 * The paragraph will be displayed in a div with a space-y-2 mb-4 class
 * The bold text will be displayed in a strong element with a font-bold text-gray-900 dark:text-white class
 * The italic text will be displayed in a em element with a italic text-gray-800 dark:text-gray-100 class
 * @param html - The HTML to style
 * @returns The styled HTML
 */
export function styleHTMLContent(html: string): string {
  // This function should only be called on the client side
  if (typeof document === 'undefined') {
    return html; // Return unprocessed HTML on server
  }
  
  // Create a temporary div to parse HTML
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = html;

  // Style paragraphs and split paragraphs with multiple strong elements into separate paragraphs
  const paragraphsToProcess = Array.from(tempDiv.querySelectorAll('p'));
  paragraphsToProcess.forEach(p => {
    // Check if paragraph has multiple strong elements
    const strongElements = p.querySelectorAll('strong');
    if (strongElements.length > 1) {
      // Split into separate paragraphs - each strong element and its content becomes a paragraph
      const childNodes = Array.from(p.childNodes);
      const fragments: Node[][] = [];
      let currentFragment: Node[] = [];
      
      childNodes.forEach((node, index) => {
        // If we encounter a strong element and we already have content in current fragment
        if (node.nodeType === Node.ELEMENT_NODE && (node as Element).tagName === 'STRONG' && currentFragment.length > 0) {
          // Save current fragment and start a new one
          fragments.push([...currentFragment]);
          currentFragment = [node];
        } else {
          currentFragment.push(node);
        }
      });
      
      // Add the last fragment
      if (currentFragment.length > 0) {
        fragments.push([...currentFragment]);
      }
      
      // If we successfully split into multiple fragments, create separate paragraphs
      if (fragments.length > 1) {
        const wrapper = document.createElement('div');
        wrapper.className = 'space-y-2 mb-4';
        
        fragments.forEach(fragment => {
          const newP = document.createElement('p');
          newP.className = 'text-gray-700 dark:text-gray-300 leading-relaxed mb-2';
          fragment.forEach(node => newP.appendChild(node.cloneNode(true)));
          if (newP.textContent?.trim()) {
            wrapper.appendChild(newP);
          }
        });
        
        // Replace the original paragraph with the wrapper if we created multiple paragraphs
        if (wrapper.children.length > 1) {
          p.parentNode?.replaceChild(wrapper, p);
          return; // Skip normal paragraph styling
        }
      }
    }
    
    // Normal paragraph styling
    (p as HTMLElement).style.display = 'block';
    p.className = 'text-gray-700 dark:text-gray-300 leading-relaxed mb-4';
  });

  const usedIds = new Set();
  // Style headings
  tempDiv.querySelectorAll('h1, h2, h3, h4, h5, h6').forEach(h => {
    const title = h.textContent.trim();
    let id = slugifyTitle(title);
    if (usedIds.has(id)) {
      // Generate a unique ID
      id = `${id}-${usedIds.size + 1}`;
    }
    usedIds.add(id);
    if (h.tagName === 'H2') {
      h.className = 'text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-5 mt-7';
      h.id = id;
    } else {
      h.className = 'text-2xl font-bold text-gray-900 dark:text-white mb-4 mt-6';
      h.id = id;
    }
  });

  // Style lists - handle nested lists properly
  tempDiv.querySelectorAll('ul, ol').forEach(list => {
    // Check if this list is nested (inside another list item)
    const isNested = list.parentElement?.tagName === 'LI';
    
    // Use list-outside for proper nested list support
    const listType = list.tagName === 'UL' ? 'list-disc' : 'list-decimal';
    if (isNested) {
      list.className = `mb-2 space-y-1 ${listType} list-outside ml-6`;
    } else {
      list.className = `mb-4 space-y-2 ${listType} list-outside ml-6`;
    }
    
    list.querySelectorAll('li').forEach(li => {
      li.className = 'mb-2 text-gray-700 dark:text-gray-300 transition-colors duration-200';
      // Style nested paragraphs in list items
      li.querySelectorAll('p').forEach(p => {
        p.className = 'text-gray-700 dark:text-gray-300 leading-relaxed mb-2';
        (p as HTMLElement).style.display = 'block';
      });
      // Ensure list items with bold text display properly
      li.querySelectorAll('strong').forEach(strong => {
        strong.className = 'font-bold text-gray-900 dark:text-white';
      });
    });
  });

  // Style code blocks - copy button and syntax highlighting will be added by JavaScript in generated HTML
  // Keep language classes for Prism.js
  tempDiv.querySelectorAll('pre').forEach(pre => {
    // Don't set background here - Prism.js theme will handle it
    // Ensure whitespace is preserved for code blocks
    (pre as HTMLElement).style.whiteSpace = 'pre';
    pre.className = 'p-4 rounded-lg overflow-x-auto';
    pre.querySelectorAll('code').forEach(code => {
      const language = code.className.match(/language-(\w+)/)?.[1] || 'text';
      // Keep language class for Prism.js, remove other classes
      // Ensure code elements preserve whitespace
      (code as HTMLElement).style.whiteSpace = 'pre';
      code.className = `language-${language}`;
    });
  });

  // Style inline code
  tempDiv.querySelectorAll('code:not(pre code)').forEach(code => {
    code.className = 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 px-2 py-1 rounded text-sm font-mono';
  });

  // Style blockquotes
  tempDiv.querySelectorAll('blockquote').forEach(blockquote => {
    blockquote.className = 'border-l-4 border-blue-500 bg-blue-50 dark:bg-blue-900/20 pl-6 py-4 my-6 italic text-gray-700 dark:text-gray-300';
  });

  // Style links
  tempDiv.querySelectorAll('a').forEach(a => {
    a.className = 'text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 underline hover:no-underline transition-colors duration-200';
  });

  // Style strong and em
  tempDiv.querySelectorAll('strong').forEach(strong => {
    strong.className = 'font-bold text-gray-900 dark:text-white';
  });

  tempDiv.querySelectorAll('em').forEach(em => {
    em.className = 'italic text-gray-800 dark:text-gray-100';
  });

  // Style tables - wrap in responsive container and style all elements
  tempDiv.querySelectorAll('table').forEach(table => {
    // Wrap table in responsive container
    const wrapper = document.createElement('div');
    wrapper.className = 'overflow-x-auto my-6';
    table.parentNode?.insertBefore(wrapper, table);
    wrapper.appendChild(table);
    
    // Style the table
    table.className = 'min-w-full divide-y divide-gray-200 dark:divide-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden shadow-sm';
    
    // Style table header
    table.querySelectorAll('thead').forEach(thead => {
      thead.className = 'bg-gray-50 dark:bg-gray-800';
    });
    
    // Style table header cells
    table.querySelectorAll('th').forEach(th => {
      // Check for alignment attributes or styles
      let alignClass = 'text-left';
      const align = th.getAttribute('align') || (th as HTMLElement).style.textAlign;
      if (align === 'center' || align === 'middle') {
        alignClass = 'text-center';
      } else if (align === 'right') {
        alignClass = 'text-right';
      }
      
      th.className = `px-6 py-3 ${alignClass} text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider border-b border-gray-200 dark:border-gray-700`;
      th.removeAttribute('align'); // Remove align attribute as we're using classes
    });
    
    // Style table body
    table.querySelectorAll('tbody').forEach(tbody => {
      tbody.className = 'bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700';
    });
    
    // Style table rows with alternating colors
    table.querySelectorAll('tbody tr').forEach((tr, index) => {
      // Alternate row colors for better readability
      if (index % 2 === 0) {
        tr.className = 'bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors';
      } else {
        tr.className = 'bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors';
      }
    });
    
    // Style table data cells
    table.querySelectorAll('td').forEach(td => {
      // Check for alignment
      let alignClass = 'text-left';
      const align = td.getAttribute('align') || (td as HTMLElement).style.textAlign;
      if (align === 'center' || align === 'middle') {
        alignClass = 'text-center';
      } else if (align === 'right') {
        alignClass = 'text-right';
      }
      
      td.className = `px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300 ${alignClass} border-b border-gray-200 dark:border-gray-700`;
      td.removeAttribute('align'); // Remove align attribute as we're using classes
    });
  });

  // Style horizontal rules
  tempDiv.querySelectorAll('hr').forEach(hr => {
    hr.className = 'border-gray-300 dark:border-gray-600 my-8';
  });

  // Style images - add article-image class (wrapping and captions handled by ContentRenderer)
  tempDiv.querySelectorAll('img').forEach(img => {
    img.classList.add('article-image');
  });

  // Style videos - add article-video class
  tempDiv.querySelectorAll('video').forEach(video => {
    video.classList.add('article-video');
  });

  // Style iframes (including YouTube embeds) - classes handled by ContentRenderer
  tempDiv.querySelectorAll('iframe').forEach(iframe => {
    // YouTube embeds will be handled by ContentRenderer
    // Just ensure they're not wrapped yet
    if (!iframe.closest('.article-youtube-embed') && !iframe.closest('.article-video-wrapper')) {
      // ContentRenderer will handle wrapping
    }
  });

  return tempDiv.innerHTML;
}

