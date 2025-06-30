import os
import json
from datetime import datetime
import shutil
import sys
import traceback
from bs4 import BeautifulSoup

# Paths
ARTICLES_PATH = 'src/assets/json/articles.json'
NOTES_PATH = 'src/assets/json/notes.json'
NAVBAR_CSS = 'src/components/css/navbar.css'
FOOTER_CSS = 'src/components/css/footer.css'
VIEWARTICLE_CSS = 'src/pages/css/viewarticle.css'
INDEX_CSS = 'src/index.css'
STATIC_ARTICLE_JS = 'scripts/static-article.js'

def log_info(message):
    """Log info message with timestamp"""
    timestamp = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    print(f"[INFO] {timestamp}: {message}")

def log_error(message, error=None):
    """Log error message with timestamp and optional error details"""
    timestamp = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    print(f"[ERROR] {timestamp}: {message}")
    if error:
        print(f"[ERROR] Details: {str(error)}")
        print(f"[ERROR] Traceback: {traceback.format_exc()}")

def log_warning(message):
    """Log warning message with timestamp"""
    timestamp = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    print(f"[WARNING] {timestamp}: {message}")

# Helper: format date
def format_date(ts):
    try:
        if not ts:
            log_warning(f"Empty timestamp provided to format_date")
            return "Unknown Date"
        
        # Handle datetime strings first
        if isinstance(ts, str):
            try:
                # Try to parse as datetime string (YYYY-MM-DD HH:MM:SS)
                dt = datetime.strptime(ts, '%Y-%m-%d %H:%M:%S')
                return dt.strftime('%A, %B %d, %Y')
            except ValueError:
                # Try to parse as integer timestamp
                try:
                    ts = int(ts)
                except ValueError:
                    log_warning(f"Could not convert timestamp string '{ts}' to integer")
                    return ts
        
        # Handle integer timestamps
        if isinstance(ts, int):
            # Assume milliseconds if timestamp is large
            if ts > 1000000000000:  # Greater than year 2000 in milliseconds
                dt = datetime.fromtimestamp(ts / 1000)
            else:
                dt = datetime.fromtimestamp(ts)
            return dt.strftime('%A, %B %d, %Y')
        else:
            log_warning(f"Unexpected timestamp type: {type(ts)}, value: {ts}")
            return str(ts)
    except Exception as e:
        log_error(f"Error formatting date for timestamp '{ts}'", e)
        return str(ts)

# Helper: format short date for latest articles
def format_short_date(ts):
    try:
        if not ts:
            log_warning(f"Empty timestamp provided to format_short_date")
            return "Unknown Date"
        
        # Handle datetime strings first
        if isinstance(ts, str):
            try:
                # Try to parse as datetime string (YYYY-MM-DD HH:MM:SS)
                dt = datetime.strptime(ts, '%Y-%m-%d %H:%M:%S')
                return dt.strftime('%b %d, %Y')
            except ValueError:
                # Try to parse as integer timestamp
                try:
                    ts = int(ts)
                except ValueError:
                    log_warning(f"Could not convert timestamp string '{ts}' to integer")
                    return ts
        
        # Handle integer timestamps
        if isinstance(ts, int):
            # Assume milliseconds if timestamp is large
            if ts > 1000000000000:  # Greater than year 2000 in milliseconds
                dt = datetime.fromtimestamp(ts / 1000)
            else:
                dt = datetime.fromtimestamp(ts)
            return dt.strftime('%b %d, %Y')
        else:
            log_warning(f"Unexpected timestamp type: {type(ts)}, value: {ts}")
            return str(ts)
    except Exception as e:
        log_error(f"Error formatting short date for timestamp '{ts}'", e)
        return str(ts)

# Helper: HTML escape
def esc(s):
    try:
        if s is None:
            return ''
        return str(s).replace('&', '&amp;').replace('<', '&lt;').replace('>', '&gt;')
    except Exception as e:
        log_error(f"Error escaping string: {s}", e)
        return str(s) if s else ''

