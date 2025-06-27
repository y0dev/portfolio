#!/usr/bin/env python3
import os
import sys
import json
import re
import mysql.connector
from mysql.connector import errorcode
from typing import List, Dict, Any
from dotenv import load_dotenv

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


def process_article(json_data: Dict[str, Any]) -> Dict[str, Any]:
    transformed = {
        "id": json_data["id"],
        "title": json_data["title"],
        "description": json_data.get("description"),
        "date": json_data["date"],
        "tags": json_data["tags"],
        "type": "article",
        "image": json_data.get("image"),
        "content": []
    }

    for section in json_data["content"]:
        title = section.get("title", {}).get("text")
        paragraphs = section.get("paragraphs", [])
        images = section.get("images", [])
        links = section.get("links", [])
        lists = section.get("lists", [])
        codes = section.get("code", []) if "code" in section else section.get("codes", [])

        html_paragraphs = [f'<p class="post-details">{replace_placeholders(p, images, links, lists, codes)}</p>' for p in paragraphs]
        htmlContent = "\n".join(html_paragraphs)

        transformed["content"].append({
            "title": title,
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
            category VARCHAR(100),
            description TEXT,
            content LONGTEXT,
            body TEXT NOT NULL,
            date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
            tags JSON,
            type ENUM('article', 'note') DEFAULT 'article',
            image JSON,
            author_id INT DEFAULT 1,
            like_count INT DEFAULT 0,
            share_count INT DEFAULT 0,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            INDEX idx_date (date),
            INDEX idx_type (type),
            INDEX idx_slug (slug)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    """
    cursor.execute(create_table_query)


def save_article(cursor, article):
    insert_sql = """
    INSERT INTO articles
    (title, slug, category, description, content, body, date, tags, type, image, author_id, like_count, share_count)
    VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
    ON DUPLICATE KEY UPDATE
        title = VALUES(title),
        category = VALUES(category),
        description = VALUES(description),
        content = VALUES(content),
        body = VALUES(body),
        date = VALUES(date),
        tags = VALUES(tags),
        type = VALUES(type),
        image = VALUES(image),
        updated_at = CURRENT_TIMESTAMP
    """

    slug = article.get('slug')
    if not slug and article.get('title'):
        slug = article['title'].lower().replace(' ', '-')

    full_content = "\n".join(section['htmlContent'] for section in article.get('content', []))
    body_text = f"{article.get('title', '')}\n\n{article.get('description', '')}"
    category = article.get('category') or ''
    tags_json = json.dumps(article.get('tags', []), ensure_ascii=False)
    image_json = json.dumps(article.get('image', {}), ensure_ascii=False)
    author_id = 1
    like_count = 0
    share_count = 0

    data = (
        article.get('title', ''),
        slug,
        category,
        article.get('description', ''),
        full_content,
        body_text,
        article.get('date', None),
        tags_json,
        article.get('type', 'article'),
        image_json,
        author_id,
        like_count,
        share_count
    )

    try:
        cursor.execute(insert_sql, data)
        print(f"✅ Saved article '{article.get('title', '')}' with slug '{slug}'")
    except mysql.connector.Error as e:
        print(f"❌ DB error saving article '{article.get('title', '')}': {e}")


def main():
    # Articles directory to load JSON files from
    ARTICLES_DIR = get_input_directory()
    print(f"📁 Loading articles from directory: {ARTICLES_DIR}")

    if not os.path.exists(ARTICLES_DIR) or not os.path.isdir(ARTICLES_DIR):
        print(f"❌ Articles directory does not exist: {ARTICLES_DIR}")
        sys.exit(1)

    articles = load_articles_from_dir(ARTICLES_DIR)

    if not articles:
        print("⚠️ No articles found to process.")
        sys.exit(0)

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
    for art in articles:
        save_article(cursor, art)

    conn.commit()
    cursor.close()
    conn.close()
    print(f"🎉 Completed saving {len(articles)} articles to the database.")


if __name__ == "__main__":
    main()
