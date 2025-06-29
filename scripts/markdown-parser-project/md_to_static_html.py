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
import glob
from dotenv import load_dotenv
import mysql.connector
from mysql.connector import Error

# Import category mapper functions
def get_category_tags() -> dict:
    category_tags = {
        "theology": ["Theology", "God", "Gospel", "Reformed"],
        "covenant": ["Christ", "Covenant", "Reformed", "Gospel"],
        "thankful": ["Christ", "Salvation", "Love", "Thankful"],
        "health": ["Health", "Fitness"],
        "tech": ["Technology", "Engineer"],
        "technology": ["Technology", "Engineer"],
        "embedded": ["Technology", "Embedded", "Engineer"],
        "quantum": ["Technology", "Quantum"],
        "algo": ["Data Structures", "Algorithms", "Tech Interview"],
        "algorithm": ["Data Structures", "Algorithms", "Tech Interview"],
        "system design": ["System Design", "Technology", "Tech Interview"],
        "security": ["Cybersecurity", "Encryption", "Network Security"],
        "cloud": ["Cloud Computing", "AWS", "Azure", "GCP"],
        "ai": ["Artificial Intelligence", "Machine Learning", "Deep Learning"],
        "risc-v": ["RISC-V", "Embedded Systems", "Microcontrollers"],
        "linux": ["Linux", "Operating Systems", "Kernel Development"],
        "docker": ["Docker", "Containers", "DevOps"],
        "kubernetes": ["Kubernetes", "Container Orchestration", "DevOps"],
        "networking": ["Networking", "TCP/IP", "Protocols"],
        "database": ["Database", "SQL", "NoSQL"],
        "system programming": ["Low-Level Programming", "Assembly", "Embedded"],
        "web development": ["HTML", "CSS", "JavaScript", "ReactJS", "NodeJS"],
        "cryptography": ["Cryptography", "Randomness Testing", "Security", "Encryption"],
        "default": ["Template", "Info", "Beginner"],
    }
    return category_tags

def get_tags_for_category(category: str) -> list:
    category = category.lower()
    category_tags = get_category_tags()
    return category_tags.get(category, category_tags["default"])

