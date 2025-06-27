<?php
// Quick API Test - Simple CORS test
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, Accept, Origin');
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$response = [
    'success' => true,
    'message' => 'Quick test successful',
    'timestamp' => date('Y-m-d H:i:s'),
    'method' => $_SERVER['REQUEST_METHOD'],
    'uri' => $_SERVER['REQUEST_URI'],
    'origin' => $_SERVER['HTTP_ORIGIN'] ?? 'No origin',
    'server' => $_SERVER['SERVER_NAME'],
    'php_version' => PHP_VERSION
];

echo json_encode($response);
?> 