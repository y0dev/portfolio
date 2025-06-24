
import os
from markdown_parser.md_parser import MarkdownParser
from markdown_parser.pug_gen import PugTemplateGenerator
from markdown_parser.utils.info_manager import *

parser = MarkdownParser()
pug_gen = PugTemplateGenerator()

# Read markdown text
with open("examples/sample.md", "r") as f:
    md_text = f.read()

# Extract all components
extracted_data = parser.extract_all(md_text)

bible_refs = find_bible_references(md_text)
ttr = estimate_reading_time(md_text)


# Print extracted info to console
print("Sections:")
for heading, content in extracted_data["sections"].items():
    print(f"## {heading} ##\n")
    # print(f"{content}\n")
    
    if "Blog/Note Info".lower() in heading.lower():
        lists = parser.extract_lists_from_section(content)
        lists_info = lists["unordered"][-1]
        doc_info = extract_blog_note_info(lists["unordered"])
        doc_info["ttr"] = ttr
        info = pug_gen.generate_pug_base(doc_info)
        if not info:
            exit(1)
        pug_gen.info = info
        # Add document info to info section of pug file using pug generator
    else:
        pug_gen.info += pug_gen.generate_pug_for_section(heading=heading, section_nodes=content, parser=parser)


pug_gen.info += pug_gen.generate_footer(bible_refs)
# print(pug_gen.info)


os.makedirs('output', exist_ok=True)

# Save to file
with open("output/output.pug", "w") as f:
    f.write(pug_gen.info)

print("\n✅ Pug file generated: output/output.pug")

"""
print("Lists:")
for list_type, list_items in extracted_data["lists"].items():
    print(f"{list_type.capitalize()} List:")
    for sublist in list_items:
        for item in sublist:
            print(f" - {item}")

print("Images:")
for image in extracted_data["images"]:
    print(f"Alt Text: {image['alt_text']}, URL: {image['url']}")

print("Links:")
for link in extracted_data["links"]:
    print(f"Text: {link['text']}, URL: {link['url']}")

print("Blockquotes:")
for blockquote in extracted_data["blockquotes"]:
    print(f"> {blockquote}")

print("Code Blocks:")
for code in extracted_data["code_blocks"]:
    print(f"```\n{code}\n```")

print("Tables:")
for table in extracted_data["tables"]:
    for row in table:
        print(f"| {' | '.join(row)} |")

# ✅ Generate Pug content
pug_output = pug_gen.generate_pug_file(md_text)
"""