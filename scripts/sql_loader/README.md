# Portfolio Database Setup Script

A Python script to automatically create and populate database tables for the portfolio content management system.

## Features

- **Automated Database Creation**: Creates the portfolio database if it doesn't exist
- **Table Management**: Creates all necessary tables with proper indexes and constraints
- **Sample Data**: Inserts sample content for testing and demonstration
- **Error Handling**: Comprehensive exception handling with informative error messages
- **Environment Configuration**: Uses .env file for database configuration
- **Modular Design**: Object-oriented approach with clear separation of concerns

## Requirements

- Python 3.7 or higher
- MySQL 5.7 or higher (with JSON support)
- MySQL Connector for Python
- python-dotenv

## Installation

1. **Install Python dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

2. **Create environment file:**
   Create a `.env` file in the project root with your database configuration:
   ```env
   DB_USER=your_username
   DB_PASSWORD=your_password
   DB_HOST=localhost
   DB_NAME=portfolio_db
   ```

3. **Run the setup script:**
   ```bash
   python main.py
   ```

## Database Tables Created

### 1. Articles Table
- **Purpose**: Store blog articles and notes
- **Key Fields**: title, slug, description, content, tags, type, image
- **Features**: JSON support for tags and content, unique slugs, timestamps

### 2. Projects Table
- **Purpose**: Store portfolio projects
- **Key Fields**: title, slug, description, image, link, github_link, technologies, category
- **Features**: JSON support for technologies, featured flag, category indexing

### 3. Testimonials Table
- **Purpose**: Store client testimonials and recommendations
- **Key Fields**: name, role, company, content, rating, image
- **Features**: Rating validation (1-5), featured flag, timestamps

### 4. Books Table
- **Purpose**: Store recommended books and reading list
- **Key Fields**: title, author, description, cover_image, category, rating, amazon_link
- **Features**: ISBN support, page count, publication year, rating validation

### 5. Resources Table
- **Purpose**: Store useful resources and tools
- **Key Fields**: title, description, link, category, type, tags
- **Features**: Multiple resource types (tool, website, podcast, etc.), JSON tags

### 6. Users Table
- **Purpose**: User authentication and management
- **Key Fields**: username, email, password_hash, role, is_active
- **Features**: Role-based access control, last login tracking

## Sample Data

The script automatically inserts sample data for testing:

### Articles
- "Getting Started with React" - A comprehensive guide to React development

### Projects
- "Portfolio Website" - A modern React portfolio website
- "Task Management App" - Full-stack task management application

### Testimonials
- John Smith (Senior Developer at TechCorp Inc.)
- Sarah Johnson (Project Manager at StartupXYZ)

### Books
- "Clean Code" by Robert C. Martin
- "The Pragmatic Programmer" by Andrew Hunt & David Thomas
- "Systematic Theology" by Wayne Grudem

### Resources
- MDN Web Docs
- React Documentation
- Syntax.fm Podcast
- VS Code

### Users
- Admin user with credentials (username: admin, password: admin123)

## Usage Examples

### Basic Setup
```bash
# Install dependencies
pip install -r requirements.txt

# Create .env file with your database credentials
echo "DB_USER=root" > .env
echo "DB_PASSWORD=your_password" >> .env
echo "DB_HOST=localhost" >> .env
echo "DB_NAME=portfolio_db" >> .env

# Run the setup script
python main.py
```

### Custom Configuration
You can modify the sample data by editing the `insert_sample_data()` method in the `DatabaseManager` class.

### Error Handling
The script includes comprehensive error handling:
- Database connection failures
- Table creation errors
- Duplicate entry handling
- Data insertion errors

## Output

The script provides detailed feedback during execution:

```
🎯 Portfolio Database Setup Script
==================================================
✅ Database 'portfolio_db' created or already exists.
✅ Database connection established successfully.

🚀 Creating database tables...
✅ Articles table created successfully.
✅ Projects table created successfully.
✅ Testimonials table created successfully.
✅ Books table created successfully.
✅ Resources table created successfully.
✅ Users table created successfully.

📊 Database setup complete: 6/6 tables created successfully.

📝 Inserting sample data...
✅ Article 'Getting Started with React' inserted.
✅ Project 'Portfolio Website' inserted.
✅ Testimonial from 'John Smith' inserted.
✅ Book 'Clean Code' inserted.
✅ Resource 'MDN Web Docs' inserted.
✅ User 'admin' inserted.
✅ Sample data inserted successfully.

🎉 Database setup completed successfully!

📋 Next steps:
   1. Update your PHP API configuration in config.php
   2. Test the API endpoints
   3. Customize the sample data as needed
✅ Database connection closed.
```

## Troubleshooting

### Common Issues

1. **Database Connection Error**
   - Verify MySQL is running
   - Check database credentials in .env file
   - Ensure MySQL user has CREATE privileges

2. **Permission Errors**
   - Make sure the MySQL user has sufficient privileges
   - Check if the database exists and is accessible

3. **Duplicate Entry Errors**
   - The script handles duplicate entries gracefully
   - Existing data will not be overwritten

4. **JSON Support Error**
   - Ensure MySQL version 5.7+ for JSON support
   - Check MySQL configuration for JSON compatibility

### Debug Mode
For detailed error information, you can modify the script to include more verbose logging.

## Integration with PHP API

After running this script, you can use the PHP API (`database_api.php`) to interact with the database:

```php
// Example: Get all articles
$response = file_get_contents('http://localhost/scripts/database_api.php/articles');
$articles = json_decode($response, true);
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions, please contact:
- Email: devontae@devontaereid.com
- GitHub: https://github.com/devontaereid 