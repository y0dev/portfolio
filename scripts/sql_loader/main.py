import mysql.connector
from mysql.connector import errorcode
from dotenv import load_dotenv
import os

# Load environment variables
load_dotenv()

# DB CONFIG
config = {
    'user': os.getenv('DB_USER'),
    'password': os.getenv('DB_PASSWORD'),
    'host': os.getenv('DB_HOST'),
    'database': os.getenv('DB_NAME'),
    'raise_on_warnings': True
}

# Connect and create
try:
    cnx = mysql.connector.connect(**config)
    cursor = cnx.cursor()

    # Create articles table
    create_table_query = """
    CREATE TABLE IF NOT EXISTS articles (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        slug VARCHAR(255) NOT NULL UNIQUE,
        body TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        like_count INT DEFAULT 0,
        share_count INT DEFAULT 0
    );
    """
    cursor.execute(create_table_query)
    print("✅ Table created or already exists.")

    # Insert sample article
    insert_article_query = """
    INSERT INTO articles (title, slug, body)
    VALUES (%s, %s, %s)
    """
    article_data = (
        'My First Python Article',
        'my-first-python-article',
        'This article was inserted via Python script.'
    )

    try:
        cursor.execute(insert_article_query, article_data)
        cnx.commit()
        print("✅ Article inserted.")
    except mysql.connector.errors.IntegrityError as e:
        if e.errno == errorcode.ER_DUP_ENTRY:
            print("⚠️ Article with this slug already exists.")
        else:
            raise

except mysql.connector.Error as err:
    print(f"❌ Error: {err}")
finally:
    if 'cursor' in locals():
        cursor.close()
    if 'cnx' in locals():
        cnx.close()
