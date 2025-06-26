import os
import re
from datetime import datetime
from docx import Document
from markdownify import markdownify as md
import sys

def format_title(filename):
    base = os.path.splitext(filename)[0]
    title = base.replace('_', ' ').replace('-', ' ')
    return title.title()

def extract_rich_text(paragraph):
    parts = []
    for run in paragraph.runs:
        text = run.text
        if run.bold:
            text = f"**{text}**"
        if run.italic:
            text = f"*{text}*"
        if run.underline:
            text = f"<u>{text}</u>"  # Markdown doesn't support underline natively
        parts.append(text)
    return "".join(parts)


def docx_to_markdown_directory(input_dir, output_folder="output"):
    if not os.path.isdir(input_dir):
        print(f"Directory not found: {input_dir}")
        return

    os.makedirs(output_folder, exist_ok=True)

    for filename in os.listdir(input_dir):
        if filename.lower().endswith(".docx") and not filename.startswith("~"):
            input_path = os.path.join(input_dir, filename)

            try:
                # Load the Word document
                document = Document(input_path)

                # Extract rich text content including formatting
                full_text = []
                for para in document.paragraphs:
                    full_text.append(extract_rich_text(para))

                raw_html_like = "\n".join(full_text)
                markdown_body = md(raw_html_like, heading_style="ATX")  # Use # style for headings

                # Get creation or modified date
                created_timestamp = os.path.getctime(input_path)
                created_date = datetime.fromtimestamp(created_timestamp).strftime("%B %d, %Y")

                # Build markdown header
                title = format_title(filename)
                markdown_header = f"""# Basic Notes template

## Blog/Note Info

- Title: {title}
- Description: Template for taking basic notes
- Date: {created_date}
- Category: Default
- Type: Note

"""

                markdown_content = markdown_header + markdown_body

                # Save to output file
                base_filename = os.path.splitext(filename)[0]
                output_path = os.path.join(output_folder, base_filename + ".md")

                with open(output_path, "w", encoding="utf-8") as f:
                    f.write(markdown_content)

                print(f"✅ Markdown file saved to: {output_path}")

            except Exception as e:
                print(f"❌ Failed to convert {filename}: {e}")

if __name__ == "__main__":
    docx_to_markdown_directory(r"F:\Documents\blog_articles")
