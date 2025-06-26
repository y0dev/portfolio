import os
from docx import Document
from markdownify import markdownify as md
import sys

def docx_to_markdown_directory(input_dir, output_folder="output"):
    if not os.path.isdir(input_dir):
        print(f"Directory not found: {input_dir}")
        return

    # Ensure output folder exists
    os.makedirs(output_folder, exist_ok=True)

    # Loop through all .docx files in the directory
    for filename in os.listdir(input_dir):
        if filename.lower().endswith(".docx"):
            input_path = os.path.join(input_dir, filename)

            try:
                # Load the Word document
                document = Document(input_path)

                # Extract all text content from paragraphs
                full_text = [para.text for para in document.paragraphs]

                # Convert to markdown
                raw_text = "\n".join(full_text)
                markdown_text = md(raw_text)

                # Define output path
                base_filename = os.path.splitext(filename)[0]
                output_path = os.path.join(output_folder, base_filename + ".md")

                # Write markdown to file
                with open(output_path, "w", encoding="utf-8") as f:
                    f.write(markdown_text)

                print(f"✅ Markdown file saved to: {output_path}")
            except Exception as e:
                print(f"❌ Failed to convert {filename}: {e}")

if __name__ == "__main__":
    docx_to_markdown_directory(r"F:\Documents\blog_articles")
