<?php
/**
 * Structure Test File
 * 
 * This file helps debug the current file structure and API setup
 * 
 * @author Devontae Reid
 * @version 1.0
 */

echo "<h1>File Structure Test</h1>\n";
echo "<p>Current directory: " . __DIR__ . "</p>\n";

// Check current directory structure
echo "<h2>1. Current Directory Contents</h2>\n";
$files = scandir(__DIR__);
foreach ($files as $file) {
    if ($file != '.' && $file != '..') {
        $path = __DIR__ . '/' . $file;
        if (is_dir($path)) {
            echo "📁 Directory: $file\n";
        } else {
            echo "📄 File: $file\n";
        }
    }
}

// Check if config.php exists in current directory
echo "<h2>2. Configuration Check</h2>\n";
$configFile = __DIR__ . '/config.php';
if (file_exists($configFile)) {
    echo "✅ config.php found in current directory\n";
} else {
    echo "❌ config.php not found in current directory\n";
    
    // Check if it exists in parent config directory
    $parentConfigFile = dirname(__DIR__) . '/config/config.php';
    if (file_exists($parentConfigFile)) {
        echo "⚠️ config.php found in parent config/ directory\n";
    }
}

// Check routes directory
echo "<h2>3. Routes Directory Check</h2>\n";
$routesDir = __DIR__ . '/routes/';
if (is_dir($routesDir)) {
    echo "✅ routes/ directory exists\n";
    $routeFiles = scandir($routesDir);
    foreach ($routeFiles as $file) {
        if ($file != '.' && $file != '..' && pathinfo($file, PATHINFO_EXTENSION) == 'php') {
            echo "  📄 $file\n";
        }
    }
} else {
    echo "❌ routes/ directory not found\n";
}

// Check .htaccess
echo "<h2>4. .htaccess Check</h2>\n";
$htaccessFile = __DIR__ . '/.htaccess';
if (file_exists($htaccessFile)) {
    echo "✅ .htaccess found in current directory\n";
} else {
    echo "❌ .htaccess not found in current directory\n";
    
    // Check if it exists in parent directory
    $parentHtaccessFile = dirname(__DIR__) . '/.htaccess';
    if (file_exists($parentHtaccessFile)) {
        echo "⚠️ .htaccess found in parent directory\n";
    }
}

// Test database connection
echo "<h2>5. Database Connection Test</h2>\n";
try {
    // Try to load config from current directory
    if (file_exists($configFile)) {
        require_once $configFile;
    } else {
        // Try parent config directory
        $parentConfigFile = dirname(__DIR__) . '/config/config.php';
        if (file_exists($parentConfigFile)) {
            require_once $parentConfigFile;
        } else {
            throw new Exception("No config.php found");
        }
    }
    
    $pdo = getDatabaseConnection();
    echo "✅ Database connection successful\n";
    
} catch (Exception $e) {
    echo "❌ Database connection failed: " . $e->getMessage() . "\n";
}

// Show recommended structure
echo "<h2>6. Recommended Structure</h2>\n";
echo "<p>Your API should have this structure:</p>\n";
echo "<pre>\n";
echo "public_html/\n";
echo "└── scripts/\n";
echo "    └── api/\n";
echo "        ├── .htaccess\n";
echo "        ├── index.php\n";
echo "        ├── config.php\n";
echo "        ├── routes/\n";
echo "        │   ├── articles.php\n";
echo "        │   ├── projects.php\n";
echo "        │   ├── testimonials.php\n";
echo "        │   ├── books.php\n";
echo "        │   └── resources.php\n";
echo "        ├── logs/\n";
echo "        └── cache/\n";
echo "</pre>\n";

// Show current structure
echo "<h2>7. Your Current Structure</h2>\n";
echo "<pre>\n";
echo "public_html/\n";
echo "├── .htaccess\n";
echo "├── config/\n";
echo "│   └── config.php\n";
echo "└── scripts/\n";
echo "    └── api/\n";
echo "        └── routes/\n";
echo "</pre>\n";

echo "<h2>8. Action Required</h2>\n";
echo "<p>To fix this, you need to:</p>\n";
echo "<ol>\n";
echo "<li>Move .htaccess from public_html/ to scripts/api/</li>\n";
echo "<li>Move config.php from config/ to scripts/api/</li>\n";
echo "<li>Create index.php in scripts/api/</li>\n";
echo "<li>Create logs/ and cache/ directories in scripts/api/</li>\n";
echo "</ol>\n";

echo "<h2>9. Quick Fix Commands</h2>\n";
echo "<p>Run these commands on your server:</p>\n";
echo "<pre>\n";
echo "# Move .htaccess\n";
echo "mv public_html/.htaccess public_html/scripts/api/\n\n";
echo "# Move config.php\n";
echo "mv public_html/config/config.php public_html/scripts/api/\n\n";
echo "# Create directories\n";
echo "mkdir public_html/scripts/api/logs\n";
echo "mkdir public_html/scripts/api/cache\n";
echo "chmod 777 public_html/scripts/api/logs\n";
echo "chmod 777 public_html/scripts/api/cache\n";
echo "</pre>\n";
?> 