# Hostinger Deployment Guide

This guide explains how to deploy your Next.js static export to Hostinger shared hosting.

## Prerequisites

1. Hostinger shared hosting account (Business, Premium, or Cloud Startup plans)
2. FTP credentials (from Hostinger hPanel)
3. Static export of your Next.js portfolio (`out/` directory)

## Deployment Steps

### 1. Build Your Static Site

First, build and format your static export:

```bash
npm run build:export
```

This creates an `out/` directory with all your static files.

### 2. Prepare Files for Upload

The `out/` directory contains everything you need, including:
- `index.html` (and other HTML files)
- `_next/` (JavaScript, CSS, and assets)
- `assets/` (images, fonts, etc.)
- `sitemap.xml`
- `robots.txt`
- `.htaccess` (security headers)

### 3. Upload to Hostinger

#### Option A: Using FTP Client (Recommended)

1. **Get FTP Credentials from hPanel:**
   - Log into Hostinger hPanel
   - Go to **Files** → **FTP Accounts**
   - Note your FTP host, username, and password
   - Default FTP host is usually: `ftp.yourdomain.com` or your server IP

2. **Connect via FTP Client:**
   - Use FileZilla, Cyberduck, or any FTP client
   - Connect using your FTP credentials
   - Navigate to `public_html/` directory (this is your website root)

3. **Upload Files:**
   - Upload ALL contents from the `out/` directory to `public_html/`
   - Make sure `.htaccess` is uploaded (it starts with a dot, so enable "Show hidden files")
   - Ensure file permissions are correct (usually 644 for files, 755 for directories)

#### Option B: Using Hostinger File Manager

1. **Access File Manager:**
   - Log into Hostinger hPanel
   - Go to **Files** → **File Manager**
   - Navigate to `public_html/` directory

2. **Upload Files:**
   - Click **Upload** button
   - Upload all files from your `out/` directory
   - **Important:** You need to upload `.htaccess` separately:
     - Click "New File" in File Manager
     - Name it `.htaccess`
     - Paste the contents from `public/.htaccess`

3. **Set Permissions:**
   - Right-click on `.htaccess` → **Change Permissions**
   - Set to `644`

### 4. Verify .htaccess is Working

After uploading, test your security headers:

1. Visit: https://securityheaders.com/?q=https://www.devontaereid.com
2. You should see headers like:
   - `X-Content-Type-Options: nosniff`
   - `X-Frame-Options: SAMEORIGIN`
   - `X-XSS-Protection: 1; mode=block`
   - `Referrer-Policy: strict-origin-when-cross-origin`

If headers aren't showing:
- Check that `.htaccess` is in `public_html/` root (not in a subdirectory)
- Verify file permissions (644)
- Check Hostinger error logs in hPanel
- Try a simpler `.htaccess` first to test if mod_headers is enabled

### 5. Enable SSL/HTTPS (Recommended)

1. **In Hostinger hPanel:**
   - Go to **Advanced** → **SSL**
   - Install a free SSL certificate (Let's Encrypt)
   - Enable "Force HTTPS Redirect"

2. **Update .htaccess for HTTPS:**
   - Uncomment the HTTPS redirect line in `.htaccess`:
   ```apache
   RewriteCond %{HTTPS} off
   RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
   ```
   - Uncomment the HSTS header line:
   ```apache
   Header set Strict-Transport-Security "max-age=31536000; includeSubDomains"
   ```

### 6. Update DNS (if needed)

If you haven't already:
- Point your domain's A record to Hostinger's IP address
- Or use Hostinger's nameservers:
  - `ns1.dns-parking.com`
  - `ns2.dns-parking.com`

## File Structure on Hostinger

After deployment, your `public_html/` should look like:

```
public_html/
├── .htaccess          (Security headers)
├── index.html         (Homepage)
├── sitemap.xml        (Sitemap)
├── robots.txt         (Robots file)
├── favicon.ico        (Favicon)
├── logo192.png        (Logo)
├── logo512.png        (Logo)
├── _next/             (Next.js assets)
│   └── static/
│       └── ...
├── assets/            (Your assets)
│   └── images/
│       └── ...
├── article/           (Article pages)
│   └── ...
├── note/              (Note pages)
│   └── ...
├── projects/          (Projects page)
├── articles/          (Articles listing)
├── gospel/            (Gospel page)
├── bible-reading/     (Bible reading page)
└── resources/         (Resources pages)
    └── ...
```

## Troubleshooting

### Headers Not Showing

If security headers aren't appearing:

1. **Check mod_headers is enabled:**
   - Create a test `.htaccess` with just: `Header set Test-Header "test"`
   - If this works, mod_headers is enabled

2. **Try simplified headers:**
   ```apache
   <IfModule mod_headers.c>
     Header set X-Content-Type-Options "nosniff"
     Header set X-Frame-Options "SAMEORIGIN"
   </IfModule>
   ```

3. **Contact Hostinger Support:**
   - They can verify if mod_headers, mod_expires, and mod_deflate are enabled
   - Most shared hosting plans include these modules

### 404 Errors on Routes

If you get 404 errors on routes like `/articles/`:

1. **Check file structure:**
   - Routes should have `index.html` files: `articles/index.html`
   - This is handled automatically by Next.js static export

2. **Verify .htaccess rewrite rules:**
   - The rewrite rules should handle trailing slashes
   - Make sure mod_rewrite is enabled (it usually is on Hostinger)

### Performance Issues

1. **Enable compression:**
   - The `.htaccess` includes mod_deflate rules
   - Verify it's working at: https://tools.pingdom.com/

2. **Check caching:**
   - Browser caching is configured in `.htaccess`
   - Static assets should be cached for 1 year

## Automated Deployment

You can use the Docker deployment setup we created to automate this:

```bash
# Build and deploy via FTP
docker-compose --profile deploy run --rm deploy
```

Make sure your `.env` file has Hostinger FTP credentials:
```env
FTP_HOST=ftp.yourdomain.com
FTP_USER=your-ftp-username
FTP_PASSWORD=your-ftp-password
FTP_PORT=21
FTP_SECURE=false
FTP_REMOTE_PATH=/public_html
```

## Important Notes

- **Hostinger Shared Hosting** does NOT support Node.js server-side rendering
- You MUST use static export (`output: "export"` in next.config.ts) ✅
- The `.htaccess` file works on Hostinger's Apache servers
- All security headers are compatible with Hostinger's standard modules
- Make sure `.htaccess` is in the `public_html/` root directory

## Support

If you encounter issues:
1. Check Hostinger Knowledge Base: https://www.hostinger.com/tutorials
2. Contact Hostinger Support via hPanel
3. Check error logs in hPanel → Advanced → Error Log