# Helper: copy CSS files to output directory
def copy_css_files(output_dir):
    try:
        log_info(f"Starting CSS file copy to: {output_dir}")
        
        css_dir = os.path.join(output_dir, 'css')
        scripts_dir = os.path.join(output_dir, 'scripts')
        
        # Create directories
        try:
            os.makedirs(css_dir, exist_ok=True)
            log_info(f"Created CSS directory: {css_dir}")
        except Exception as e:
            log_error(f"Failed to create CSS directory: {css_dir}", e)
            return False
        
        try:
            os.makedirs(scripts_dir, exist_ok=True)
            log_info(f"Created scripts directory: {scripts_dir}")
        except Exception as e:
            log_error(f"Failed to create scripts directory: {scripts_dir}", e)
            return False
        
        css_files = [
            (NAVBAR_CSS, 'navbar.css'),
            (VIEWARTICLE_CSS, 'viewarticle.css'),
            (FOOTER_CSS, 'footer.css'),
            (INDEX_CSS, 'index.css')
        ]
        
        copied_count = 0
        for src_path, dest_name in css_files:
            try:
                if os.path.exists(src_path):
                    dest_path = os.path.join(css_dir, dest_name)
                    shutil.copy2(src_path, dest_path)
                    log_info(f"Copied {src_path} to {dest_path}")
                    copied_count += 1
                else:
                    log_warning(f"CSS file not found: {src_path}")
            except Exception as e:
                log_error(f"Failed to copy CSS file {src_path} to {dest_name}", e)
        
        # Copy JavaScript file
        try:
            if os.path.exists(STATIC_ARTICLE_JS):
                dest_js_path = os.path.join(scripts_dir, 'static-article.js')
                shutil.copy2(STATIC_ARTICLE_JS, dest_js_path)
                log_info(f"Copied {STATIC_ARTICLE_JS} to {dest_js_path}")
                copied_count += 1
            else:
                log_warning(f"JavaScript file not found: {STATIC_ARTICLE_JS}")
        except Exception as e:
            log_error(f"Failed to copy JavaScript file {STATIC_ARTICLE_JS}", e)
        
        log_info(f"CSS/JS copy completed. Successfully copied {copied_count} files.")
        return True
        
    except Exception as e:
        log_error("Unexpected error in copy_css_files", e)
        return False

# Helper: get latest articles
def get_latest_articles_html(current_article_id, articles, notes, limit=3):
    try:
        log_info(f"Generating latest articles HTML for article ID: {current_article_id}")
        
        # Combine articles and notes, sort by date, and exclude current article
        all_posts = []
        
        try:
            if articles:
                all_posts.extend(articles)
                log_info(f"Added {len(articles)} articles to latest posts")
        except Exception as e:
            log_error("Error processing articles for latest posts", e)
        
        try:
            if notes:
                all_posts.extend(notes)
                log_info(f"Added {len(notes)} notes to latest posts")
        except Exception as e:
            log_error("Error processing notes for latest posts", e)
        
        # Filter out current article and sort by date
        try:
            filtered_posts = [post for post in all_posts if post.get('id') != current_article_id]
            log_info(f"Filtered out current article, {len(filtered_posts)} posts remaining")
        except Exception as e:
            log_error("Error filtering out current article", e)
            filtered_posts = all_posts
        
        try:
            # Sort by date - handle both timestamp integers and datetime strings
            def get_sort_key(post):
                date_value = post.get('date', '')
                if isinstance(date_value, int):
                    return date_value
                elif isinstance(date_value, str):
                    try:
                        # Try to parse as datetime string
                        dt = datetime.strptime(date_value, '%Y-%m-%d %H:%M:%S')
                        return dt.timestamp()
                    except ValueError:
                        try:
                            # Try to parse as integer timestamp
                            return int(date_value)
                        except ValueError:
                            log_warning(f"Could not parse date: {date_value}, using 0")
                            return 0
                else:
                    log_warning(f"Unexpected date type: {type(date_value)}, value: {date_value}")
                    return 0
            
            sorted_posts = sorted(filtered_posts, key=get_sort_key, reverse=True)
            latest_posts = sorted_posts[:limit]
            log_info(f"Sorted posts and selected {len(latest_posts)} latest posts")
        except Exception as e:
            log_error("Error sorting posts by date", e)
            latest_posts = filtered_posts[:limit]
        
        latest_articles_html = ''
        for i, post in enumerate(latest_posts):
            try:
                post_id = post.get('id', '')
                title = esc(post.get('title', 'Untitled'))
                description = esc(post.get('description', ''))
                date = format_short_date(post.get('date', ''))
                post_type = 'Note' if post.get('file-id') == 'note' else 'Article'
                post_url = f"/{'note' if post.get('file-id') == 'note' else 'article'}/{post_id}"
                
                image_html = ''
                try:
                    if post.get('image'):
                        image_name = esc(post["image"]["name"])
                        image_alt = esc(post["image"].get("alt", ""))
                        image_html = f'<div class="latest-article-image"><img src="{image_name}" alt="{image_alt}" /></div>'
                except Exception as e:
                    log_error(f"Error processing image for latest article {post_id}", e)
                
                latest_articles_html += f'''
                <div class="latest-article-card">
                    <a href="{post_url}" class="latest-article-link">
                        {image_html}
                        <div class="latest-article-content">
                            <h3 class="latest-article-title">{title}</h3>
                            <p class="latest-article-excerpt">{description}</p>
                            <div class="latest-article-meta">
                                <span class="latest-article-date">{date}</span>
                                <span class="latest-article-type">{post_type}</span>
                            </div>
                        </div>
                    </a>
                </div>'''
                
                log_info(f"Generated latest article HTML for post {i+1}/{len(latest_posts)}: {post_id}")
                
            except Exception as e:
                log_error(f"Error generating HTML for latest article {i+1}", e)
                continue
        
        log_info(f"Latest articles HTML generation completed. Generated {len(latest_posts)} articles.")
        return latest_articles_html
        
    except Exception as e:
        log_error("Unexpected error in get_latest_articles_html", e)
        return ""

