#!/usr/bin/env python3
"""
Markdown to Static HTML Converter
Converts markdown files to static HTML similar to generate_static_articles.py format
with preview functionality and database update capabilities.
"""

import os
import json
import argparse
import webbrowser
import tempfile
from datetime import datetime
from pathlib import Path
import markdown
from markdown.extensions import codehilite, tables, toc
import re
from typing import Dict, Any, Optional

class MarkdownToStaticHTML:
    def __init__(self):
        self.md = markdown.Markdown(
            extensions=[
                'markdown.extensions.codehilite',
                'markdown.extensions.tables',
                'markdown.extensions.toc',
                'markdown.extensions.fenced_code',
                'markdown.extensions.nl2br'
            ],
            extension_configs={
                'codehilite': {
                    'css_class': 'highlight',
                    'use_pygments': True,
                    'noclasses': True
                }
            }
        )
        
    def extract_metadata(self, content: str) -> Dict[str, Any]:
        """Extract metadata from markdown content."""
        metadata = {
            'title': 'Untitled',
            'description': '',
            'date': datetime.now().strftime('%Y-%m-%d'),
            'category': 'General',
            'type': 'Article',
            'tags': [],
            'image': None
        }
        
        # Look for Blog/Note Info section
        info_match = re.search(r'##\s*Blog/Note\s*Info\s*\n(.*?)(?=\n##|\Z)', content, re.DOTALL | re.IGNORECASE)
        if info_match:
            info_section = info_match.group(1)
            
            # Extract title
            title_match = re.search(r'Title:\s*(.+)', info_section, re.IGNORECASE)
            if title_match:
                metadata['title'] = title_match.group(1).strip()
            
            # Extract description
            desc_match = re.search(r'Description:\s*(.+)', info_section, re.IGNORECASE)
            if desc_match:
                metadata['description'] = desc_match.group(1).strip()
            
            # Extract date
            date_match = re.search(r'Date:\s*(.+)', info_section, re.IGNORECASE)
            if date_match:
                metadata['date'] = date_match.group(1).strip()
            
            # Extract category
            cat_match = re.search(r'Category:\s*(.+)', info_section, re.IGNORECASE)
            if cat_match:
                metadata['category'] = cat_match.group(1).strip()
            
            # Extract type
            type_match = re.search(r'Type:\s*(.+)', info_section, re.IGNORECASE)
            if type_match:
                metadata['type'] = type_match.group(1).strip()
            
            # Extract tags
            tags_match = re.search(r'Tags:\s*(.+)', info_section, re.IGNORECASE)
            if tags_match:
                tags_str = tags_match.group(1).strip()
                metadata['tags'] = [tag.strip() for tag in tags_str.split(',')]
            
            # Extract image
            img_match = re.search(r'Image:\s*(.+)', info_section, re.IGNORECASE)
            if img_match:
                metadata['image'] = img_match.group(1).strip()
        
        return metadata
    
    def extract_content(self, content: str) -> str:
        """Extract content sections from markdown, excluding metadata."""
        # Remove the Blog/Note Info section
        content = re.sub(r'##\s*Blog/Note\s*Info\s*\n.*?(?=\n##|\Z)', '', content, flags=re.DOTALL | re.IGNORECASE)
        return content.strip()
    
    def convert_timestamp(self, date_str: str) -> int:
        """Convert date string to timestamp."""
        try:
            # Try different date formats
            formats = [
                '%B %d, %Y',  # April 25, 2025
                '%Y-%m-%d',   # 2025-04-25
                '%m/%d/%Y',   # 04/25/2025
                '%d/%m/%Y',   # 25/04/2025
            ]
            
            for fmt in formats:
                try:
                    dt = datetime.strptime(date_str, fmt)
                    return int(dt.timestamp() * 1000)  # Convert to milliseconds
                except ValueError:
                    continue
            
            # If no format works, use current timestamp
            return int(datetime.now().timestamp() * 1000)
        except:
            return int(datetime.now().timestamp() * 1000)
    
    def generate_html(self, md_file_path: str, output_dir: str = None) -> Dict[str, Any]:
        """Generate static HTML from markdown file."""
        with open(md_file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Extract metadata and content
        metadata = self.extract_metadata(content)
        content_sections = self.extract_content(content)
        
        # Convert markdown to HTML
        html_content = self.md.convert(content_sections)
        
        # Generate unique ID from filename
        file_id = Path(md_file_path).stem.lower().replace(' ', '-').replace('_', '-')
        
        # Convert date to timestamp
        timestamp = self.convert_timestamp(metadata['date'])
        
        # Create article data structure
        article_data = {
            'id': file_id,
            'title': metadata['title'],
            'description': metadata['description'],
            'date': timestamp,
            'category': metadata['category'],
            'type': metadata['type'].lower(),
            'tags': metadata['tags'],
            'image': metadata['image'] or {
                'name': '/images/default-article.jpg',
                'alt': metadata['title']
            },
            'content': [
                {
                    'title': '',
                    'htmlContent': html_content
                }
            ]
        }
        
        # Generate HTML file
        html_output = self.generate_static_html(article_data)
        
        # Save to output directory
        output_path = None
        if output_dir:
            os.makedirs(output_dir, exist_ok=True)
            output_path = os.path.join(output_dir, f'{file_id}.html')
            with open(output_path, 'w', encoding='utf-8') as f:
                f.write(html_output)
        
        return {
            'article_data': article_data,
            'html_content': html_output,
            'output_path': output_path
        }
    
    def generate_static_html(self, article_data: Dict[str, Any]) -> str:
        """Generate static HTML similar to generate_static_articles.py format."""
        title = article_data['title']
        description = article_data['description']
        date = datetime.fromtimestamp(article_data['date'] / 1000).strftime('%A, %B %d, %Y')
        tags = ''.join(f'<span class="post-header-tag">{tag}</span>' for tag in article_data['tags'])
        content = article_data['content'][0]['htmlContent'] if article_data['content'] else ''
        meta_badge = f'<span>{article_data["type"].title()}</span>'
        
        # Image HTML
        image_html = ''
        if article_data.get('image'):
            if isinstance(article_data['image'], dict):
                image_html = f'''<div class="post-hero-image"><img class="post-header-image" src="{article_data['image']['name']}" alt="{article_data['image'].get('alt', '')}" /></div>'''
            else:
                image_html = f'''<div class="post-hero-image"><img class="post-header-image" src="{article_data['image']}" alt="{title}" /></div>'''
        
        return f'''<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>{title} - Devontae Reid</title>
    <meta name="description" content="{description}" />
    <link rel="icon" href="/images/logos/logo192.png" />
    <link rel="stylesheet" href="/css/navbar.css" />
    <link rel="stylesheet" href="/css/footer.css" />
    <link rel="stylesheet" href="/css/viewarticle.css" />
    <link rel="stylesheet" href="/css/index.css" />
    <style>
        .highlight {{
            background: #f4f4f4;
            padding: 1rem;
            border-radius: 4px;
            overflow-x: auto;
        }}
        .highlight pre {{
            margin: 0;
        }}
        table {{
            border-collapse: collapse;
            width: 100%;
            margin: 1rem 0;
        }}
        th, td {{
            border: 1px solid #ddd;
            padding: 8px;
            text-align: left;
        }}
        th {{
            background-color: #f2f2f2;
        }}
        blockquote {{
            border-left: 4px solid #3b82f6;
            margin: 1rem 0;
            padding: 0.5rem 1rem;
            background: #f8f9fa;
        }}
    </style>
</head>
<body>
    <!-- Navigation Bar -->
    <nav class="navbar">
        <div class="main-menu">
            <div class="menu-branding">
                <a href="/" class="brand-link">
                    <img src="/images/logos/logo.png" alt="Devontae Reid Logo" class="brand-logo">
                    <h3 class="brand-text">DEVONTAE REID</h3>
                </a>
            </div>
            <ul class="menu-list desktop-only">
                <li class="nav-item"><a href="/" class="nav-link">Home</a></li>
                <li class="nav-item"><a href="/projects" class="nav-link">Projects</a></li>
                <li class="nav-item"><a href="/articles" class="nav-link active">Articles</a></li>
                <li class="nav-item"><a href="/gospel" class="nav-link">Gospel</a></li>
                <li class="nav-item"><a href="/resources" class="nav-link">Resources</a></li>
            </ul>
            <div class="nav-controls">
                <button class="theme-toggle" aria-label="Toggle theme">☀️</button>
                <button class="mobile-menu-toggle mobile-only" aria-label="Toggle menu" aria-expanded="false" type="button">
                    <span class="hamburger">
                        <span class="hamburger-line"></span>
                        <span class="hamburger-line"></span>
                        <span class="hamburger-line"></span>
                    </span>
                </button>
            </div>
        </div>
        <div class="mobile-dropdown">
            <ul class="mobile-menu-list">
                <li class="mobile-nav-item"><a href="/" class="mobile-nav-link">Home</a></li>
                <li class="mobile-nav-item"><a href="/projects" class="mobile-nav-link">Projects</a></li>
                <li class="mobile-nav-item"><a href="/articles" class="mobile-nav-link">Articles</a></li>
                <li class="mobile-nav-item"><a href="/gospel" class="mobile-nav-link">Gospel</a></li>
                <li class="mobile-nav-item"><a href="/resources" class="mobile-nav-link">Resources</a></li>
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
                    <div class="post-content">{content}</div>
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

def preview_html(html_content: str) -> str:
    """Create a temporary HTML file and open it in browser for preview."""
    with tempfile.NamedTemporaryFile(mode='w', suffix='.html', delete=False, encoding='utf-8') as f:
        f.write(html_content)
        temp_path = f.name
    
    # Open in default browser
    webbrowser.open(f'file://{temp_path}')
    return temp_path

def update_database(article_data: Dict[str, Any], db_file: str = 'articles.json'):
    """Update the database with new article data."""
    try:
        # Load existing data
        if os.path.exists(db_file):
            with open(db_file, 'r', encoding='utf-8') as f:
                data = json.load(f)
        else:
            data = []
        
        # Check if article already exists
        existing_index = None
        for i, article in enumerate(data):
            if article.get('id') == article_data['id']:
                existing_index = i
                break
        
        if existing_index is not None:
            # Update existing article
            data[existing_index] = article_data
            print(f"✅ Updated existing article: {article_data['title']}")
        else:
            # Add new article
            data.append(article_data)
            print(f"✅ Added new article: {article_data['title']}")
        
        # Save updated data
        with open(db_file, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=2, ensure_ascii=False)
        
        return True
    except Exception as e:
        print(f"❌ Error updating database: {e}")
        return False

def main():
    parser = argparse.ArgumentParser(description="Convert Markdown to Static HTML")
    parser.add_argument('input_file', help='Input markdown file path')
    parser.add_argument('-o', '--output', help='Output directory for HTML files')
    parser.add_argument('-p', '--preview', action='store_true', help='Preview HTML in browser')
    parser.add_argument('-d', '--database', help='Database file to update (default: articles.json)')
    parser.add_argument('--no-db', action='store_true', help='Skip database update')
    
    args = parser.parse_args()
    
    # Initialize converter
    converter = MarkdownToStaticHTML()
    
    # Generate HTML
    print(f"📄 Processing: {args.input_file}")
    result = converter.generate_html(args.input_file, args.output)
    
    print(f"✅ Generated HTML for: {result['article_data']['title']}")
    print(f"📊 Article ID: {result['article_data']['id']}")
    print(f"📅 Date: {result['article_data']['date']}")
    print(f"🏷️ Tags: {', '.join(result['article_data']['tags'])}")
    
    # Preview if requested
    if args.preview:
        temp_file = preview_html(result['html_content'])
        print(f"🌐 Preview opened in browser: {temp_file}")
        input("Press Enter to continue...")
        # Clean up temp file
        try:
            os.unlink(temp_file)
        except:
            pass
    
    # Update database if not skipped
    if not args.no_db:
        db_file = args.database or 'articles.json'
        if update_database(result['article_data'], db_file):
            print(f"💾 Database updated: {db_file}")
        else:
            print("⚠️ Database update failed")
    
    if args.output:
        print(f"📁 HTML saved to: {result['output_path']}")

if __name__ == '__main__':
    main() 