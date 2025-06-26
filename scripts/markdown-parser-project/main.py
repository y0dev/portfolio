"""
Main script for processing markdown files into HTML/Pug templates and managing FTP uploads.
This script provides functionality to create new markdown files and generate HTML/Pug templates
from existing markdown files, with support for blog/note information extraction and FTP deployment.
"""

import os
import argparse
from dotenv import load_dotenv # type: ignore
from markdown_parser.md_parser import MarkdownParser
from markdown_parser.pug_gen import PugTemplateGenerator
from markdown_parser.utils.file_handler import (
    select_markdown_file,
    convert_pug_to_html,
    create_new_markdown,
    update_js_json_data,
    upload_folder_to_ftp,
    upload_file_to_ftp,
    download_file_from_ftp
)
from markdown_parser.utils.info_manager import (
    extract_blog_note_info,
    estimate_reading_time,
    find_bible_references,
    build_js_entry_from_info,
    correct_spelling_interactively
)

def prepare_output_dirs(base_dir, doc_type, title_slug):
    """
    Create and prepare output directories for Pug and HTML files.
    
    Args:
        base_dir (str): Base directory for output files
        doc_type (str): Type of document (e.g., 'blog', 'note')
        title_slug (str): URL-friendly version of the document title
        
    Returns:
        tuple: Paths to the created Pug and HTML directories
    """
    pug_dir = os.path.join(base_dir, 'pug', doc_type, title_slug)
    html_dir = os.path.join(base_dir, 'html', doc_type, title_slug)
    os.makedirs(pug_dir, exist_ok=True)
    os.makedirs(html_dir, exist_ok=True)
    return pug_dir, html_dir

def process_markdown_file(file_path: str):
    """
    Process a markdown file to generate Pug templates and HTML output.
    Also handles FTP uploads of generated content.
    
    Args:
        file_path (str): Path to the markdown file to process
    """
    # Initialize parser and template generator
    parser = MarkdownParser()
    pug_gen = PugTemplateGenerator()
    
    # Load FTP configuration from environment variables
    ftp_host = os.getenv("FTP_HOSTNAME")
    ftp_user = os.getenv("FTP_USERNAME")
    ftp_pass = os.getenv("FTP_PASS")
    ftp_base_path = os.getenv("FTP_BASE_PATH")
    ftp_art_path = os.getenv("FTP_ART_PATH")
    
    # Read and process the markdown file
    with open(file_path, "r", encoding="utf-8") as f:
        md_text = f.read()
    print(f"📄 Loaded file: {file_path}")

    # Extract content and metadata
    extracted_data = parser.extract_all(md_text)
    bible_refs = find_bible_references(md_text)
    ttr = estimate_reading_time(md_text)

    output_base_dir = 'output'
    new_entry = None
    doc_info = None

    # Process each section of the markdown file
    for heading, content in extracted_data["sections"].items():
        if "Blog/Note Info".lower() in heading.lower():
            # Extract and process document metadata
            lists = parser.extract_lists_from_section(content)
            doc_info = extract_blog_note_info(lists["unordered"])
            doc_info["ttr"] = ttr

            # Prepare output directories and generate base Pug structure
            title_slug = doc_info["title"].lower().replace(' ', '-')
            doc_type = doc_info["type"].lower()
            new_entry = build_js_entry_from_info(doc_info)
            pug_dir, html_dir = prepare_output_dirs(output_base_dir, doc_type, title_slug)

            pug_gen.info = pug_gen.generate_pug_base(doc_info)
            if not pug_gen.info:
                exit("❌ Failed to generate base Pug structure.")
        else:
            # Generate Pug template for regular content sections
            pug_gen.info += pug_gen.generate_pug_for_section(
                heading=heading, section_nodes=content, parser=parser
            )

    # Add footer with Bible references
    pug_gen.info += pug_gen.generate_footer(bible_refs)

    # Write Pug template to file
    output_pug_path = os.path.join(pug_dir, 'index.pug')
    with open(output_pug_path, "w") as f:
        f.write(pug_gen.info)
    print(f"✅ Pug file generated: {output_pug_path}")

    # Convert Pug to HTML
    output_html_path = os.path.join(html_dir, 'index.html')
    convert_pug_to_html(output_pug_path, output_html_path)

    # Update JSON data and handle FTP operations
    article_js_path = os.path.join('output',ftp_art_path)
    download_file_from_ftp(ftp_host, ftp_user, ftp_pass,ftp_art_path,article_js_path)
    # update_js_json_data(article_js_path, new_entry, entry_type=doc_info["type"].lower())

    # # Upload generated content to FTP server
    # remote_folder_path = os.path.join(ftp_base_path, doc_info["type"].lower() + 's', os.path.basename(html_dir))
    # upload_folder_to_ftp(ftp_host, ftp_user, ftp_pass, html_dir, remote_folder_path)
    # upload_file_to_ftp(ftp_host, ftp_user, ftp_pass, article_js_path)

def main():
    """
    Main entry point for the script.
    Handles command-line arguments and executes the appropriate functionality.
    """
    parser = argparse.ArgumentParser(description="Markdown Blog Tool")
    parser.add_argument(
        "-c","--create",
        action="store_true",
        help="Create a new Markdown file interactively."
    )
    parser.add_argument(
        "-g","--generate",
        action="store_true",
        help="Generate HTML/Pug from a selected Markdown file."
    )

    args = parser.parse_args()

    if args.create:
        create_new_markdown()
    elif args.generate:
        selected_file = select_markdown_file("input_md")  # Or your preferred folder
        process_markdown_file(selected_file)
    else:
        print("⚠️ Please specify either --create or --generate")
        parser.print_help()

if __name__ == "__main__":
    load_dotenv()  # Loads variables from .env file into environment
    main()
