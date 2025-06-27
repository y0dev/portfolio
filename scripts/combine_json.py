import os
import json
import re
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
            return f'<img src="{img["link"]}" alt="{img["alt"]}" title="{img.get("caption", "")}">'
        return match.group(0)

    # Replace linkPlace
    def link_replacer(match):
        link_id = match.group(1)
        link = next((l for l in links if l["id"] == link_id), None)
        if link:
            return f'<a href="{link["link"]}">{link["text"]}</a>'
        return match.group(0)

    # Replace listPlace
    def list_replacer(match):
        list_id = match.group(1)
        list_block = next((l for l in lists if l["id"] == list_id), None)
        if list_block:
            tag = 'ol' if list_block['list_type'] == 'ordered' else 'ul'
            items = ''.join(f"<li>{item}</li>" for item in list_block['items'])
            return f"<{tag}>{items}</{tag}>"
        return match.group(0)
    
    # Replace :codePlace(ID)
    def code_replacer(match):
        code_id = match.group(1)
        code_entry = next((c for c in codes if c["id"] == code_id), None)
        if code_entry:
            return f'<pre><code>{code_entry["content"]}</code></pre>'
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

        html_paragraphs = [f"<p>{replace_placeholders(p, images, links, lists, codes)}</p>" for p in paragraphs]
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

if __name__ == "__main__":
    input_dir = "/Volumes/Documents/blog_articles/json_outputs"  # directory with input JSON files
    output_path = ARTICLES_PATH

    all_articles = combine_articles(input_dir)

    with open(output_path, "w", encoding="utf-8") as out_file:
        json.dump(all_articles, out_file, indent=2)

    print(f"✅ Combined {len(all_articles)} articles into '{output_path}'")
