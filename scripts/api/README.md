# Portfolio PHP API

A comprehensive RESTful API for managing portfolio content including articles, projects, testimonials, books, and resources.

## Features

- **RESTful API Design**: Standard HTTP methods (GET, POST, PUT, DELETE)
- **CRUD Operations**: Full Create, Read, Update, Delete functionality
- **Pagination**: Built-in pagination support for large datasets
- **Search & Filtering**: Advanced search and filtering capabilities
- **CORS Support**: Cross-origin resource sharing enabled
- **Rate Limiting**: Request rate limiting to prevent abuse
- **Input Validation**: Comprehensive input validation and sanitization
- **Error Handling**: Detailed error responses with proper HTTP status codes
- **Logging**: Request and error logging for debugging
- **Security**: JWT authentication support and SQL injection prevention

## Requirements

- PHP 7.4 or higher
- MySQL 5.7 or higher
- Apache/Nginx web server
- PDO MySQL extension
- JSON extension

## Installation

1. **Clone or download the API files** to your web server directory:
   ```
   /path/to/your/website/scripts/api/
   ```

2. **Configure the database** in `config.php`:
   ```php
   define('DB_HOST', 'localhost');
   define('DB_NAME', 'portfolio_db');
   define('DB_USERNAME', 'your_username');
   define('DB_PASSWORD', 'your_password');
   ```

3. **Create the database tables** using the SQL schema:
   ```bash
   mysql -u your_username -p portfolio_db < ../database_schema.sql
   ```

4. **Set proper permissions**:
   ```bash
   chmod 755 scripts/api/
   chmod 644 scripts/api/*.php
   mkdir scripts/api/logs
   mkdir scripts/api/cache
   chmod 777 scripts/api/logs
   chmod 777 scripts/api/cache
   ```

## API Endpoints

### Base URL
```
http://your-domain.com/scripts/api/
```

### Articles
- `GET /articles` - Get all articles with pagination and filters
- `GET /articles/{id}` - Get single article by ID
- `POST /articles` - Create new article
- `PUT /articles/{id}` - Update article
- `DELETE /articles/{id}` - Delete article

### Projects
- `GET /projects` - Get all projects with pagination and filters
- `GET /projects/{id}` - Get single project by ID
- `POST /projects` - Create new project
- `PUT /projects/{id}` - Update project
- `DELETE /projects/{id}` - Delete project

### Testimonials
- `GET /testimonials` - Get all testimonials with pagination and filters
- `GET /testimonials/{id}` - Get single testimonial by ID
- `POST /testimonials` - Create new testimonial
- `PUT /testimonials/{id}` - Update testimonial
- `DELETE /testimonials/{id}` - Delete testimonial

### Books
- `GET /books` - Get all books with pagination and filters
- `GET /books/{id}` - Get single book by ID
- `POST /books` - Create new book
- `PUT /books/{id}` - Update book
- `DELETE /books/{id}` - Delete book

### Resources
- `GET /resources` - Get all resources with pagination and filters
- `GET /resources/{id}` - Get single resource by ID
- `POST /resources` - Create new resource
- `PUT /resources/{id}` - Update resource
- `DELETE /resources/{id}` - Delete resource

## Query Parameters

### Pagination
- `page` - Page number (default: 1)
- `per_page` - Items per page (default: 6, max: 100)

### Filtering
- `search` - Search term for filtering
- `category` - Filter by category
- `tags` - Filter by tags (articles, resources)
- `technologies` - Filter by technologies (projects)
- `author` - Filter by author (books)
- `rating` - Filter by rating (testimonials, books)
- `type` - Filter by type (resources)

### Sorting
- `sort_by` - Sort field (default: created_at)
- `sort_order` - Sort order: ASC or DESC (default: DESC)

## Usage Examples

### Get All Articles
```bash
curl -X GET "http://localhost/scripts/api/articles"
```

