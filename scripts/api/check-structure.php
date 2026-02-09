<?php
/**
 * Check API Structure
 * 
 * This script checks if all API files are in the correct location
 */

echo "<h1>API Structure Check</h1>\n";
echo "<p>Current directory: " . __DIR__ . "</p>\n";

// Check if we're in the right location
$expectedPath = '/scripts/api';
$currentPath = $_SERVER['SCRIPT_NAME'];
if (strpos($currentPath, $expectedPath) !== false) {
    echo "✅ Script is in the correct location\n<br>";
} else {
    echo "❌ Script is NOT in the correct location. Expected: $expectedPath, Found: $currentPath\n<br>";
}

echo "<h2>File Structure Check</h2>\n";

// Check required files
$requiredFiles = [
    '.htaccess' => 'URL rewriting rules',
    'index.php' => 'Main API entry point',
    'config.php' => 'API configuration',
    'routes/' => 'API routes directory'
];

foreach ($requiredFiles as $file => $description) {
    $path = __DIR__ . '/' . $file;
    if (file_exists($path)) {
        echo "✅ $file exists ($description)\n<br>";
    } else {
        echo "❌ $file missing ($description)\n<br>";
    }
}

// Check route files
echo "<h3>Route Files</h3>\n";
$routeFiles = ['articles.php', 'projects.php', 'testimonials.php', 'books.php', 'resources.php'];
$routesDir = __DIR__ . '/routes/';

if (is_dir($routesDir)) {
    foreach ($routeFiles as $file) {
        if (file_exists($routesDir . $file)) {
            echo "✅ routes/$file exists\n<br>";
        } else {
            echo "❌ routes/$file missing\n<br>";
        }
    }
} else {
    echo "❌ routes/ directory missing\n<br>";
}

// Check .htaccess content
echo "<h3>.htaccess Check</h3>\n";
$htaccessFile = __DIR__ . '../.htaccess';
if (file_exists($htaccessFile)) {
    $content = file_get_contents($htaccessFile);
    if (strpos($content, 'RewriteEngine On') !== false) {
        echo "✅ .htaccess contains RewriteEngine directive\n<br>";
    } else {
        echo "❌ .htaccess missing RewriteEngine directive\n<br>";
    }
    if (strpos($content, 'index.php') !== false) {
        echo "✅ .htaccess routes to index.php\n<br>";
    } else {
        echo "❌ .htaccess doesn't route to index.php\n<br>";
    }
} else {
    echo "❌ .htaccess file missing\n<br>";
}

// Test database connection
echo "<h3>Database Connection</h3>\n";
try {
    if (file_exists(__DIR__ . '/config.php')) {
        require_once __DIR__ . '/config.php';
        $pdo = getDatabaseConnection();
        echo "✅ Database connection successful\n<br>";
    } else {
        echo "❌ Cannot test database - config.php missing\n<br>";
    }
} catch (Exception $e) {
    echo "❌ Database connection failed: " . $e->getMessage() . "\n<br>";
}

// Show current URL structure
echo "<h3>URL Structure</h3>\n";
echo "Current URL: " . $_SERVER['REQUEST_URI'] . "\n<br>";
echo "Script Name: " . $_SERVER['SCRIPT_NAME'] . "\n<br>";
echo "Document Root: " . $_SERVER['DOCUMENT_ROOT'] . "\n<br>";

// Test if index.php can be accessed
echo "<h3>Testing index.php</h3>\n";
$indexUrl = dirname($_SERVER['SCRIPT_NAME']) . '/index.php';
echo "Index URL: $indexUrl\n<br>";

// Try to include index.php
try {
    ob_start();
    include __DIR__ . '/index.php';
    $output = ob_get_clean();
    
    if (strlen($output) > 0) {
        echo "✅ index.php executed successfully\n<br>";
        echo "Output length: " . strlen($output) . " characters\n<br>";
        echo "First 200 characters:\n<pre>" . htmlspecialchars(substr($output, 0, 200)) . "</pre>\n";
    } else {
        echo "⚠️ index.php executed but returned no output\n<br>";
    }
} catch (Exception $e) {
    echo "❌ Error executing index.php: " . $e->getMessage() . "\n<br>";
}

echo "<h3>Next Steps</h3>\n";
echo "<p>If you see missing files above, upload them to the correct location.</p>\n";
echo "<p>Make sure your file structure matches:</p>\n";
echo "<pre>\n";
echo "public_html/\n";
echo "└── scripts/\n";
echo "    └── api/\n";
echo "        ├── .htaccess\n";
echo "        ├── index.php\n";
echo "        ├── config.php\n";
echo "        └── routes/\n";
echo "            ├── articles.php\n";
echo "            ├── projects.php\n";
echo "            ├── testimonials.php\n";
echo "            ├── books.php\n";
echo "            └── resources.php\n";
echo "</pre>\n";
?> 