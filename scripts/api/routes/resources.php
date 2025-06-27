<?php
/**
 * Resources API Routes
 * 
 * @author Devontae Reid
 * @version 1.0
 */

require_once '../../config/config.php';

// Set CORS headers
setCorsHeaders();

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Check rate limiting
$clientIP = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
if (!checkRateLimit($clientIP)) {
    ApiResponse::sendError('Rate limit exceeded. Please try again later.', 429);
    exit();
}

// Get request method and path
$method = $_SERVER['REQUEST_METHOD'];
$path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$pathParts = explode('/', trim($path, '/'));

// Extract endpoint and resource type from path
$endpoint = end($pathParts);
$resourceId = null;
$resourceType = '';

// Check if endpoint is a numeric ID
if (is_numeric($endpoint)) {
    $resourceId = (int)$endpoint;
    // Get resource type from second-to-last path part
    $resourceType = $pathParts[count($pathParts) - 2] ?? '';
} else {
    // Get resource type from last path part
    $resourceType = $endpoint;
}

// Validate resource type
$validTypes = ['books', 'tools', 'dev_resources', 'podcasts', 'youtube_channels', 'theology_resources'];
if (!in_array($resourceType, $validTypes)) {
    ApiResponse::sendError('Invalid resource type. Valid types: ' . implode(', ', $validTypes), 400);
    exit();
}

// Get request body for POST/PUT requests
$input = json_decode(file_get_contents('php://input'), true);
if (!$input) {
    $input = $_POST;
}

try {
    $pdo = getDatabaseConnection();
    
    switch ($method) {
        case 'GET':
            if ($resourceId) {
                // Get single resource
                getResource($pdo, $resourceType, $resourceId);
            } else {
                // Get resources with pagination and filters
                getResources($pdo, $resourceType);
            }
            break;
            
        case 'POST':
            // Create new resource
            createResource($pdo, $resourceType, $input);
            break;
            
        case 'PUT':
            if ($resourceId) {
                // Update resource
                updateResource($pdo, $resourceType, $resourceId, $input);
            } else {
                ApiResponse::sendError('Resource ID is required for update', 400);
            }
            break;
            
        case 'DELETE':
            if ($resourceId) {
                // Delete resource
                deleteResource($pdo, $resourceType, $resourceId);
            } else {
                ApiResponse::sendError('Resource ID is required for deletion', 400);
            }
            break;
            
        default:
            ApiResponse::sendError('Method not allowed', 405);
            break;
    }
    
} catch (Exception $e) {
    logMessage('ERROR', 'Resources API Error: ' . $e->getMessage());
    ApiResponse::sendError('Internal server error', 500);
}

/**
 * Get all resources of a specific type with pagination and filters
 */
function getResources($pdo, $resourceType) {
    // Get query parameters
    $page = max(1, (int)($_GET['page'] ?? 1));
    $perPage = min(MAX_PAGE_SIZE, max(1, (int)($_GET['per_page'] ?? DEFAULT_PAGE_SIZE)));
    $search = $_GET['search'] ?? '';
    $category = $_GET['category'] ?? '';
    $sortBy = $_GET['sort_by'] ?? 'created_at';
    $sortOrder = strtoupper($_GET['sort_order'] ?? 'DESC');
    
    // Validate sort order
    if (!in_array($sortOrder, ['ASC', 'DESC'])) {
        $sortOrder = 'DESC';
    }
    
    // Build WHERE clause
    $whereConditions = [];
    $params = [];
    
    if ($search) {
        switch ($resourceType) {
            case 'books':
                $whereConditions[] = "(title LIKE ? OR author LIKE ? OR description LIKE ?)";
                $params[] = "%$search%";
                $params[] = "%$search%";
                $params[] = "%$search%";
                break;
            case 'tools':
            case 'dev_resources':
            case 'theology_resources':
                $whereConditions[] = "(name LIKE ? OR description LIKE ?)";
                $params[] = "%$search%";
                $params[] = "%$search%";
                break;
            case 'podcasts':
            case 'youtube_channels':
                $whereConditions[] = "(name LIKE ? OR description LIKE ?)";
                $params[] = "%$search%";
                $params[] = "%$search%";
                break;
        }
    }
    
    if ($category) {
        $whereConditions[] = "category = ?";
        $params[] = $category;
    }
    
    $whereClause = !empty($whereConditions) ? 'WHERE ' . implode(' AND ', $whereConditions) : '';
    
    // Get total count
    $countSql = "SELECT COUNT(*) as total FROM $resourceType $whereClause";
    $countStmt = $pdo->prepare($countSql);
    $countStmt->execute($params);
    $total = $countStmt->fetch()['total'];
    
    // Calculate pagination
    $offset = ($page - 1) * $perPage;
    
    // Get resources
    $sql = "SELECT * FROM $resourceType $whereClause ORDER BY $sortBy $sortOrder LIMIT ? OFFSET ?";
    $params[] = $perPage;
    $params[] = $offset;
    
    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);
    $resources = $stmt->fetchAll();
    
    // Process resources based on type
    foreach ($resources as &$resource) {
        $resource['created_at'] = date('Y-m-d H:i:s', strtotime($resource['created_at']));
        
        // Add type field for frontend identification
        $resource['type'] = $resourceType;
    }
    
    ApiResponse::sendPaginated($resources, $total, $page, $perPage, ucfirst(str_replace('_', ' ', $resourceType)) . ' retrieved successfully');
}

