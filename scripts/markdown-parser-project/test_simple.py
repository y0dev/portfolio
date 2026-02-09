#!/usr/bin/env python3
"""
Simple test script to demonstrate file scanning functionality
"""

import os
import glob

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
    print("🚀 Testing Markdown File Scanner")
    print("=" * 40)
    
    # List available files
    md_files = list_markdown_files()
    
    if not md_files:
        print("❌ No markdown files found in input_md directory")
        return
    
    print(f"📁 Found {len(md_files)} markdown file(s):")
    for i, file in enumerate(md_files, 1):
        filename = os.path.basename(file)
        print(f"  {i}. {filename}")
    
    print(f"\n✅ File scanning works correctly!")
    print(f"📝 To process these files, run: python3 md_to_static_html.py")
    if md_files:
        print(f"📝 To process a specific file: python3 md_to_static_html.py {os.path.basename(md_files[0])}")

if __name__ == '__main__':
    main() 