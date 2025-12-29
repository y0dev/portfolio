import { ContentSection } from './markdown';
import { formatDateFull, slugifyTitle } from './utils';

function generateCodeCopyScript(): string {
  return `
    <script>
      // Code block copy functionality and syntax highlighting
      (function() {
        document.addEventListener('DOMContentLoaded', function() {
          document.querySelectorAll('pre').forEach((pre, index) => {
            // Check if already has copy button
            if (pre.parentElement && pre.parentElement.querySelector('.code-copy-btn')) {
              return;
            }
            
            // Get language from code element
            const codeElement = pre.querySelector('code');
            const language = codeElement ? (codeElement.className.match(/language-(\w+)/)?.[1] || 'text') : 'text';
            
            // Wrap pre in container
            const wrapper = document.createElement('div');
            wrapper.className = 'relative group my-4';
            pre.parentNode?.insertBefore(wrapper, pre);
            wrapper.appendChild(pre);
            
            // Update pre and code styling for syntax highlighting
            pre.className = 'bg-gray-900 dark:bg-gray-800 p-4 rounded-lg overflow-x-auto';
            if (codeElement) {
              // Set language class - Prism autoloader will handle highlighting
              codeElement.className = \`language-\${language}\`;
              
              // If Prism is already loaded, highlight immediately
              if (typeof Prism !== 'undefined' && Prism.highlightElement) {
                try {
                  Prism.highlightElement(codeElement);
                } catch (e) {
                  // If highlighting fails, continue without it
                  console.warn('Prism highlighting failed:', e);
                }
              }
            }
            
            // Create copy button
            const copyButton = document.createElement('button');
            copyButton.className = 'code-copy-btn absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-700 dark:bg-gray-600 hover:bg-gray-600 dark:hover:bg-gray-500 text-white px-3 py-1.5 rounded text-xs font-medium flex items-center gap-2 z-10';
            copyButton.innerHTML = \`
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
              </svg>
              <span class="copy-text">Copy</span>
            \`;
            
            // Add copy functionality
            copyButton.addEventListener('click', function() {
              const textToCopy = codeElement ? codeElement.textContent || pre.textContent || '' : pre.textContent || '';
              
              navigator.clipboard.writeText(textToCopy).then(() => {
                const span = copyButton.querySelector('.copy-text');
                if (span) {
                  const originalText = span.textContent;
                  span.textContent = 'Copied!';
                  setTimeout(() => {
                    if (span) span.textContent = originalText || 'Copy';
                  }, 2000);
                }
              }).catch(err => {
                console.error('Failed to copy text: ', err);
              });
            });
            
            wrapper.appendChild(copyButton);
          });
          
          // Trigger Prism highlighting for all code blocks
          if (typeof Prism !== 'undefined' && Prism.highlightAll) {
            Prism.highlightAll();
          }
        });
      })();
    </script>
  `;
}

function generateTableResponsiveScript(): string {
  return `
    <script>
      // Convert tables to cards on mobile
      (function() {
        function convertTablesToCards() {
          const tables = document.querySelectorAll('table');
          const isMobile = window.innerWidth < 768; // md breakpoint
          
          tables.forEach(table => {
            // Find the wrapper (could be overflow-x-auto or table-responsive-wrapper)
            let wrapper = table.parentElement;
            let cardsContainer = null;
            
            // Check if we've already processed this table
            if (wrapper && wrapper.classList.contains('table-responsive-wrapper')) {
              cardsContainer = wrapper.querySelector('.table-cards-container');
            } else {
              // Create new wrapper
              wrapper = document.createElement('div');
              wrapper.className = 'table-responsive-wrapper overflow-x-auto my-6';
              table.parentNode?.insertBefore(wrapper, table);
              wrapper.appendChild(table);
            }
            
            if (isMobile) {
              // Check if cards already exist
              if (!cardsContainer) {
                // Convert to cards
                const headers = Array.from(table.querySelectorAll('thead th')).map(th => th.textContent?.trim() || '');
                const rows = Array.from(table.querySelectorAll('tbody tr'));
                
                // Create cards container
                cardsContainer = document.createElement('div');
                cardsContainer.className = 'table-cards-container space-y-4 md:hidden';
                
                rows.forEach(row => {
                  const cells = Array.from(row.querySelectorAll('td'));
                  const card = document.createElement('div');
                  card.className = 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 shadow-sm';
                  
                  let cardContent = '';
                  cells.forEach((cell, index) => {
                    if (headers[index]) {
                      const value = cell.textContent?.trim() || '';
                      cardContent += \`
                        <div class="mb-3 last:mb-0">
                          <div class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">\${headers[index]}</div>
                          <div class="text-sm text-gray-900 dark:text-gray-100">\${value}</div>
                        </div>
                      \`;
                    }
                  });
                  
                  card.innerHTML = cardContent;
                  cardsContainer.appendChild(card);
                });
                
                wrapper.appendChild(cardsContainer);
              }
              
              // Hide table and show cards on mobile
              table.style.display = 'none';
              if (cardsContainer) cardsContainer.style.display = 'block';
            } else {
              // Show table on desktop
              table.style.display = 'table';
              if (cardsContainer) cardsContainer.style.display = 'none';
            }
          });
        }
        
        // Run on load and resize
        if (document.readyState === 'loading') {
          document.addEventListener('DOMContentLoaded', convertTablesToCards);
        } else {
          convertTablesToCards();
        }
        window.addEventListener('resize', convertTablesToCards);
      })();
    </script>
  `;
}

