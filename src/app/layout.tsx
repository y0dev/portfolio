import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import Navigation from "@/components/Navigation";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Devontae Reid | Full-Stack Developer & Creative Technologist",
  description: "Full-stack developer and creative technologist passionate about building innovative web applications and sharing insights on technology and faith.",
  metadataBase: new URL('https://www.devontaereid.com'),
  keywords: ["full-stack developer", "web development", "react", "next.js", "typescript", "portfolio", "creative technologist", "devontae reid"],
  authors: [{ name: "Devontae Reid" }],
  creator: "Devontae Reid",
  publisher: "Devontae Reid",
  category: "Technology",
  classification: "Portfolio",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: 'https://www.devontaereid.com',
  },
  openGraph: {
    title: "Devontae Reid | Embedded Engineer & Full-Stack Developer",
    description: "Full-stack developer and creative technologist passionate about building innovative web applications and sharing insights on technology and faith.",
    url: "https://www.devontaereid.com",
    siteName: "Devontae Reid",
    images: [
      {
        url: "/logo512.png",
        width: 512,
        height: 512,
        alt: "Devontae Reid - Embedded Engineer & Full-Stack Developer",
        type: "image/png",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Devontae Reid | Embedded Engineer & Full-Stack Developer",
    description: "Full-stack developer and creative technologist passionate about building innovative web applications and sharing insights on technology and faith.",
    images: ["/logo512.png"],
    site: "@_yodev_",
    creator: "@_yodev_",
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/favicon.ico",
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" type="image/x-icon" href="/images/logo.png" />
        <meta charSet="UTF-8" />
        
        {/* Basic Meta Tags */}
        <meta name="author" content="Devontae Reid" />
        <meta name="creator" content="Devontae Reid" />
        <meta name="publisher" content="Devontae Reid" />
        <meta name="copyright" content="Devontae Reid" />
        
        {/* Category and Content Recognition */}
        <meta name="category" content="Technology" />
        <meta name="subject" content="Web Development" />
        <meta name="classification" content="Portfolio" />
        <meta name="content-type" content="text/html" />
        <meta name="content-language" content="en" />
        <meta name="audience" content="Developers, tech professionals, potential clients" />
        <meta name="target-audience" content="Technology, web development, software industry" />
        
        {/* Keywords for Category Bots */}
        <meta name="keywords" content="full-stack developer, web development, react, next.js, typescript, portfolio, creative technologist, devontae reid, software engineer" />
        
        {/* Content Classification */}
        <meta name="content-classification" content="Technology/Development" />
        <meta name="content-category" content="Web Development" />
        <meta name="content-subcategory" content="Portfolio" />
        
        {/* Social Media Enhanced */}
        <meta property="og:site_name" content="Devontae Reid" />
        <meta property="og:locale" content="en_US" />
        <meta property="og:locale:alternate" content="en_CA" />
        <meta property="og:locale:alternate" content="en_GB" />
        
        {/* Twitter Enhanced */}
        <meta name="twitter:label1" content="Category" />
        <meta name="twitter:data1" content="Technology" />
        <meta name="twitter:label2" content="Author" />
        <meta name="twitter:data2" content="Devontae Reid" />
        
        
        {/* Additional Bot Recognition */}
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
        <meta name="googlebot" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
        <meta name="bingbot" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
        
        {/* Content Rating */}
        <meta name="rating" content="General" />
        <meta name="content-rating" content="General" />
        
        {/* Mobile and App Specific */}
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Devontae Reid" />
        
        {/* RSS Feed */}
        <link rel="alternate" type="application/rss+xml" title="Devontae Reid RSS Feed" href="/rss.xml" />
        <link rel="alternate" type="application/atom+xml" title="Devontae Reid Atom Feed" href="/atom.xml" />
        
        {/* Sitemap */}
        <link rel="sitemap" type="application/xml" href="/sitemap.xml" />
        
        {/* Theme initialization script - runs before React hydrates to prevent flash */}
        
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        style={{ background: "var(--background)", color: "var(--foreground)" }}
      >
        <Navigation />
        <main className="min-h-screen">
          {children}
        </main>
        <script src="https://static.esvmedia.org/crossref/crossref.min.js" type="text/javascript"></script>
      </body>
    </html>
  );
}
