import re
import math
from datetime import datetime
from .category_mapper import *
from spellchecker import SpellChecker # type: ignore

def format_date_with_weekday(date_str: str) -> str:
    """
    Converts a date string like 'April 1, 2025' to 'Tuesday, April 1, 2025'.

    :param date_str: Date string in the format 'Month day, Year'
    :type date_str: str
    :return: Formatted date with weekday
    :rtype: str
    """
    # Parse the input string to a datetime object
    date_obj = datetime.strptime(date_str, "%B %d, %Y")
    # Format it with weekday
    return date_obj.strftime("%A, %B %-d, %Y")  # %-d removes leading zeros on Unix

def correct_spelling_interactively(md_text: str) -> str:
    """
    Check for spelling errors in the markdown text and allow user to correct them interactively.

    :param md_text: Input markdown text
    :type md_text: str
    :return: Corrected markdown text
    :rtype: str
    """
    spell = SpellChecker()
    words = re.findall(r'\b\w+\b', md_text)
    misspelled = spell.unknown(words)
    corrected_text = md_text

    for word in misspelled:
        suggestions = spell.candidates(word)
        print(f"\nMisspelled word found: '{word}'")
        print(f"Suggestions: {', '.join(suggestions) if suggestions else 'No suggestions'}")
        choice = input(f"Enter replacement (or press Enter to keep '{word}'): ").strip()
        if choice and choice != word:
            corrected_text = re.sub(rf'\b{re.escape(word)}\b', choice, corrected_text)

    return corrected_text

def estimate_reading_time(md_text: str, words_per_minute: int = 225) -> int:
    """
    Estimate the reading time in minutes based on the markdown text.

    :param md_text: Input markdown text
    :type md_text: str
    :param words_per_minute: Words a person can read per minute (default 225)
    :type words_per_minute: int
    :return: Estimated reading time in minutes
    :rtype: int
    """
    # Strip markdown formatting (very basic: remove special characters)
    clean_text = re.sub(r'[`*_>#\-\+\[\]()!]', '', md_text)
    # Find all words
    words = re.findall(r'\w+', clean_text)
    word_count = len(words)

    # Calculate time and always round UP (even if it's 1.1 minutes → 2 minutes)
    reading_time_minutes = math.ceil(word_count / words_per_minute)

    return reading_time_minutes

def extract_blog_note_info(lists_info_section: list[list[str]]) -> dict:
    """
    Extracts the blog or note metadata (title, date, category) from a markdown section's list.

    :param lists_info_section: The last unordered list under the Blog/Note Info section.
    :type lists_info_section: list[list[str]]
    :return: Dictionary containing title, date, and category.
    :rtype: dict
    """
    info = {
        "title": "",
        "description": "",
        "date": "",
        "type": "",
        "category": None,
        "tags": None,
        "image": ""
    }

    if lists_info_section:
        items = lists_info_section[-1]  # Last unordered list assumed to have the metadata
        for item in items:
            if item.startswith("Title:"):
                info["title"] = item.replace("Title:", "").strip()
            elif item.startswith("Description:"):
                info["description"] = item.replace("Description:", "").strip()
            elif item.startswith("Date:"):
                info["date"] = format_date_with_weekday(item.replace("Date:", "").strip())
            elif item.startswith("Category:"):
                info["category"] = item.replace("Category:", "").strip()
                info["image"] = get_image_info_for_category(info["category"])
                info["tags"] = get_tags_for_category(info["category"])
            elif item.startswith("Type:"):
                info["type"] = item.replace("Type:", "").strip()
    return info

import time

def build_js_entry_from_info(info: dict) -> dict:
    """
    Builds a JS-compatible dictionary (article/note) from extracted blog/note metadata.

    :param info: Dictionary with extracted blog/note metadata.
    :return: Dictionary suitable for JSON insertion into JS file.
    """
    # Generate ID from title (URL-friendly)
    slug = info["title"].lower().replace(" ", "-")
    print(info)

    return {
        "file-id": info["type"],  # "note" or "article"
        "date": int(time.time() * 1000),  # Current timestamp in ms
        "id": slug,
        "image": info["image"],
        "tags": info.get("tags", []),
        "title": info["title"]
    }


def find_bible_references(md_text: str) -> list:
    """
    Find Bible book, chapter, and verse references in a given text.

    :param md_text: Input markdown or plain text
    :type md_text: str
    :return: List of found references like 'Rom. 1:17'
    :rtype: list
    """
    # Regex explanation:
    # - Book can be 1 or 2 words, sometimes abbreviated (with or without a dot)
    # - Chapter is one or more digits
    # - Verse is one or more digits
    bible_ref_pattern = re.compile(
        r'\b(?:[1-3]\s)?[A-Z][a-z]+\.?\s\d+:\d+\b'
    )
    
    matches = bible_ref_pattern.findall(md_text)
    return matches

def slugify_heading(heading: str) -> str:
    """
    Converts a heading string into a slug suitable for HTML element IDs.
    Removes special characters and replaces spaces with dashes.
    """
    # Lowercase the heading
    slug = heading.lower()
    # Replace & and / with nothing
    slug = slug.replace('&', '').replace('/', '')
    # Remove unwanted characters (anything not alphanumeric, dash, or space)
    slug = re.sub(r'[^\w\s-]', '', slug)
    # Replace spaces and underscores with dashes
    slug = re.sub(r'[\s_]+', '-', slug)
    return slug.strip('-')