function generatePostHeroCSS(): string {
  return `
    <style>
      /* Hero Section */
      .post-hero {
        display: grid;
        grid-template-columns: 1fr auto;
        gap: 3rem;
        align-items: start;
        margin-bottom: 3rem;
        padding: 2rem 0;
      }

      .post-hero-content {
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
      }

      .post-meta-badge {
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.5rem 1rem;
        background: linear-gradient(135deg, #3b82f6, #8b5cf6);
        color: white;
        border-radius: 20px;
        font-size: 0.875rem;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        width: fit-content;
      }

      #post-header-title {
        font-size: clamp(2rem, 4vw, 3.5rem);
        font-weight: 700;
        line-height: 1.2;
        color: #1f2937;
        margin: 0;
      }

      html.dark-mode #post-header-title,
      .dark #post-header-title {
        color: #f9fafb;
      }

      .post-header-meta {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 1rem;
        flex-wrap: wrap;
      }

      .author-info {
        display: flex;
        align-items: center;
        gap: 1rem;
      }

      .post-header-icon {
        width: 48px;
        height: 48px;
        border-radius: 50%;
        object-fit: cover;
        border: 3px solid #3b82f6;
        box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
      }

      .author-details {
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
      }

      .author-name {
        font-weight: 600;
        color: #1f2937;
        font-size: 1rem;
      }

      html.dark-mode .author-name,
      .dark .author-name {
        color: #f9fafb;
      }

      .post-date {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        color: #6b7280;
        font-size: 0.875rem;
      }

      html.dark-mode .post-date,
      .dark .post-date {
        color: #d1d5db;
      }

      .post-header-shareButton {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.75rem 1.5rem;
        background: rgba(59, 130, 246, 0.1);
        color: #3b82f6;
        border: 1px solid rgba(59, 130, 246, 0.2);
        border-radius: 8px;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.2s ease;
        font-size: 0.875rem;
      }

      .post-header-shareButton:hover {
        background: #3b82f6;
        color: white;
        transform: translateY(-2px);
        box-shadow: 0 8px 20px rgba(59, 130, 246, 0.3);
      }

      .post-header-tags {
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem;
      }

      .post-header-tag {
        padding: 0.375rem 0.75rem;
        background: rgba(59, 130, 246, 0.1);
        color: #3b82f6;
        border: 1px solid rgba(59, 130, 246, 0.2);
        border-radius: 6px;
        font-size: 0.75rem;
        font-weight: 500;
        text-transform: capitalize;
        transition: all 0.2s ease;
      }

      .post-header-tag:hover {
        background: #3b82f6;
        color: white;
        transform: translateY(-1px);
      }

      /* Hero Visual */
      .post-hero-visual {
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .post-hero-image {
        width: 200px;
        height: 200px;
        border-radius: 16px;
        overflow: hidden;
        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
        background: white;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 2rem;
      }

      html.dark-mode .post-hero-image,
      .dark .post-hero-image {
        background: #374151;
        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
      }

      .post-header-image {
        width: 100%;
        height: 100%;
        object-fit: contain;
        border-radius: 8px;
      }
    </style>
  `;
}

