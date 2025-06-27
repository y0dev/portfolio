<?php
/**
 * API Test File
 * 
 * This file demonstrates how to test the API endpoints
 * Run this file to test the API functionality
 * 
 * @author Devontae Reid
 * @version 1.0
 */

// Test configuration
$baseUrl = 'http://localhost/scripts/api/';
$testData = [
    'articles' => [
        'title' => 'Test Article',
        'content' => 'This is a test article content.',
        'category' => 'technology',
        'tags' => ['test', 'api', 'php'],
        'image' => 'test-image.jpg'
    ],
    'projects' => [
        'title' => 'Test Project',
        'description' => 'This is a test project description.',
        'category' => 'web-development',
        'technologies' => ['React', 'PHP', 'MySQL'],
        'github_url' => 'https://github.com/test/project',
        'live_url' => 'https://test-project.com'
    ],
    'testimonials' => [
        'name' => 'John Doe',
        'content' => 'Great work and excellent communication!',
        'company' => 'Test Company',
        'rating' => 5,
        'image' => 'john-doe.jpg'
    ],
    'books' => [
        'title' => 'Test Book',
        'author' => 'Jane Smith',
        'description' => 'A great book about testing.',
        'category' => 'technology',
        'rating' => 4,
        'cover_image' => 'book-cover.jpg',
        'amazon_url' => 'https://amazon.com/test-book'
    ],
    'resources' => [
        'title' => 'Test Resource',
        'description' => 'A useful resource for developers.',
        'url' => 'https://example.com/resource',
        'category' => 'development',
        'type' => 'article',
        'tags' => ['development', 'tutorial'],
        'image' => 'resource-image.jpg'
    ]
];

/**
 * Make HTTP request to API
 */
function makeRequest($url, $method = 'GET', $data = null) {
    $ch = curl_init();
    
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'Content-Type: application/json',
        'Accept: application/json'
    ]);
    
    if ($method === 'POST' || $method === 'PUT') {
        curl_setopt($ch, CURLOPT_CUSTOMREQUEST, $method);
        if ($data) {
            curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
        }
    }
    
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    
    return [
        'status' => $httpCode,
        'response' => json_decode($response, true)
    ];
}

/**
 * Test API endpoint
 */
function testEndpoint($endpoint, $method = 'GET', $data = null, $id = null) {
    global $baseUrl;
    
    $url = $baseUrl . $endpoint;
    if ($id) {
        $url .= '/' . $id;
    }
    
    echo "Testing $method $url\n";
    
    $result = makeRequest($url, $method, $data);
    
    echo "Status: " . $result['status'] . "\n";
    echo "Response: " . json_encode($result['response'], JSON_PRETTY_PRINT) . "\n";
    echo "----------------------------------------\n";
    
    return $result;
}

/**
 * Run all tests
 */
function runTests() {
    global $testData;
    
    echo "Starting API Tests\n";
    echo "==================\n\n";
    
    // Test Articles
    echo "Testing Articles API\n";
    echo "===================\n";
    
    // Get all articles
    testEndpoint('articles');
    
    // Create article
    $articleResult = testEndpoint('articles', 'POST', $testData['articles']);
    $articleId = $articleResult['response']['data']['id'] ?? null;
    
    if ($articleId) {
        // Get single article
        testEndpoint('articles', 'GET', null, $articleId);
        
        // Update article
        $updateData = $testData['articles'];
        $updateData['title'] = 'Updated Test Article';
        testEndpoint('articles', 'PUT', $updateData, $articleId);
        
        // Delete article
        testEndpoint('articles', 'DELETE', null, $articleId);
    }
    
    echo "\n";
    
    // Test Projects
    echo "Testing Projects API\n";
    echo "===================\n";
    
    // Get all projects
    testEndpoint('projects');
    
    // Create project
    $projectResult = testEndpoint('projects', 'POST', $testData['projects']);
    $projectId = $projectResult['response']['data']['id'] ?? null;
    
    if ($projectId) {
        // Get single project
        testEndpoint('projects', 'GET', null, $projectId);
        
        // Update project
        $updateData = $testData['projects'];
        $updateData['title'] = 'Updated Test Project';
        testEndpoint('projects', 'PUT', $updateData, $projectId);
        
        // Delete project
        testEndpoint('projects', 'DELETE', null, $projectId);
    }
    
    echo "\n";
    
    // Test Testimonials
    echo "Testing Testimonials API\n";
    echo "========================\n";
    
    // Get all testimonials
    testEndpoint('testimonials');
    
    // Create testimonial
    $testimonialResult = testEndpoint('testimonials', 'POST', $testData['testimonials']);
    $testimonialId = $testimonialResult['response']['data']['id'] ?? null;
    
    if ($testimonialId) {
        // Get single testimonial
        testEndpoint('testimonials', 'GET', null, $testimonialId);
        
        // Update testimonial
        $updateData = $testData['testimonials'];
        $updateData['name'] = 'Jane Doe';
        testEndpoint('testimonials', 'PUT', $updateData, $testimonialId);
        
        // Delete testimonial
        testEndpoint('testimonials', 'DELETE', null, $testimonialId);
    }
    
    echo "\n";
    
    // Test Books
    echo "Testing Books API\n";
    echo "=================\n";
    
    // Get all books
    testEndpoint('books');
    
    // Create book
    $bookResult = testEndpoint('books', 'POST', $testData['books']);
    $bookId = $bookResult['response']['data']['id'] ?? null;
    
    if ($bookId) {
        // Get single book
        testEndpoint('books', 'GET', null, $bookId);
        
        // Update book
        $updateData = $testData['books'];
        $updateData['title'] = 'Updated Test Book';
        testEndpoint('books', 'PUT', $updateData, $bookId);
        
        // Delete book
        testEndpoint('books', 'DELETE', null, $bookId);
    }
    
    echo "\n";
    
    // Test Resources
    echo "Testing Resources API\n";
    echo "====================\n";
    
    // Get all resources
    testEndpoint('resources');
    
    // Create resource
    $resourceResult = testEndpoint('resources', 'POST', $testData['resources']);
    $resourceId = $resourceResult['response']['data']['id'] ?? null;
    
    if ($resourceId) {
        // Get single resource
        testEndpoint('resources', 'GET', null, $resourceId);
        
        // Update resource
        $updateData = $testData['resources'];
        $updateData['title'] = 'Updated Test Resource';
        testEndpoint('resources', 'PUT', $updateData, $resourceId);
        
        // Delete resource
        testEndpoint('resources', 'DELETE', null, $resourceId);
    }
    
    echo "\n";
    
    // Test API Info
    echo "Testing API Info\n";
    echo "================\n";
    testEndpoint('');
    
    echo "All tests completed!\n";
}

// Run tests if this file is executed directly
if (basename(__FILE__) === basename($_SERVER['SCRIPT_NAME'])) {
    runTests();
}
?> 