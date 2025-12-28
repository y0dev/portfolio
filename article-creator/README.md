# Article Creator

A Next.js application for creating articles and notes that match your portfolio design.

## Features

- **Rich Markdown Editor**: Write content using markdown syntax
- **Auto Slug Generation**: Automatically generates URL-friendly slugs from titles
- **Live Preview**: Preview your article/note matching the portfolio design
- **HTML Generation**: Generate full HTML pages matching the article/note page designs
- **JSON Export**: Export article data in the format expected by your portfolio
- **Server Upload**: Upload articles directly to your server via API
- **Table Support**: Full support for markdown tables with alignment

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

This will start the server at `http://localhost:3000`.

## Usage

1. **Fill in the form**:
   - Select type (Article or Note)
   - Enter title (ID/slug will be auto-generated)
   - Add description, date, tags
   - Add image path and alt text (optional)

2. **Write content** in the markdown editor:
   - Use `##` or `###` for section titles
   - Sections with titles will be automatically split
   - Supports all standard markdown syntax including tables

3. **Generate HTML**:
   - Click "Generate HTML" to create the HTML output
   - Click "Preview" to see it in a new window
   - Click "Copy HTML" to copy the generated HTML

4. **Export JSON**:
   - Click "Export JSON" to download the article data
   - This JSON can be added to your portfolio's `src/data/articles.ts` file

5. **Upload to Server**:
   - Click "Upload to Server"
   - The article will be sent to `/api/articles` endpoint
   - Articles are saved to `article-backups/` directory

## Article Data Format

The generated JSON follows this structure:

```json
{
  "id": "article-slug",
  "title": "Article Title",
  "description": "Article description",
  "date": "May 9, 2025",
  "tags": ["Technology", "Engineering"],
  "type": "article",
  "image": {
    "alt": "Image alt text",
    "name": "images/image.png"
  },
  "content": [
    {
      "title": "Section Title (optional)",
      "htmlContent": "<p>HTML content...</p>"
    }
  ]
}
```

## API Endpoint

The application includes an API route at `/api/articles` that accepts POST requests with article data. Articles are saved to the `article-backups/` directory as JSON files.

## Adding to Portfolio

After exporting the JSON, you can add it to your portfolio:

1. Open `src/data/articles.ts` in your portfolio project
2. Copy the exported JSON object
3. Add it to the `articles` array
4. Rebuild your Next.js application: `npm run build`

## Notes

- The editor uses a simple textarea for markdown editing
- Marked.js is used for markdown parsing with GFM support (including tables)
- HTML styling matches your portfolio's Tailwind CSS classes
- The preview opens in a new window for better viewing
- Slug generation automatically updates as you type the title
