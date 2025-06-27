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

# Helper: format date

def format_date(ts):
    try:
        dt = datetime.fromtimestamp(int(ts) / 1000)
        return dt.strftime('%A, %B %d, %Y')
    except Exception:
        return ts

# Helper: HTML escape

def esc(s):
    return (s or '').replace('&', '&amp;').replace('<', '&lt;').replace('>', '&gt;')

# HTML template

def render_article(post, is_note=False):
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
</head>
<body>
    <div class="article-page">
        <div class="article-navigation">
            <a href="/articles" class="back-button">
                &#8592; <span>Back to Articles</span>
            </a>
        </div>
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
    </div>
    <script type="text/javascript" src="/scripts/viewarticle.js"></script>
</body>
</html>'''


def generate_all(output_dir):
    # Articles
    with open(ARTICLES_PATH, 'r') as f:
        articles = json.load(f)
    for post in articles:
        out_dir = os.path.join(output_dir, 'article', post['id'])
        os.makedirs(out_dir, exist_ok=True)
        html = render_article(post, is_note=False)
        with open(os.path.join(out_dir, 'index.html'), 'w', encoding='utf-8') as outf:
            outf.write(html)
    # Notes
    if os.path.exists(NOTES_PATH):
        with open(NOTES_PATH, 'r') as f:
            notes = json.load(f)
        for post in notes:
            out_dir = os.path.join(output_dir, 'note', post['id'])
            os.makedirs(out_dir, exist_ok=True)
            html = render_article(post, is_note=True)
            with open(os.path.join(out_dir, 'index.html'), 'w', encoding='utf-8') as outf:
                outf.write(html)

if __name__ == '__main__':
    output_dir = sys.argv[1] if len(sys.argv) > 1 else 'dist/'
    generate_all(output_dir) 