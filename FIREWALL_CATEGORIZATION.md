# Firewall Categorization Guide

This guide explains how to ensure your site (https://www.devontaereid.com) is properly categorized and accessible through corporate firewalls and content filters.

## Why Sites Get Blocked

Corporate firewalls and content filtering systems (like Blue Coat, Cisco, Fortinet, etc.) categorize websites. Uncategorized sites are often blocked by default security policies. Your portfolio site needs to be recognized as a **professional/technology** site rather than being uncategorized.

## Solutions Implemented

### 1. Security Headers ✅

We've added security headers that help firewalls identify your site as legitimate:
- `X-Content-Type-Options: nosniff` - Prevents MIME type sniffing
- `X-Frame-Options: SAMEORIGIN` - Prevents clickjacking
- `Content-Security-Policy` - Defines allowed content sources
- Proper `Content-Type` headers for all file types

**Files created:**
- `public/.htaccess` - For Apache servers
- `public/_headers` - For Netlify
- `nginx.conf.example` - For Nginx servers

### 2. Sitemap.xml ✅

A sitemap helps search engines and categorization services understand your site structure.

**File:** `public/sitemap.xml`

Make sure it's accessible at: https://www.devontaereid.com/sitemap.xml

### 3. Robots.txt ✅

Updated to reference the sitemap.

**File:** `public/robots.txt`

### 4. Meta Tags ✅

Your site already has excellent meta tags in `src/app/layout.tsx`:
- Proper `category: "Technology"`
- `classification: "Portfolio"`
- Comprehensive keywords
- Open Graph tags
- Twitter Card tags

## What You Need to Do

### 1. Submit to Web Categorization Services

You need to manually submit your site to these services (most are free):

#### **Cisco Talos / OpenDNS** (Most Important)
- URL: https://talosintelligence.com/reputation_center/lookup
- Submit: https://talosintelligence.com/reputation_center/submit_url
- Category: Select "Technology" or "Business"
- This is used by many corporate firewalls

#### **FortiGuard**
- URL: https://www.fortiguard.com/faq/wfratingsubmit
- Category: Technology / Professional
- Used by Fortinet firewalls

#### **Symantec Blue Coat** (Now Broadcom)
- URL: Contact your hosting provider or use their categorization form
- Category: Technology / Business
- Very common in corporate environments

#### **Trend Micro**
- URL: https://global.sitesafety.trendmicro.com/
- Submit for categorization
- Category: Technology / Professional

#### **Google Safe Browsing** (Automatic but verify)
- URL: https://transparencyreport.google.com/safe-browsing/search
- Check your site status
- Usually automatic if properly indexed

#### **URLVoid / VirusTotal**
- URL: https://www.urlvoid.com/scan/
- Check for any false positives
- Multiple engine scanning

### 2. Configure Headers on Your Server

Depending on your hosting provider:

#### **Apache / Hostinger (.htaccess)**
The `.htaccess` file in `public/` is configured for Hostinger shared hosting and should work automatically.

**For Hostinger:**
- Upload the `.htaccess` file to your `public_html/` root directory (along with all other files from `out/`)
- Hostinger supports `mod_headers`, `mod_expires`, and `mod_deflate` modules
- See `HOSTINGER_DEPLOYMENT.md` for detailed Hostinger deployment instructions

#### **Nginx**
Use the `nginx.conf.example` file and add it to your server configuration.

#### **Netlify**
The `_headers` file in `public/` should work automatically.

#### **Vercel**
Add to `vercel.json`:
```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "SAMEORIGIN"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        },
        {
          "key": "Referrer-Policy",
          "value": "strict-origin-when-cross-origin"
        }
      ]
    }
  ]
}
```

#### **Cloudflare**
1. Go to Cloudflare Dashboard → Rules → Transform Rules → HTTP Response Headers
2. Add the security headers manually

### 3. Ensure Proper SSL/TLS

Make sure your site uses HTTPS with a valid SSL certificate:
- ✅ Your site already uses HTTPS (https://www.devontaereid.com)
- Ensure SSL certificate is valid and not expired
- Use TLS 1.2 or higher

### 4. Submit to Search Engines

Submit your sitemap to search engines (helps with categorization):

- **Google Search Console**: https://search.google.com/search-console
  - Add property → Verify ownership → Submit sitemap
  
- **Bing Webmaster Tools**: https://www.bing.com/webmasters
  - Add site → Verify → Submit sitemap

### 5. Build Time Considerations

After making changes, rebuild your static export:

```bash
npm run build:export
```

This ensures all the new files (sitemap.xml, updated robots.txt, etc.) are included in the `out/` directory.

## Testing

### Check Your Headers
Use these tools to verify headers are being served:

1. **SecurityHeaders.com**: https://securityheaders.com/?q=https://www.devontaereid.com
   - Should show A or A+ rating

2. **SSL Labs**: https://www.ssllabs.com/ssltest/analyze.html?d=www.devontaereid.com
   - Check SSL/TLS configuration

3. **Mozilla Observatory**: https://observatory.mozilla.org/analyze/www.devontaereid.com
   - Security scan

### Check Categorization

1. **Talos Intelligence**: https://talosintelligence.com/reputation_center/lookup?search=devontaereid.com
2. **URLVoid**: https://www.urlvoid.com/scan/devontaereid.com
3. **VirusTotal**: https://www.virustotal.com/gui/domain/devontaereid.com

## Timeline

- **Immediate**: Headers, sitemap, robots.txt are already in place
- **24-48 hours**: Submit to categorization services (takes time to process)
- **1-2 weeks**: Most categorization services update their databases
- **Ongoing**: Monitor and resubmit if needed

## Additional Recommendations

1. **Regular Content Updates**: Sites with fresh content are more likely to be properly categorized
2. **Consistent Branding**: Your site already has consistent branding and professional appearance
3. **Contact Information**: Your site has contact info, which helps with categorization
4. **Professional Domain**: Using a `.com` domain helps (you already have this ✅)

## Troubleshooting

If your site is still blocked:

1. **Check with IT Department**: They can manually whitelist your domain
2. **Request Re-categorization**: Most services allow re-submission if incorrectly categorized
3. **Verify Headers**: Use the testing tools above
4. **Check DNS**: Ensure proper DNS records (A, AAAA, MX if applicable)
5. **Review Content**: Ensure no content triggers false positives

## Resources

- [Cisco Talos Reputation Center](https://talosintelligence.com/reputation_center)
- [Google Safe Browsing](https://transparencyreport.google.com/safe-browsing/search)
- [SecurityHeaders.com](https://securityheaders.com)
- [Mozilla HTTP Observatory](https://observatory.mozilla.org)

---

**Note**: Categorization can take 1-2 weeks to propagate across all services. Be patient and monitor your submissions.

