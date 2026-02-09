/**
 * ViewArticle Standalone JavaScript
 * 
 * This file contains all the functionality for the viewarticle static page.
 * It replicates the React component functionality without React dependencies.
 * 
 * @author Devontae Reid
 * @version 1.0
 */

// Global variables
let articlesData = [];
let notesData = [];
let currentPost = null;

// API Configuration
const API_BASE_URL = 'https://devontaereid.com/scripts/api';
const ARTICLES_ENDPOINT = `${API_BASE_URL}/articles`;

/**
 * Initialize the page when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('ViewArticle page initializing...');
    
    // Extract ID from URL pathname
    const pathname = window.location.pathname;
    const articleId = pathname.split('/').pop();
    
    console.log('Article ID:', articleId);
    console.log('Current URL:', document.URL);
    
    // Try to load from API first, fallback to static data
    loadArticleData(articleId);
});
 */

/**
 * Load article data from API or fallback to static JSON
async function loadArticleData(articleId) {
    try {
        // Try API first
        console.log('Attempting to load from API...');
        const response = await fetch(ARTICLES_ENDPOINT, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            mode: 'cors',
        });

        if (response.ok) {
            const data = await response.json();
            if (data.success && data.data) {
                articlesData = data.data;
                console.log('Articles loaded from API:', articlesData.length);
                renderArticle(articleId);
                return;
            }
        }
    } catch (error) {
        console.log('API failed, using fallback data:', error.message);
    }
    
    // Fallback to static data
    loadFallbackData(articleId);
}
 */

/**
 * Load fallback data from static JSON files
async function loadFallbackData(articleId) {
    try {
        // Load articles and notes from static files
        const [articlesResponse, notesResponse] = await Promise.all([
            fetch('/src/assets/json/articles.json'),
            fetch('/src/assets/json/notes.json')
        ]);
        
        if (articlesResponse.ok && notesResponse.ok) {
            articlesData = await articlesResponse.json();
            notesData = await notesResponse.json();
            console.log('Fallback data loaded - Articles:', articlesData.length, 'Notes:', notesData.length);
            renderArticle(articleId);
        } else {
            throw new Error('Failed to load fallback data');
        }
    } catch (error) {
        console.error('Failed to load any data:', error);
        showErrorPage();
    }
}
 */

/**
 * Render the article page
 */
function renderArticle(articleId) {
    // Find the article
    let post = articlesData.find(article => article.id === articleId);
    if (!post) {
        post = notesData.find(note => note.id === articleId);
    }
    
    if (!post) {
        showErrorPage();
        return;
    }
    
    currentPost = post;
    
    // Render the page
    renderPageStructure();
    renderHeroSection(post);
    renderContent(post);
    renderFooter();
    
    // Add event listeners
    addEventListeners();
    
    console.log('Article rendered successfully');
}

/**
 * Render the basic page structure
 */
function renderPageStructure() {
    const body = document.body;
    body.innerHTML = `
        <div class="article-page">
            <!-- Back Navigation -->
            <div class="article-navigation">
                <a href="/articles" class="back-button">
                    <svg class="back-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
                    </svg>
                    <span>Back to Articles</span>
                </a>
            </div>

            <article class="app-body" id="post-container">
                <!-- Hero Section will be inserted here -->
                <div id="hero-section"></div>
                
                <!-- Content Section will be inserted here -->
                <div id="content-section"></div>
            </article>
        </div>
    `;
}

/**
 * Render the hero section
 */
