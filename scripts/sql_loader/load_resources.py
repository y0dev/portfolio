#!/usr/bin/env python3
import os
import sys
import json
import mysql.connector
from mysql.connector import errorcode
from typing import List, Dict, Any
from dotenv import load_dotenv

# Load .env if exists for DB credentials
load_dotenv()

# DB config from environment or defaults
DB_CONFIG = {
    'user': os.getenv('DB_USER', 'root'),
    'password': os.getenv('DB_PASSWORD', ''),
    'host': os.getenv('DB_HOST', 'localhost'),
    'database': os.getenv('DB_NAME', 'portfolio_db'),
    'charset': 'utf8mb4',
}


def get_resources_file():
    """Get the resources.json file path"""
    # Check command line arguments first
    if len(sys.argv) > 1:
        return sys.argv[1]
    
    # Check environment variable
    env_path = os.getenv('RESOURCES_JSON_PATH')
    if env_path:
        return env_path
    
    # Default path
    default_path = 'src/assets/json/resources.json'
    
    if os.path.exists(default_path):
        return default_path
    
    print(f"❌ Resources file not found: {default_path}")
    sys.exit(1)


def load_resources_from_file(file_path: str) -> Dict[str, Any]:
    """Load resources from JSON file"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
        print(f"✅ Loaded resources from: {file_path}")
        return data
    except Exception as e:
        print(f"❌ Failed to load resources from {file_path}: {e}")
        sys.exit(1)


def save_book(cursor, book):
    """Save book to database"""
    insert_sql = """
    INSERT INTO books (title, author, category, description, cover, rating, status, featured, link, image)
    VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
    ON DUPLICATE KEY UPDATE
        title = VALUES(title),
        author = VALUES(author),
        category = VALUES(category),
        description = VALUES(description),
        cover = VALUES(cover),
        rating = VALUES(rating),
        status = VALUES(status),
        featured = VALUES(featured),
        link = VALUES(link),
        image = VALUES(image)
    """
    
    data = (
        book.get('title', ''),
        book.get('author', ''),
        book.get('category', ''),
        book.get('description', ''),
        book.get('cover', '📚'),
        book.get('rating', 0),
        book.get('status', 'To Read'),
        book.get('featured', False),
        book.get('link', ''),
        book.get('image', '')
    )
    
    try:
        cursor.execute(insert_sql, data)
        print(f"✅ Saved book '{book.get('title', '')}'")
    except mysql.connector.Error as e:
        print(f"❌ DB error saving book '{book.get('title', '')}': {e}")


def save_tool(cursor, tool):
    """Save tool to database"""
    insert_sql = """
    INSERT INTO tools (name, category, description, icon)
    VALUES (%s, %s, %s, %s)
    ON DUPLICATE KEY UPDATE
        name = VALUES(name),
        category = VALUES(category),
        description = VALUES(description),
        icon = VALUES(icon)
    """
    
    data = (
        tool.get('name', ''),
        tool.get('category', ''),
        tool.get('description', ''),
        tool.get('icon', '🛠️')
    )
    
    try:
        cursor.execute(insert_sql, data)
        print(f"✅ Saved tool '{tool.get('name', '')}'")
    except mysql.connector.Error as e:
        print(f"❌ DB error saving tool '{tool.get('name', '')}': {e}")


def save_dev_resource(cursor, resource):
    """Save dev resource to database"""
    insert_sql = """
    INSERT INTO dev_resources (name, category, description, url, icon)
    VALUES (%s, %s, %s, %s, %s)
    ON DUPLICATE KEY UPDATE
        name = VALUES(name),
        category = VALUES(category),
        description = VALUES(description),
        url = VALUES(url),
        icon = VALUES(icon)
    """
    
    data = (
        resource.get('name', ''),
        resource.get('category', ''),
        resource.get('description', ''),
        resource.get('url', ''),
        resource.get('icon', '🔗')
    )
    
    try:
        cursor.execute(insert_sql, data)
        print(f"✅ Saved dev resource '{resource.get('name', '')}'")
    except mysql.connector.Error as e:
        print(f"❌ DB error saving dev resource '{resource.get('name', '')}': {e}")


def save_podcast(cursor, podcast):
    """Save podcast to database"""
    insert_sql = """
    INSERT INTO podcasts (name, description, url, icon)
    VALUES (%s, %s, %s, %s)
    ON DUPLICATE KEY UPDATE
        name = VALUES(name),
        description = VALUES(description),
        url = VALUES(url),
        icon = VALUES(icon)
    """
    
    data = (
        podcast.get('name', ''),
        podcast.get('description', ''),
        podcast.get('url', ''),
        podcast.get('icon', '🎧')
    )
    
    try:
        cursor.execute(insert_sql, data)
        print(f"✅ Saved podcast '{podcast.get('name', '')}'")
    except mysql.connector.Error as e:
        print(f"❌ DB error saving podcast '{podcast.get('name', '')}': {e}")


def save_youtube_channel(cursor, channel):
    """Save YouTube channel to database"""
    insert_sql = """
    INSERT INTO youtube_channels (name, description, url, icon)
    VALUES (%s, %s, %s, %s)
    ON DUPLICATE KEY UPDATE
        name = VALUES(name),
        description = VALUES(description),
        url = VALUES(url),
        icon = VALUES(icon)
    """
    
    data = (
        channel.get('name', ''),
        channel.get('description', ''),
        channel.get('url', ''),
        channel.get('icon', '📺')
    )
    
    try:
        cursor.execute(insert_sql, data)
        print(f"✅ Saved YouTube channel '{channel.get('name', '')}'")
    except mysql.connector.Error as e:
        print(f"❌ DB error saving YouTube channel '{channel.get('name', '')}': {e}")


def save_theology_resource(cursor, resource):
    """Save theology resource to database"""
    insert_sql = """
    INSERT INTO theology_resources (name, category, description, url, icon)
    VALUES (%s, %s, %s, %s, %s)
    ON DUPLICATE KEY UPDATE
        name = VALUES(name),
        category = VALUES(category),
        description = VALUES(description),
        url = VALUES(url),
        icon = VALUES(icon)
    """
    
    data = (
        resource.get('name', ''),
        resource.get('category', ''),
        resource.get('description', ''),
        resource.get('url', ''),
        resource.get('icon', '✝️')
    )
    
    try:
        cursor.execute(insert_sql, data)
        print(f"✅ Saved theology resource '{resource.get('name', '')}'")
    except mysql.connector.Error as e:
        print(f"❌ DB error saving theology resource '{resource.get('name', '')}': {e}")


def create_tables(cursor):
    """Create all resource tables if they don't exist"""
    
    # Books table
    books_table = """
    CREATE TABLE IF NOT EXISTS books (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        author VARCHAR(255),
        category VARCHAR(100),
        description TEXT,
        cover VARCHAR(10),
        rating INT CHECK (rating BETWEEN 1 AND 5),
        status ENUM('To Read', 'Reading', 'Read') DEFAULT 'To Read',
        featured BOOLEAN DEFAULT FALSE,
        link TEXT,
        image TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    """
    
    # Tools table
    tools_table = """
    CREATE TABLE IF NOT EXISTS tools (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        category VARCHAR(100),
        description TEXT,
        icon VARCHAR(10),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    """
    
    # Dev Resources table
    dev_resources_table = """
    CREATE TABLE IF NOT EXISTS dev_resources (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(150) NOT NULL,
        category VARCHAR(100),
        description TEXT,
        url TEXT,
        icon VARCHAR(10),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    """
    
    # Podcasts table
    podcasts_table = """
    CREATE TABLE IF NOT EXISTS podcasts (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(150) NOT NULL,
        description TEXT,
        url TEXT,
        icon VARCHAR(10),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    """
    
    # YouTube Channels table
    youtube_channels_table = """
    CREATE TABLE IF NOT EXISTS youtube_channels (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(150) NOT NULL,
        description TEXT,
        url TEXT,
        icon VARCHAR(10),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    """
    
    # Theology Resources table
    theology_resources_table = """
    CREATE TABLE IF NOT EXISTS theology_resources (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(150) NOT NULL,
        category VARCHAR(100),
        description TEXT,
        url TEXT,
        icon VARCHAR(10),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    """
    
    tables = [
        ('books', books_table),
        ('tools', tools_table),
        ('dev_resources', dev_resources_table),
        ('podcasts', podcasts_table),
        ('youtube_channels', youtube_channels_table),
        ('theology_resources', theology_resources_table)
    ]
    
    for table_name, create_sql in tables:
        try:
            cursor.execute(create_sql)
            print(f"✅ Created/verified {table_name} table")
        except mysql.connector.Error as e:
            print(f"❌ Error creating {table_name} table: {e}")