# HTML template
def render_article(post, is_note=False, articles=None, notes=None):
    try:
        log_info(f"Rendering article: {post.get('id', 'unknown')} (is_note: {is_note})")
        
        # Process tags
        try:
            tags = ''.join(f'<span class="post-header-tag">{esc(tag)}</span>' for tag in post.get('tags', []))
            log_info(f"Processed {len(post.get('tags', []))} tags")
        except Exception as e:
            log_error("Error processing tags", e)
            tags = ''
        
        # Process image
        try:
            image_html = ''
            if post.get('image'):
                image_name = esc(post['image']['name'])
                image_alt = esc(post['image'].get('alt', ''))
                image_html = f'''<div class="post-hero-image"><img class="post-header-image" src="{image_name}" alt="{image_alt}" /></div>'''
                log_info(f"Processed image: {image_name}")
        except Exception as e:
            log_error("Error processing image", e)
            image_html = ''
        
        # Process date
        try:
            date = format_date(post.get('date', ''))
            log_info(f"Formatted date: {date}")
        except Exception as e:
            log_error("Error formatting date", e)
            date = "Unknown Date"
        
        # Process meta badge and title
        try:
            meta_badge = f'<span>{"Note" if is_note else "Article"}</span>'
            title = esc(post.get('title', 'Untitled'))
            log_info(f"Processed title: {title}")
        except Exception as e:
            log_error("Error processing title and meta badge", e)
            meta_badge = '<span>Article</span>'
            title = 'Untitled'
        
        # Process content sections
        try:
            content_html = ''
            if post.get('content') and isinstance(post['content'], list):
                log_info(f"Processing {len(post['content'])} content sections")
                for i, section in enumerate(post['content']):
                    try:
                        section_title = section.get('title', '')
                        section_content = section.get('htmlContent', '')
                        
                        if section_title:
                            content_html += f'<h2>{esc(section_title)}</h2>'
                        if section_content:
                            content_html += section_content
                        
                        log_info(f"Processed content section {i+1}/{len(post['content'])}")
                    except Exception as e:
                        log_error(f"Error processing content section {i+1}", e)
                        continue
            else:
                log_warning("No content sections found, using placeholder")
                content_html = '''<div class="post-content-placeholder"><div class="placeholder-content"><h3>Content Coming Soon</h3><p>This article is being prepared. Check back soon for the full content!</p></div></div>'''
        except Exception as e:
            log_error("Error processing content sections", e)
            content_html = '''<div class="post-content-placeholder"><div class="placeholder-content"><h3>Content Coming Soon</h3><p>This article is being prepared. Check back soon for the full content!</p></div></div>'''
        
        # Get latest articles HTML
        try:
            latest_articles_html = get_latest_articles_html(post.get('id', ''), articles, notes)
            log_info("Generated latest articles HTML")
        except Exception as e:
            log_error("Error generating latest articles HTML", e)
            latest_articles_html = ""
        
        # Generate main HTML
        try:
            log_info("Generating main HTML template")
            html_template = f'''<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>{title} - Devontae Reid</title>
    <meta name="description" content="{esc(post.get('description', title))}" />
    
    <!-- SEO Meta Tags -->
    <meta name="author" content="Devontae Reid" />
    <meta name="robots" content="index, follow" />
    <meta name="language" content="English" />
    <meta name="revisit-after" content="7 days" />
    <meta name="distribution" content="web" />
    <meta name="rating" content="general" />
    
    <!-- Open Graph Meta Tags -->
    <meta property="og:title" content="{title}" />
    <meta property="og:description" content="{esc(post.get('description', title))}" />
    <meta property="og:type" content="article" />
    <meta property="og:url" content="https://devontaereid.com/{'note' if is_note else 'article'}/{post.get('id', '')}" />
    <meta property="og:site_name" content="Devontae Reid" />
    <meta property="og:locale" content="en_US" />
    <meta property="article:author" content="Devontae Reid" />
    <meta property="article:published_time" content="{post.get('date', '')}" />
    <meta property="article:section" content="Technology" />
    
    <!-- Twitter Card Meta Tags -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:site" content="@_yodev_" />
    <meta name="twitter:creator" content="@_yodev_" />
    <meta name="twitter:title" content="{title}" />
    <meta name="twitter:description" content="{esc(post.get('description', title))}" />
    
    <!-- Additional Meta Tags -->
    <meta name="keywords" content="{', '.join(esc(tag) for tag in post.get('tags', []))}" />
    <meta name="category" content="Technology" />
    <meta name="article:tag" content="{', '.join(esc(tag) for tag in post.get('tags', []))}" />
    
    <!-- Favicon and Icons -->
    <link rel="icon" href="images/logos/logo192.png" />
    <link rel="apple-touch-icon" href="images/logos/logo192.png" />
    <link rel="manifest" href="/manifest.json" />
    
    <!-- Canonical URL -->
    <link rel="canonical" href="https://devontaereid.com/{'note' if is_note else 'article'}/{post.get('id', '')}" />
    
    <!-- Stylesheets -->
    <link rel="stylesheet" href="/css/navbar.css" />
    <link rel="stylesheet" href="/css/footer.css" />
    <link rel="stylesheet" href="/css/viewarticle.css" />
    <link rel="stylesheet" href="/css/index.css" />
</head>
<body>
    <!-- Navigation Bar -->
    <nav class="navbar  ">
        <div class="main-menu">
            <div class="menu-branding">
                <a href="/" class="brand-link">
                    <img src="/images/logos/logo.png" alt="Devontae Reid Logo" class="brand-logo">
                    <h3 class="brand-text">DEVONTAE REID</h3>
                </a>
            </div>
            <ul class="menu-list desktop-only">
                <li class="nav-item"><a href="/" class="nav-link ">Home</a></li>
                <li class="nav-item"><a href="/projects" class="nav-link ">Projects</a></li>
                <li class="nav-item"><a href="/articles" class="nav-link active">Articles</a></li>
                <li class="nav-item"><a href="/gospel" class="nav-link ">Gospel</a></li>
                <li class="nav-item"><a href="/resources" class="nav-link ">Resources</a></li>
            </ul>
            <div class="nav-controls"><button class="theme-toggle" aria-label="Toggle theme">☀️</button><button class="mobile-menu-toggle mobile-only" aria-label="Toggle menu" aria-expanded="false" type="button"><span class="hamburger "><span class="hamburger-line"></span><span class="hamburger-line"></span><span class="hamburger-line"></span></span></button></div>
        </div>
        <div class="mobile-dropdown ">
            <ul class="mobile-menu-list">
                <li class="mobile-nav-item"><a href="/" class="mobile-nav-link ">Home</a></li>
                <li class="mobile-nav-item"><a href="/projects" class="mobile-nav-link ">Projects</a></li>
                <li class="mobile-nav-item"><a href="/articles" class="mobile-nav-link ">Articles</a></li>
                <li class="mobile-nav-item"><a href="/gospel" class="mobile-nav-link ">Gospel</a></li>
                <li class="mobile-nav-item"><a href="/resources" class="mobile-nav-link ">Resources</a></li>
            </ul>
        </div>
    </nav>

    <div class="article-page">
        <div class="article-navigation">
            <a href="/articles" class="back-button">
                &#8592; <span>Back to Articles</span>
            </a>
        </div>
        <div class="article-layout">
            <article class="app-body" id="post-container">
                <div class="post-hero">
                    <div class="post-hero-content">
                        <div class="post-meta-badge">{meta_badge}</div>
                        <h1 id="post-header-title">{title}</h1>
                        <div class="post-header-meta">
                            <div class="author-info">
                                <img class="post-header-icon" src="https://i.ibb.co/HY4dx9s/headshot.jpg" alt="Devontae Reid" />
                                <div class="author-details">
                                    <span class="author-name">Devontae Reid</span>
                                    <div class="post-date">
                                        <span>{date}</span>
                                    </div>
                                </div>
                            </div>
                            <button class="post-header-shareButton" id="shareButton">Share</button>
                        </div>
                        <div class="post-header-tags">{tags}</div>
                    </div>
                    <div class="post-hero-visual">{image_html}</div>
                </div>
                <div class="post-content-wrapper">
                    <div class="post-content">{content_html}</div>
                    <div class="post-footer">
                        <div class="post-footer-content">
                            <div class="post-footer-meta">
                                <p>Thanks for reading! If you found this helpful, consider sharing it.</p>
                            </div>
                            <button class="post-footer-share">Share Article</button>
                        </div>
                    </div>
                </div>
            </article>

            <!-- Latest Articles Sidebar -->
            <aside class="latest-articles-sidebar">
                <div class="latest-articles-container">
                    <h2 class="latest-articles-title">Latest Articles</h2>
                    <div class="latest-articles-list">
                        {latest_articles_html}
                    </div>
                </div>
            </aside>
        </div>

        <!-- Latest Articles Section for Mobile -->
        <section class="latest-articles-mobile">
            <div class="latest-articles-container">
                <h2 class="latest-articles-title">Latest Articles</h2>
                <div class="latest-articles-list">
                    {latest_articles_html}
                </div>
            </div>
        </section>
    </div>
    <footer class="footer">
        <div class="footer-container">
            <div class="footer-brand">
                <h3 class="brand-name">Devontae Reid</h3>
                <p class="brand-description">Senior Software Engineer based in Dallas, Texas, USA</p>
                <div class="social-links">
                    <a href="https://github.com/y0dev" target="_blank" rel="noopener noreferrer" class="social-link" aria-label="GitHub">
                    <svg class="social-icon" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"></path>
                    </svg>
                    </a>
                    <a href="https://linkedin.com/in/devontae-reid" target="_blank" rel="noopener noreferrer" class="social-link" aria-label="LinkedIn">
                    <svg class="social-icon" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"></path>
                    </svg>
                    </a>
                    <a href="https://x.com/_yodev_" target="_blank" rel="noopener noreferrer" class="social-link" aria-label="Twitter">
                    <svg class="social-icon" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"></path>
                    </svg>
                    </a>
                </div>
            </div>
            <div class="footer-links">
                <div class="footer-section">
                    <h4 class="footer-section-title">Quick Links</h4>
                    <ul class="footer-link-list">
                    <li><a href="/" class="footer-link">Home</a></li>
                    <li><a href="/about" class="footer-link">About</a></li>
                    <li><a href="/projects" class="footer-link">Projects</a></li>
                    <li><a href="/articles" class="footer-link">Articles</a></li>
                    <li><a href="/resources" class="footer-link">Resources</a></li>
                    </ul>
                </div>
                <div class="footer-section">
                    <h4 class="footer-section-title">Resources</h4>
                    <ul class="footer-link-list">
                    <li><a href="/resources/books" class="footer-link">Books</a></li>
                    <li><a href="/resources" class="footer-link">Tools</a></li>
                    <li><a href="/resources" class="footer-link">Podcasts</a></li>
                    <li><a href="/resources" class="footer-link">YouTube</a></li>
                    <li><a href="/resources" class="footer-link">Theology</a></li>
                    </ul>
                </div>
                <div class="footer-section">
                    <h4 class="footer-section-title">Contact</h4>
                    <ul class="footer-link-list">
                    <li><a href="mailto:devontae.reid@gmail.com" class="footer-link contact-link">devontae.reid@gmail.com</a></li>
                    <li><span class="footer-link contact-link">Dallas, Texas, USA</span></li>
                    </ul>
                </div>
            </div>
        </div>
        <div class="footer-bottom">
            <div class="footer-bottom-content">
                <p class="copyright">© 2025 Devontae Reid. All rights reserved.</p>
            </div>
        </div>
    </footer>
    <script type="text/javascript" src="/scripts/static-article.js"></script>
</body>
</html>'''
            
            # Prettify the HTML
            prettified_html = prettify_html(html_template)
            
            log_info(f"Successfully generated and prettified HTML for article: {post.get('id', 'unknown')}")
            return prettified_html
            
        except Exception as e:
            log_error("Error generating main HTML template", e)
            return f"<html><body><h1>Error generating article: {str(e)}</h1></body></html>"
        
    except Exception as e:
        log_error(f"Unexpected error in render_article for post {post.get('id', 'unknown')}", e)
        return f"<html><body><h1>Error rendering article: {str(e)}</h1></body></html>"

