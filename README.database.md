# Database Configuration for Portfolio

The portfolio application now includes infrastructure to load data from a MySQL database instead of static files. By default, the application uses static files for backward compatibility.

## Configuration

### Environment Variables

Create a `.env.local` file in the portfolio root directory:

```env
# Database Configuration (optional)
# Set USE_DATABASE=true to enable database mode
USE_DATABASE=false

# Database connection settings (required if USE_DATABASE=true)
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=portfolio
DB_PORT=3306
```

### Important Notes

**Static Export Mode (Default):**

When `output: "export"` is set in `next.config.ts` (default), the application uses static file generation. In this mode:
- Database access is NOT available at runtime
- All pages are pre-rendered at build time
- If `USE_DATABASE=true`, the database must be accessible **at build time**
- If the database is not available at build time, the build will fail
- **Recommendation**: Keep `USE_DATABASE=false` for static export builds

**Server-Side Rendering Mode:**

To use the database at runtime, you must:
1. Remove or comment out `output: "export"` in `next.config.ts`
2. Set `USE_DATABASE=true` in your environment variables
3. Ensure your database is accessible from your deployment environment

## Database Schema

The portfolio uses the same database schema as the article-creator. Run the schema file to set up the database:

```bash
mysql -u root -p portfolio < article-creator/database/schema.sql
```

This creates tables for:
- `articles` - Blog articles and notes
- `projects` - Project portfolio items
- `resource_books` - Book resources
- `resource_tools` - Development tools
- `resource_dev_resources` - Developer resources
- `resource_podcasts` - Podcast resources
- `resource_youtube_channels` - YouTube channel resources
- `resource_theology_resources` - Theology resources

## Data Loading

The application uses data loader functions in `src/lib/data/` that automatically:
- Check the `USE_DATABASE` environment variable
- Load from database if enabled, otherwise use static files
- Fall back to static files if database access fails

**Data Loader Functions:**
- `src/lib/data/articles.ts` - `getArticles()`, `getArticleById()`, `getArticleBySlug()`, `getArticlesSync()`
- `src/lib/data/projects.ts` - `getProjects()`, `getFeaturedProjects()`
- `src/lib/data/resources.ts` - `getResources()`

## Usage Examples

### Static Mode (Default)

No configuration needed. The app automatically uses static files from:
- `src/data/articles.ts`
- `src/data/projects.json`
- `src/data/resources.json`

### Database Mode

1. Set up your database and run the schema
2. Create `.env.local` file with database configuration:
   ```env
   USE_DATABASE=true
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_password
   DB_NAME=portfolio
   DB_PORT=3306
   ```
3. Build with database:
   ```bash
   # For static export (database accessed at build time)
   npm run build:db:export
   
   # For standard build (database accessed at build time)
   npm run build:db
   
   # For runtime database access, remove `output: "export"` from next.config.ts first
   npm run build:db
   npm start
   ```

## Current Status

**Default Behavior: Static Files**
- The application defaults to using static files
- All existing functionality works without any database setup
- No breaking changes to existing deployments

**Database Infrastructure Ready**
- All database utility functions are in place
- Data loaders support both static and database modes
- Easy to switch between modes via environment variable

**Pages Using Database Infrastructure:**
- ✅ `src/app/article/[slug]/page.tsx` - Uses `getArticleBySlug()`
- ✅ `src/app/note/[slug]/page.tsx` - Uses `getArticleBySlug()`

**Pages Still Using Static Imports (Need Refactoring for Full DB Support):**
- ⚠️ `src/app/articles/page.tsx` - Client component, would need API route or server component refactoring
- ⚠️ `src/app/projects/page.tsx` - Would need server component refactoring
- ⚠️ `src/app/resources/page.tsx` - Client component, would need API route or server component refactoring
- ⚠️ `src/components/ArticleSidebar.tsx` - Would need to receive data as props

**Note:** Client components can't directly use async database loaders. To add full database support to client components, you would need to:
1. Create API routes that use the data loaders, or
2. Refactor them to server components and pass data as props, or
3. Use React Server Components pattern with async components

## Migration Path

To migrate from static files to database:

1. Set up your MySQL database
2. Import your existing data into the database tables
3. Set `USE_DATABASE=true` in environment variables
4. Test with a development build
5. Deploy with database configuration

The application will automatically use the database once `USE_DATABASE=true` is set and the database is accessible.

