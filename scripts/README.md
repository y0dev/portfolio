# Portfolio Database API

A PHP-based REST API for managing portfolio content including articles, projects, testimonials, books, and resources.

## Features

- **RESTful API** with JSON responses
- **CRUD operations** for all content types
- **Database abstraction** with PDO
- **Error handling** and validation
- **CORS support** for cross-origin requests
- **Rate limiting** to prevent abuse
- **Caching** for improved performance
- **Security features** including input sanitization
- **Comprehensive logging**

## Requirements

- PHP 7.4 or higher
- MySQL 5.7 or higher (with JSON support)
- PDO MySQL extension
- Web server (Apache/Nginx)

## Installation

### 1. Database Setup

1. Create a MySQL database:
```sql
CREATE DATABASE portfolio_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

2. Import the database schema:
```bash
mysql -u your_username -p portfolio_db < database_schema.sql
```

### 2. Configuration

1. Update the database configuration in `config.php`:
```php
define('DB_HOST', 'localhost');
define('DB_NAME', 'portfolio_db');
define('DB_USERNAME', 'your_username');
define('DB_PASSWORD', 'your_password');
```

2. Update the API configuration as needed:
```php
define('API_BASE_URL', 'http://your-domain.com/scripts/database_api.php');
define('JWT_SECRET', 'your-secret-key-here');
```

### 3. File Permissions

Ensure the following directories are writable:
```bash
chmod 755 scripts/logs/
chmod 755 scripts/cache/
chmod 755 scripts/uploads/
```

## API Endpoints

### Articles

#### Get All Articles
```
GET /scripts/database_api.php/articles
```

**Query Parameters:**
- `limit` (optional): Number of articles to return
- `offset` (optional): Number of articles to skip
- `tag` (optional): Filter by tag

**Response:**
```json
{
  "success": true,
  "message": "Articles retrieved successfully",
  "data": [
    {
      "id": 1,
      "title": "Getting Started with React",
      "description": "A comprehensive guide...",
      "content": "...",
      "date": "2024-01-15 10:00:00",
      "tags": ["react", "javascript"],
      "type": "article",
      "image": {"url": "/images/react-logo.png", "alt": "React Logo"}
    }
  ],
  "timestamp": "2024-01-20 15:30:00"
}
```

#### Get Article by ID
```
GET /scripts/database_api.php/articles/{id}
```

#### Create Article
```
POST /scripts/database_api.php/articles
```

**Request Body:**
```json
{
  "title": "New Article Title",
  "description": "Article description",
  "content": "Article content in JSON format",
  "date": "2024-01-20 15:30:00",
  "tags": ["tag1", "tag2"],
  "type": "article",
  "image": {"url": "/images/article.jpg", "alt": "Article Image"},
  "author_id": 1
}
```

#### Update Article
```
PUT /scripts/database_api.php/articles/{id}
```

#### Delete Article
```
DELETE /scripts/database_api.php/articles/{id}
```

### Projects

#### Get All Projects
```
GET /scripts/database_api.php/projects
```

**Query Parameters:**
- `limit` (optional): Number of projects to return
- `offset` (optional): Number of projects to skip
- `category` (optional): Filter by category

#### Get Project by ID
```
GET /scripts/database_api.php/projects/{id}
```

#### Create Project
```
POST /scripts/database_api.php/projects
```

**Request Body:**
```json
{
  "title": "Project Title",
  "description": "Project description",
  "image": {"url": "/images/project.jpg", "alt": "Project Image"},
  "link": "https://project-url.com",
  "github_link": "https://github.com/user/project",
  "technologies": ["react", "node.js"],
  "category": "web-development"
}
```

### Testimonials

#### Get All Testimonials
```
GET /scripts/database_api.php/testimonials
```

#### Get Testimonial by ID
```
GET /scripts/database_api.php/testimonials/{id}
```

#### Create Testimonial
```
POST /scripts/database_api.php/testimonials
```

**Request Body:**
```json
{
  "name": "John Smith",
  "role": "Senior Developer",
  "company": "TechCorp Inc.",
  "content": "Testimonial content",
  "rating": 5,
  "image": {"url": "/images/john.jpg", "alt": "John Smith"}
}
```

### Books

#### Get All Books
```
GET /scripts/database_api.php/books
```

**Query Parameters:**
- `limit` (optional): Number of books to return
- `offset` (optional): Number of books to skip
- `category` (optional): Filter by category

#### Get Book by ID
```
GET /scripts/database_api.php/books/{id}
```

#### Create Book
```
POST /scripts/database_api.php/books
```

**Request Body:**
```json
{
  "title": "Book Title",
  "author": "Author Name",
  "description": "Book description",
  "cover_image": {"url": "/images/book-cover.jpg", "alt": "Book Cover"},
  "category": "programming",
  "rating": 4.5,
  "amazon_link": "https://amazon.com/book"
}
```

### Resources

#### Get All Resources
```
GET /scripts/database_api.php/resources
```

**Query Parameters:**
- `limit` (optional): Number of resources to return
- `offset` (optional): Number of resources to skip
- `category` (optional): Filter by category

#### Get Resource by ID
```
GET /scripts/database_api.php/resources/{id}
```

#### Create Resource
```
POST /scripts/database_api.php/resources
```

**Request Body:**
```json
{
  "title": "Resource Title",
  "description": "Resource description",
  "link": "https://resource-url.com",
  "category": "documentation",
  "type": "website"
}
```

## Error Handling

The API returns consistent error responses:

```json
{
  "success": false,
  "message": "Error description",
  "timestamp": "2024-01-20 15:30:00"
}
```

**Common HTTP Status Codes:**
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `404` - Not Found
- `405` - Method Not Allowed
- `500` - Internal Server Error

## Security Features

### Rate Limiting
- Default: 100 requests per minute per IP
- Configurable in `config.php`

### Input Validation
- All inputs are validated and sanitized
- SQL injection protection with prepared statements
- XSS protection with output encoding

### CORS
- Configurable allowed origins
- Preflight request handling

## Database Schema

### Articles Table
- `id` - Primary key
- `title` - Article title
- `description` - Article description
- `content` - Article content (JSON)
- `date` - Publication date
- `tags` - Tags (JSON array)
- `type` - Article type (article/note)
- `image` - Image data (JSON)
- `author_id` - Author ID

### Projects Table
- `id` - Primary key
- `title` - Project title
- `description` - Project description
- `image` - Project image (JSON)
- `link` - Project URL
- `github_link` - GitHub repository URL
- `technologies` - Technologies used (JSON array)
- `category` - Project category

### Testimonials Table
- `id` - Primary key
- `name` - Person's name
- `role` - Person's role
- `company` - Company name
- `content` - Testimonial content
- `rating` - Rating (1-5)
- `image` - Person's image (JSON)

### Books Table
- `id` - Primary key
- `title` - Book title
- `author` - Author name
- `description` - Book description
- `cover_image` - Book cover (JSON)
- `category` - Book category
- `rating` - Rating (0-5)
- `amazon_link` - Amazon link

### Resources Table
- `id` - Primary key
- `title` - Resource title
- `description` - Resource description
- `link` - Resource URL
- `category` - Resource category
- `type` - Resource type (tool/website/podcast/video/documentation/other)

## Usage Examples

### JavaScript/Fetch API

```javascript
// Get all articles
fetch('/scripts/database_api.php/articles')
  .then(response => response.json())
  .then(data => {
    if (data.success) {
      console.log('Articles:', data.data);
    } else {
      console.error('Error:', data.message);
    }
  });

