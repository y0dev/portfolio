#!/usr/bin/env python3
"""
Test script for the Markdown to Static HTML converter
"""

import os
import sys
from md_to_static_html import MarkdownToStaticHTML, preview_html, update_database

def test_conversion():
    """Test the markdown conversion with a sample file."""
    
    # Test with sample.md
    input_file = 'input_md/sample.md'
    
    if not os.path.exists(input_file):
        print(f"❌ Test file not found: {input_file}")
        return False
    
    print("🧪 Testing Markdown to Static HTML conversion...")
    
    # Initialize converter
    converter = MarkdownToStaticHTML()
    
    # Generate HTML
    result = converter.generate_html(input_file, 'test_output')
    
    print(f"✅ Generated HTML for: {result['article_data']['title']}")
    print(f"📊 Article ID: {result['article_data']['id']}")
    print(f"📅 Date: {result['article_data']['date']}")
    print(f"🏷️ Tags: {', '.join(result['article_data']['tags'])}")
    print(f"📁 HTML saved to: {result['output_path']}")
    
    # Ask if user wants to preview
    preview_choice = input("\n🌐 Would you like to preview the HTML? (y/n): ").lower().strip()
    if preview_choice in ['y', 'yes']:
        temp_file = preview_html(result['html_content'])
        print(f"🌐 Preview opened in browser: {temp_file}")
        input("Press Enter to continue...")
        # Clean up temp file
        try:
            os.unlink(temp_file)
        except:
            pass
    
    # Ask if user wants to update database
    db_choice = input("\n💾 Would you like to update the database? (y/n): ").lower().strip()
    if db_choice in ['y', 'yes']:
        db_file = input("Enter database file path (default: articles.json): ").strip() or 'articles.json'
        if update_database(result['article_data'], db_file):
            print(f"💾 Database updated: {db_file}")
        else:
            print("⚠️ Database update failed")
    
    return True

def list_available_files():
    """List all available markdown files for conversion."""
    input_dir = 'input_md'
    if not os.path.exists(input_dir):
        print(f"❌ Input directory not found: {input_dir}")
        return
    
    md_files = [f for f in os.listdir(input_dir) if f.endswith('.md')]
    
    if not md_files:
        print("❌ No markdown files found in input_md directory")
        return
    
    print("📁 Available markdown files:")
    for i, file in enumerate(md_files, 1):
        print(f"  {i}. {file}")
    
    return md_files

def main():
    """Main test function."""
    print("🚀 Markdown to Static HTML Converter Test")
    print("=" * 50)
    
    # List available files
    md_files = list_available_files()
    if not md_files:
        return
    
    # Run test conversion
    if test_conversion():
        print("\n✅ Test completed successfully!")
    else:
        print("\n❌ Test failed!")

if __name__ == '__main__':
    main() 