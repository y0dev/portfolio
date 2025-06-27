-- Portfolio Database Schema
-- Created by Devontae Reid

-- Create database
CREATE DATABASE IF NOT EXISTS portfolio_db
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

USE portfolio_db;

-- Articles table
CREATE TABLE IF NOT EXISTS articles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    content LONGTEXT,
    date DATETIME NOT NULL,
    tags JSON,
    type ENUM('article', 'note') DEFAULT 'article',
    image JSON,
    author_id INT DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_date (date),
    INDEX idx_type (type),
    INDEX idx_tags ((CAST(tags AS CHAR(100))))
);

-- Projects table
CREATE TABLE IF NOT EXISTS projects (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    image JSON,
    link VARCHAR(500),
    github_link VARCHAR(500),
    technologies JSON,
    category VARCHAR(100),
    date_created DATETIME DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_category (category),
    INDEX idx_date_created (date_created)
);

-- Testimonials table
CREATE TABLE IF NOT EXISTS testimonials (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(255),
    company VARCHAR(255),
    content TEXT NOT NULL,
    rating INT CHECK (rating >= 1 AND rating <= 5),
    image JSON,
    date_created DATETIME DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_rating (rating),
    INDEX idx_date_created (date_created)
);

-- Books table
CREATE TABLE IF NOT EXISTS books (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    author VARCHAR(255) NOT NULL,
    description TEXT,
    cover_image JSON,
    category VARCHAR(100),
    rating DECIMAL(2,1) CHECK (rating >= 0 AND rating <= 5),
    amazon_link VARCHAR(500),
    date_added DATETIME DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_category (category),
    INDEX idx_rating (rating),
    INDEX idx_date_added (date_added)
);

-- Resources table
CREATE TABLE IF NOT EXISTS resources (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    link VARCHAR(500) NOT NULL,
    category VARCHAR(100),
    type ENUM('tool', 'website', 'podcast', 'video', 'documentation', 'other') DEFAULT 'other',
    date_added DATETIME DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_category (category),
    INDEX idx_type (type),
    INDEX idx_date_added (date_added)
);

-- Users table (for future authentication)
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255),
    role ENUM('admin', 'editor', 'viewer') DEFAULT 'viewer',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_username (username),
    INDEX idx_email (email),
    INDEX idx_role (role)
);

-- Insert default admin user (password: admin123)
INSERT INTO users (username, email, password_hash, full_name, role) VALUES 
('admin', 'admin@devontaereid.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Devontae Reid', 'admin')
ON DUPLICATE KEY UPDATE id=id;

-- Sample data for articles
INSERT INTO articles (title, description, content, date, tags, type, image) VALUES 
(
    'Getting Started with React',
    'A comprehensive guide to building modern web applications with React',
    '{"sections": [{"title": "Introduction", "content": "React is a powerful JavaScript library..."}]}',
    '2024-01-15 10:00:00',
    '["react", "javascript", "web-development"]',
    'article',
    '{"url": "/images/react-logo.png", "alt": "React Logo"}'
),
(
    'Understanding JavaScript Promises',
    'Deep dive into asynchronous programming with JavaScript Promises',
    '{"sections": [{"title": "What are Promises?", "content": "Promises represent the eventual completion..."}]}',
    '2024-01-20 14:30:00',
    '["javascript", "async", "programming"]',
    'article',
    '{"url": "/images/promises.png", "alt": "JavaScript Promises"}'
);

-- Sample data for projects
INSERT INTO projects (title, description, image, link, github_link, technologies, category) VALUES 
(
    'Portfolio Website',
    'A modern, responsive portfolio website built with React and Node.js',
    '{"url": "/images/portfolio.png", "alt": "Portfolio Website"}',
    'https://devontaereid.com',
    'https://github.com/devontaereid/portfolio',
    '["react", "node.js", "webpack", "css3"]',
    'web-development'
),
(
    'Task Management App',
    'A full-stack task management application with real-time updates',
    '{"url": "/images/task-app.png", "alt": "Task Management App"}',
    'https://task-app.devontaereid.com',
    'https://github.com/devontaereid/task-app',
    '["react", "express", "mongodb", "socket.io"]',
    'full-stack'
);

