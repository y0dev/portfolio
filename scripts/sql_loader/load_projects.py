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


def get_projects_file():
    """Get the projects.json file path"""
    # Check command line arguments first
    if len(sys.argv) > 1:
        return sys.argv[1]
    
    # Check environment variable
    env_path = os.getenv('PROJECTS_JSON_PATH')
    if env_path:
        return env_path
    
    # Default path
    default_path = 'src/assets/json/projects.json'
    
    if os.path.exists(default_path):
        return default_path
    
    print(f"❌ Projects file not found: {default_path}")
    print("   Create a projects.json file or specify the path as an argument")
    sys.exit(1)


def load_projects_from_file(file_path: str) -> List[Dict[str, Any]]:
    """Load projects from JSON file"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        # Handle both array and object with 'projects' key
        if isinstance(data, list):
            projects = data
        elif isinstance(data, dict) and 'projects' in data:
            projects = data['projects']
        else:
            print("❌ Invalid JSON format. Expected array of projects or object with 'projects' key.")
            sys.exit(1)
        
        print(f"✅ Loaded {len(projects)} projects from: {file_path}")
        return projects
    except Exception as e:
        print(f"❌ Failed to load projects from {file_path}: {e}")
        sys.exit(1)


def save_project(cursor, project):
    """Save project to database"""
    insert_sql = """
    INSERT INTO projects (title, slug, description, image, link, github_link, technologies, category, featured, date_created)
    VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
    ON DUPLICATE KEY UPDATE
        title = VALUES(title),
        description = VALUES(description),
        image = VALUES(image),
        link = VALUES(link),
        github_link = VALUES(github_link),
        technologies = VALUES(technologies),
        category = VALUES(category),
        featured = VALUES(featured),
        date_created = VALUES(date_created),
        updated_at = CURRENT_TIMESTAMP
    """
    
    # Generate slug from title if not provided
    slug = project.get('slug')
    if not slug and project.get('title'):
        slug = project['title'].lower().replace(' ', '-').replace('&', 'and').replace('/', '-')
        # Remove special characters
        import re
        slug = re.sub(r'[^a-z0-9\-]', '', slug)
    
    # Prepare technologies as JSON
    technologies = project.get('technologies', [])
    if isinstance(technologies, str):
        technologies = [tech.strip() for tech in technologies.split(',')]
    technologies_json = json.dumps(technologies, ensure_ascii=False)
    print(project.get('image', {}))
    data = (
        project.get('title', ''),
        slug,
        project.get('description', ''),
        project.get('image', {}),
        project.get('link') or project.get('live_url', ''),
        project.get('github_link') or project.get('github_url', ''),
        technologies_json,
        project.get('category', ''),
        project.get('featured', False),
        project.get('date_created') or project.get('created_at') or None
    )
    
    try:
        cursor.execute(insert_sql, data)
        print(f"✅ Saved project '{project.get('title', '')}' with slug '{slug}'")
    except mysql.connector.Error as e:
        print(f"❌ DB error saving project '{project.get('title', '')}': {e}")


def create_projects_table(cursor):
    """Create projects table if it doesn't exist"""
    create_table_query = """
    CREATE TABLE IF NOT EXISTS projects (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        slug VARCHAR(255) NOT NULL UNIQUE,
        description TEXT,
        images JSON,
        link VARCHAR(500),
        github_link VARCHAR(500),
        technologies JSON,
        category VARCHAR(100),
        featured BOOLEAN DEFAULT FALSE,
        date_created DATETIME DEFAULT CURRENT_TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_category (category),
        INDEX idx_date_created (date_created),
        INDEX idx_slug (slug)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    """
    try:
        cursor.execute(create_table_query)
        print("✅ Created/verified projects table")
    except mysql.connector.Error as e:
        print(f"❌ Error creating projects table: {e}")