function renderHeroSection(post) {
    const heroSection = document.getElementById('hero-section');
    const imageObj = getImage(post);
    const tags = getPostTags(post);
    const date = getDate(post);
    const isNote = post['file-id'] === 'note';
    
    heroSection.innerHTML = `
        <div class="post-hero">
            <div class="post-hero-content">
                <div class="post-meta-badge">
                    <svg class="badge-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="${isNote ? 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' : 'M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z'}"></path>
                    </svg>
                    <span>${isNote ? 'Note' : 'Article'}</span>
                </div>
                
                <h1 id="post-header-title">${post.title}</h1>
                
                <div class="post-header-meta">
                    <div class="author-info">
                        <img class="post-header-icon" src="https://i.ibb.co/HY4dx9s/headshot.jpg" alt="Devontae Reid" />
                        <div class="author-details">
                            <span class="author-name">Devontae Reid</span>
                            <div class="post-date">
                                <svg class="calendar-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                                </svg>
                                <span>${date}</span>
                            </div>
                        </div>
                    </div>
                    
                    <button class="post-header-shareButton" id="shareButton" aria-label="Share article">
                        <svg class="share-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"></path>
                        </svg>
                        <span>Share</span>
                    </button>
                </div>
                
                ${tags && tags.length > 0 ? `<div class="post-header-tags">${tags}</div>` : ''}
            </div>
            
            ${imageObj ? `<div class="post-hero-visual">${imageObj}</div>` : ''}
        </div>
    `;
}

/**
 * Render the content section
 */
function renderContent(post) {
    const contentSection = document.getElementById('content-section');
    const sections = getSections(post);
    
    contentSection.innerHTML = `
        <div class="post-content-wrapper">
            <div class="post-content">
                ${sections}
            </div>
            
            <!-- Article Footer -->
            <div class="post-footer">
                <div class="post-footer-content">
                    <div class="post-footer-meta">
                        <p>Thanks for reading! If you found this helpful, consider sharing it.</p>
                    </div>
                    <button class="post-footer-share" id="footerShareButton">
                        <svg class="share-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"></path>
                        </svg>
                        Share Article
                    </button>
                </div>
            </div>
        </div>
    `;
}

/**
 * Render the footer
 */
function renderFooter() {
    // Footer is already included in the content section
}

/**
 * Get post tags HTML
 */
function getPostTags(post) {
    if (!post.tags || !Array.isArray(post.tags)) {
        return '';
    }
    
    return post.tags.map((tag, idx) => 
        `<span class="post-header-tag" key="${idx}">${tag}</span>`
    ).join('');
}

/**
 * Get image HTML
 */
function getImage(post) {
    if (post.image) {
        return `
            <div class="post-hero-image">
                <img class="post-header-image" src="${post.image.name}" alt="${post.image.alt || post.title}" />
            </div>
        `;
    }
    return null;
}

/**
 * Get sections HTML
 */
function getSections(post) {
    if (!post.content) {
        return `
            <div class="post-content-placeholder">
                <div class="placeholder-content">
                    <h3>Content Coming Soon</h3>
                    <p>This article is being prepared. Check back soon for the full content!</p>
                </div>
            </div>
        `;
    }
    
    return post.content.map((section, idx) => {
        return getPostSection(section, idx);
    }).join('');
}

/**
 * Get individual post section HTML
 */
function getPostSection(section, idx) {
    let sectionHtml = `<section class="post-section" id="section_${idx}">`;
    
    // Section title
    if (section.title) {
        sectionHtml += `<h2 class="section-title">${section.title}</h2>`;
    }
    
    // Paragraphs
    if (section.paragraphs && Array.isArray(section.paragraphs)) {
        section.paragraphs.forEach(paragraph => {
            sectionHtml += `<p class="section-paragraph">${paragraph}</p>`;
        });
    }
    
    // Images
    if (section.images && Array.isArray(section.images)) {
        section.images.forEach(image => {
            sectionHtml += `
                <div class="section-image">
                    <img src="${image.src}" alt="${image.alt || ''}" />
                    ${image.caption ? `<p class="image-caption">${image.caption}</p>` : ''}
                </div>
            `;
        });
    }
    
    // Code blocks
    if (section.code && Array.isArray(section.code)) {
        section.code.forEach(codeBlock => {
            sectionHtml += `
                <div class="code-block">
                    ${codeBlock.language ? `<div class="code-language">${codeBlock.language}</div>` : ''}
                    <pre><code>${escapeHtml(codeBlock.code)}</code></pre>
                </div>
            `;
        });
    }
    
    // Blockquotes
    if (section.blockquotes && Array.isArray(section.blockquotes)) {
        section.blockquotes.forEach(quote => {
            sectionHtml += `
                <blockquote class="section-quote">
                    <p>${quote.text}</p>
                    ${quote.author ? `<cite>— ${quote.author}</cite>` : ''}
                </blockquote>
            `;
        });
    }
    
    // Links
    if (section.links && Array.isArray(section.links)) {
        section.links.forEach(link => {
            sectionHtml += `
                <div class="section-link">
                    <a href="${link.url}" target="_blank" rel="noopener noreferrer">
                        ${link.text}
                    </a>
                </div>
            `;
        });
    }
    
    // Lists
    if (section.lists && Array.isArray(section.lists)) {
        section.lists.forEach(list => {
            const listType = list.type === 'ordered' ? 'ol' : 'ul';
            sectionHtml += `<${listType} class="section-list">`;
            list.items.forEach(item => {
                sectionHtml += `<li>${item}</li>`;
            });
            sectionHtml += `</${listType}>`;
        });
    }
    
    sectionHtml += '</section>';
    return sectionHtml;
}

