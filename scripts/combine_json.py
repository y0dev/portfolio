import os
import json
import re
import sys
from typing import List, Dict, Any


# Paths
ARTICLES_PATH = 'src/assets/json/articles.json'

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
    input_dir = get_input_directory()
    output_path = ARTICLES_PATH
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

    # Ensure output directory exists
    os.makedirs(os.path.dirname(output_path), exist_ok=True)

    with open(output_path, "w", encoding="utf-8") as out_file:
        json.dump(all_articles, out_file, indent=2)

    print(f"✅ Combined {len(all_articles)} articles into '{output_path}'")