def create_sample_projects():
    """Create sample projects data if no file is provided"""
    return [
        {
            "title": "Portfolio Website",
            "description": "A modern, responsive portfolio website built with React and Node.js. Features include dynamic content management, blog functionality, and SEO optimization.",
            "category": "web-development",
            "technologies": ["React", "Node.js", "MySQL", "PHP", "CSS3", "JavaScript"],
            "link": "https://devontaereid.com",
            "github_link": "https://github.com/devontaereid/portfolio",
            "images": [
                {
                    "url": "/images/portfolio.png",
                    "alt": "Portfolio Website Screenshot"
                }
            ],
            "featured": True,
            "date_created": "2024-01-15 10:00:00"
        },
        {
            "title": "E-Commerce Platform",
            "description": "A full-stack e-commerce platform with payment processing, inventory management, and admin dashboard.",
            "category": "web-development",
            "technologies": ["React", "Express.js", "MongoDB", "Stripe", "Redux"],
            "link": "https://ecommerce-demo.com",
            "github_link": "https://github.com/devontaereid/ecommerce",
            "images": [
                {
                    "url": "/images/ecommerce.png",
                    "alt": "E-Commerce Platform"
                }
            ],
            "featured": False,
            "date_created": "2023-12-01 14:30:00"
        },
        {
            "title": "Task Management App",
            "description": "A collaborative task management application with real-time updates, team collaboration, and progress tracking.",
            "category": "web-development",
            "technologies": ["Vue.js", "Firebase", "Vuex", "CSS3", "JavaScript"],
            "link": "https://task-manager-demo.com",
            "github_link": "https://github.com/devontaereid/task-manager",
            "images": [
                {
                    "url": "/images/task-manager.png",
                    "alt": "Task Management App"
                }
            ],
            "featured": False,
            "date_created": "2023-11-20 09:15:00"
        },
        {
            "title": "Weather Dashboard",
            "description": "A weather dashboard that displays current weather conditions and forecasts using multiple weather APIs.",
            "category": "web-development",
            "technologies": ["JavaScript", "HTML5", "CSS3", "Weather API", "Chart.js"],
            "link": "https://weather-dashboard-demo.com",
            "github_link": "https://github.com/devontaereid/weather-dashboard",
            "images": [
                {
                    "url": "/images/weather-dashboard.png",
                    "alt": "Weather Dashboard"
                }
            ],
            "featured": False,
            "date_created": "2023-10-10 16:45:00"
        },
        {
            "title": "FPGA Digital Design",
            "description": "Digital design project implementing a custom processor architecture on Xilinx FPGA with VHDL.",
            "category": "embedded-systems",
            "technologies": ["VHDL", "Xilinx Vivado", "FPGA", "Digital Design", "Verilog"],
            "link": "",
            "github_link": "https://github.com/devontaereid/fpga-processor",
            "images": [
                {
                    "url": "/images/fpga-project.png",
                    "alt": "FPGA Digital Design"
                }
            ],
            "featured": True,
            "date_created": "2023-09-05 11:20:00"
        }
    ]


def main():
    # Projects file to load JSON from
    PROJECTS_FILE = get_projects_file()
    print(f"📁 Loading projects from file: {PROJECTS_FILE}")

    # Load projects data
    if os.path.exists(PROJECTS_FILE):
        projects = load_projects_from_file(PROJECTS_FILE)
    else:
        print(f"⚠️ Projects file not found: {PROJECTS_FILE}")
        print("📝 Creating sample projects data...")
        projects = create_sample_projects()

    if not projects:
        print("⚠️ No projects found to process.")
        sys.exit(0)

    # Connect to DB
    try:
        conn = mysql.connector.connect(**DB_CONFIG)
        cursor = conn.cursor()
        print("✅ Connected to database.")
    except mysql.connector.Error as err:
        print(f"❌ Database connection error: {err}")
        sys.exit(1)

    # Create projects table if missing
    create_projects_table(cursor)

    # Save projects
    print(f"\n🚀 Processing {len(projects)} projects...")
    for project in projects:
        save_project(cursor, project)

    conn.commit()
    cursor.close()
    conn.close()
    print(f"\n🎉 Completed saving {len(projects)} projects to the database.")


if __name__ == "__main__":
    main() 