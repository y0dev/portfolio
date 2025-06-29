import os
import json
from datetime import datetime
import shutil
import sys

# Paths
ARTICLES_PATH = 'src/assets/json/articles.json'
NOTES_PATH = 'src/assets/json/notes.json'
NAVBAR_CSS = 'src/components/css/navbar.css'
VIEWARTICLE_CSS = 'src/pages/css/viewarticle.css'
INDEX_CSS = 'src/index.css'
VIEWARTICLE_JS = 'src/pages/viewarticle.js'

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
    if os.path.exists(VIEWARTICLE_JS):
        dest_js_path = os.path.join(scripts_dir, 'viewarticle.js')
        shutil.copy2(VIEWARTICLE_JS, dest_js_path)
        print(f"Copied {VIEWARTICLE_JS} to {dest_js_path}")
    else:
        print(f"Warning: JavaScript file not found: {VIEWARTICLE_JS}")

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
    <link rel="stylesheet" href="/css/viewarticle.css" />
    <link rel="stylesheet" href="/css/index.css" />
    <style>
        .article-navigation {{
            margin-bottom: 1rem !important;
            padding: 0.75rem 0 !important;
            background: #ffffff !important;
            border-bottom: 1px solid #e5e7eb !important;
        }}
        @media (prefers-color-scheme: dark) {{
            .article-navigation {{
                background: #1f2937 !important;
                border-bottom: 1px solid #374151 !important;
            }}
        }}
        .article-page {{
            padding-top: 0 !important;
        }}
    </style>
</head>
<body>
    <!-- Navigation Bar -->
    <nav class="navbar">
        <div class="navbar-container">
            <div class="navbar-brand">
                <a href="/" class="navbar-logo">
                    <img src="/images/logos/logo192.png" alt="Devontae Reid" />
                    <span>Devontae Reid</span>
                </a>
            </div>
            <div class="navbar-menu">
                <a href="/" class="navbar-link">Home</a>
                <a href="/projects" class="navbar-link">Projects</a>
                <a href="/articles" class="navbar-link">Articles</a>
                <a href="/resources" class="navbar-link">Resources</a>
                <a href="/books" class="navbar-link">Books</a>
            </div>
            <div class="navbar-toggle">
                <span></span>
                <span></span>
                <span></span>
            </div>
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
    <script type="text/javascript" src="/scripts/viewarticle.js"></script>
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