def main():
    # Resources file to load JSON from
    RESOURCES_FILE = get_resources_file()
    print(f"📁 Loading resources from file: {RESOURCES_FILE}")

    # Load resources data
    resources_data = load_resources_from_file(RESOURCES_FILE)

    # Connect to DB
    try:
        conn = mysql.connector.connect(**DB_CONFIG)
        cursor = conn.cursor()
        print("✅ Connected to database.")
    except mysql.connector.Error as err:
        print(f"❌ Database connection error: {err}")
        sys.exit(1)

    # Create tables if they don't exist
    create_tables(cursor)

    # Save books
    if 'books' in resources_data:
        print(f"\n📚 Processing {len(resources_data['books'])} books...")
        for book in resources_data['books']:
            save_book(cursor, book)

    # Save tools
    if 'tools' in resources_data:
        print(f"\n🛠️ Processing {len(resources_data['tools'])} tools...")
        for tool in resources_data['tools']:
            save_tool(cursor, tool)

    # Save dev resources
    if 'dev_resources' in resources_data:
        print(f"\n🔗 Processing {len(resources_data['dev_resources'])} dev resources...")
        for resource in resources_data['dev_resources']:
            save_dev_resource(cursor, resource)

    # Save podcasts
    if 'podcasts' in resources_data:
        print(f"\n🎧 Processing {len(resources_data['podcasts'])} podcasts...")
        for podcast in resources_data['podcasts']:
            save_podcast(cursor, podcast)

    # Save YouTube channels
    if 'youtube_channels' in resources_data:
        print(f"\n📺 Processing {len(resources_data['youtube_channels'])} YouTube channels...")
        for channel in resources_data['youtube_channels']:
            save_youtube_channel(cursor, channel)

    # Save theology resources
    if 'theology_resources' in resources_data:
        print(f"\n✝️ Processing {len(resources_data['theology_resources'])} theology resources...")
        for resource in resources_data['theology_resources']:
            save_theology_resource(cursor, resource)

    # Commit and close
    conn.commit()
    cursor.close()
    conn.close()
    
    total_items = sum(len(resources_data.get(key, [])) for key in ['books', 'tools', 'dev_resources', 'podcasts', 'youtube_channels', 'theology_resources'])
    print(f"\n🎉 Completed saving {total_items} resources to the database.")


if __name__ == "__main__":
    main() 