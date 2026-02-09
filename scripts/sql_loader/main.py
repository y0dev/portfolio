#!/usr/bin/env python3
"""
Portfolio Database Setup Script
Creates and populates database tables for portfolio content management

Author: Devontae Reid
Version: 1.0
"""

import mysql.connector
from mysql.connector import errorcode
from dotenv import load_dotenv
import os
import sys
from datetime import datetime
import json

# Load environment variables
load_dotenv()

class DatabaseManager:
    """Manages database operations for portfolio content"""
    
    def __init__(self):
        """Initialize database connection configuration"""
        self.config = {
            'user': os.getenv('DB_USER', 'root'),
            'password': os.getenv('DB_PASSWORD', ''),
            'host': os.getenv('DB_HOST', 'localhost'),
            'database': os.getenv('DB_NAME', 'portfolio_db'),
            'raise_on_warnings': True,
            'charset': 'utf8mb4',
            'collation': 'utf8mb4_unicode_ci'
        }
        self.connection = None
        self.cursor = None
    
    def connect(self):
        """Establish database connection"""
        try:
            self.connection = mysql.connector.connect(**self.config)
            self.cursor = self.connection.cursor()
            print("✅ Database connection established successfully.")
            return True
        except mysql.connector.Error as err:
            print(f"❌ Database connection failed: {err}")
            return False
    
    def disconnect(self):
        """Close database connection"""
        try:
            if self.cursor:
                self.cursor.close()
            if self.connection:
                self.connection.close()
            print("✅ Database connection closed.")
        except mysql.connector.Error as err:
            print(f"⚠️ Error closing connection: {err}")
    
    def create_database(self):
        """Create database if it doesn't exist"""
        try:
            temp_config = self.config.copy()
            del temp_config['database']
            temp_connection = mysql.connector.connect(**temp_config)
            temp_cursor = temp_connection.cursor()
            
            create_db_query = f"""
            CREATE DATABASE IF NOT EXISTS {self.config['database']}
            CHARACTER SET {self.config['charset']}
            COLLATE {self.config['collation']}
            """
            temp_cursor.execute(create_db_query)
            print(f"✅ Database '{self.config['database']}' created or already exists.")
            
            temp_cursor.close()
            temp_connection.close()
            return True
            
        except mysql.connector.Error as err:
            print(f"❌ Error creating database: {err}")
            return False
    
    def create_articles_table(self):
        """Create articles table"""
        try:
            create_table_query = """
            CREATE TABLE IF NOT EXISTS articles (
                id INT AUTO_INCREMENT PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                slug VARCHAR(255) NOT NULL UNIQUE,
                category VARCHAR(100),
                description TEXT,
                content LONGTEXT,
                body TEXT NOT NULL,
                date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
                tags JSON,
                type ENUM('article', 'note') DEFAULT 'article',
                image JSON,
                author_id INT DEFAULT 1,
                like_count INT DEFAULT 0,
                share_count INT DEFAULT 0,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                INDEX idx_date (date),
                INDEX idx_type (type),
                INDEX idx_slug (slug)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
            """
            self.cursor.execute(create_table_query)
            print("✅ Articles table created successfully.")
            return True
            
        except mysql.connector.Error as err:
            print(f"❌ Error creating articles table: {err}")
            return False
    
    def create_projects_table(self):
        """Create projects table"""
        try:
            create_table_query = """
            CREATE TABLE IF NOT EXISTS projects (
                id INT AUTO_INCREMENT PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                slug VARCHAR(255) NOT NULL UNIQUE,
                description TEXT,
                image JSON,
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
            self.cursor.execute(create_table_query)
            print("✅ Projects table created successfully.")
            return True
            
        except mysql.connector.Error as err:
            print(f"❌ Error creating projects table: {err}")
            return False
    
    def create_testimonials_table(self):
        """Create testimonials table"""
        try:
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
            self.cursor.execute(create_table_query)
            print("✅ Testimonials table created successfully.")
            return True
            
        except mysql.connector.Error as err:
            print(f"❌ Error creating testimonials table: {err}")
            return False
    
    def create_books_table(self):
        """Create books table"""
        try:
            create_table_query = """
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
            self.cursor.execute(create_table_query)
            print("✅ Books table created successfully.")
            return True
            
        except mysql.connector.Error as err:
            print(f"❌ Error creating books table: {err}")
            return False
    
    def create_tools_table(self):
        """Create tools table"""
        try:
            create_table_query = """
            CREATE TABLE IF NOT EXISTS tools (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(100) NOT NULL,
                category VARCHAR(100),
                description TEXT,
                icon VARCHAR(10),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
            """
            self.cursor.execute(create_table_query)
            print("✅ Tools table created successfully.")
            return True
            
        except mysql.connector.Error as err:
            print(f"❌ Error creating tools table: {err}")
            return False
    
    def create_dev_resources_table(self):
        """Create dev_resources table"""
        try:
            create_table_query = """
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
            self.cursor.execute(create_table_query)
            print("✅ Dev Resources table created successfully.")
            return True
            
        except mysql.connector.Error as err:
            print(f"❌ Error creating dev_resources table: {err}")
            return False
    
    def create_podcasts_table(self):
        """Create podcasts table"""
        try:
            create_table_query = """
            CREATE TABLE IF NOT EXISTS podcasts (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(150) NOT NULL,
                description TEXT,
                url TEXT,
                icon VARCHAR(10),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
            """
            self.cursor.execute(create_table_query)
            print("✅ Podcasts table created successfully.")
            return True
            
        except mysql.connector.Error as err:
            print(f"❌ Error creating podcasts table: {err}")
            return False
    
    def create_youtube_channels_table(self):
        """Create youtube_channels table"""
        try:
            create_table_query = """
            CREATE TABLE IF NOT EXISTS youtube_channels (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(150) NOT NULL,
                description TEXT,
                url TEXT,
                icon VARCHAR(10),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
            """
            self.cursor.execute(create_table_query)
            print("✅ YouTube Channels table created successfully.")
            return True
            
        except mysql.connector.Error as err:
            print(f"❌ Error creating youtube_channels table: {err}")
            return False
    
    def create_theology_resources_table(self):
        """Create theology_resources table"""
        try:
            create_table_query = """
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
            self.cursor.execute(create_table_query)
            print("✅ Theology Resources table created successfully.")
            return True
            
        except mysql.connector.Error as err:
            print(f"❌ Error creating theology_resources table: {err}")
            return False
    
    def create_users_table(self):
        """Create users table for authentication"""
        try:
            create_table_query = """
            CREATE TABLE IF NOT EXISTS users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                username VARCHAR(50) UNIQUE NOT NULL,
                email VARCHAR(255) UNIQUE NOT NULL,
                password_hash VARCHAR(255) NOT NULL,
                full_name VARCHAR(255),
                role ENUM('admin', 'editor', 'viewer') DEFAULT 'viewer',
                is_active BOOLEAN DEFAULT TRUE,
                last_login DATETIME,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                INDEX idx_username (username),
                INDEX idx_email (email),
                INDEX idx_role (role)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
            """
            self.cursor.execute(create_table_query)
            print("✅ Users table created successfully.")
            return True
            
        except mysql.connector.Error as err:
            print(f"❌ Error creating users table: {err}")
            return False
    
    def insert_sample_data(self):
        """Insert sample data into all tables"""
        try:
            # Sample articles
            self.insert_article('Getting Started with React', 'getting-started-with-react', 
                               'Web Development',
                               'A comprehensive guide to building modern web applications with React',
                               '{"sections": [{"title": "Introduction", "content": "React is a powerful JavaScript library..."}]}',
                               '2024-01-15 10:00:00', '["react", "javascript", "web-development"]', 'article')
            
            # Sample projects
            self.insert_project('Portfolio Website', 'portfolio-website',
                               'A modern, responsive portfolio website built with React and Node.js',
                               '{"url": "/images/portfolio.png", "alt": "Portfolio Website"}',
                               'https://devontaereid.com', 'https://github.com/devontaereid/portfolio',
                               '["react", "node.js", "webpack", "css3"]', 'web-development', True)
            
            # Sample testimonials
            self.insert_testimonial('John Smith', 'Senior Developer', 'TechCorp Inc.',
                                   'Devontae is an exceptional developer with strong problem-solving skills and attention to detail.',
                                   5, '{"url": "/images/john-smith.jpg", "alt": "John Smith"}', True)
            
            # Sample books
            self.insert_book('Clean Code', 'Robert C. Martin', 'programming', 'A handbook of agile software craftsmanship',
                            '📚', 5, 'Read', True, 'https://amazon.com/clean-code', '/images/clean-code.jpg')
            
            # Sample tools
            self.insert_tool('VS Code', 'development', 'Popular code editor with extensive plugin ecosystem', '💻')
            
            # Sample dev resources
            self.insert_dev_resource('MDN Web Docs', 'documentation', 'Comprehensive documentation for web technologies',
                                    'https://developer.mozilla.org', '📖')
            
            # Sample podcasts
            self.insert_podcast('Syntax', 'A Tasty Treats Podcast for Web Developers',
                               'https://syntax.fm', '🎧')
            
            # Sample YouTube channels
            self.insert_youtube_channel('Traversy Media', 'Web development tutorials and courses',
                                       'https://youtube.com/traversymedia', '📺')
            
            # Sample theology resources
            self.insert_theology_resource('Ligonier Ministries', 'apologetics', 'Reformed theology resources and teaching',
                                         'https://ligonier.org', '✝️')
            
            print("✅ Sample data inserted successfully.")
            return True
            
        except Exception as err:
            print(f"❌ Error inserting sample data: {err}")
            return False
    
    def insert_article(self, title, slug, category, description, content, date, tags, type_article):
        """Insert article with error handling"""
        try:
            query = """
            INSERT INTO articles (title, slug, category, description, content, date, tags, type, body)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
            """
            body = f"{title}\n\n{description}"
            data = (title, slug, category, description, content, date, tags, type_article, body)
            self.cursor.execute(query, data)
            self.connection.commit()
            print(f"✅ Article '{title}' inserted.")
            
        except mysql.connector.errors.IntegrityError as e:
            if e.errno == errorcode.ER_DUP_ENTRY:
                print(f"⚠️ Article with slug '{slug}' already exists.")
            else:
                print(f"❌ Integrity error inserting article '{title}': {e}")
        except Exception as e:
            print(f"❌ Error inserting article '{title}': {e}")
    
    def insert_project(self, title, slug, description, image, link, github_link, technologies, category, featured):
        """Insert project with error handling"""
        try:
            query = """
            INSERT INTO projects (title, slug, description, image, link, github_link, technologies, category, featured)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
            """
            data = (title, slug, description, image, link, github_link, technologies, category, featured)
            self.cursor.execute(query, data)
            self.connection.commit()
            print(f"✅ Project '{title}' inserted.")
            
        except mysql.connector.errors.IntegrityError as e:
            if e.errno == errorcode.ER_DUP_ENTRY:
                print(f"⚠️ Project with slug '{slug}' already exists.")
            else:
                print(f"❌ Integrity error inserting project '{title}': {e}")
        except Exception as e:
            print(f"❌ Error inserting project '{title}': {e}")
    
    def insert_testimonial(self, name, role, company, content, rating, image, featured):
        """Insert testimonial with error handling"""
        try:
            query = """
            INSERT INTO testimonials (name, role, company, content, rating, image, featured)
            VALUES (%s, %s, %s, %s, %s, %s, %s)
            """
            data = (name, role, company, content, rating, image, featured)
            self.cursor.execute(query, data)
            self.connection.commit()
            print(f"✅ Testimonial from '{name}' inserted.")
            
        except Exception as e:
            print(f"❌ Error inserting testimonial from '{name}': {e}")
    
    def insert_book(self, title, author, category, description, cover, rating, status, featured, link, image):
        """Insert book with error handling"""
        try:
            query = """
            INSERT INTO books (title, author, category, description, cover, rating, status, featured, link, image)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
            """
            data = (title, author, category, description, cover, rating, status, featured, link, image)
            self.cursor.execute(query, data)
            self.connection.commit()
            print(f"✅ Book '{title}' inserted.")
            
        except Exception as e:
            print(f"❌ Error inserting book '{title}': {e}")
    
    def insert_tool(self, name, category, description, icon):
        """Insert tool with error handling"""
        try:
            query = """
            INSERT INTO tools (name, category, description, icon)
            VALUES (%s, %s, %s, %s)
            """
            data = (name, category, description, icon)
            self.cursor.execute(query, data)
            self.connection.commit()
            print(f"✅ Tool '{name}' inserted.")
            
        except Exception as e:
            print(f"❌ Error inserting tool '{name}': {e}")
    
    def insert_dev_resource(self, name, category, description, url, icon):
        """Insert dev resource with error handling"""
        try:
            query = """
            INSERT INTO dev_resources (name, category, description, url, icon)
            VALUES (%s, %s, %s, %s, %s)
            """
            data = (name, category, description, url, icon)
            self.cursor.execute(query, data)
            self.connection.commit()
            print(f"✅ Dev Resource '{name}' inserted.")
            
        except Exception as e:
            print(f"❌ Error inserting dev resource '{name}': {e}")
    
    def insert_podcast(self, name, description, url, icon):
        """Insert podcast with error handling"""
        try:
            query = """
            INSERT INTO podcasts (name, description, url, icon)
            VALUES (%s, %s, %s, %s)
            """
            data = (name, description, url, icon)
            self.cursor.execute(query, data)
            self.connection.commit()
            print(f"✅ Podcast '{name}' inserted.")
            
        except Exception as e:
            print(f"❌ Error inserting podcast '{name}': {e}")
    
    def insert_youtube_channel(self, name, description, url, icon):
        """Insert YouTube channel with error handling"""
        try:
            query = """
            INSERT INTO youtube_channels (name, description, url, icon)
            VALUES (%s, %s, %s, %s)
            """
            data = (name, description, url, icon)
            self.cursor.execute(query, data)
            self.connection.commit()
            print(f"✅ YouTube Channel '{name}' inserted.")
            
        except Exception as e:
            print(f"❌ Error inserting YouTube channel '{name}': {e}")
    
    def insert_theology_resource(self, name, category, description, url, icon):
        """Insert theology resource with error handling"""
        try:
            query = """
            INSERT INTO theology_resources (name, category, description, url, icon)
            VALUES (%s, %s, %s, %s, %s)
            """
            data = (name, category, description, url, icon)
            self.cursor.execute(query, data)
            self.connection.commit()
            print(f"✅ Theology Resource '{name}' inserted.")
            
        except Exception as e:
            print(f"❌ Error inserting theology resource '{name}': {e}")
    
    def insert_user(self, username, email, password_hash, full_name, role):
        """Insert user with error handling"""
        try:
            query = """
            INSERT INTO users (username, email, password_hash, full_name, role)
            VALUES (%s, %s, %s, %s, %s)
            """
            data = (username, email, password_hash, full_name, role)
            self.cursor.execute(query, data)
            self.connection.commit()
            print(f"✅ User '{username}' inserted.")
            
        except mysql.connector.errors.IntegrityError as e:
            if e.errno == errorcode.ER_DUP_ENTRY:
                print(f"⚠️ User '{username}' already exists.")
            else:
                print(f"❌ Integrity error inserting user '{username}': {e}")
        except Exception as e:
            print(f"❌ Error inserting user '{username}': {e}")
    
    def create_all_tables(self):
        """Create all database tables"""
        print("\n🚀 Creating database tables...")
        
        tables_created = 0
        total_tables = 8
        
        if self.create_articles_table():
            tables_created += 1
        if self.create_projects_table():
            tables_created += 1
        if self.create_testimonials_table():
            tables_created += 1
        if self.create_books_table():
            tables_created += 1
        if self.create_tools_table():
            tables_created += 1
        if self.create_dev_resources_table():
            tables_created += 1
        if self.create_podcasts_table():
            tables_created += 1
        if self.create_youtube_channels_table():
            tables_created += 1
        if self.create_theology_resources_table():
            tables_created += 1
        
        print(f"\n📊 Database setup complete: {tables_created}/{total_tables} tables created successfully.")
        return tables_created == total_tables
    
    def load_all_data(self):
        """Load all data using the individual loading scripts"""
        print("\n📝 Loading data from JSON files...")
        
        # Import and run loading scripts
        try:
            import subprocess
            import sys
            import os
            
            # Get the directory of this script
            script_dir = os.path.dirname(os.path.abspath(__file__))
            
            # List of loading scripts to run
            loading_scripts = [
                'load_article.py',
                'load_resources.py', 
                'load_projects.py',
                'load_testimonials.py'
            ]
            
            for script in loading_scripts:
                script_path = os.path.join(script_dir, script)
                if os.path.exists(script_path):
                    print(f"\n🔄 Running {script}...")
                    try:
                        result = subprocess.run([sys.executable, script_path], 
                                              cwd=script_dir, 
                                              capture_output=True, 
                                              text=True)
                        if result.returncode == 0:
                            print(f"✅ {script} completed successfully")
                            if result.stdout:
                                print(result.stdout)
                        else:
                            print(f"⚠️ {script} completed with warnings")
                            if result.stderr:
                                print(result.stderr)
                    except Exception as e:
                        print(f"❌ Error running {script}: {e}")
                else:
                    print(f"⚠️ {script} not found, skipping...")
            
            print("\n✅ All data loading scripts completed.")
            return True
            
        except Exception as e:
            print(f"❌ Error loading data: {e}")
            return False

def main():
    """Main function to run the database setup"""
    print("🎯 Portfolio Database Setup Script")
    print("=" * 50)
    
    # Check if .env file exists
    if not os.path.exists('.env'):
        print("⚠️  .env file not found. Using default database configuration.")
        print("   Create a .env file with the following variables:")
        print("   DB_USER=your_username")
        print("   DB_PASSWORD=your_password")
        print("   DB_HOST=localhost")
        print("   DB_NAME=portfolio_db")
    
    # Initialize database manager
    db_manager = DatabaseManager()
    
    try:
        # Create database
        # if not db_manager.create_database():
        #     print("❌ Failed to create database. Exiting.")
        #     sys.exit(1)
        
        # Connect to database
        if not db_manager.connect():
            print("❌ Failed to connect to database. Exiting.")
            sys.exit(1)
        
        # Create all tables
        if not db_manager.create_all_tables():
            print("❌ Failed to create all tables. Exiting.")
            sys.exit(1)
        
        # Insert sample data
        # print("\n📝 Inserting sample data...")
        # db_manager.insert_sample_data()
        
        # Load all data
        if not db_manager.load_all_data():
            print("❌ Failed to load all data. Exiting.")
            sys.exit(1)
        
        print("\n🎉 Database setup completed successfully!")
        print("\n📋 Next steps:")
        print("   1. Update your PHP API configuration in config.php")
        print("   2. Test the API endpoints")
        print("   3. Customize the sample data as needed")
        
    except KeyboardInterrupt:
        print("\n⚠️  Setup interrupted by user.")
    except Exception as e:
        print(f"\n❌ Unexpected error: {e}")
        sys.exit(1)
    finally:
        db_manager.disconnect()

if __name__ == "__main__":
    main()


# DROP TABLE articles;
# DROP TABLE books;
# DROP TABLE projects;
# DROP TABLE tools;
# DROP TABLE dev_resources;
# DROP TABLE podcasts;
# DROP TABLE youtube_channels;
# DROP TABLE theology_resources;
# DROP TABLE testimonials;

# Script to check if the files are in the correct place
# ls -la dev/docs/ && echo "---" && ls -la dev/scripts/