def generate_all(output_dir):
    try:
        log_info(f"Starting static article generation for output directory: {output_dir}")
        
        # Create output directory if it doesn't exist
        try:
            os.makedirs(output_dir, exist_ok=True)
            log_info(f"Created/verified output directory: {output_dir}")
        except Exception as e:
            log_error(f"Failed to create output directory: {output_dir}", e)
            return False
        
        # Copy CSS files to output directory
        try:
            css_copy_success = copy_css_files(output_dir)
            if not css_copy_success:
                log_warning("CSS file copy had issues, but continuing with generation")
        except Exception as e:
            log_error("Failed to copy CSS files", e)
            log_warning("Continuing without CSS files")
        
        # Load articles and notes
        articles = []
        notes = []
        
        # Load articles
        try:
            if os.path.exists(ARTICLES_PATH):
                log_info(f"Loading articles from: {ARTICLES_PATH}")
                with open(ARTICLES_PATH, 'r', encoding='utf-8') as f:
                    articles = json.load(f)
                log_info(f"Successfully loaded {len(articles)} articles")
            else:
                log_warning(f"Articles file not found: {ARTICLES_PATH}")
        except Exception as e:
            log_error(f"Failed to load articles from {ARTICLES_PATH}", e)
            articles = []
        
        # Load notes
        try:
            if os.path.exists(NOTES_PATH):
                log_info(f"Loading notes from: {NOTES_PATH}")
                with open(NOTES_PATH, 'r', encoding='utf-8') as f:
                    notes = json.load(f)
                log_info(f"Successfully loaded {len(notes)} notes")
            else:
                log_warning(f"Notes file not found: {NOTES_PATH}")
        except Exception as e:
            log_error(f"Failed to load notes from {NOTES_PATH}", e)
            notes = []
        
        # Validate data structure
        try:
            if not isinstance(articles, list):
                log_error(f"Articles data is not a list, got: {type(articles)}")
                articles = []
            if not isinstance(notes, list):
                log_error(f"Notes data is not a list, got: {type(notes)}")
                notes = []
        except Exception as e:
            log_error("Error validating data structure", e)
        
        total_generated = 0
        errors = 0
        
        # Generate article pages
        log_info("Starting article page generation")
        for i, post in enumerate(articles):
            try:
                post_id = post.get('id', f'unknown_{i}')
                log_info(f"Processing article {i+1}/{len(articles)}: {post_id}")
                
                # Validate required fields
                if not post.get('id'):
                    log_warning(f"Article {i+1} missing ID, skipping")
                    continue
                
                if not post.get('title'):
                    log_warning(f"Article {post_id} missing title, using default")
                    post['title'] = 'Untitled Article'
                
                # Create output directory
                try:
                    out_dir = os.path.join(output_dir, 'article', post['id'])
                    os.makedirs(out_dir, exist_ok=True)
                    log_info(f"Created article directory: {out_dir}")
                except Exception as e:
                    log_error(f"Failed to create directory for article {post_id}", e)
                    continue
                
                # Generate HTML
                try:
                    html = render_article(post, is_note=False, articles=articles, notes=notes)
                    log_info(f"Generated HTML for article {post_id}")
                except Exception as e:
                    log_error(f"Failed to render article {post_id}", e)
                    errors += 1
                    continue
                
                # Write HTML file
                try:
                    html_file_path = os.path.join(out_dir, 'index.html')
                    with open(html_file_path, 'w', encoding='utf-8') as outf:
                        outf.write(html)
                    log_info(f"Written article HTML to: {html_file_path}")
                    total_generated += 1
                except Exception as e:
                    log_error(f"Failed to write HTML file for article {post_id}", e)
                    errors += 1
                    continue
                
            except Exception as e:
                log_error(f"Unexpected error processing article {i+1}", e)
                errors += 1
                continue
        
        # Generate note pages
        log_info("Starting note page generation")
        for i, post in enumerate(notes):
            try:
                post_id = post.get('id', f'unknown_{i}')
                log_info(f"Processing note {i+1}/{len(notes)}: {post_id}")
                
                # Validate required fields
                if not post.get('id'):
                    log_warning(f"Note {i+1} missing ID, skipping")
                    continue
                
                if not post.get('title'):
                    log_warning(f"Note {post_id} missing title, using default")
                    post['title'] = 'Untitled Note'
                
                # Create output directory
                try:
                    out_dir = os.path.join(output_dir, 'note', post['id'])
                    os.makedirs(out_dir, exist_ok=True)
                    log_info(f"Created note directory: {out_dir}")
                except Exception as e:
                    log_error(f"Failed to create directory for note {post_id}", e)
                    continue
                
                # Generate HTML
                try:
                    html = render_article(post, is_note=True, articles=articles, notes=notes)
                    log_info(f"Generated HTML for note {post_id}")
                except Exception as e:
                    log_error(f"Failed to render note {post_id}", e)
                    errors += 1
                    continue
                
                # Write HTML file
                try:
                    html_file_path = os.path.join(out_dir, 'index.html')
                    with open(html_file_path, 'w', encoding='utf-8') as outf:
                        outf.write(html)
                    log_info(f"Written note HTML to: {html_file_path}")
                    total_generated += 1
                except Exception as e:
                    log_error(f"Failed to write HTML file for note {post_id}", e)
                    errors += 1
                    continue
                
            except Exception as e:
                log_error(f"Unexpected error processing note {i+1}", e)
                errors += 1
                continue
        
        log_info(f"Static article generation completed!")
        log_info(f"Total files generated: {total_generated}")
        log_info(f"Total errors: {errors}")
        
        if errors > 0:
            log_warning(f"Generation completed with {errors} errors")
            return False
        else:
            log_info("Generation completed successfully!")
            return True
            
    except Exception as e:
        log_error("Unexpected error in generate_all", e)
        return False