function generateNavigationHTML(): string {
  return `
    <nav class="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <a href="/" class="flex items-center space-x-3 group">
            <img
              src="/logo192.png"
              alt="Devontae Reid Logo"
              width="32"
              height="32"
              class="rounded-full group-hover:scale-110 transition-transform duration-300"
            />
            <span class="text-xl font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
              DEVONTAE REID
            </span>
          </a>

          <div class="hidden md:flex items-center space-x-6">
            <a href="/" class="px-3 py-2 rounded-md text-sm font-medium transition-colors text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">Home</a>
            <a href="/projects" class="px-3 py-2 rounded-md text-sm font-medium transition-colors text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">Projects</a>
            <a href="/articles" class="px-3 py-2 rounded-md text-sm font-medium transition-colors text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20">Articles</a>
            <a href="/gospel" class="px-3 py-2 rounded-md text-sm font-medium transition-colors text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">Gospel</a>
            <a href="/bible-reading" class="px-3 py-2 rounded-md text-sm font-medium transition-colors text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">Bible Reading</a>
            <a href="/resources" class="px-3 py-2 rounded-md text-sm font-medium transition-colors text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">Resources</a>
            
            <button
              id="theme-toggle"
              aria-label="Toggle theme"
              class="ml-4 p-2 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-gray-700 dark:text-gray-300"
            >
              <svg id="theme-icon-sun" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 hidden dark:block" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <circle cx="12" cy="12" r="5" stroke="currentColor" stroke-width="2" />
                <path stroke="currentColor" stroke-width="2" stroke-linecap="round" d="M12 1v2m0 18v2m11-11h-2M3 12H1m16.95 7.07l-1.41-1.41M6.34 6.34L4.93 4.93m12.02 0l-1.41 1.41M6.34 17.66l-1.41 1.41" />
              </svg>
              <svg id="theme-icon-moon" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 block dark:hidden" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" d="M21 12.79A9 9 0 1111.21 3a7 7 0 109.79 9.79z" />
              </svg>
            </button>
          </div>

          <div class="md:hidden flex items-center">
            <button
              id="theme-toggle-mobile"
              aria-label="Toggle theme"
              class="p-2 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-gray-700 dark:text-gray-300"
            >
              <svg id="theme-icon-sun-mobile" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 hidden dark:block" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <circle cx="12" cy="12" r="5" stroke="currentColor" stroke-width="2" />
                <path stroke="currentColor" stroke-width="2" stroke-linecap="round" d="M12 1v2m0 18v2m11-11h-2M3 12H1m16.95 7.07l-1.41-1.41M6.34 6.34L4.93 4.93m12.02 0l-1.41 1.41M6.34 17.66l-1.41 1.41" />
              </svg>
              <svg id="theme-icon-moon-mobile" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 block dark:hidden" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" d="M21 12.79A9 9 0 1111.21 3a7 7 0 109.79 9.79z" />
              </svg>
            </button>
            <button
              id="mobile-menu-toggle"
              class="ml-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
            >
              <svg id="menu-icon-open" class="h-6 w-6 block" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              <svg id="menu-icon-close" class="h-6 w-6 hidden" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <div id="mobile-menu" class="hidden md:hidden">
        <div class="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          <a href="/" class="block px-3 py-2 rounded-md text-base font-medium transition-colors text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-800">Home</a>
          <a href="/projects" class="block px-3 py-2 rounded-md text-base font-medium transition-colors text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-800">Projects</a>
          <a href="/articles" class="block px-3 py-2 rounded-md text-base font-medium transition-colors text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20">Articles</a>
          <a href="/gospel" class="block px-3 py-2 rounded-md text-base font-medium transition-colors text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-800">Gospel</a>
          <a href="/bible-reading" class="block px-3 py-2 rounded-md text-base font-medium transition-colors text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-800">Bible Reading</a>
          <a href="/resources" class="block px-3 py-2 rounded-md text-base font-medium transition-colors text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-800">Resources</a>
        </div>
      </div>
    </nav>

    <script>
      // Theme toggle functionality
      (function() {
        function initTheme() {
          const stored = localStorage.getItem('theme');
          const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
          const isDark = stored === 'dark' || (!stored && prefersDark);
          
          if (isDark) {
            document.documentElement.classList.add('dark');
          } else {
            document.documentElement.classList.remove('dark');
          }
        }

        function toggleTheme() {
          const isDark = document.documentElement.classList.contains('dark');
          if (isDark) {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
          } else {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
          }
        }

        initTheme();

        const themeToggle = document.getElementById('theme-toggle');
        const themeToggleMobile = document.getElementById('theme-toggle-mobile');
        
        if (themeToggle) themeToggle.addEventListener('click', toggleTheme);
        if (themeToggleMobile) themeToggleMobile.addEventListener('click', toggleTheme);

        // Mobile menu toggle
        const menuToggle = document.getElementById('mobile-menu-toggle');
        const mobileMenu = document.getElementById('mobile-menu');
        const menuIconOpen = document.getElementById('menu-icon-open');
        const menuIconClose = document.getElementById('menu-icon-close');

        if (menuToggle && mobileMenu) {
          menuToggle.addEventListener('click', function() {
            const isHidden = mobileMenu.classList.contains('hidden');
            if (isHidden) {
              mobileMenu.classList.remove('hidden');
              if (menuIconOpen) menuIconOpen.classList.add('hidden');
              if (menuIconClose) menuIconClose.classList.remove('hidden');
            } else {
              mobileMenu.classList.add('hidden');
              if (menuIconOpen) menuIconOpen.classList.remove('hidden');
              if (menuIconClose) menuIconClose.classList.add('hidden');
            }
          });

          // Close menu when clicking on a link
          mobileMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', function() {
              mobileMenu.classList.add('hidden');
              if (menuIconOpen) menuIconOpen.classList.remove('hidden');
              if (menuIconClose) menuIconClose.classList.add('hidden');
            });
          });
        }
      })();
    </script>
  `;
}

