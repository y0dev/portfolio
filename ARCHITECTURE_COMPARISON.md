# Articles Storage: Static Files vs SQL Database

## Current Setup (Static Files)

**How it works:**
- Articles stored in `src/data/articles.ts` (TypeScript array)
- Static site generation at build time
- All pages pre-rendered to HTML
- Deployed as static files (works on any hosting)

**Pros:**
- ✅ **Simple & Fast**: No database setup, no API overhead
- ✅ **Cost-effective**: Works on Hostinger shared hosting (no database needed)
- ✅ **Fast Performance**: Pre-rendered HTML loads instantly
- ✅ **SEO-friendly**: All content is in HTML at build time
- ✅ **Version Controlled**: Articles are in Git, easy to track changes
- ✅ **No Server Costs**: Static hosting is cheaper
- ✅ **Reliable**: No database connection failures
- ✅ **CDN-friendly**: All files can be cached globally

**Cons:**
- ❌ **Rebuild Required**: Must rebuild site after adding/editing articles
- ❌ **Not Dynamic**: Can't add articles without deploying
- ❌ **Limited Scalability**: Large article counts slow down build time
- ❌ **Manual Process**: Need to edit TypeScript file and rebuild

## SQL Database Approach

**How it would work:**
- Articles stored in MySQL/PostgreSQL database
- API routes to fetch articles
- Server-side rendering (SSR) or Incremental Static Regeneration (ISR)
- Dynamic content loading

**Pros:**
- ✅ **Dynamic Content**: Add/edit articles without rebuilding
- ✅ **Better for CMS**: Article-creator could directly write to database
- ✅ **Scalable**: Handles thousands of articles efficiently
- ✅ **Real-time Updates**: Changes appear immediately
- ✅ **Query Capabilities**: Advanced filtering, search, pagination
- ✅ **Editorial Workflow**: Can add draft/publish states

**Cons:**
- ❌ **Complex Setup**: Need database server, connection pooling, migrations
- ❌ **Hosting Requirements**: Need Node.js hosting (VPS/Platform-as-a-Service)
- ❌ **Higher Costs**: Database hosting + server costs
- ❌ **Slower Initial Load**: API calls add latency
- ❌ **Maintenance**: Database backups, migrations, monitoring
- ❌ **Not Compatible with Static Export**: Must remove `output: "export"`
- ❌ **SEO Considerations**: Need SSR/ISR for proper indexing

## Recommendation: **Hybrid Approach** (Best of Both Worlds)

Given your current setup and requirements, I recommend a **hybrid approach**:

### Option 1: Keep Static + Add Build Automation ⭐ (Recommended)

**Best for:** Current setup, minimal changes needed

**How it works:**
1. Article-creator writes to database (or JSON files)
2. Build script fetches articles from database/API
3. Generates `src/data/articles.ts` automatically
4. Static build proceeds as normal
5. Deploy static site

**Benefits:**
- ✅ Keeps static site benefits (fast, cheap, reliable)
- ✅ Article-creator can write to database
- ✅ Automated workflow
- ✅ Still works on Hostinger shared hosting
- ✅ No breaking changes to current setup

### Option 2: Full Dynamic with ISR

**Best for:** If you want real-time updates without rebuilds

**Requirements:**
- Remove `output: "export"` from `next.config.ts`
- Add database (MySQL/PostgreSQL)
- Convert to API routes + SSR/ISR
- Upgrade hosting (VPS or Vercel/Netlify with database)
- Higher costs

**Use this if:**
- You publish articles frequently (multiple times per day)
- You need draft/published states
- You want editorial workflow
- You have budget for hosting upgrade

## My Recommendation

**Stick with static files** but **improve the workflow**:

1. **Keep current static setup** (works great for portfolio site)
2. **Enhance article-creator** to:
   - Option A: Save to database, then have a build script pull from DB
   - Option B: Use Git to auto-update articles.ts file
   - Option C: API endpoint that updates articles.ts file (requires server)

**Why this is better:**
- Your site is a portfolio (not a high-frequency blog)
- Static sites are faster and cheaper
- Current setup already works well
- You can still automate the workflow
- Works on Hostinger shared hosting (no upgrade needed)

## Implementation Options

### Option A: Database + Build Script (Recommended)
```
Article Creator → MySQL Database → Build Script → articles.ts → Static Build
```

### Option B: Git-based Workflow
```
Article Creator → Git Commit → CI/CD → Auto-rebuild → Deploy
```

### Option C: Keep Current + Improve UX
```
Article Creator → JSON export → Manual copy/paste → Build → Deploy
(Add better tooling/automation to reduce friction)
```

## When to Switch to Full SQL/Dynamic

Switch to full SQL/dynamic approach if:
- ✅ You're publishing multiple articles per day
- ✅ You need draft/published workflow
- ✅ You have multiple authors/editors
- ✅ You need real-time updates (no rebuild)
- ✅ You have budget for VPS/database hosting
- ✅ You're building a blog platform, not a portfolio

For a portfolio site with occasional article updates, **static files + automation** is the sweet spot.

