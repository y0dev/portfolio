<?php
/**
 * CORS Test File
 * Use this to test if the API is accessible and CORS is working
 */

// Enable error reporting
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Set CORS headers
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With, Accept, Origin');
header('Access-Control-Max-Age: 86400');
header('Access-Control-Allow-Credentials: true');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Set JSON content type
header('Content-Type: application/json; charset=utf-8');

// Get request info
$requestInfo = [
    'method' => $_SERVER['REQUEST_METHOD'],
    'uri' => $_SERVER['REQUEST_URI'],
    'path' => parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH),
    'query' => $_SERVER['QUERY_STRING'],
    'origin' => $_SERVER['HTTP_ORIGIN'] ?? 'No origin header',
    'user_agent' => $_SERVER['HTTP_USER_AGENT'] ?? 'No user agent',
    'timestamp' => date('Y-m-d H:i:s'),
    'server' => $_SERVER['SERVER_NAME'],
    'port' => $_SERVER['SERVER_PORT'],
    'protocol' => $_SERVER['REQUEST_SCHEME'] ?? 'unknown'
];

// Test database connection if config exists
$dbStatus = 'Not tested';
if (file_exists(__DIR__ . '/config.php')) {
    try {
        require_once __DIR__ . '/config.php';
        $pdo = getDatabaseConnection();
        $dbStatus = 'Connected successfully';
    } catch (Exception $e) {
        $dbStatus = 'Connection failed: ' . $e->getMessage();
    }
} else {
    $dbStatus = 'Config file not found';
}

// Check if other API files exist
$files = [
    'index.php' => file_exists(__DIR__ . '/index.php'),
    'config.php' => file_exists(__DIR__ . '/config.php'),
    'routes/articles.php' => file_exists(__DIR__ . '/routes/articles.php'),
    'routes/books.php' => file_exists(__DIR__ . '/routes/books.php'),
    'routes/projects.php' => file_exists(__DIR__ . '/routes/projects.php'),
    'routes/resources.php' => file_exists(__DIR__ . '/routes/resources.php'),
    'routes/testimonials.php' => file_exists(__DIR__ . '/routes/testimonials.php'),
    '.htaccess' => file_exists(__DIR__ . '/.htaccess')
];

// Response data
$response = [
    'success' => true,
    'message' => 'CORS test successful',
    'data' => [
        'request_info' => $requestInfo,
        'database_status' => $dbStatus,
        'files_exist' => $files,
        'php_version' => PHP_VERSION,
        'server_software' => $_SERVER['SERVER_SOFTWARE'] ?? 'Unknown',
        'cors_headers_set' => true
    ],
    'timestamp' => date('Y-m-d H:i:s')
];

// Send response
http_response_code(200);
echo json_encode($response, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
?> 