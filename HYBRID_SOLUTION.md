# Hybrid Solution: Database + Static Generation

## Recommended Approach for Your Setup

Since you have:
- ✅ Hostinger database available (MySQL)
- ✅ Publishing 1-2 articles per month
- ✅ Static site generation (`output: "export"`)
- ✅ Article-creator already set up

## Best Solution: Database for Management, Static for Site

**Workflow:**
```
Article Creator → MySQL Database → Build Script → articles.ts → Static Build → Deploy
```

### Benefits:
1. **Easy Content Management**: Article-creator writes directly to database
2. **Keep Static Benefits**: Fast, cheap, works on Hostinger shared hosting
3. **Automated Workflow**: Build script pulls from DB and generates articles.ts
4. **No Breaking Changes**: Portfolio site stays static
5. **Simple Deployment**: Still just upload static files

## Implementation Plan

### Step 1: Database Schema

Create an `articles` table in your Hostinger MySQL database:

```sql
CREATE TABLE articles (
  id VARCHAR(255) PRIMARY KEY,
  title VARCHAR(500) NOT NULL,
  description TEXT,
  date VARCHAR(100) NOT NULL,
  tags JSON,
  type ENUM('article', 'note') NOT NULL,
  image_alt VARCHAR(500),
  image_name VARCHAR(500),
  content JSON NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_type (type),
  INDEX idx_date (date)
);
```

### Step 2: Update Article Creator

Modify article-creator to:
- Write articles to MySQL database
- Read articles from database for editing
- List articles for management

### Step 3: Create Build Script

Create a script that:
1. Connects to MySQL database
2. Fetches all articles
3. Generates `src/data/articles.ts` file
4. Runs the static build

### Step 4: Keep Static Export

- Portfolio site remains static (`output: "export"`)
- Works on Hostinger shared hosting
- No Node.js server needed for the portfolio site

## Alternative: Full Dynamic (If You Want)

If you prefer the database approach and want to remove static export:

**Pros:**
- ✅ Articles update immediately (no rebuild needed)
- ✅ Article-creator directly manages content
- ✅ Simpler workflow

**Cons:**
- ❌ Need Node.js hosting (VPS or upgrade Hostinger plan)
- ❌ Can't use Hostinger shared hosting (needs to run Node.js)
- ❌ Higher costs
- ❌ Slower page loads (API calls)
- ❌ More complex setup

## My Recommendation

**For 1-2 articles/month: Use Hybrid Approach**

The hybrid approach is perfect because:
- You get the ease of database management
- You keep the performance and cost benefits of static
- You can still use Hostinger shared hosting
- Build script handles the conversion automatically
- You only rebuild when you publish (which is infrequent anyway)

**When publishing:**
1. Create article in article-creator
2. Save to MySQL database
3. Run build script: `npm run build:from-db`
4. Script generates articles.ts, builds static site
5. Deploy static files to Hostinger

This gives you the best of both worlds!