def prettify_html(html_content: str) -> str:
    """Prettify HTML content with proper indentation and formatting."""
    try:
        # Parse HTML with BeautifulSoup
        soup = BeautifulSoup(html_content, 'html.parser')
        
        # Prettify with custom formatting
        prettified = soup.prettify()
        
        # Clean up extra whitespace while preserving structure
        lines = prettified.split('\n')
        cleaned_lines = []
        
        for line in lines:
            # Remove excessive whitespace but keep indentation
            stripped = line.strip()
            if stripped:
                # Preserve original indentation level
                indent_level = len(line) - len(line.lstrip())
                cleaned_line = ' ' * indent_level + stripped
                cleaned_lines.append(cleaned_line)
            elif line.strip() == '':
                # Keep empty lines for readability
                cleaned_lines.append('')
        
        return '\n'.join(cleaned_lines)
        
    except Exception as e:
        log_error(f"Error prettifying HTML: {e}")
        # Return original content if prettification fails
        return html_content

if __name__ == '__main__':
    try:
        log_info("Starting static article generation script")
        
        # Get output directory from command line arguments
        output_dir = sys.argv[1] if len(sys.argv) > 1 else 'dist/'
        log_info(f"Output directory: {output_dir}")
        
        # Validate output directory path
        try:
            output_dir = os.path.abspath(output_dir)
            log_info(f"Absolute output directory: {output_dir}")
        except Exception as e:
            log_error(f"Failed to resolve output directory path: {output_dir}", e)
            sys.exit(1)
        
        # Run generation
        success = generate_all(output_dir)
        
        if success:
            log_info("Script completed successfully!")
            sys.exit(0)
        else:
            log_error("Script completed with errors!")
            sys.exit(1)
            
    except KeyboardInterrupt:
        log_info("Script interrupted by user")
        sys.exit(1)
    except Exception as e:
        log_error("Unexpected error in main execution", e)
        sys.exit(1) 