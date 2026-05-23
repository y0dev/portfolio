# Uploading Articles to Static Web Server

Since your portfolio is a static Next.js site (using `output: "export"`), here's how to add new articles:

## Workflow

### 1. Create Article in Article Creator
- Use the article-creator tool to create your article/note
- Fill in all the fields and generate the HTML
- Click "Export JSON" to download the article data as JSON

### 2. Add Article to Portfolio
- Open `src/data/articles.ts` in your portfolio project
- Copy the JSON object from the exported file
- Add it to the `articles` array in `articles.ts`
- The format should match the `Article` interface

### 3. Rebuild the Site
```bash
cd /path/to/portfolio
npm run build
```

This generates static HTML files in the `out` folder.

### 4. Upload to Static Server
Upload the **entire contents** of the `out` folder to your static web server.

**Important:** Next.js generates files in the `out` folder (not `dist`), so make sure you're uploading from the `out` directory.

## File Structure After Build

```
out/
├── index.html
├── article/
│   └── [slug]/
│       └── index.html
├── note/
│   └── [slug]/
│       └── index.html
├── articles/
│   └── index.html
├── _next/
│   └── (static assets)
└── assets/
    └── (images and other assets)
```

## Alternative: Automated Script

You could create a script that:
1. Reads the exported JSON from article-creator
2. Automatically appends it to `articles.ts`
3. Rebuilds the site
4. (Optionally) uploads to your server via FTP/SSH

This would streamline the process for adding multiple articles.

