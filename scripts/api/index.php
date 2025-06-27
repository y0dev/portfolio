<?php
/**
 * Portfolio API Main Entry Point
 * 
 * @author Devontae Reid
 * @version 1.0
 */

// Set error reporting for debugging
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Include configuration
require_once __DIR__ . '/config.php';

// Set CORS headers
setCorsHeaders();

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Get request path
$requestUri = $_SERVER['REQUEST_URI'];
$basePath = '/scripts/api/';

// Remove base path from request URI
$path = str_replace($basePath, '', $requestUri);
$path = parse_url($path, PHP_URL_PATH);
$pathParts = explode('/', trim($path, '/'));

// Get the resource type (articles, projects, testimonials, books, resources)
$resourceType = $pathParts[0] ?? '';

// Route to appropriate handler
switch ($resourceType) {
    case 'articles':
        require_once __DIR__ . '/routes/articles.php';
        break;
        
    case 'projects':
        require_once __DIR__ . '/routes/projects.php';
        break;
        
    case 'testimonials':
        require_once __DIR__ . '/routes/testimonials.php';
        break;
        
    case 'books':
        require_once __DIR__ . '/routes/books.php';
        break;
        
    case 'resources':
        require_once __DIR__ . '/routes/resources.php';
        break;
        
    case '':
        // API root - show available endpoints
        showApiInfo();
        break;
        
    default:
        ApiResponse::sendError('Resource not found. Available resources: articles, projects, testimonials, books, resources', 404);
        break;
}

/**
 * Show API information and available endpoints
 */
function showApiInfo() {
    $apiInfo = [
        'name' => 'Portfolio API',
        'version' => API_VERSION,
        'description' => 'RESTful API for managing portfolio content',
        'base_url' => API_BASE_URL,
        'endpoints' => [
            'articles' => [
                'GET /articles' => 'Get all articles with pagination and filters',
                'GET /articles/{id}' => 'Get single article by ID',
                'POST /articles' => 'Create new article',
                'PUT /articles/{id}' => 'Update article',
                'DELETE /articles/{id}' => 'Delete article'
            ],
            'projects' => [
                'GET /projects' => 'Get all projects with pagination and filters',
                'GET /projects/{id}' => 'Get single project by ID',
                'POST /projects' => 'Create new project',
                'PUT /projects/{id}' => 'Update project',
                'DELETE /projects/{id}' => 'Delete project'
            ],
            'testimonials' => [
                'GET /testimonials' => 'Get all testimonials with pagination and filters',
                'GET /testimonials/{id}' => 'Get single testimonial by ID',
                'POST /testimonials' => 'Create new testimonial',
                'PUT /testimonials/{id}' => 'Update testimonial',
                'DELETE /testimonials/{id}' => 'Delete testimonial'
            ],
            'books' => [
                'GET /books' => 'Get all books with pagination and filters',
                'GET /books/{id}' => 'Get single book by ID',
                'POST /books' => 'Create new book',
                'PUT /books/{id}' => 'Update book',
                'DELETE /books/{id}' => 'Delete book'
            ],
            'resources' => [
                'GET /resources' => 'Get all resources with pagination and filters',
                'GET /resources/{id}' => 'Get single resource by ID',
                'POST /resources' => 'Create new resource',
                'PUT /resources/{id}' => 'Update resource',
                'DELETE /resources/{id}' => 'Delete resource'
            ]
        ],
        'query_parameters' => [
            'page' => 'Page number for pagination (default: 1)',
            'per_page' => 'Items per page (default: 6, max: 100)',
            'search' => 'Search term for filtering',
            'category' => 'Filter by category',
            'sort_by' => 'Sort field (default: created_at)',
            'sort_order' => 'Sort order: ASC or DESC (default: DESC)'
        ],
        'authentication' => 'JWT tokens supported for protected endpoints',
        'rate_limiting' => API_RATE_LIMIT . ' requests per minute',
        'cors' => 'CORS enabled for web applications',
        'status' => 'API is running successfully!'
    ];
    
    // Set proper JSON content-type header
    header('Content-Type: application/json; charset=utf-8');
    http_response_code(200);
    echo json_encode($apiInfo, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
}
?> 