export function generateNoteHTML(
  id: string,
  title: string,
  description: string,
  date: string,
  tags: string[],
  imagePath: string,
  imageAlt: string,
  sections: ContentSection[]
): string {

  const contentHTML = sections.map(section => {
    const titleId = section.title ? slugifyTitle(section.title) : '';
    const titleHTML = section.title ? `<h2 id="${titleId}" class="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-5 mt-7">${section.title}</h2>` : '';
    return `
          <section class="mb-12">
            ${titleHTML}
            <div>${section.htmlContent || ''}</div>
          </section>`;
  }).join('');

  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title} | Devontae Reid</title>
    <meta name="description" content="${description || ''}">
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/themes/prism-tomorrow.min.css" rel="stylesheet" />
    <script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/components/prism-core.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/plugins/autoloader/prism-autoloader.min.js" data-autoloader-path="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/components/"></script>
</head>
<body class="min-h-screen bg-gray-50 dark:bg-gray-900">
    ${generateNavigationHTML()}
    <main class="py-20 px-4 sm:px-6 lg:px-8">
        <div class="max-w-4xl mx-auto">
          <!-- Breadcrumb -->
          <nav class="mb-8">
            <a href="/articles" class="text-blue-600 dark:text-blue-400 hover:underline">
              ← Back to Articles & Notes
            </a>
          </nav>

          <!-- Note Header -->
          <div class="post-hero">
            <div class="post-hero-content">
              <div class="post-meta-badge">
                <span>Note</span>
              </div>
              <h1 id="post-header-title">${title}</h1>
              <div class="post-header-meta">
                <div class="author-info">
                  <img alt="Devontae Reid" class="post-header-icon" src="https://i.ibb.co/HY4dx9s/headshot.jpg">
                  <div class="author-details">
                    <span class="author-name">Devontae Reid</span>
                    <div class="post-date">
                      <span>${formatDateFull(date)}</span>
                    </div>
                  </div>
                </div>
                <button class="post-header-shareButton" id="shareButton" onclick="if (navigator.share) { navigator.share({title: document.title, text: document.querySelector('meta[name=description]')?.content || '', url: window.location.href}).catch(() => {}); } else { navigator.clipboard.writeText(window.location.href).then(() => alert('Link copied to clipboard!')).catch(() => {}); }">
                  Share
                </button>
              </div>
              <div class="post-header-tags">
                ${tags.map(tag => `<span class="post-header-tag">${tag}</span>`).join('')}
              </div>
            </div>
            ${imagePath ? `
            <div class="post-hero-visual">
              <div class="post-hero-image">
                <img alt="${imageAlt || 'Note image'}" class="post-header-image" src="/assets/${imagePath}">
              </div>
            </div>
            ` : ''}
          </div>

          <!-- Note Content -->
          <article class="prose prose-lg dark:prose-invert max-w-none">
            ${contentHTML}
          </article>
        </div>
      </main>
    ${generateCodeCopyScript()}
    ${generateTableResponsiveScript()}
