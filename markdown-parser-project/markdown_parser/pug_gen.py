from .md_parser import MarkdownParser
from .utils.info_manager import slugify_heading


class PugTemplateGenerator:
    def __init__(self):
        """
        Initialize the PugTemplateGenerator instance.

        :param None: No parameters are passed during initialization.
        """
        self.info = ""
    
    def generate_pug_base(self, info: dict) -> str:
        """
        Generate the base Pug structure for an HTML page using an info dictionary.

        :param info: Dictionary containing page information.
            Required keys: 'title', 'description', 'image', 'site_url', 'twitter_handle'
            Optional keys: 'stylesheet' (default '/style.css'), 'favicon' (default '/images/logo.png')
        :type info: dict
        :return: Pug template string
        :rtype: str
        """
        title = info.get("title", "")
        date = info.get("date", "")
        ttr = info.get("ttr", "")
        description = info.get("description", "")
        image = info.get("image", "")
        site_url = info.get("site_url", "https://www.devontaereid.com")
        twitter_handle = info.get("twitter_handle", "@_yodev_")
        stylesheet = info.get("stylesheet", "/style.css")
        favicon = info.get("favicon", "/images/logo.png")
        tags_and_image = self.generate_tags_and_image(info, 6)

        if title == "":
            print("No title was added!")
            return
        
        if description == "":
            print("No description was added!")
            return
        
        if image == "":
            print("No image was added!")
            return
        
        if ttr != "":
            if ttr > 1:
                ttr = f"{ttr} mins"
            else:
                ttr = "< 1 min"
        else:
            ttr = "< 1 min"


        pug = f"""doctype html
html(lang='en')
  head
    link(rel="icon" type="image/x-icon" href="{favicon}")
    meta(charset="UTF-8")
    meta(name="viewport" content="width=device-width, initial-scale=1.0")
    title {title}
    meta(name="title" property="og:title" content="{title}")
    meta(name="title" property="twitter:title" content="{title}")
    meta(name="description" property="og:description" content="{description}")
    meta(name="description" property="twitter:description" content="{description}")
    meta(name="image" property="og:image" content="{image['name']}")
    meta(name="image" property="twitter:image" content="{image['name']}")
    meta(property="twitter:card" content="summary_large_image")
    meta(property="twitter:site" content="{twitter_handle}")
    meta(property="og:url" content="{site_url}")
    meta(property="og:type" content="website")
    link(rel="stylesheet" href="{stylesheet}")
  body
    div#nav-bar.navbar.header-content--mini
      nav
        div.main-menu
          a.menu-branding(href="/")
            img.menu-branding(src="/images/logo.png" alt="branding-logo")
            h3 Devontae Reid
          ul.menu-list
            li
              a(href="/projects") Projects
            li
              a(href="/articles") Articles
            li
              a(href="/gospel") Gospel
            li
              button.display-switch ☀️
    div.post-body
      article.button#post-container
      div.post-header-container
        div.post-header-details
          h1#post-header-title {title}
          div.post-header-meta
            img.post-header-icon(src="https://i.ibb.co/HY4dx9s/headshot.jpg" alt="headshot")
            p.post-header-time {date}
            span.post-header-divider |
            p#post-read-time {ttr}
            button.post-header-shareButton#shareButton
              span.post-header-shareButton-icon
                img(src="/images/share_icon.png" alt="share_icon")
                .
                  Share
          div.post-header-tags
{tags_and_image}
      div.post-content
"""
        return pug
    
    def generate_footer(self,bible_refs:list, indent_level: int = 4) -> str:
        """
        Generate the Pug footer section with social links and scripts.

        :param scripts: List of JavaScript file URLs to include.
        :type scripts: list or None
        :param indent_level: Base indentation for footer content.
        :type indent_level: int
        :return: Pug-formatted footer section
        :rtype: str
        """
        scripts = ["/scripts/main.js"]
        if len(bible_refs) != 0:
            scripts.append("https://static.esvmedia.org/crossref/crossref.min.js")

        base_indent = " " * indent_level
        pug = ""

        pug += f"{base_indent}.footer\n"
        pug += f"{base_indent}  .footer-container\n"
        pug += f"{base_indent}    p Sola Scriptura ( Scripture Alone ), Solus Christus ( Christ Alone ), Sola fide ( Faith Alone ), Sola Gratia ( Grace Alone ), and Soli Deo Gloria ( Glory to God Alone )\n"
        pug += f"{base_indent}    .socials\n"
        pug += f"{base_indent}      ul\n"
        
        # Social links
        socials = [
            {"href": "https://www.linkedin.com/in/devontaereid/", "img": "/images/websites/linkedin.png"},
            {"href": "https://twitter.com/_yodev_", "img": "/images/websites/twitter.png"},
            {"href": "https://github.com/y0dev", "img": "/images/websites/github.png"},
        ]
        for social in socials:
            pug += f"{base_indent}        li.social-links\n"
            pug += f"{base_indent}          a(href=\"{social['href']}\")\n"
            pug += f"{base_indent}            img(src=\"{social['img']}\")\n"

        # Footer small
        pug += f"{base_indent}    p.footer-small Icons provided by \n"
        pug += f"{base_indent}      a(href=\"https://www.flaticon.com/authors/freepik\" title=\"Freepik\") Freepik\n"

        # Add external scripts
        for script_url in scripts:
            pug += f"{base_indent}script(type=\"text/javascript\" src=\"{script_url}\")\n"

        return pug


    def generate_tags_and_image(self, info: dict, indent_level: int = 2):

        """
        Generate the base Pug structure for an HTML page using an info dictionary.

        :param info: Dictionary containing page information.
            Required keys: 'title', 'description', 'image', 'site_url', 'twitter_handle'
            Optional keys: 'stylesheet' (default '/style.css'), 'favicon' (default '/images/logo.png')
        :type info: dict
        :return: Pug template string
        :rtype: str
        """
        pug = ""
        tags = info.get("tags", None)
        image = info.get("image", "")

        if not tags:
            print("No tags were added!")
            return None
        
        if image == "":
            print("No image was added!")
            return None
        
        base_indent = " " * indent_level
        for tag in tags:
            pug += f"{base_indent}      span.post-header-tag {tag}\n"
        pug += f'{base_indent}  img.post-header-image(src="/{image["name"]}" alt="{image["alt"]}")'
        return pug

    def generate_section(self, sections):
        """
        Generate the Pug template for sections (headings).

        :param sections: A dictionary of sections where the key is the section heading and the value is its content.
        :type sections: dict
        :return: Pug code for the sections.
        :rtype: str
        """
        pug = ""
        for heading, content in sections.items():
            pug += f"h2 {heading}\n"
            pug += f"  p {content}\n"
        return pug

    def generate_paragraphs(self, paragraphs, indent_level: int = 2) -> str:
        """
        Generate the Pug template for paragraphs, parsing bold markers into strong tags.

        :param paragraphs: A list of paragraph strings.
        :type paragraphs: list
        :param indent_level: Base indentation level for Pug output.
        :type indent_level: int
        :return: Pug code for the paragraphs.
        :rtype: str
        """
        import re

        pug = ""
        base_indent = " " * indent_level

        # Regex patterns
        underline_pattern = re.compile(r'__(.*?)__')  # Matches __underline__
        bold_pattern = re.compile(r'\*\*(.*?)\*\*')    # Matches **bold**
        italic_pattern = re.compile(r'\*(.*?)\*')       # Matches *italic*

        
        for paragraph in paragraphs:
            # Replace underline with a separate line
            paragraph = underline_pattern.sub(lambda m: f"\n{base_indent}  span.underline-text {m.group(1)}\n{base_indent}  |", paragraph)
            # Replace bold with a separate line
            paragraph = bold_pattern.sub(lambda m: f"\n{base_indent}  span.bold-text {m.group(1)}\n{base_indent}  |", paragraph)
            # Replace italic with a separate line
            paragraph = italic_pattern.sub(lambda m: f"\n{base_indent}  span.italic-text {m.group(1)}\n{base_indent}  |", paragraph)
            
            # Now just output the remaining text as part of the paragraph
            pug += f"{base_indent}p.post-details {paragraph}\n"
            


        return pug


    def generate_list(self, lists, indent_level: int = 2):
        """
        Generate the Pug template for ordered and unordered lists.

        :param lists: A dictionary containing 'ordered' and 'unordered' lists, each with a list of list items.
        :type lists: dict
        :return: Pug code for the lists.
        :rtype: str
        """
        pug = ""
        base_indent = " " * indent_level
        for list_type, list_items in lists.items():
            if not list_items:
                continue
            pug += f"{base_indent}{'ul' if list_type == 'unordered' else 'ol'}\n"
            for items in list_items:
                if isinstance(items, list):
                    for item in items:
                        if isinstance(item, list):
                            parent_text = item[0]
                            sublist_items = item[1]

                            pug += f"{base_indent}  li.post-list-item {parent_text}\n"
                            pug += f"{base_indent}    ul.sublist\n"
                            for subitem in sublist_items:
                                pug += f"{base_indent}      li.post-list-item {subitem}\n"
                        else:
                            pug += f"{base_indent}  li {str(item)}\n"
                else:
                    pug += f"{base_indent}  li {str(items)}\n"
        return pug

    def generate_images(self, images, indent_level: int = 2):
        """
        Generate the Pug template for images.

        :param images: A list of dictionaries containing 'alt_text' and 'url' for each image.
        :type images: list
        :return: Pug code for the images.
        :rtype: str
        """
        pug = ""
        indent = " " * indent_level
        for image in images:
            pug += f"{indent}.post-image-container"
            pug += f"{indent}    a.post-image-container(href='{image['url']}')"
            pug += f"{indent}      img.post-image(src='{image['url']}', alt='{image['alt_text']}')\n"
            # Add <figcaption class="post-image-caption">Load Balancing from G4G</figcaption>
        return pug


    def generate_links(self, links, indent_level: int = 2):
        """
        Generate the Pug template for links.

        :param links: A list of dictionaries containing 'text' and 'url' for each link.
        :type links: list
        :return: Pug code for the links.
        :rtype: str
        """
        pug = ""
        indent = " " * indent_level
        for link in links:
            pug += f"{indent}a.post-link(href='{link['url']}') {link['text']}\n"
        return pug

    def generate_blockquotes(self, blockquotes, indent_level: int = 2):
        """
        Generate the Pug template for blockquotes.

        :param blockquotes: A list of blockquotes to be converted into Pug.
        :type blockquotes: list
        :return: Pug code for the blockquotes.
        :rtype: str
        """
        pug = ""
        indent = " " * indent_level
        for blockquote in blockquotes:
            pug += f"{indent}blockquote\n"
            pug += f"{indent}  p {blockquote}\n"
        return pug


    def generate_code_blocks(self, code_blocks, indent_level: int = 2):
        """
        Generate the Pug template for code blocks.

        :param code_blocks: A list of code blocks to be converted into Pug.
        :type code_blocks: list
        :return: Pug code for the code blocks.
        :rtype: str
        """
        pug = ""
        indent = " " * indent_level
        for block in code_blocks:
            language = block.get('language', '')
            code_content = block.get('code', '')

            if language:
                pug += f"{indent}pre(lang=\"{language}\")\n"
            else:
                pug += f"{indent}pre\n"

            pug += f"{indent}  code\n"
            for line in code_content.strip().split('\n'):
                pug += f"{indent}    | {line.rstrip()}\n"
        return pug

    def generate_tables(self, tables, indent_level: int = 2):
        """
        Generate the Pug template for tables.

        :param tables: A list of tables, where each table is a list of rows (each row is a list of cells).
        :type tables: list
        :return: Pug code for the tables.
        :rtype: str
        """
        pug = ""
        indent = " " * indent_level
        for table in tables:
            pug += f"{indent}div.table-view-container\n"
            pug += f"{indent}  h3.table-title Table Title\n"
            pug += f"{indent}  div.table-container\n"
            pug += f"{indent}    table\n"
            
            for idx, row in enumerate(table):
                if idx == 0:
                    pug += f"{indent}      thead\n"
                    for cell in row:
                        pug += f"{indent}        th {cell}\n"
                    pug += f"{indent}      tbody\n"
                    continue
                
                pug += f"{indent}        tr\n"
                for cell in row:
                    pug += f"{indent}          td {cell}\n"
        return pug

    def generate_pug_file(self, md_text):
        """
        Generate the complete Pug template from markdown text.

        :param md_text: The markdown text to generate Pug from.
        :type md_text: str
        :return: Complete Pug template for the given markdown text.
        :rtype: str
        """
        parser = MarkdownParser()
        extracted_data = parser.extract_all(md_text)
        pug = ""

        pug += self.generate_section(extracted_data["sections"])
        pug += self.generate_list(extracted_data["lists"])
        pug += self.generate_images(extracted_data["images"])
        pug += self.generate_links(extracted_data["links"])
        pug += self.generate_blockquotes(extracted_data["blockquotes"])
        pug += self.generate_code_blocks(extracted_data["code_blocks"])
        pug += self.generate_tables(extracted_data["tables"])

        return pug

    def generate_pug_file_from_file(self, file_path):
        """
        Generate the complete Pug template from a markdown file.

        :param file_path: The path to the markdown file to generate Pug from.
        :type file_path: str
        :return: Complete Pug template for the markdown file.
        :rtype: str
        """
        with open(file_path, 'r', encoding='utf-8') as f:
            md_text = f.read()
            return self.generate_pug_file(md_text)
    
    def generate_pug_for_section(self, heading: str, section_nodes: list, parser, indent_level: int = 8) -> str:
        """
        Generates the Pug content for a single markdown section.

        :param heading: The section title.
        :param section_nodes: List of AST nodes under this section.
        :param parser: An instance of MarkdownParser.
        :return: Pug-formatted string for this section.
        """
        indent = " " * indent_level
        pug = f"{indent}div.post-section-container#{slugify_heading(heading)}\n" \
              f"{indent}  h2.section-title {heading}\n"
        # indent_level = indent_level + 2

        paragraph = parser.extract_paragraphs_from_section(section_nodes)
        pug += self.generate_paragraphs(paragraph, indent_level=indent_level + 2)

        lists = parser.extract_lists_from_section(section_nodes)
        pug += self.generate_list(lists, indent_level=indent_level + 2)

        blockquotes = parser.extract_blockquotes_from_section(section_nodes)
        pug += self.generate_blockquotes(blockquotes, indent_level=indent_level + 2)

        links = parser.extract_links_from_section(section_nodes)
        pug += self.generate_links(links, indent_level=indent_level + 2)

        images = parser.extract_images_from_section(section_nodes)
        pug += self.generate_images(images, indent_level=indent_level + 2)

        code_blocks = parser.extract_code_blocks_from_section(section_nodes)
        pug += self.generate_code_blocks(code_blocks, indent_level=indent_level + 2)

        tables = parser.extract_tables_from_section(section_nodes)
        pug += self.generate_tables(tables, indent_level=indent_level + 2)

        return pug

