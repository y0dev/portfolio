# Database Setup for Article Creator

The Article Creator now supports storing articles in a MySQL database for better content management. The infrastructure is ready for future use, but the application currently continues to use static files.

## Setup Instructions

### 1. Database Configuration

Create a `.env` file in the `article-creator` directory with your database credentials:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=portfolio
DB_PORT=3306
```

### 2. Create Database and Table

Run the SQL schema file to create the articles table:

```bash
mysql -u root -p portfolio < article-creator/database/schema.sql
```

Or manually run the SQL in `database/schema.sql`:

The schema includes:

**Articles Table:**
- Basic article fields (id, title, slug, description, date, tags, type, image, content)
- **Engagement metrics** (likes, views, comments, shares, replies, reposts) - ready for future use
- **Slug field** for SEO-friendly URLs - ready for future use
- Indexes on type, date, and slug for performance

**Projects Table:**
- Project fields (id, title, slug, description, technologies, image, link, github)
- `is_emoji` boolean for emoji-based images
- `featured` boolean for featured projects
- Indexes on featured and slug

**Resources Tables:**
- `resource_books` - Books with author, category, rating, status, featured flag
- `resource_tools` - Development tools with category
- `resource_dev_resources` - Developer resources (documentation, platforms)
- `resource_podcasts` - Podcasts with category
- `resource_youtube_channels` - YouTube channels with category
- `resource_theology_resources` - Theology resources with category
- All resource tables have indexes on category for filtering

### 3. Features

**Articles:**
- **List Articles**: Navigate to `/articles` to see all articles stored in the database
- **Edit Articles**: Click "Edit" on any article to modify it
- **Delete Articles**: Click "Delete" (and confirm) to remove an article
- **Create Articles**: Articles created via the main page can be saved to the database using the API

**Projects & Resources:**
- Database infrastructure is ready for projects and resources
- Use the functions in `lib/db-projects.ts` and `lib/db-resources.ts` for CRUD operations
- All resource types (books, tools, dev_resources, podcasts, youtube_channels, theology_resources) are supported

### 4. API Endpoints

The database API is available at `/api/articles/db`:

**Articles:**
- `GET /api/articles/db` - Get all articles
- `GET /api/articles/db?id=<article_id>` - Get a specific article
- `POST /api/articles/db` - Create a new article
- `PUT /api/articles/db` - Update an existing article
- `DELETE /api/articles/db?id=<article_id>` - Delete an article

**Projects & Resources:**
- API endpoints can be created using the utility functions in:
  - `lib/db-projects.ts` - For projects CRUD operations
  - `lib/db-resources.ts` - For all resource types (books, tools, dev_resources, podcasts, youtube_channels, theology_resources)

### 5. Engagement Metrics (Future Use)

The database includes engagement metrics fields that are ready for future use:
- `post_likes` - Number of likes
- `post_views` - Number of views
- `post_comments` - Number of comments
- `post_shares` - Number of shares
- `post_replies` - Number of replies
- `post_reposts` - Number of reposts

Use the functions in `lib/db-metrics.ts` to manage these metrics:
- `getArticleMetrics(id)` - Get all metrics for an article
- `incrementMetric(id, metric, amount)` - Increment a specific metric
- `updateMetrics(id, metrics)` - Update multiple metrics at once

### 6. Slug Support (Future Use)

The database includes a `slug` field that is automatically generated from the article title. This is ready for SEO-friendly URLs in the future.

Use `getArticleBySlug(slug)` in `lib/db.ts` to fetch articles by slug instead of ID.

### 7. Docker Configuration

If using Docker Compose, add the database environment variables to your `.env` file:

```env
DB_HOST=your_db_host
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=portfolio
DB_PORT=3306
```

The database initialization happens automatically on the first API call.

### 8. HTML to Markdown Conversion

When editing articles, the system automatically converts HTML content back to Markdown. This conversion handles most common HTML elements, but complex HTML structures may require manual editing.

### 9. Current Status

**The application currently uses static files** for the portfolio, but all database infrastructure is in place and ready to use when you decide to switch:

- **Articles**: Static files in `src/data/articles.ts`
- **Projects**: Static files in `src/data/projects.json`
- **Resources**: Static files in `src/data/resources.json`

The database schema and code support:
- Full CRUD operations for articles, projects, and all resource types
- Engagement metrics tracking for articles
- Slug-based URLs for articles and projects
- Search and filtering capabilities
- Featured items support for projects and books