-- Sample data for testimonials
INSERT INTO testimonials (name, role, company, content, rating, image) VALUES 
(
    'John Smith',
    'Senior Developer',
    'TechCorp Inc.',
    'Devontae is an exceptional developer with strong problem-solving skills and attention to detail.',
    5,
    '{"url": "/images/john-smith.jpg", "alt": "John Smith"}'
),
(
    'Sarah Johnson',
    'Project Manager',
    'StartupXYZ',
    'Working with Devontae was a pleasure. He delivered high-quality code on time and was always responsive to feedback.',
    5,
    '{"url": "/images/sarah-johnson.jpg", "alt": "Sarah Johnson"}'
);

-- Sample data for books
INSERT INTO books (title, author, description, cover_image, category, rating, amazon_link) VALUES 
(
    'Clean Code',
    'Robert C. Martin',
    'A handbook of agile software craftsmanship',
    '{"url": "/images/clean-code.jpg", "alt": "Clean Code Book Cover"}',
    'programming',
    4.5,
    'https://amazon.com/clean-code'
),
(
    'The Pragmatic Programmer',
    'Andrew Hunt, David Thomas',
    'Your journey to mastery',
    '{"url": "/images/pragmatic-programmer.jpg", "alt": "The Pragmatic Programmer Book Cover"}',
    'programming',
    4.8,
    'https://amazon.com/pragmatic-programmer'
),
(
    'Systematic Theology',
    'Wayne Grudem',
    'An introduction to biblical doctrine',
    '{"url": "/images/systematic-theology.jpg", "alt": "Systematic Theology Book Cover"}',
    'theology',
    4.7,
    'https://amazon.com/systematic-theology'
);

-- Sample data for resources
INSERT INTO resources (title, description, link, category, type) VALUES 
(
    'MDN Web Docs',
    'Comprehensive documentation for web technologies',
    'https://developer.mozilla.org',
    'documentation',
    'website'
),
(
    'React Documentation',
    'Official React documentation and tutorials',
    'https://react.dev',
    'documentation',
    'website'
),
(
    'Syntax.fm Podcast',
    'A podcast about web development',
    'https://syntax.fm',
    'learning',
    'podcast'
),
(
    'VS Code',
    'Powerful code editor for modern development',
    'https://code.visualstudio.com',
    'tools',
    'tool'
);

-- Create views for easier querying
CREATE VIEW articles_summary AS
SELECT 
    id,
    title,
    description,
    date,
    tags,
    type,
    image,
    created_at
FROM articles
ORDER BY date DESC;

CREATE VIEW projects_summary AS
SELECT 
    id,
    title,
    description,
    image,
    link,
    github_link,
    technologies,
    category,
    date_created
FROM projects
ORDER BY date_created DESC;

-- Create stored procedures for common operations
DELIMITER //

CREATE PROCEDURE GetArticlesByTag(IN tag_name VARCHAR(100))
BEGIN
    SELECT * FROM articles 
    WHERE JSON_CONTAINS(tags, JSON_QUOTE(tag_name))
    ORDER BY date DESC;
END //

CREATE PROCEDURE GetProjectsByTechnology(IN tech_name VARCHAR(100))
BEGIN
    SELECT * FROM projects 
    WHERE JSON_CONTAINS(technologies, JSON_QUOTE(tech_name))
    ORDER BY date_created DESC;
END //

CREATE PROCEDURE GetTopRatedBooks(IN limit_count INT)
BEGIN
    SELECT * FROM books 
    ORDER BY rating DESC, date_added DESC
    LIMIT limit_count;
END //

DELIMITER ;

-- Create indexes for better performance
CREATE INDEX idx_articles_title ON articles(title);
CREATE INDEX idx_projects_title ON projects(title);
CREATE INDEX idx_books_title ON books(title);
CREATE INDEX idx_books_author ON books(author);
CREATE INDEX idx_resources_title ON resources(title);

-- Grant permissions (adjust as needed)
-- GRANT SELECT, INSERT, UPDATE, DELETE ON portfolio_db.* TO 'your_username'@'localhost';
-- FLUSH PRIVILEGES; 