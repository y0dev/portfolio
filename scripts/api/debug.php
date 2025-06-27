<?php
/**
 * API Debug Script
 * 
 * This script helps debug API issues by showing exactly what's being returned
 * 
 * @author Devontae Reid
 * @version 1.0
 */

// Enable error reporting
error_reporting(E_ALL);
ini_set('display_errors', 1);

echo "<h1>API Debug Information</h1>\n";

// Check if we're being called directly
echo "<h2>1. Request Information</h2>\n";
echo "Request Method: " . $_SERVER['REQUEST_METHOD'] . "\n<br>";
echo "Request URI: " . $_SERVER['REQUEST_URI'] . "\n<br>";
echo "Script Name: " . $_SERVER['SCRIPT_NAME'] . "\n<br>";
echo "Document Root: " . $_SERVER['DOCUMENT_ROOT'] . "\n<br>";

// Check if config file exists
echo "<h2>2. File Structure Check</h2>\n";
$configFile = __DIR__ . '/config.php';
if (file_exists($configFile)) {
    echo "✅ config.php exists at: " . $configFile . "\n<br>";
} else {
    echo "❌ config.php missing at: " . $configFile . "\n<br>";
}

$indexFile = __DIR__ . '/index.php';
if (file_exists($indexFile)) {
    echo "✅ index.php exists at: " . $indexFile . "\n<br>";
} else {
    echo "❌ index.php missing at: " . $indexFile . "\n<br>";
}

$htaccessFile = __DIR__ . '/.htaccess';
if (file_exists($htaccessFile)) {
    echo "✅ .htaccess exists at: " . $htaccessFile . "\n<br>";
} else {
    echo "❌ .htaccess missing at: " . $htaccessFile . "\n<br>";
}

// Check routes directory
$routesDir = __DIR__ . '/routes/';
if (is_dir($routesDir)) {
    echo "✅ routes/ directory exists\n<br>";
    $routeFiles = ['articles.php', 'projects.php', 'testimonials.php', 'books.php', 'resources.php'];
    foreach ($routeFiles as $file) {
        if (file_exists($routesDir . $file)) {
            echo "  ✅ routes/$file exists\n<br>";
        } else {
            echo "  ❌ routes/$file missing\n<br>";
        }
    }
} else {
    echo "❌ routes/ directory missing\n<br>";
}

// Test database connection
echo "<h2>3. Database Connection Test</h2>\n";
try {
    if (file_exists($configFile)) {
        require_once $configFile;
        $pdo = getDatabaseConnection();
        echo "✅ Database connection successful\n<br>";
        
        // Test a simple query
        $stmt = $pdo->query("SELECT COUNT(*) as count FROM information_schema.tables WHERE table_schema = '" . DB_NAME . "'");
        $result = $stmt->fetch();
        echo "✅ Database has " . $result['count'] . " tables\n<br>";
    } else {
        echo "❌ Cannot test database - config.php missing\n<br>";
    }
} catch (Exception $e) {
    echo "❌ Database connection failed: " . $e->getMessage() . "\n<br>";
}

// Test API endpoints directly
echo "<h2>4. Direct API Endpoint Tests</h2>\n";

// Test the root endpoint
echo "<h3>Testing Root Endpoint</h3>\n";
ob_start();
try {
    if (file_exists($indexFile)) {
        // Simulate a request to the root endpoint
        $_SERVER['REQUEST_URI'] = '/scripts/api/';
        $_SERVER['REQUEST_METHOD'] = 'GET';
        
        // Capture output
        ob_start();
        include $indexFile;
        $output = ob_get_clean();
        
        echo "✅ Root endpoint executed successfully\n<br>";
        echo "Output length: " . strlen($output) . " characters\n<br>";
        echo "First 200 characters:\n<pre>" . htmlspecialchars(substr($output, 0, 200)) . "</pre>\n";
        
        // Check if it's JSON
        if (json_decode($output) !== null) {
            echo "✅ Output is valid JSON\n<br>";
        } else {
            echo "❌ Output is not valid JSON\n<br>";
        }
    } else {
        echo "❌ Cannot test - index.php missing\n<br>";
    }
} catch (Exception $e) {
    echo "❌ Error testing root endpoint: " . $e->getMessage() . "\n<br>";
}

// Test articles endpoint
echo "<h3>Testing Articles Endpoint</h3>\n";
try {
    if (file_exists($routesDir . 'articles.php')) {
        // Simulate a request to articles endpoint
        $_SERVER['REQUEST_URI'] = '/scripts/api/articles';
        $_SERVER['REQUEST_METHOD'] = 'GET';
        
        // Capture output
        ob_start();
        include $routesDir . 'articles.php';
        $output = ob_get_clean();
        
        echo "✅ Articles endpoint executed successfully\n<br>";
        echo "Output length: " . strlen($output) . " characters\n<br>";
        echo "First 200 characters:\n<pre>" . htmlspecialchars(substr($output, 0, 200)) . "</pre>\n";
        
        // Check if it's JSON
        if (json_decode($output) !== null) {
            echo "✅ Output is valid JSON\n<br>";
        } else {
            echo "❌ Output is not valid JSON\n<br>";
        }
    } else {
        echo "❌ Cannot test - articles.php missing\n<br>";
    }
} catch (Exception $e) {
    echo "❌ Error testing articles endpoint: " . $e->getMessage() . "\n<br>";
}

// Check headers
echo "<h2>5. Response Headers Test</h2>\n";
echo "Testing if we can set headers...\n<br>";

// Test setting JSON header
header('Content-Type: application/json; charset=utf-8');
echo "✅ JSON content-type header set\n<br>";

// Test CORS headers
header('Access-Control-Allow-Origin: *');
echo "✅ CORS header set\n<br>";

echo "<h2>6. PHP Configuration</h2>\n";
echo "PHP Version: " . PHP_VERSION . "\n<br>";
echo "PDO MySQL: " . (extension_loaded('pdo_mysql') ? '✅ Enabled' : '❌ Disabled') . "\n<br>";
echo "JSON: " . (extension_loaded('json') ? '✅ Enabled' : '❌ Disabled') . "\n<br>";

echo "<h2>7. Next Steps</h2>\n";
echo "<p>If you see errors above, fix them first. Then test the API again.</p>\n";
echo "<p>Common issues:</p>\n";
echo "<ul>\n";
echo "<li>Files not in correct location</li>\n";
echo "<li>Missing .htaccess file</li>\n";
echo "<li>Database connection issues</li>\n";
echo "<li>PHP configuration problems</li>\n";
echo "</ul>\n";

echo "<h2>8. Test URLs</h2>\n";
echo "<p>Try these URLs in your browser:</p>\n";
echo "<ul>\n";
echo "<li><a href='./' target='_blank'>API Root</a></li>\n";
echo "<li><a href='./articles' target='_blank'>Articles Endpoint</a></li>\n";
echo "<li><a href='./projects' target='_blank'>Projects Endpoint</a></li>\n";
echo "<li><a href='./test-page.html' target='_blank'>Test Page</a></li>\n";
echo "</ul>\n";

// Debug file to test API connectivity
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

echo json_encode([
    'success' => true,
    'message' => 'API is working!',
    'timestamp' => date('Y-m-d H:i:s'),
    'method' => $_SERVER['REQUEST_METHOD'],
    'uri' => $_SERVER['REQUEST_URI']
]);
?> 