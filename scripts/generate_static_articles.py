import os
import json
from datetime import datetime
import shutil
import sys

# Paths
ARTICLES_PATH = 'src/assets/json/articles.json'
NOTES_PATH = 'src/assets/json/notes.json'
NAVBAR_CSS = 'src/components/css/navbar.css'
FOOTER_CSS = 'src/components/css/footer.css'
VIEWARTICLE_CSS = 'src/pages/css/viewarticle.css'
INDEX_CSS = 'src/index.css'
STATIC_ARTICLE_JS = 'scripts/static-article.js'

# Helper: format date

def format_date(ts):
    try:
        dt = datetime.fromtimestamp(int(ts) / 1000)
        return dt.strftime('%A, %B %d, %Y')
    except Exception:
        return ts

# Helper: format short date for latest articles

def format_short_date(ts):
    try:
        dt = datetime.fromtimestamp(int(ts) / 1000)
        return dt.strftime('%b %d, %Y')
    except Exception:
        return ts

# Helper: HTML escape

def esc(s):
    return (s or '').replace('&', '&amp;').replace('<', '&lt;').replace('>', '&gt;')

# Helper: copy CSS files to output directory

def copy_css_files(output_dir):
    css_dir = os.path.join(output_dir, 'css')
    scripts_dir = os.path.join(output_dir, 'scripts')
    os.makedirs(css_dir, exist_ok=True)
    os.makedirs(scripts_dir, exist_ok=True)
    
    css_files = [
        (NAVBAR_CSS, 'navbar.css'),
        (VIEWARTICLE_CSS, 'viewarticle.css'),
        (FOOTER_CSS, 'footer.css'),
        (INDEX_CSS, 'index.css')
    ]
    
    for src_path, dest_name in css_files:
        if os.path.exists(src_path):
            dest_path = os.path.join(css_dir, dest_name)
            shutil.copy2(src_path, dest_path)
            print(f"Copied {src_path} to {dest_path}")
        else:
            print(f"Warning: CSS file not found: {src_path}")
    
    # Copy JavaScript file
    if os.path.exists(STATIC_ARTICLE_JS):
        dest_js_path = os.path.join(scripts_dir, 'static-article.js')
        shutil.copy2(STATIC_ARTICLE_JS, dest_js_path)
        print(f"Copied {STATIC_ARTICLE_JS} to {dest_js_path}")
    else:
        print(f"Warning: JavaScript file not found: {STATIC_ARTICLE_JS}")

# Helper: get latest articles

def get_latest_articles_html(current_article_id, articles, notes, limit=3):
    # Combine articles and notes, sort by date, and exclude current article
    all_posts = []
    
    if articles:
        all_posts.extend(articles)
    if notes:
        all_posts.extend(notes)
    
    # Filter out current article and sort by date
    filtered_posts = [post for post in all_posts if post.get('id') != current_article_id]
    sorted_posts = sorted(filtered_posts, key=lambda x: int(x.get('date', 0)), reverse=True)
    latest_posts = sorted_posts[:limit]
    
    latest_articles_html = ''
    for post in latest_posts:
        post_id = post.get('id', '')
        title = esc(post.get('title', 'Untitled'))
        description = esc(post.get('description', ''))
        date = format_short_date(post.get('date', ''))
        post_type = 'Note' if post.get('file-id') == 'note' else 'Article'
        post_url = f"/{'note' if post.get('file-id') == 'note' else 'article'}/{post_id}"
        
        image_html = ''
        if post.get('image'):
            image_html = f'<div class="latest-article-image"><img src="{esc(post["image"]["name"])}" alt="{esc(post["image"].get("alt", ""))}" /></div>'
        
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
    
    return latest_articles_html

# HTML template

def render_article(post, is_note=False, articles=None, notes=None):
    tags = ''.join(f'<span class="post-header-tag">{esc(tag)}</span>' for tag in post.get('tags', []))
    image_html = ''
    if post.get('image'):
        image_html = f'''<div class="post-hero-image"><img class="post-header-image" src="{esc(post['image']['name'])}" alt="{esc(post['image'].get('alt', ''))}" /></div>'''
    date = format_date(post.get('date', ''))
    meta_badge = f'<span>{"Note" if is_note else "Article"}</span>'
    title = esc(post.get('title', 'Untitled'))
    
    # Process content sections
    content_html = ''
    if post.get('content') and isinstance(post['content'], list):
        for section in post['content']:
            section_title = section.get('title', '')
            section_content = section.get('htmlContent', '')
            
            if section_title:
                content_html += f'<h2>{esc(section_title)}</h2>'
            if section_content:
                content_html += section_content
    else:
        # Fallback to placeholder if no content
        content_html = '''<div class="post-content-placeholder"><div class="placeholder-content"><h3>Content Coming Soon</h3><p>This article is being prepared. Check back soon for the full content!</p></div></div>'''
    
    # Get latest articles HTML
    latest_articles_html = get_latest_articles_html(post.get('id', ''), articles, notes)
    
    # Main HTML
    return f'''<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>{title} - Devontae Reid</title>
    <meta name="description" content="{esc(post.get('description', title))}" />
    <link rel="icon" href="images/logos/logo192.png" />
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


def generate_all(output_dir):
    # Create output directory if it doesn't exist
    os.makedirs(output_dir, exist_ok=True)
    
    # Copy CSS files to output directory
    copy_css_files(output_dir)
    
    # Load articles and notes
    articles = []
    notes = []
    
    if os.path.exists(ARTICLES_PATH):
        with open(ARTICLES_PATH, 'r') as f:
            articles = json.load(f)
    
    if os.path.exists(NOTES_PATH):
        with open(NOTES_PATH, 'r') as f:
            notes = json.load(f)
    
    # Generate article pages
    for post in articles:
        out_dir = os.path.join(output_dir, 'article', post['id'])
        os.makedirs(out_dir, exist_ok=True)
        html = render_article(post, is_note=False, articles=articles, notes=notes)
        with open(os.path.join(out_dir, 'index.html'), 'w', encoding='utf-8') as outf:
            outf.write(html)
    
    # Generate note pages
    for post in notes:
        out_dir = os.path.join(output_dir, 'note', post['id'])
        os.makedirs(out_dir, exist_ok=True)
        html = render_article(post, is_note=True, articles=articles, notes=notes)
        with open(os.path.join(out_dir, 'index.html'), 'w', encoding='utf-8') as outf:
            outf.write(html)

if __name__ == '__main__':
    output_dir = sys.argv[1] if len(sys.argv) > 1 else 'dist/'
    generate_all(output_dir) 