</body>
</html>`;
}

export function generateArticleHTML(
  id: string,
  title: string,
  description: string,
  date: string,
  tags: string[],
  imagePath: string,
  imageAlt: string,
  sections: ContentSection[]
): string {
  const contentHTML = sections.map(section => {
    const titleId = section.title ? slugifyTitle(section.title) : '';
    const titleHTML = section.title ? `<h2 id="${titleId}" class="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-5 mt-7">${section.title}</h2>` : '';
    return `
          <section class="mb-12">
            ${titleHTML}
            <div>${section.htmlContent || ''}</div>
          </section>`;
  }).join('');

  const footerTagsHTML = tags.map(tag => `
              <a href="/articles?tag=${encodeURIComponent(tag)}" class="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-3 py-1 rounded-full text-sm hover:bg-blue-100 dark:hover:bg-blue-900/30 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                ${tag}
              </a>`).join('');

  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title} | Devontae Reid</title>
    <meta name="description" content="${description || ''}">
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/themes/prism-tomorrow.min.css" rel="stylesheet" />
    <script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/components/prism-core.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/plugins/autoloader/prism-autoloader.min.js" data-autoloader-path="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/components/"></script>
    ${generatePostHeroCSS()}
</head>
<body class="min-h-screen bg-gray-50 dark:bg-gray-900">
    ${generateNavigationHTML()}
    <div class="py-20 px-4 sm:px-6 lg:px-8">
    <div class="max-w-4xl mx-auto">
      <!-- Breadcrumb -->
      <nav class="mb-8">
        <a href="/articles" class="text-blue-600 dark:text-blue-400 hover:underline">
          ← Back to Articles
        </a>
      </nav>

      <!-- Header -->
      <div class="post-hero">
        <div class="post-hero-content">
          <div class="post-meta-badge">
            <span>Article</span>
          </div>
          <h1 id="post-header-title">${title}</h1>
          <div class="post-header-meta">
            <div class="author-info">
              <img alt="Devontae Reid" class="post-header-icon" src="https://i.ibb.co/HY4dx9s/headshot.jpg">
              <div class="author-details">
                <span class="author-name">Devontae Reid</span>
                <div class="post-date">
                  <span>${formatDateFull(date)}</span>
                </div>
              </div>
            </div>
            <button class="post-header-shareButton" id="shareButton" onclick="if (navigator.share) { navigator.share({title: document.title, text: document.querySelector('meta[name=description]')?.content || '', url: window.location.href}).catch(() => {}); } else { navigator.clipboard.writeText(window.location.href).then(() => alert('Link copied to clipboard!')).catch(() => {}); }">
              Share
            </button>
          </div>
          <div class="post-header-tags">
            ${tags.map(tag => `<span class="post-header-tag">${tag}</span>`).join('')}
          </div>
        </div>
        ${imagePath ? `
        <div class="post-hero-visual">
          <div class="post-hero-image">
            <img alt="${imageAlt || 'Article image'}" class="post-header-image" src="/assets/${imagePath}">
          </div>
        </div>
        ` : ''}
      </div>

      <!-- Content -->
      <article class="prose prose-lg dark:prose-invert max-w-none">
        ${contentHTML}
      </article>

      <!-- Footer -->
      <footer class="mt-16 pt-8 border-t border-gray-200 dark:border-gray-700">
        <div class="flex flex-wrap gap-4">
          <span class="text-gray-600 dark:text-gray-400">Tags:</span>
          ${footerTagsHTML}
        </div>
      </footer>
    </div>
    </div>
    ${generateCodeCopyScript()}
    ${generateTableResponsiveScript()}
</body>
</html>`;
}