/**
 * Get single resource by ID and type
 */
function getResource($pdo, $resourceType, $resourceId) {
    $sql = "SELECT * FROM $resourceType WHERE id = ?";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([$resourceId]);
    $resource = $stmt->fetch();
    
    if (!$resource) {
        ApiResponse::sendError('Resource not found', 404);
        return;
    }
    
    // Process resource
    $resource['created_at'] = date('Y-m-d H:i:s', strtotime($resource['created_at']));
    $resource['type'] = $resourceType;
    
    ApiResponse::sendSuccess($resource, 'Resource retrieved successfully');
}

/**
 * Create new resource based on type
 */
function createResource($pdo, $resourceType, $input) {
    // Validate input based on resource type
    $errors = validateResourceInput($resourceType, $input);
    if (!empty($errors)) {
        ApiResponse::sendError('Validation failed: ' . json_encode($errors), 400);
        return;
    }
    
    // Sanitize input
    $input = sanitizeInput($input);
    
    // Build insert query based on resource type
    $sql = buildInsertQuery($resourceType, $input);
    $params = buildInsertParams($resourceType, $input);
    
    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);
    
    $resourceId = $pdo->lastInsertId();
    
    // Get the created resource
    $sql = "SELECT * FROM $resourceType WHERE id = ?";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([$resourceId]);
    $resource = $stmt->fetch();
    
    $resource['type'] = $resourceType;
    
    logMessage('INFO', "$resourceType created: ID $resourceId");
    ApiResponse::sendSuccess($resource, ucfirst(str_replace('_', ' ', $resourceType)) . ' created successfully', 201);
}

/**
 * Update resource based on type
 */
function updateResource($pdo, $resourceType, $resourceId, $input) {
    // Check if resource exists
    $checkSql = "SELECT id FROM $resourceType WHERE id = ?";
    $checkStmt = $pdo->prepare($checkSql);
    $checkStmt->execute([$resourceId]);
    
    if (!$checkStmt->fetch()) {
        ApiResponse::sendError('Resource not found', 404);
        return;
    }
    
    // Sanitize input
    $input = sanitizeInput($input);
    
    // Build update query based on resource type
    $sql = buildUpdateQuery($resourceType, $input);
    $params = buildUpdateParams($resourceType, $input, $resourceId);
    
    if (empty($params)) {
        ApiResponse::sendError('No valid fields to update', 400);
        return;
    }
    
    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);
    
    // Get updated resource
    $sql = "SELECT * FROM $resourceType WHERE id = ?";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([$resourceId]);
    $resource = $stmt->fetch();
    
    $resource['type'] = $resourceType;
    
    logMessage('INFO', "$resourceType updated: ID $resourceId");
    ApiResponse::sendSuccess($resource, ucfirst(str_replace('_', ' ', $resourceType)) . ' updated successfully');
}

/**
 * Delete resource based on type
 */
function deleteResource($pdo, $resourceType, $resourceId) {
    // Check if resource exists
    $checkSql = "SELECT id FROM $resourceType WHERE id = ?";
    $checkStmt = $pdo->prepare($checkSql);
    $checkStmt->execute([$resourceId]);
    
    if (!$checkStmt->fetch()) {
        ApiResponse::sendError('Resource not found', 404);
        return;
    }
    
    $sql = "DELETE FROM $resourceType WHERE id = ?";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([$resourceId]);
    
    logMessage('INFO', "$resourceType deleted: ID $resourceId");
    ApiResponse::sendSuccess(['id' => $resourceId], ucfirst(str_replace('_', ' ', $resourceType)) . ' deleted successfully');
}

/**
 * Validate input based on resource type
 */