/**
 * Get formatted date
 */
function getDate(post) {
    const options = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    };
    const date = new Date(parseInt(post.date));
    
    // Responsive date format
    if (window.innerWidth <= 460) {
        options.weekday = undefined;
        options.month = 'short';
    }
    
    return date.toLocaleDateString("en-US", options);
}

/**
 * Copy URL to clipboard
 */
function copyURL() {
    navigator.clipboard.writeText(document.URL).then(() => {
        // Show feedback
        const shareButton = document.getElementById("shareButton");
        const footerShareButton = document.getElementById("footerShareButton");
        
        if (shareButton) {
            const originalText = shareButton.innerHTML;
            shareButton.innerHTML = '<span class="post-header-shareButton-icon">✓</span> Copied!';
            setTimeout(() => {
                shareButton.innerHTML = originalText;
            }, 2000);
        }
        
        if (footerShareButton) {
            const originalText = footerShareButton.innerHTML;
            footerShareButton.innerHTML = '<span>✓ Copied!</span>';
            setTimeout(() => {
                footerShareButton.innerHTML = originalText;
            }, 2000);
        }
    }).catch(err => {
        console.error('Failed to copy URL:', err);
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = document.URL;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
    });
}

/**
 * Show error page
 */
function showErrorPage() {
    document.body.innerHTML = `
        <div class="app-body">
            <div class="error-container">
                <div class="error-icon">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.47-.881-6.08-2.33"></path>
                    </svg>
                </div>
                <h1>Article Not Found</h1>
                <p>The article you're looking for doesn't exist or may have been moved.</p>
                <div class="error-actions">
                    <a href="/articles" class="back-link">
                        <svg class="back-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
                        </svg>
                        Back to Articles
                    </a>
                    <a href="/" class="home-link">
                        Go Home
                    </a>
                </div>
            </div>
        </div>
    `;
}

/**
 * Add event listeners
 */
function addEventListeners() {
    // Share button listeners
    const shareButton = document.getElementById("shareButton");
    const footerShareButton = document.getElementById("footerShareButton");
    
    if (shareButton) {
        shareButton.addEventListener('click', copyURL);
    }
    
    if (footerShareButton) {
        footerShareButton.addEventListener('click', copyURL);
    }
    
    // Back button listener
    const backButton = document.querySelector('.back-button');
    if (backButton) {
        backButton.addEventListener('click', function(e) {
            e.preventDefault();
            window.history.back();
        });
    }
}

/**
 * Escape HTML to prevent XSS
 */
function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, function(m) { return map[m]; });
}

/**
 * Handle window resize for responsive date format
 */
window.addEventListener('resize', function() {
    if (currentPost) {
        const dateElement = document.querySelector('.post-date span');
        if (dateElement) {
            dateElement.textContent = getDate(currentPost);
        }
    }
});

// Export functions for potential external use
window.ViewArticle = {
    loadArticleData,
    renderArticle,
    copyURL,
    getDate,
    getPostTags,
    getImage,
    getSections
}; 