// Create a new article
fetch('/scripts/database_api.php/articles', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    title: 'New Article',
    description: 'Article description',
    content: '{"sections": []}',
    date: '2024-01-20 15:30:00',
    tags: ['javascript', 'react'],
    type: 'article',
    image: {url: '/images/article.jpg', alt: 'Article Image'},
    author_id: 1
  })
})
.then(response => response.json())
.then(data => {
  if (data.success) {
    console.log('Article created:', data.data);
  } else {
    console.error('Error:', data.message);
  }
});
```

### cURL Examples

```bash
# Get all articles
curl -X GET "http://localhost/scripts/database_api.php/articles"

# Get articles with pagination
curl -X GET "http://localhost/scripts/database_api.php/articles?limit=5&offset=0"

# Get articles by tag
curl -X GET "http://localhost/scripts/database_api.php/articles?tag=react"

# Create a new article
curl -X POST "http://localhost/scripts/database_api.php/articles" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "New Article",
    "description": "Article description",
    "content": "{\"sections\": []}",
    "date": "2024-01-20 15:30:00",
    "tags": ["javascript", "react"],
    "type": "article",
    "image": {"url": "/images/article.jpg", "alt": "Article Image"},
    "author_id": 1
  }'
```

## Logging

Logs are stored in the `logs/` directory with daily rotation:
- Format: `YYYY-MM-DD.log`
- Contains: timestamp, level, message, and context

## Caching

Cache files are stored in the `cache/` directory:
- Automatic expiration based on configuration
- Manual cache clearing available
- Cache keys are MD5 hashed

## Troubleshooting

### Common Issues

1. **Database Connection Error**
   - Check database credentials in `config.php`
   - Ensure MySQL service is running
   - Verify database exists

2. **Permission Errors**
   - Ensure web server has write permissions to logs/, cache/, and uploads/ directories
   - Check file ownership

3. **CORS Issues**
   - Update `ALLOWED_ORIGINS` in `config.php`
   - Ensure proper CORS headers are set

4. **Rate Limiting**
   - Check rate limit configuration
   - Clear cache files if needed

### Debug Mode

Enable debug mode in `config.php`:
```php
define('DEBUG_MODE', true);
```

This will show detailed error messages and enable additional logging.

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