def get_image_info_for_category(category: str) -> dict:
    """
    Returns a dict with 'alt' and 'name' keys for the image.
    """
    category = category.lower()

    image_mappings = {
        ("theology", "covenant"): {"alt": "bible-icon", "name": "/images/icons/bible-icon.png"},
        ("thankful",): {"alt": "thankful-icon", "name": "/images/icons/thankful.png"},
        ("family",): {"alt": "family-image", "name": "/images/icons/family.png"},
        ("health",): {"alt": "health-img", "name": "/images/icons/heart_strength.png"},
        ("tech", "technology", "code", "system design"): {"alt": "web-dev-img", "name": "/images/icons/web-dev.png"},
        ("algo", "algorithm"): {"alt": "algo-img", "name": "/images/icons/algorithm.png"},
        ("embedded",): {"alt": "binary-code-img", "name": "/images/icons/binary-code.png"},
        ("quantum",): {"alt": "physics-img", "name": "/images/icons/physics-icon.png"},
        ("docker",): {"alt": "docker-image", "name": "/images/icons/docker.png"},
        ("jenkins",): {"alt": "jenkins-image", "name": "/images/icons/jenkins.png"},
        ("cryptography",): {"alt": "crypto-img", "name": "/images/icons/crypto.png"},
    }

    for categories, image_info in image_mappings.items():
        if category in categories:
            return image_info

    # Default
    return {"alt": "image-title", "name": "images/image.png"}

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
    
    def convert_timestamp(self, date_str: str) -> str:
        """Convert date string to MySQL datetime format."""
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
                    return dt.strftime('%Y-%m-%d %H:%M:%S')  # MySQL datetime format
                except ValueError:
                    continue
            
            # If no format works, use current datetime
            return datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        except:
            return datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    
    def generate_html(self, md_file_path: str, output_dir: str = None) -> Dict[str, Any]:
        """Generate static HTML from markdown file."""
        with open(md_file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Extract metadata and content
        metadata = self.extract_metadata(content)
        content_sections = self.extract_content(content)
        
        # Convert markdown to HTML
        html_content = self.md.convert(content_sections)
        
        # Generate unique ID from filename and title
        file_id = Path(md_file_path).stem.lower().replace(' ', '-').replace('_', '-')
        title_id = metadata['title'].lower().replace(' ', '-').replace('_', '-').replace('.', '').replace(',', '')
        
        # Use title-based ID if available, otherwise use filename
        if title_id and title_id != 'untitled':
            article_id = title_id
        else:
            article_id = file_id
        
        # Ensure ID is not empty and add timestamp if needed for uniqueness
        if not article_id or article_id == 'untitled':
            article_id = f"article-{int(datetime.now().timestamp())}"
        
        # Convert date to timestamp
        timestamp = self.convert_timestamp(metadata['date'])
        
        # Generate tags and image based on category
        category = metadata['category'].lower()
        auto_tags = get_tags_for_category(category)
        auto_image = get_image_info_for_category(category)
        
        # Combine auto-generated tags with manually specified tags
        all_tags = list(set(auto_tags + metadata['tags']))
        
        # Use auto-generated image if no image is specified in metadata
        final_image = metadata['image'] or auto_image
        
        # Create article data structure
        article_data = {
            'id': article_id,
            'title': metadata['title'],
            'description': metadata['description'],
            'date': timestamp,
            'category': metadata['category'],
            'type': metadata['type'].lower(),
            'tags': all_tags,
            'image': final_image,
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
            # Create folder structure: output_dir/type/slug/index.html
            article_type = article_data['type'].lower()
            type_folder = os.path.join(output_dir, article_type)
            article_folder = os.path.join(type_folder, article_id)
            os.makedirs(article_folder, exist_ok=True)
            output_path = os.path.join(article_folder, 'index.html')
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
        
        # Handle date formatting - now it's already a datetime string
        if isinstance(article_data['date'], str):
            # Parse the datetime string and format it for display
            try:
                dt = datetime.strptime(article_data['date'], '%Y-%m-%d %H:%M:%S')
                date = dt.strftime('%A, %B %d, %Y')
            except ValueError:
                # Fallback if parsing fails
                date = article_data['date']
        else:
            # Fallback for any other format
            date = str(article_data['date'])
        
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

def get_sql_connection():
    """Get SQL database connection from environment variables."""
    try:
        connection = mysql.connector.connect(
            host=os.getenv('DB_HOST', 'localhost'),
            database=os.getenv('DB_NAME', 'portfolio'),
            user=os.getenv('DB_USER', 'root'),
            password=os.getenv('DB_PASSWORD', ''),
            port=int(os.getenv('DB_PORT', 3306))
        )
        return connection
    except Error as e:
        print(f"❌ Error connecting to database: {e}")
        return None

def check_existing_article_id(article_id: str) -> str:
    """Check if article ID exists and suggest an alternative if needed."""
    connection = get_sql_connection()
    if not connection:
        return article_id
    
    try:
        cursor = connection.cursor()
        check_query = "SELECT slug FROM articles WHERE slug = %s"
        cursor.execute(check_query, (article_id,))
        existing_article = cursor.fetchone()
        
        if existing_article:
            # Generate alternative ID with timestamp
            timestamp = int(datetime.now().timestamp())
            alternative_id = f"{article_id}-{timestamp}"
            print(f"⚠️ Article slug '{article_id}' already exists")
            print(f"💡 Using alternative slug: {alternative_id}")
            return alternative_id
        
        return article_id
        
    except Error as e:
        print(f"⚠️ Could not check for existing slug: {e}")
        return article_id
    finally:
        if connection.is_connected():
            cursor.close()
            connection.close()

def update_sql_database(article_data: Dict[str, Any]):
    """Update SQL database with new article data."""
    connection = get_sql_connection()
    if not connection:
        return False
    
    try:
        cursor = connection.cursor()
        
        # Validate article slug
        if not article_data['id'] or article_data['id'].strip() == '':
            print(f"❌ Error: Article slug cannot be empty")
            return False
        
        # Check if article already exists by slug
        check_query = "SELECT id FROM articles WHERE slug = %s"
        cursor.execute(check_query, (article_data['id'],))
        existing_article = cursor.fetchone()
        
        # Prepare data for database
        content_html = article_data['content'][0]['htmlContent'] if article_data['content'] else ''
        tags_json = json.dumps(article_data['tags'])
        image_json = json.dumps(article_data['image'])
        like_count = 0
        share_count = 0
        
        if existing_article:
            # Update existing article
            update_query = """
                UPDATE articles 
                SET title = %s, slug = %s, description = %s, content = %s, date = %s, 
                    type = %s, tags = %s, image = %s, like_count = %s, share_count = %s, updated_at = NOW()
                WHERE slug = %s
            """
            cursor.execute(update_query, (
                article_data['title'],
                article_data['id'],  # slug
                article_data['description'],
                content_html,
                article_data['date'],  # Now in datetime format
                article_data['type'],
                tags_json,
                image_json,
                like_count,
                share_count,
                article_data['id']  # where clause
            ))
            print(f"✅ Updated existing article in database: {article_data['title']} (slug: {article_data['id']})")
        else:
            # Insert new article (id will be auto-generated)
            insert_query = """
                INSERT INTO articles (title, slug, description, content, date, type, tags, image, like_count, share_count, created_at, updated_at)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, NOW(), NOW())
            """
            cursor.execute(insert_query, (
                article_data['title'],
                article_data['id'],  # slug
                article_data['description'],
                content_html,
                article_data['date'],  # Now in datetime format
                article_data['type'],
                tags_json,
                image_json,
                like_count,
                share_count
            ))
            print(f"✅ Added new article to database: {article_data['title']} (slug: {article_data['id']})")
        
        connection.commit()
        return True
        
    except Error as e:
        print(f"❌ Database error: {e}")
        if e.errno == 1062:  # Duplicate entry error
            print(f"💡 This article slug already exists: {article_data['id']}")
            print(f"💡 Try using a different title or filename to generate a unique slug")
        elif e.errno == 1366:  # Incorrect integer value
            print(f"💡 Check that the date field contains a valid timestamp")
        elif e.errno == 1146:  # Table doesn't exist
            print(f"💡 Make sure the 'articles' table exists in your database")
        return False
    finally:
        if connection.is_connected():
            cursor.close()
            connection.close()

def list_markdown_files(input_dir: str = None) -> list:
    """List all markdown files in the input directory."""
    # Get the directory where this script is located
    script_dir = os.path.dirname(os.path.abspath(__file__))
    
    # Default to input_md in the same directory as the script
    if input_dir is None:
        input_dir = os.path.join(script_dir, 'input_md')
    
    if not os.path.exists(input_dir):
        print(f"❌ Input directory not found: {input_dir}")
        return []
    
    md_files = glob.glob(os.path.join(input_dir, '*.md'))
    return md_files

def main():
    # Load environment variables
    load_dotenv()
    
    # Get the directory where this script is located
    script_dir = os.path.dirname(os.path.abspath(__file__))
    default_output = os.path.join(script_dir, 'output')
    
    parser = argparse.ArgumentParser(description="Convert Markdown to Static HTML")
    parser.add_argument('input_file', nargs='?', help='Input markdown file path (optional - will scan input_md folder if not provided)')
    parser.add_argument('-o', '--output', default=default_output, help=f'Output directory for HTML files (default: {default_output})')
    parser.add_argument('-p', '--preview', action='store_true', default=True, help='Preview HTML in browser (default: True)')
    parser.add_argument('--no-preview', action='store_true', help='Disable preview')
    parser.add_argument('--no-db', action='store_true', help='Skip database update')
    
    args = parser.parse_args()
    
    # Override preview if --no-preview is specified
    if args.no_preview:
        args.preview = False
    
    # Initialize converter
    converter = MarkdownToStaticHTML()
    
    # Get input files
    if args.input_file:
        # Single file specified - make it absolute if it's relative
        if not os.path.isabs(args.input_file):
            args.input_file = os.path.join(script_dir, args.input_file)
        input_files = [args.input_file]
    else:
        # Scan input_md folder
        input_files = list_markdown_files()
        if not input_files:
            print("❌ No markdown files found in input_md directory")
            return
    
    print(f"📁 Found {len(input_files)} markdown file(s)")
    
    # Process each file
    for md_file in input_files:
        print(f"\n📄 Processing: {md_file}")
        
        # Generate HTML
        result = converter.generate_html(md_file, args.output)
        
        # Check for existing article ID if database update is enabled
        if not args.no_db:
            original_slug = result['article_data']['id']
            checked_slug = check_existing_article_id(original_slug)
            if checked_slug != original_slug:
                result['article_data']['id'] = checked_slug
                # Update output path if it was already created
                if result['output_path']:
                    # Rename the folder from original_slug to checked_slug within the type subdirectory
                    article_type = result['article_data']['type'].lower()
                    type_folder = os.path.join(args.output, article_type)
                    original_folder = os.path.join(type_folder, original_slug)
                    new_folder = os.path.join(type_folder, checked_slug)
                    if os.path.exists(original_folder):
                        os.rename(original_folder, new_folder)
                    result['output_path'] = os.path.join(new_folder, 'index.html')
        
        print(f"✅ Generated HTML for: {result['article_data']['title']}")
        print(f"📊 Article Slug: {result['article_data']['id']}")
        print(f"📅 Date: {result['article_data']['date']}")
        print(f"🏷️ Tags: {', '.join(result['article_data']['tags'])}")
        
        if result['output_path']:
            print(f"📁 HTML saved to: {result['output_path']}")
        
        # Preview if enabled
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
            if update_sql_database(result['article_data']):
                print(f"💾 Database updated successfully")
            else:
                print("⚠️ Database update failed")

if __name__ == '__main__':
    main() 