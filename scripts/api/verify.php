<?php
/**
 * API Verification Script
 * 
 * This script verifies that all API files are properly uploaded and accessible
 * 
 * @author Devontae Reid
 * @version 1.0
 */

echo "<h1>Portfolio API Verification</h1>\n";
echo "<p>Checking API setup...</p>\n";

// Check if config file exists
echo "<h2>1. Configuration Files</h2>\n";
$configFile = __DIR__ . '/config.php';
if (file_exists($configFile)) {
    echo "✅ config.php exists\n";
} else {
    echo "❌ config.php missing\n";
}

// Check if index file exists
$indexFile = __DIR__ . '/index.php';
if (file_exists($indexFile)) {
    echo "✅ index.php exists\n";
} else {
    echo "❌ index.php missing\n";
}

// Check if .htaccess exists
$htaccessFile = __DIR__ . '/.htaccess';
if (file_exists($htaccessFile)) {
    echo "✅ .htaccess exists\n";
} else {
    echo "❌ .htaccess missing\n";
}

// Check routes directory
echo "<h2>2. Route Files</h2>\n";
$routesDir = __DIR__ . '/routes/';
if (is_dir($routesDir)) {
    echo "✅ routes/ directory exists\n";
    
    $routeFiles = ['articles.php', 'projects.php', 'testimonials.php', 'books.php', 'resources.php'];
    foreach ($routeFiles as $file) {
        if (file_exists($routesDir . $file)) {
            echo "✅ routes/$file exists\n";
        } else {
            echo "❌ routes/$file missing\n";
        }
    }
} else {
    echo "❌ routes/ directory missing\n";
}

// Check database connection
echo "<h2>3. Database Connection</h2>\n";
try {
    require_once 'config.php';
    $pdo = getDatabaseConnection();
    echo "✅ Database connection successful\n";
    
    // Test a simple query
    $stmt = $pdo->query("SELECT COUNT(*) as count FROM information_schema.tables WHERE table_schema = '" . DB_NAME . "'");
    $result = $stmt->fetch();
    echo "✅ Database has " . $result['count'] . " tables\n";
    
} catch (Exception $e) {
    echo "❌ Database connection failed: " . $e->getMessage() . "\n";
}

// Check API endpoints
echo "<h2>4. API Endpoints Test</h2>\n";
$endpoints = ['articles', 'projects', 'testimonials', 'books', 'resources'];

foreach ($endpoints as $endpoint) {
    $url = "https://devssite.net/scripts/api/$endpoint";
    echo "Testing: $url\n";
    
    // Use file_get_contents with context to handle SSL
    $context = stream_context_create([
        'http' => [
            'method' => 'GET',
            'header' => 'Content-Type: application/json'
        ],
        'ssl' => [
            'verify_peer' => false,
            'verify_peer_name' => false
        ]
    ]);
    
    $response = @file_get_contents($url, false, $context);
    
    if ($response !== false) {
        $data = json_decode($response, true);
        if ($data && isset($data['success'])) {
            echo "✅ $endpoint endpoint working\n";
        } else {
            echo "⚠️ $endpoint endpoint responding but not JSON\n";
        }
    } else {
        echo "❌ $endpoint endpoint not accessible\n";
    }
}

// Check file permissions
echo "<h2>5. File Permissions</h2>\n";
$files = [
    'config.php' => '644',
    'index.php' => '644',
    '.htaccess' => '644',
    'routes/' => '755'
];

foreach ($files as $file => $expectedPerms) {
    $path = __DIR__ . '/' . $file;
    if (file_exists($path)) {
        $perms = substr(sprintf('%o', fileperms($path)), -3);
        if ($perms == $expectedPerms) {
            echo "✅ $file permissions correct ($perms)\n";
        } else {
            echo "⚠️ $file permissions: $perms (expected: $expectedPerms)\n";
        }
    }
}

// Create logs and cache directories if they don't exist
echo "<h2>6. Directory Setup</h2>\n";
$dirs = ['logs', 'cache'];
foreach ($dirs as $dir) {
    $dirPath = __DIR__ . '/' . $dir;
    if (!is_dir($dirPath)) {
        if (mkdir($dirPath, 0777, true)) {
            echo "✅ Created $dir/ directory\n";
        } else {
            echo "❌ Failed to create $dir/ directory\n";
        }
    } else {
        echo "✅ $dir/ directory exists\n";
    }
}

echo "<h2>7. PHP Information</h2>\n";
echo "PHP Version: " . PHP_VERSION . "\n";
echo "PDO MySQL: " . (extension_loaded('pdo_mysql') ? '✅ Enabled' : '❌ Disabled') . "\n";
echo "JSON: " . (extension_loaded('json') ? '✅ Enabled' : '❌ Disabled') . "\n";

echo "<h2>8. Next Steps</h2>\n";
echo "<p>If all checks pass, your API should be working. Test it with:</p>\n";
echo "<ul>\n";
echo "<li><a href='https://devssite.net/scripts/api/' target='_blank'>API Root</a></li>\n";
echo "<li><a href='https://devssite.net/scripts/api/test-page.html' target='_blank'>Test Page</a></li>\n";
echo "<li><a href='https://devssite.net/scripts/api/articles' target='_blank'>Articles Endpoint</a></li>\n";
echo "</ul>\n";
?> 