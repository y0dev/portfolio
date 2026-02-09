const fs = require('fs');
const path = require('path');

// Read articles data
const articlesData = require('../src/data/articles.ts');

// Extract articles (this is a simplified version - you may need to adjust)
// Since it's a .ts file, we'll need to parse it differently
// For now, we'll create a basic sitemap structure

const baseUrl = 'https://www.devontaereid.com';

// Define static routes
const staticRoutes = [
  '',
  '/',
  '/projects/',
  '/articles/',
  '/gospel/',
  '/bible-reading/',
  '/resources/',
  '/resources/books/',
];

// Generate sitemap XML
function generateSitemap() {
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

  // Add static routes
  staticRoutes.forEach(route => {
    xml += '  <url>\n';
    xml += `    <loc>${baseUrl}${route}</loc>\n`;
    xml += '    <changefreq>weekly</changefreq>\n';
    xml += '    <priority>0.8</priority>\n';
    xml += '  </url>\n';
  });

  // Note: Article and note routes would need to be added here
  // You can extend this by reading the articles.ts file properly
  // For now, this provides the basic structure

  xml += '</urlset>';

  return xml;
}

// Write sitemap to public directory
const sitemapContent = generateSitemap();
const sitemapPath = path.join(__dirname, '..', 'public', 'sitemap.xml');

fs.writeFileSync(sitemapPath, sitemapContent, 'utf8');
console.log(`Sitemap generated at: ${sitemapPath}`);

