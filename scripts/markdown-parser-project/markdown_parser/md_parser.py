import marko # type: ignore
from marko import Markdown # type: ignore
from marko.ext.gfm import GFM # type: ignore

class MarkdownParser:
    def __init__(self):
        """
        Initialize the MarkdownParser instance.

        :param None: No parameters are passed during initialization.
        """
        self.parser = Markdown(extensions=[GFM])

    def parse_to_html(self, md_text):
        """
        Convert markdown text to HTML.

        :param md_text: The markdown text to be converted to HTML.
        :type md_text: str
        :return: HTML content generated from markdown text.
        :rtype: str
        """
        return self.parser.convert(md_text)

    def parse_file_to_html(self, file_path):
        """
        Convert markdown file content to HTML.

        :param file_path: The path to the markdown file to be read and converted.
        :type file_path: str
        :return: HTML content generated from the markdown file.
        :rtype: str
        """
        with open(file_path, 'r', encoding='utf-8') as f:
            return self.parse_to_html(f.read())

    def extract_sections(self, md_text):
        """
        Extract sections (headings) and their associated content from the markdown text.

        :param md_text: The markdown text to extract sections from.
        :type md_text: str
        :return: A dictionary where keys are section headings, and values are the content associated with those headings.
        :rtype: dict
        """
        ast = self.parser.parse(md_text)
        sections = {}
        current_heading = None
        buffer = []

        for node in ast.children:
            if node.__class__.__name__ == "Heading":
                if current_heading:
                    sections[current_heading] = buffer
                    buffer = []
                current_heading = node.children[0].children if node.children else "Untitled"
            else:
                buffer.append(node)

        if current_heading:
            sections[current_heading] = buffer

        return sections

    def extract_paragraphs_from_section(self, section_node) -> list:
        """
        Extracts plain paragraphs from a parsed section node, skipping links.

        :param section_node: The parsed AST nodes of a section
        :return: List of paragraph strings
        """
        paragraphs = []

        def flatten_paragraph(node):
            # Only extract text nodes, not links
            text = ""
            if hasattr(node, 'children'):
                # print(node.children)
                for child in node.children:
                    if isinstance(child, marko.inline.Link):
                        continue  # Skip link nodes
                    elif isinstance(child, marko.inline.Image):
                        # Add bold markers for strong emphasis
                        continue
                    elif isinstance(child, marko.inline.Emphasis):
                        # Add bold markers for strong emphasis
                        text += "**" + flatten_paragraph(child) + "**"
                    elif isinstance(child, marko.inline.StrongEmphasis):
                        # Add bold markers for strong emphasis
                        text += "*" + flatten_paragraph(child) + "*"
                    elif hasattr(child, 'children'):
                        text += flatten_paragraph(child)
                    elif hasattr(child, 'children') is False and hasattr(child, 'children') is not None:
                        # Handle inline RawText nodes
                        text += str(child)
                    else:
                        text += str(child)
            return text

        for node in section_node.children if hasattr(section_node, 'children') else section_node:
            if isinstance(node, marko.block.Paragraph):
                paragraph_text = flatten_paragraph(node)
                if paragraph_text.strip():  # Only add non-empty
                    paragraphs.append(paragraph_text.strip())

        return paragraphs



    def extract_lists(self, md_text: str) -> dict:
        """
        Extracts ordered and unordered lists from Markdown.

        :param md_text: The markdown text to parse
        :return: A dictionary with 'ordered' and 'unordered' lists
        """
        document = self.parser.parse(md_text)
        unordered_lists = []
        ordered_lists = []

        for node in document.children:
            if isinstance(node, marko.block.List):
                current_list = []
                for item in node.children:
                    # Each item is a ListItem
                    for child in item.children:
                        text = self.flatten_node_text(child)
                        current_list.append(text)
                if node.ordered:
                    ordered_lists.append(current_list)
                else:
                    unordered_lists.append(current_list)

        return {
            'ordered': ordered_lists,
            'unordered': unordered_lists
        }

    def extract_lists_from_section(self, section_node) -> dict:
        """
        Extracts ordered and unordered lists (including sublists) from a parsed section node.

        :param section_node: A parsed Markdown AST node representing a section's content
        :type section_node: marko.block.Document or list of nodes
        :return: A dictionary with 'ordered' and 'unordered' lists
        :rtype: dict
        """
        unordered_lists = []
        ordered_lists = []

        def extract_items(item_node):
            items = []
            for child in item_node.children:
                if isinstance(child, marko.block.List):
                    # Nested list: recurse
                    subitems = []
                    for subitem in child.children:
                        subitems.append(extract_items(subitem))
                    items.append(subitems)
                else:
                    # Normal text node
                    text = self.flatten_node_text(child)
                    items.append(text)
            return items if len(items) > 1 else items[0]  # Simplify single-item lists

        for node in section_node.children if hasattr(section_node, 'children') else section_node:
            if isinstance(node, marko.block.List):
                current_list = []
                for item in node.children:
                    extracted = extract_items(item)
                    current_list.append(extracted)
                if node.ordered:
                    ordered_lists.append(current_list)
                else:
                    unordered_lists.append(current_list)

        return {
            'ordered': ordered_lists,
            'unordered': unordered_lists
        }




    def flatten_node_text(self, node) -> str:
        """
        Recursively extracts plain text from a marko AST node.

        :param node: The node to extract text from
        :return: A plain string of text content
        """
        if hasattr(node, 'children'):
            return ''.join(self.flatten_node_text(child) for child in node.children)
        return str(node)


    def extract_images(self, md_text):
        """
        Extract all images (with alt text and URL) from the markdown text.

        :param md_text: The markdown text to extract images from.
        :type md_text: str
        :return: A list of dictionaries, each containing the alt text and URL of an image.
        :rtype: list
        """
        ast = self.parser.parse(md_text)
        images = []

        for node in ast.children:
            if node.__class__.__name__ == "Image":
                alt_text = ''.join([str(child) for child in node.children if isinstance(child, str)])  # Alt text
                url = node.destination  # Image URL
                images.append({"alt_text": alt_text, "url": url})

        return images
    
    def extract_images_from_section(self, section_node) -> list:
        """
        Extracts images from a parsed section node.

        :param section_node: The parsed AST nodes of a section
        :return: List of dicts with 'alt_text' and 'url'
        """
        images = []

        def recursive_image_search(node):
            if isinstance(node, marko.inline.Image):
                images.append({'alt_text': self.flatten_node_text(node), 'url': node.dest})
            if hasattr(node, 'children'):
                for child in node.children:
                    recursive_image_search(child)

        for node in section_node.children if hasattr(section_node, 'children') else section_node:
            recursive_image_search(node)

        return images


    def extract_links(self, md_text):
        """
        Extract all links (with text and URL) from the markdown text.

        :param md_text: The markdown text to extract links from.
        :type md_text: str
        :return: A list of dictionaries, each containing the text and URL of a link.
        :rtype: list
        """
        ast = self.parser.parse(md_text)
        links = []

        for node in ast.children:
            if node.__class__.__name__ == "Link":
                link_text = ''.join([str(child) for child in node.children if isinstance(child, str)])  # Link text
                url = node.destination  # URL
                links.append({"text": link_text, "url": url})

        return links
    
    def extract_links_from_section(self, section_node) -> list:
        """
        Extracts links from a parsed section node.

        :param section_node: The parsed AST nodes of a section
        :return: List of dicts with 'text' and 'url'
        """
        links = []

        def recursive_link_search(node):
            if isinstance(node, marko.inline.Link):
                links.append({'text': self.flatten_node_text(node), 'url': node.dest})
            if hasattr(node, 'children'):
                for child in node.children:
                    recursive_link_search(child)

        for node in section_node.children if hasattr(section_node, 'children') else section_node:
            recursive_link_search(node)

        return links


    def extract_blockquotes(self, md_text):
        """
        Extract all blockquotes from the markdown text.

        :param md_text: The markdown text to extract blockquotes from.
        :type md_text: str
        :return: A list of blockquotes extracted from the markdown text.
        :rtype: list
        """
        ast = self.parser.parse(md_text)
        blockquotes = []

        for node in ast.children:
            if node.__class__.__name__ == "BlockQuote":
                blockquotes.append(''.join([str(child) for child in node.children]))

        return blockquotes
    
    def extract_blockquotes_from_section(self, section_node) -> list:
        """
        Extracts blockquotes from a parsed section node.

        :param section_node: The parsed AST nodes of a section
        :return: List of blockquote texts
        """
        blockquotes = []
        for node in section_node.children if hasattr(section_node, 'children') else section_node:
            if isinstance(node, marko.block.Quote):
                for child in node.children:
                    blockquotes.append(self.flatten_node_text(child))
        return blockquotes


    def extract_code_blocks(self, md_text):
        """
        Extract all code blocks from the markdown text.

        :param md_text: The markdown text to extract code blocks from.
        :type md_text: str
        :return: A list of code blocks extracted from the markdown text.
        :rtype: list
        """
        ast = self.parser.parse(md_text)
        code_blocks = []

        for node in ast.children:
            if node.__class__.__name__ == "Code":
                code_blocks.append(''.join([str(child) for child in node.children]))

        return code_blocks
    
    def extract_code_blocks_from_section(self, section_node) -> list:
        """
        Extracts fenced code blocks from a parsed section node.

        :param section_node: The parsed AST nodes of a section
        :return: List of code block strings
        """
        code_blocks = []
        for node in section_node.children if hasattr(section_node, 'children') else section_node:
            if isinstance(node, marko.block.FencedCode):
                language = node.lang.strip() if node.lang else ""
                code_text = ""
                if node.children:
                    # Typically one child which has the actual text
                    child = node.children[0]
                    if hasattr(child, 'children'):
                        code_text = child.children
                    else:
                        code_text = str(child)
                
                code_blocks.append({
                    'language': language,
                    'code': code_text
                })
        return code_blocks


    def extract_tables(self, md_text):
        """
        Extract all tables from the markdown text.

        :param md_text: The markdown text to extract tables from.
        :type md_text: str
        :return: A list of tables, where each table is represented as a list of rows (each row is a list of cells).
        :rtype: list
        """
        ast = self.parser.parse(md_text)
        tables = []

        for node in ast.children:
            if node.__class__.__name__ == "Table":
                table = []
                for row in node.children:
                    row_data = [str(cell) for cell in row.children]
                    table.append(row_data)
                tables.append(table)

        return tables
    
    def extract_tables_from_section(self, section_node) -> list:
        """
        Extracts tables from a parsed section node.

        :param section_node: The parsed AST nodes of a section
        :return: List of tables, each table is a list of rows (each row is a list of cells)
        """
        tables = []
        for node in section_node.children if hasattr(section_node, 'children') else section_node:
            if isinstance(node, marko.ext.gfm.elements.Table):
                table = []
                for row in node.children:
                    table_row = [self.flatten_node_text(cell) for cell in row.children]
                    table.append(table_row)
                tables.append(table)
        return tables


    def extract_all(self, md_text):
        """
        Extract sections, lists, images, links, blockquotes, code blocks, and tables from the markdown text.

        :param md_text: The markdown text to extract all content from.
        :type md_text: str
        :return: A dictionary containing all extracted elements.
        :rtype: dict
        """
        return {
            "sections": self.extract_sections(md_text),
            "lists": self.extract_lists(md_text),
            "images": self.extract_images(md_text),
            "links": self.extract_links(md_text),
            "blockquotes": self.extract_blockquotes(md_text),
            "code_blocks": self.extract_code_blocks(md_text),
            "tables": self.extract_tables(md_text),
        }

    def extract_all_from_file(self, file_path):
        """
        Extract all elements from a markdown file.

        :param file_path: The path to the markdown file to extract elements from.
        :type file_path: str
        :return: A dictionary containing all extracted elements from the file.
        :rtype: dict
        """
        with open(file_path, 'r', encoding='utf-8') as f:
            return self.extract_all(f.read())
