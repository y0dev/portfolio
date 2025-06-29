import os
import json
import re
import sys
from typing import List, Dict, Any
from datetime import datetime


# Paths
ARTICLES_PATH = 'src/assets/json/articles.json'
NOTES_PATH = 'src/assets/json/notes.json'

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

def replace_placeholders(
    paragraph: str,
    images: List[Dict],
    links: List[Dict],
    lists: List[Dict],
    codes: List[Dict] = [],
) -> str:
    # Replace imagePlace
    def image_replacer(match):
        img_id = match.group(1)
        img = next((img for img in images if img["id"] == img_id), None)
        if img:
            return f'<div class="post-image-container"><a href="{img["link"]}"><img class="post-image" src="{img["link"]}" alt="{img["alt"]}" title="{img.get("caption", "")}"></a><figcaption class="post-image-caption">{img.get("caption", "")}</figcaption></div>'
        return match.group(0)

    # Replace linkPlace
    def link_replacer(match):
        link_id = match.group(1)
        link = next((l for l in links if l["id"] == link_id), None)
        if link:
            return f'<a class="post-link" href="{link["link"]}">{link["text"]}</a>'
        return match.group(0)

    # Replace listPlace
    def list_replacer(match):
        list_id = match.group(1)
        list_block = next((l for l in lists if l["id"] == list_id), None)
        if list_block:
            # Check for both 'list_type' and 'listType' field names
            list_type = list_block.get('list_type') or list_block.get('listType', 'unordered')
            tag = 'ol' if list_type == 'ordered' else 'ul'
            items = ''.join(f'<li class="post-list-item">{item}</li>' for item in list_block['items'])
            return f"<{tag} class=\"post-list\">{items}</{tag}>"
        return match.group(0)
    
    # Replace :codePlace(ID)
    def code_replacer(match):
        code_id = match.group(1)
        code_entry = next((c for c in codes if c["id"] == code_id), None)
        if code_entry:
            language = code_entry.get('language', 'text')
            return f'<pre class="language-{language}"><code class="language-{language}">{code_entry["content"]}</code></pre>'
        return match.group(0)

    # Replace :special-text(...)special-text-end
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
    # Handle different data formats
    if "file-id" in json_data:
        # This is a note format from notes.json
        transformed = {
            "id": json_data["id"],
            "title": json_data["title"],
            "description": json_data.get("description", ""),
            "date": convert_timestamp_to_datetime(json_data["date"]),
            "tags": json_data["tags"],
            "type": json_data.get("file-id", "note"),  # Use file-id as type
            "image": json_data.get("image"),
            "content": [
                {
                    "title": "",
                    "htmlContent": f"<p class='post-details'>{json_data.get('description', '')}</p>"
                }
            ]
        }
    else:
        # This is a full article format with content sections
        transformed = {
            "id": json_data["id"],
            "title": json_data["title"],
            "description": json_data.get("description"),
            "date": convert_timestamp_to_datetime(json_data["date"]),
            "tags": json_data["tags"],
            "type": "article",
            "image": json_data.get("image"),
            "content": []
        }

        for section in json_data.get("content", []):
            title = section.get("title", {}).get("text") if isinstance(section.get("title"), dict) else section.get("title", "")
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
            return []
        
        print(f"✅ Loaded {len(articles)} articles from: {file_path}")
        return articles
    except Exception as e:
        print(f"❌ Failed to load articles from {file_path}: {e}")
        return []

def load_notes_from_file(file_path: str) -> List[Dict[str, Any]]:
    """Load notes from JSON file"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        # Handle both array and object with 'notes' key
        if isinstance(data, list):
            notes = data
        elif isinstance(data, dict) and 'notes' in data:
            notes = data['notes']
        else:
            print("❌ Invalid JSON format. Expected array of notes or object with 'notes' key.")
            return []
        
        print(f"✅ Loaded {len(notes)} notes from: {file_path}")
        return notes
    except Exception as e:
        print(f"❌ Failed to load notes from {file_path}: {e}")
        return []

def combine_articles(directory):
    combined = []
    for filename in os.listdir(directory):
        if filename.endswith(".json"):
            filepath = os.path.join(directory, filename)
            try:
                with open(filepath, "r", encoding="utf-8") as f:
                    data = json.load(f)
                article = process_article(data)
                combined.append(article)
            except Exception as e:
                print(f"❌ Error reading {filename}: {e}")
    return combined

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

if __name__ == "__main__":
    all_articles = []
    
    # First, try to load from articles.json file
    if os.path.exists(ARTICLES_PATH):
        print(f"📁 Loading articles from file: {ARTICLES_PATH}")
        articles_data = load_articles_from_file(ARTICLES_PATH)
        for article in articles_data:
            try:
                processed_article = process_article(article)
                all_articles.append(processed_article)
            except Exception as e:
                print(f"❌ Failed to process article {article.get('id', 'unknown')}: {e}")
    
    # Then, try to load from notes.json file
    if os.path.exists(NOTES_PATH):
        print(f"📁 Loading notes from file: {NOTES_PATH}")
        notes_data = load_notes_from_file(NOTES_PATH)
        for note in notes_data:
            try:
                processed_note = process_article(note)
                all_articles.append(processed_note)
            except Exception as e:
                print(f"❌ Failed to process note {note.get('id', 'unknown')}: {e}")
    
    # Finally, try to load from directory if no files were found
    if not all_articles:
        input_dir = get_input_directory()
        print(f"📁 Input directory: {input_dir}")
        
        # Check if input directory exists
        if not os.path.exists(input_dir):
            print(f"❌ Input directory does not exist: {input_dir}")
            print("\nTo fix this, either:")
            print(f"1. Create the directory: {input_dir}")
            print("2. Set the BLOG_ARTICLES_DIR environment variable")
            print("3. Pass the directory path as a command line argument")
            print("\nExample usage:")
            print("  python scripts/combine_json.py /path/to/your/json/files")
            print("  BLOG_ARTICLES_DIR=/path/to/your/json/files python scripts/combine_json.py")
            sys.exit(1)

        print(f"📁 Reading articles from: {input_dir}")
        all_articles = combine_articles(input_dir)

    if not all_articles:
        print("⚠️ No articles or notes found to process.")
        sys.exit(0)

    # Sort articles by date (newest first)
    all_articles.sort(key=lambda x: x.get('date', ''), reverse=True)

    # Ensure output directory exists
    os.makedirs(os.path.dirname(ARTICLES_PATH), exist_ok=True)

    with open(ARTICLES_PATH, "w", encoding="utf-8") as out_file:
        json.dump(all_articles, out_file, indent=2)

    print(f"✅ Combined {len(all_articles)} articles and notes into '{ARTICLES_PATH}'")
    print(f"📝 Articles: {len([a for a in all_articles if a.get('type') == 'article'])}")
    print(f"📋 Notes: {len([a for a in all_articles if a.get('type') == 'note'])}")