### Get Articles with Pagination
```bash
curl -X GET "http://localhost/scripts/api/articles?page=1&per_page=10"
```

### Search Articles
```bash
curl -X GET "http://localhost/scripts/api/articles?search=react&category=technology"
```

### Create New Article
```bash
curl -X POST "http://localhost/scripts/api/articles" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "My New Article",
    "content": "Article content here...",
    "category": "technology",
    "tags": ["react", "javascript", "web-development"]
  }'
```

### Update Article
```bash
curl -X PUT "http://localhost/scripts/api/articles/1" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Updated Article Title",
    "content": "Updated content..."
  }'
```

### Delete Article
```bash
curl -X DELETE "http://localhost/scripts/api/articles/1"
```

## JavaScript/Fetch Examples

### Get Articles
```javascript
fetch('http://localhost/scripts/api/articles')
  .then(response => response.json())
  .then(data => {
    console.log('Articles:', data.data);
    console.log('Pagination:', data.pagination);
  })
  .catch(error => console.error('Error:', error));
```

### Create Article
```javascript
fetch('http://localhost/scripts/api/articles', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    title: 'New Article',
    content: 'Article content...',
    category: 'technology',
    tags: ['javascript', 'react']
  })
})
.then(response => response.json())
.then(data => console.log('Created:', data))
.catch(error => console.error('Error:', error));
```

### Search with Filters
```javascript
const params = new URLSearchParams({
  search: 'react',
  category: 'technology',
  page: 1,
  per_page: 10
});

fetch(`http://localhost/scripts/api/articles?${params}`)
  .then(response => response.json())
  .then(data => console.log('Filtered results:', data));
```

## Response Format

### Success Response
```json
{
  "success": true,
  "message": "Articles retrieved successfully",
  "data": [...],
  "pagination": {
    "current_page": 1,
    "per_page": 6,
    "total": 25,
    "total_pages": 5,
    "has_next": true,
    "has_prev": false
  },
  "timestamp": "2024-01-15 10:30:00"
}
```

### Error Response
```json
{
  "success": false,
  "message": "Article not found",
  "timestamp": "2024-01-15 10:30:00"
}
```

## Testing

Run the test file to verify API functionality:

```bash
php scripts/api/test.php
```

Or access the test file in your browser:
```
http://localhost/scripts/api/test.php
```

## Configuration

### Environment Variables
You can set environment variables in your web server configuration or use a `.env` file:

```bash
DB_HOST=localhost
DB_NAME=portfolio_db
DB_USERNAME=your_username
DB_PASSWORD=your_password
API_RATE_LIMIT=100
DEBUG_MODE=true
```

### CORS Configuration
Update allowed origins in `config.php`:

```php
define('ALLOWED_ORIGINS', [
    'http://localhost:3000',
    'http://localhost:8081',
    'https://yourdomain.com'
]);
```

## Security Considerations

1. **Change default secrets** in `config.php`:
   - `JWT_SECRET`
   - `PASSWORD_SALT`

2. **Use HTTPS** in production

3. **Implement authentication** for protected endpoints

4. **Validate and sanitize** all input data

5. **Use prepared statements** (already implemented)

6. **Set proper file permissions**

## Error Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `404` - Not Found
- `405` - Method Not Allowed
- `429` - Rate Limit Exceeded
- `500` - Internal Server Error

## Logging

Logs are stored in `scripts/api/logs/` with daily rotation:
- `YYYY-MM-DD.log` - Daily log files
- Log levels: DEBUG, INFO, WARNING, ERROR

## Rate Limiting

- Default: 100 requests per minute per IP
- Configurable in `config.php`
- Rate limit data stored in `scripts/api/cache/`

## Support

For issues or questions:
1. Check the logs in `scripts/api/logs/`
2. Verify database connection
3. Ensure proper file permissions
4. Check web server error logs

## License

This API is part of the portfolio project and follows the same license terms. 