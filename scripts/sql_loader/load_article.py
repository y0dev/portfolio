#!/usr/bin/env python3
import os
import sys
import json
import re
import mysql.connector
from mysql.connector import errorcode
from typing import List, Dict, Any
from dotenv import load_dotenv
from datetime import datetime

# Load .env if exists for DB credentials
load_dotenv()

# DB config from environment or defaults
DB_CONFIG = {
    'user': os.getenv('DB_USER', 'root'),
    'password': os.getenv('DB_PASSWORD', ''),
    'host': os.getenv('DB_HOST', 'localhost'),
    'database': os.getenv('DB_NAME', 'portfolio_db'),
    'charset': 'utf8mb4',
}

def get_articles_file():
    """Get the articles.json file path"""
    # Check command line arguments first
    if len(sys.argv) > 1:
        return sys.argv[1]
    
    # Check environment variable
    env_path = os.getenv('ARTICLES_JSON_PATH')
    if env_path:
        return env_path
    
    # Default path
    default_path = 'src/assets/json/articles.json'
    
    if os.path.exists(default_path):
        return default_path
    
    print(f"❌ Articles file not found: {default_path}")
    print("   Create a articles.json file or specify the path as an argument")
    sys.exit(1)

def load_articles_from_file(file_path: str) -> List[Dict[str, Any]]:
    """Load articles from JSON file"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        # Handle both array and object with 'articles' key
        if isinstance(data, list):
            articles = data
        elif isinstance(data, dict) and 'articles' in data:
            articles = data['articles']
        else:
            print("❌ Invalid JSON format. Expected array of articles or object with 'articles' key.")
            sys.exit(1)
        
        print(f"✅ Loaded {len(articles)} articles from: {file_path}")
        return articles
    except Exception as e:
        print(f"❌ Failed to load articles from {file_path}: {e}")
        sys.exit(1)

def get_input_directory():
    """Get the input directory from environment variable, command line argument, or use default"""
    # Check command line arguments first
    if len(sys.argv) > 1:
        return sys.argv[1]
    
    # Check environment variable
    env_path = os.getenv('BLOG_ARTICLES_DIR')
    if env_path:
        return env_path
    
    # Default fallback paths for different operating systems
    if os.name == 'nt':  # Windows
        default_paths = [
            os.path.join('F:\\', 'Documents', 'blog_articles', 'json_outputs')
        ]
    else:  # Linux/Mac
        default_paths = [
            os.path.join('/Volumes', 'Documents', 'blog_articles', 'json_outputs')
        ]
    
    # Try to find an existing directory
    for path in default_paths:
        if os.path.exists(path) and os.path.isdir(path):
            return path
    
    # If none exist, return the first default path and let the user create it
    return default_paths[0]


def replace_placeholders(paragraph: str,
                         images: List[Dict],
                         links: List[Dict],
                         lists: List[Dict],
                         codes: List[Dict] = [],
                         ) -> str:
    def image_replacer(match):
        img_id = match.group(1)
        img = next((img for img in images if img["id"] == img_id), None)
        if img:
            return f'<div class="post-image-container"><a href="{img["link"]}"><img class="post-image" src="{img["link"]}" alt="{img["alt"]}" title="{img.get("caption", "")}"></a><figcaption class="post-image-caption">{img.get("caption", "")}</figcaption></div>'
        return match.group(0)

    def link_replacer(match):
        link_id = match.group(1)
        link = next((l for l in links if l["id"] == link_id), None)
        if link:
            return f'<a class="post-link" href="{link["link"]}">{link["text"]}</a>'
        return match.group(0)

    def list_replacer(match):
        list_id = match.group(1)
        list_block = next((l for l in lists if l["id"] == list_id), None)
        if list_block:
            list_type = list_block.get('list_type') or list_block.get('listType', 'unordered')
            tag = 'ol' if list_type == 'ordered' else 'ul'
            items = ''.join(f'<li class="post-list-item">{item}</li>' for item in list_block['items'])
            return f"<{tag} class=\"post-list\">{items}</{tag}>"
        return match.group(0)

    def code_replacer(match):
        code_id = match.group(1)
        code_entry = next((c for c in codes if c["id"] == code_id), None)
        if code_entry:
            language = code_entry.get('language', 'text')
            return f'<pre class="language-{language}"><code class="language-{language}">{code_entry["content"]}</code></pre>'
        return match.group(0)

    def special_text_replacer(match):
        raw = match.group(1)
        parts = dict(part.split("=", 1) for part in raw.split(",") if "=" in part)
        text = list(parts.values())[-1]
        styles = {
            "bold": "strong",
            "italic": "em",
            "underline": "u"
        }
        tags = [styles.get(k.strip(), None) for k in parts.keys()]
        html = text
        for tag in reversed(tags):
            if tag:
                html = f"<{tag}>{html}</{tag}>"
        return html

    paragraph = re.sub(r":imagePlace\((\d+)\)", image_replacer, paragraph)
    paragraph = re.sub(r":linkPlace\((\d+)\)", link_replacer, paragraph)
    paragraph = re.sub(r":listPlace\((\d+)\)", list_replacer, paragraph)
    paragraph = re.sub(r":codePlace\((\d+)\)", code_replacer, paragraph)
    paragraph = re.sub(r":special-text\((.*?)\)special-text-end", special_text_replacer, paragraph)

    return paragraph


def convert_timestamp_to_datetime(timestamp_value):
    """
    Convert timestamp value to MySQL datetime format.
    Handles various timestamp formats:
    - Unix timestamp in milliseconds (e.g., 1749848487000)
    - Unix timestamp in seconds (e.g., 1749848487)
    - ISO datetime string (e.g., "2025-06-11 22:01:27")
    - Already formatted datetime string
    """
    if timestamp_value is None:
        return None
    
    try:
        # If it's already a string that looks like a datetime, return as is
        if isinstance(timestamp_value, str):
            # Check if it's already in datetime format
            if re.match(r'\d{4}-\d{2}-\d{2}', timestamp_value):
                return timestamp_value
            # Try to parse as ISO format
            try:
                dt = datetime.fromisoformat(timestamp_value.replace('Z', '+00:00'))
                return dt.strftime('%Y-%m-%d %H:%M:%S')
            except ValueError:
                pass
        
        # Convert to integer if it's a string number
        if isinstance(timestamp_value, str) and timestamp_value.isdigit():
            timestamp_value = int(timestamp_value)
        
        # Handle Unix timestamp (milliseconds or seconds)
        if isinstance(timestamp_value, (int, float)):
            # If timestamp is in seconds (10 digits), convert to milliseconds
            if timestamp_value < 10000000000:  # Less than year 2286 in seconds
                timestamp_value = timestamp_value * 1000
            
            dt = datetime.fromtimestamp(timestamp_value / 1000)
            return dt.strftime('%Y-%m-%d %H:%M:%S')
        
        # If it's already a datetime object
        if isinstance(timestamp_value, datetime):
            return timestamp_value.strftime('%Y-%m-%d %H:%M:%S')
        
        return None
    except Exception as e:
        print(f"⚠️ Warning: Could not convert timestamp {timestamp_value}: {e}")
        return None


def process_article(json_data: Dict[str, Any]) -> Dict[str, Any]:
    """Process article or note data into a unified format for database storage"""
    # Handle different data formats
    if "file-id" in json_data:
        # This is a note format from notes.json
        transformed = {
            "id": json_data["id"],
            "title": json_data["title"],
            "description": json_data.get("description", ""),
            "date": convert_timestamp_to_datetime(json_data["date"]),
            "tags": json_data["tags"],
            "type": "note",  # Notes are always type "note"
            "image": json_data.get("image"),
            "content": []
        }
        
        # Process note content sections
        for section in json_data.get("content", []):
            title = section.get("title", {})
            if isinstance(title, dict):
                title_text = title.get("text", "")
            else:
                title_text = str(title) if title else ""
            
            print(f"  📝 Processing section: {title_text}")
            
            # Build HTML content from all elements in the section
            html_parts = []
            
            # Process paragraphs
            paragraphs = section.get("paragraphs", [])
            print(f"    📄 Found {len(paragraphs)} paragraphs")
            for paragraph in paragraphs:
                if paragraph.strip():
                    # Replace placeholders in paragraph
                    processed_paragraph = replace_placeholders(
                        paragraph, 
                        section.get("images", []),
                        section.get("links", []),
                        section.get("lists", []),
                        section.get("code", []) if "code" in section else section.get("codes", [])
                    )
                    html_parts.append(f'<p class="post-details">{processed_paragraph}</p>')
            
            # Process lists (they might also be referenced in paragraphs)
            lists = section.get("lists", [])
            print(f"    📋 Found {len(lists)} lists")
            for list_item in lists:
                list_type = list_item.get('list_type') or list_item.get('listType', 'unordered')
                tag = 'ol' if list_type == 'ordered' else 'ul'
                items = ''.join(f'<li class="post-list-item">{item}</li>' for item in list_item.get('items', []))
                html_parts.append(f"<{tag} class=\"post-list\">{items}</{tag}>")
            
            # Process code blocks
            codes = section.get("code", []) if "code" in section else section.get("codes", [])
            print(f"    💻 Found {len(codes)} code blocks")
            for code_item in codes:
                language = code_item.get('language', 'text')
                content = code_item.get('content', '')
                html_parts.append(f'<pre class="language-{language}"><code class="language-{language}">{content}</code></pre>')
            
            # Process images (standalone images not in paragraphs)
            images = section.get("images", [])
            print(f"    🖼️ Found {len(images)} images")
            for img in images:
                if img.get("link") and img.get("alt"):
                    caption = img.get("caption", "")
                    html_parts.append(f'<div class="post-image-container"><a href="{img["link"]}"><img class="post-image" src="{img["link"]}" alt="{img["alt"]}" title="{caption}"></a><figcaption class="post-image-caption">{caption}</figcaption></div>')
            
            # Combine all HTML parts
            htmlContent = "\n".join(html_parts)
            print(f"    📊 Generated {len(html_parts)} HTML parts")
            
            transformed["content"].append({
                "title": title_text,
                "htmlContent": htmlContent
            })
            
    else:
        # This is a full article format with content sections
        transformed = {
            "id": json_data["id"],
            "title": json_data["title"],
            "description": json_data.get("description"),
            "date": convert_timestamp_to_datetime(json_data["date"]),
            "tags": json_data["tags"],
            "type": json_data.get("type", "article"),  # Default to "article" if not specified
            "image": json_data.get("image"),
            "content": []
        }

        # Process article content sections
        for section in json_data.get("content", []):
            title = section.get("title", {})
            if isinstance(title, dict):
                title_text = title.get("text", "")
            else:
                title_text = str(title) if title else ""
            
            # For articles, content might be directly in htmlContent
            if "htmlContent" in section:
                transformed["content"].append({
                    "title": title_text,
                    "htmlContent": section["htmlContent"]
                })
            else:
                # Process paragraphs like notes
                paragraphs = section.get("paragraphs", [])
                images = section.get("images", [])
                links = section.get("links", [])
                lists = section.get("lists", [])
                codes = section.get("code", []) if "code" in section else section.get("codes", [])

                html_paragraphs = [f'<p class="post-details">{replace_placeholders(p, images, links, lists, codes)}</p>' for p in paragraphs]
                htmlContent = "\n".join(html_paragraphs)

                transformed["content"].append({
                    "title": title_text,
                    "htmlContent": htmlContent
                })

    return transformed


def load_articles_from_dir(directory: str) -> List[Dict[str, Any]]:
    articles = []
    for filename in os.listdir(directory):
        if filename.endswith(".json"):
            path = os.path.join(directory, filename)
            try:
                with open(path, 'r', encoding='utf-8') as f:
                    data = json.load(f)
                article = process_article(data)
                articles.append(article)
            except Exception as e:
                print(f"❌ Failed to load {filename}: {e}")
    return articles


def create_articles_table(cursor):
    create_table_query = """
        CREATE TABLE IF NOT EXISTS articles (
            id INT AUTO_INCREMENT PRIMARY KEY,
            title VARCHAR(255) NOT NULL,
            slug VARCHAR(255) NOT NULL UNIQUE,
            description TEXT,
            content LONGTEXT,
            date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
            tags JSON,
            type ENUM('article', 'note') DEFAULT 'article',
            status ENUM('draft', 'published') DEFAULT 'draft',
            image JSON,
            like_count INT DEFAULT 0,
            share_count INT DEFAULT 0,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            INDEX idx_date (date),
            INDEX idx_type (type),
            INDEX idx_status (status),
            INDEX idx_slug (slug)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    """
    cursor.execute(create_table_query)


def save_article(cursor, article):
    """Save a single article to the database with enhanced error handling"""
    try:
        # Validate required fields
        if not article.get('title'):
            print(f"⚠️ Warning: Article missing title, skipping...")
            return False
            
        if not article.get('id'):
            print(f"⚠️ Warning: Article '{article.get('title', '')}' missing ID, skipping...")
            return False

        insert_sql = """
        INSERT INTO articles
        (title, slug, description, content, date, tags, type, status, image, like_count, share_count)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
        ON DUPLICATE KEY UPDATE
            title = VALUES(title),
            description = VALUES(description),
            content = VALUES(content),
            date = VALUES(date),
            tags = VALUES(tags),
            type = VALUES(type),
            status = VALUES(status),
            image = VALUES(image),
            updated_at = CURRENT_TIMESTAMP
        """

        slug = article.get('id')  # Use 'id' field as slug for both articles and notes
        if not slug:
            slug = article['title'].lower().replace(' ', '-').replace(':', '').replace('?', '')

        # Combine all content sections
        content_sections = []
        for section in article.get('content', []):
            if section.get('title'):
                content_sections.append(f"<h2>{section['title']}</h2>")
            if section.get('htmlContent'):
                content_sections.append(section['htmlContent'])
        
        full_content = "\n".join(content_sections) if content_sections else article.get('description', '')
        
        # If no content was generated, use description as fallback
        if not full_content.strip():
            full_content = article.get('description', 'No content available')
        
        description = article.get('description', '')
        tags_json = json.dumps(article.get('tags', []), ensure_ascii=False)
        image_json = json.dumps(article.get('image', {}), ensure_ascii=False)
        like_count = 0
        share_count = 0
        
        # Ensure date is properly converted
        article_date = convert_timestamp_to_datetime(article.get('date'))
        if not article_date:
            print(f"⚠️ Warning: Invalid date for article '{article.get('title', '')}'. Using current timestamp.")
            article_date = datetime.now().strftime('%Y-%m-%d %H:%M:%S')

        data = (
            article.get('title', ''),
            slug,
            description,
            full_content,
            article_date,
            tags_json,
            article.get('type', 'article'),
            article.get('status', 'published'),
            image_json,
            like_count,
            share_count
        )

        cursor.execute(insert_sql, data)
        print(f"✅ Saved {article.get('type', 'article')} '{article.get('title', '')}' with slug '{slug}' (date: {article_date})")
        return True
        
    except mysql.connector.Error as e:
        print(f"❌ DB error saving {article.get('type', 'article')} '{article.get('title', '')}': {e}")
        return False
    except Exception as e:
        print(f"❌ Unexpected error saving {article.get('type', 'article')} '{article.get('title', '')}': {e}")
        return False


def print_summary(articles):
    """Print summary statistics about the loaded articles and notes"""
    if not articles:
        print("📊 No articles or notes to process.")
        return
    
    article_count = sum(1 for art in articles if art.get('type') == 'article')
    note_count = sum(1 for art in articles if art.get('type') == 'note')
    
    print(f"\n📊 Summary:")
    print(f"   Total items: {len(articles)}")
    print(f"   Articles: {article_count}")
    print(f"   Notes: {note_count}")
    
    # Show some examples
    print(f"\n📝 Sample items:")
    for i, art in enumerate(articles[:3]):  # Show first 3 items
        print(f"   {i+1}. {art.get('type', 'unknown')}: '{art.get('title', 'No title')}' (ID: {art.get('id', 'No ID')})")
    
    if len(articles) > 3:
        print(f"   ... and {len(articles) - 3} more items")


def main():
    articles = []
    
    # Load articles from articles.json
    ARTICLES_FILE = get_articles_file()
    if os.path.exists(ARTICLES_FILE):
        print(f"📁 Loading articles from file: {ARTICLES_FILE}")
        articles_from_file = load_articles_from_file(ARTICLES_FILE)
        articles.extend(articles_from_file)
        print(f"✅ Loaded {len(articles_from_file)} articles from articles.json")
    else:
        print(f"⚠️ Articles file not found: {ARTICLES_FILE}")
    
    # Load notes from notes.json
    NOTES_FILE = 'src/assets/json/notes.json'
    if os.path.exists(NOTES_FILE):
        print(f"📁 Loading notes from file: {NOTES_FILE}")
        try:
            with open(NOTES_FILE, 'r', encoding='utf-8') as f:
                notes_data = json.load(f)
            
            # Process each note
            processed_notes = []
            for note in notes_data:
                try:
                    print(f"📝 Processing note: {note.get('title', 'Unknown')} (ID: {note.get('id', 'Unknown')})")
                    processed_note = process_article(note)
                    processed_notes.append(processed_note)
                    print(f"✅ Successfully processed note: {note.get('title', 'Unknown')}")
                except Exception as e:
                    print(f"❌ Failed to process note {note.get('id', 'unknown')}: {e}")
            
            articles.extend(processed_notes)
            print(f"✅ Loaded {len(processed_notes)} notes from notes.json")
        except Exception as e:
            print(f"❌ Failed to load notes from {NOTES_FILE}: {e}")
    else:
        print(f"⚠️ Notes file not found: {NOTES_FILE}")
    
    # If no files were found, try to load from directory
    if not articles:
        ARTICLES_DIR = get_input_directory()
        print(f"📁 Loading articles from directory: {ARTICLES_DIR}")

        if os.path.exists(ARTICLES_DIR) and os.path.isdir(ARTICLES_DIR):
            articles_from_dir = load_articles_from_dir(ARTICLES_DIR)
            articles.extend(articles_from_dir)
            print(f"✅ Loaded {len(articles_from_dir)} articles from directory")
        else:
            print(f"❌ Articles directory does not exist: {ARTICLES_DIR}")

    if not articles:
        print("⚠️ No articles or notes found to process.")
        sys.exit(0)

    print(f"📊 Total articles and notes to process: {len(articles)}")
    print_summary(articles)

    # Connect to DB
    try:
        conn = mysql.connector.connect(**DB_CONFIG)
        cursor = conn.cursor()
        print("✅ Connected to database.")
    except mysql.connector.Error as err:
        print(f"❌ Database connection error: {err}")
        sys.exit(1)

    # Create articles table if missing
    create_articles_table(cursor)

    # Save articles
    saved_count = 0
    for art in articles:
        try:
            if save_article(cursor, art):
                saved_count += 1
        except Exception as e:
            print(f"❌ Failed to save article '{art.get('title', 'unknown')}': {e}")

    conn.commit()
    cursor.close()
    conn.close()
    print(f"🎉 Completed saving {saved_count} articles and notes to the database.")


if __name__ == "__main__":
    main()