function validateResourceInput($resourceType, $input) {
    $errors = [];
    
    switch ($resourceType) {
        case 'books':
            if (empty($input['title'])) $errors[] = 'Title is required';
            if (empty($input['author'])) $errors[] = 'Author is required';
            if (isset($input['rating']) && ($input['rating'] < 1 || $input['rating'] > 5)) {
                $errors[] = 'Rating must be between 1 and 5';
            }
            break;
            
        case 'tools':
        case 'dev_resources':
        case 'theology_resources':
            if (empty($input['name'])) $errors[] = 'Name is required';
            if (empty($input['description'])) $errors[] = 'Description is required';
            break;
            
        case 'podcasts':
        case 'youtube_channels':
            if (empty($input['name'])) $errors[] = 'Name is required';
            if (empty($input['description'])) $errors[] = 'Description is required';
            if (empty($input['url'])) $errors[] = 'URL is required';
            break;
    }
    
    return $errors;
}

/**
 * Build insert query based on resource type
 */
function buildInsertQuery($resourceType, $input) {
    switch ($resourceType) {
        case 'books':
            return "INSERT INTO books (title, author, category, description, cover, rating, status, featured, link, image, created_at) 
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())";
            
        case 'tools':
            return "INSERT INTO tools (name, category, description, icon, created_at) 
                    VALUES (?, ?, ?, ?, NOW())";
            
        case 'dev_resources':
        case 'theology_resources':
            return "INSERT INTO $resourceType (name, category, description, url, icon, created_at) 
                    VALUES (?, ?, ?, ?, ?, NOW())";
            
        case 'podcasts':
        case 'youtube_channels':
            return "INSERT INTO $resourceType (name, description, url, icon, created_at) 
                    VALUES (?, ?, ?, ?, NOW())";
    }
}

/**
 * Build insert parameters based on resource type
 */
function buildInsertParams($resourceType, $input) {
    switch ($resourceType) {
        case 'books':
            return [
                $input['title'] ?? '',
                $input['author'] ?? '',
                $input['category'] ?? '',
                $input['description'] ?? '',
                $input['cover'] ?? '📚',
                $input['rating'] ?? 0,
                $input['status'] ?? 'To Read',
                $input['featured'] ?? false,
                $input['link'] ?? '',
                $input['image'] ?? ''
            ];
            
        case 'tools':
            return [
                $input['name'] ?? '',
                $input['category'] ?? '',
                $input['description'] ?? '',
                $input['icon'] ?? '🛠️'
            ];
            
        case 'dev_resources':
        case 'theology_resources':
            return [
                $input['name'] ?? '',
                $input['category'] ?? '',
                $input['description'] ?? '',
                $input['url'] ?? '',
                $input['icon'] ?? '🔗'
            ];
            
        case 'podcasts':
        case 'youtube_channels':
            return [
                $input['name'] ?? '',
                $input['description'] ?? '',
                $input['url'] ?? '',
                $input['icon'] ?? '🎧'
            ];
    }
}

/**
 * Build update query based on resource type
 */
function buildUpdateQuery($resourceType, $input) {
    $updateFields = [];
    
    switch ($resourceType) {
        case 'books':
            $allowedFields = ['title', 'author', 'category', 'description', 'cover', 'rating', 'status', 'featured', 'link', 'image'];
            break;
        case 'tools':
            $allowedFields = ['name', 'category', 'description', 'icon'];
            break;
        case 'dev_resources':
        case 'theology_resources':
            $allowedFields = ['name', 'category', 'description', 'url', 'icon'];
            break;
        case 'podcasts':
        case 'youtube_channels':
            $allowedFields = ['name', 'description', 'url', 'icon'];
            break;
    }
    
    foreach ($allowedFields as $field) {
        if (isset($input[$field])) {
            $updateFields[] = "$field = ?";
        }
    }
    
    if (empty($updateFields)) {
        return null;
    }
    
    return "UPDATE $resourceType SET " . implode(', ', $updateFields) . " WHERE id = ?";
}

/**
 * Build update parameters based on resource type
 */
function buildUpdateParams($resourceType, $input, $resourceId) {
    $params = [];
    
    switch ($resourceType) {
        case 'books':
            $allowedFields = ['title', 'author', 'category', 'description', 'cover', 'rating', 'status', 'featured', 'link', 'image'];
            break;
        case 'tools':
            $allowedFields = ['name', 'category', 'description', 'icon'];
            break;
        case 'dev_resources':
        case 'theology_resources':
            $allowedFields = ['name', 'category', 'description', 'url', 'icon'];
            break;
        case 'podcasts':
        case 'youtube_channels':
            $allowedFields = ['name', 'description', 'url', 'icon'];
            break;
    }
    
    foreach ($allowedFields as $field) {
        if (isset($input[$field])) {
            $params[] = $input[$field];
        }
    }
    
    $params[] = $resourceId;
    return $params;
}
?> 