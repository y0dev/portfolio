<?php
/**
 * Raw API Test
 * 
 * Shows the raw response from API endpoints
 */

// Disable output buffering
ob_end_clean();

echo "<h1>Raw API Response Test</h1>\n";

// Test different endpoints
$endpoints = [
    'root' => './',
    'articles' => './articles',
    'projects' => './projects',
    'testimonials' => './testimonials',
    'books' => './books',
    'resources' => './resources'
];

foreach ($endpoints as $name => $endpoint) {
    echo "<h2>Testing: $name ($endpoint)</h2>\n";
    
    // Get the current URL
    $protocol = isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? 'https' : 'http';
    $host = $_SERVER['HTTP_HOST'];
    $currentPath = dirname($_SERVER['SCRIPT_NAME']);
    $testUrl = $protocol . '://' . $host . $currentPath . '/' . $endpoint;
    
    echo "URL: $testUrl\n<br>";
    
    // Use cURL to test the endpoint
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $testUrl);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    curl_setopt($ch, CURLOPT_HEADER, true);
    curl_setopt($ch, CURLOPT_NOBODY, false);
    
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $contentType = curl_getinfo($ch, CURLINFO_CONTENT_TYPE);
    curl_close($ch);
    
    echo "HTTP Code: $httpCode\n<br>";
    echo "Content-Type: $contentType\n<br>";
    
    // Split headers and body
    $headerSize = curl_getinfo($ch, CURLINFO_HEADER_SIZE);
    $headers = substr($response, 0, $headerSize);
    $body = substr($response, $headerSize);
    
    echo "<h3>Headers:</h3>\n<pre>" . htmlspecialchars($headers) . "</pre>\n";
    echo "<h3>Body (first 500 chars):</h3>\n<pre>" . htmlspecialchars(substr($body, 0, 500)) . "</pre>\n";
    
    // Check if it's JSON
    if (json_decode($body) !== null) {
        echo "✅ Valid JSON\n<br>";
    } else {
        echo "❌ Not valid JSON\n<br>";
    }
    
    echo "<hr>\n";
}
?> 