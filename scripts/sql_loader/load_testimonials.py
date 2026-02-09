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


def get_testimonials_file():
    """Get the testimonials.json file path"""
    # Check command line arguments first
    if len(sys.argv) > 1:
        return sys.argv[1]
    
    # Check environment variable
    env_path = os.getenv('TESTIMONIALS_JSON_PATH')
    if env_path:
        return env_path
    
    # Default path
    default_path = 'src/assets/json/testimonials.json'
    
    if os.path.exists(default_path):
        return default_path
    
    print(f"❌ Testimonials file not found: {default_path}")
    sys.exit(1)


def load_testimonials_from_file(file_path: str) -> List[Dict[str, Any]]:
    """Load testimonials from JSON file"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
        print(f"✅ Loaded testimonials from: {file_path}")
        return data
    except Exception as e:
        print(f"❌ Failed to load testimonials from {file_path}: {e}")
        sys.exit(1)


def save_testimonial(cursor, testimonial):
    """Save testimonial to database"""
    insert_sql = """
    INSERT INTO testimonials (name, role, company, content, rating, image, featured)
    VALUES (%s, %s, %s, %s, %s, %s, %s)
    ON DUPLICATE KEY UPDATE
        name = VALUES(name),
        role = VALUES(role),
        company = VALUES(company),
        content = VALUES(content),
        rating = VALUES(rating),
        image = VALUES(image),
        featured = VALUES(featured)
    """
    
    # Extract data from testimonial object
    name = testimonial.get('name', '')
    role = testimonial.get('role', '')
    company = testimonial.get('company', '')
    content = testimonial.get('content', '')
    rating = testimonial.get('rating', 5)  # Default to 5 stars
    icon = testimonial.get('icon', '👤')
    
    # Create image JSON object from icon
    image_json = json.dumps({
        'url': '',
        'alt': name,
        'icon': icon
    }, ensure_ascii=False)
    
    featured = testimonial.get('featured', False)
    
    data = (name, role, company, content, rating, image_json, featured)
    
    try:
        cursor.execute(insert_sql, data)
        print(f"✅ Saved testimonial from '{name}'")
    except mysql.connector.Error as e:
        print(f"❌ DB error saving testimonial from '{name}': {e}")


def create_testimonials_table(cursor):
    """Create testimonials table if it doesn't exist"""
    create_table_query = """
    CREATE TABLE IF NOT EXISTS testimonials (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        role VARCHAR(255),
        company VARCHAR(255),
        content TEXT NOT NULL,
        rating INT CHECK (rating >= 1 AND rating <= 5),
        image JSON,
        featured BOOLEAN DEFAULT FALSE,
        date_created DATETIME DEFAULT CURRENT_TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_rating (rating),
        INDEX idx_date_created (date_created)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    """
    
    try:
        cursor.execute(create_table_query)
        print("✅ Created/verified testimonials table")
    except mysql.connector.Error as e:
        print(f"❌ Error creating testimonials table: {e}")


def main():
    # Testimonials file to load JSON from
    TESTIMONIALS_FILE = get_testimonials_file()
    print(f"📁 Loading testimonials from file: {TESTIMONIALS_FILE}")

    # Load testimonials data
    testimonials_data = load_testimonials_from_file(TESTIMONIALS_FILE)

    # Connect to DB
    try:
        conn = mysql.connector.connect(**DB_CONFIG)
        cursor = conn.cursor()
        print("✅ Connected to database.")
    except mysql.connector.Error as err:
        print(f"❌ Database connection error: {err}")
        sys.exit(1)

    # Create testimonials table if it doesn't exist
    create_testimonials_table(cursor)

    # Save testimonials
    print(f"\n💬 Processing {len(testimonials_data)} testimonials...")
    for testimonial in testimonials_data:
        save_testimonial(cursor, testimonial)

    # Commit and close
    conn.commit()
    cursor.close()
    conn.close()
    
    print(f"\n🎉 Completed saving {len(testimonials_data)} testimonials to the database.")


if __name__ == "__main__":
    main() 