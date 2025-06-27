<?php
/**
 * Resources API Routes
 * 
 * @author Devontae Reid
 * @version 1.0
 */

require_once '../config.php';

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

// Extract endpoint from path
$endpoint = end($pathParts);
$resourceId = null;

// Check if endpoint is a numeric ID
if (is_numeric($endpoint)) {
    $resourceId = (int)$endpoint;
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
                getResource($pdo, $resourceId);
            } else {
                // Get resources with pagination and filters
                getResources($pdo);
            }
            break;
            
        case 'POST':
            // Create new resource
            createResource($pdo, $input);
            break;
            
        case 'PUT':
            if ($resourceId) {
                // Update resource
                updateResource($pdo, $resourceId, $input);
            } else {
                ApiResponse::sendError('Resource ID is required for update', 400);
            }
            break;
            
        case 'DELETE':
            if ($resourceId) {
                // Delete resource
                deleteResource($pdo, $resourceId);
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
 * Get all resources with pagination and filters
 */
function getResources($pdo) {
    // Get query parameters
    $page = max(1, (int)($_GET['page'] ?? 1));
    $perPage = min(MAX_PAGE_SIZE, max(1, (int)($_GET['per_page'] ?? DEFAULT_PAGE_SIZE)));
    $search = $_GET['search'] ?? '';
    $category = $_GET['category'] ?? '';
    $type = $_GET['type'] ?? '';
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
        $whereConditions[] = "(title LIKE ? OR description LIKE ? OR tags LIKE ?)";
        $params[] = "%$search%";
        $params[] = "%$search%";
        $params[] = "%$search%";
    }
    
    if ($category) {
        $whereConditions[] = "category = ?";
        $params[] = $category;
    }
    
    if ($type) {
        $whereConditions[] = "type = ?";
        $params[] = $type;
    }
    
    $whereClause = !empty($whereConditions) ? 'WHERE ' . implode(' AND ', $whereConditions) : '';
    
    // Get total count
    $countSql = "SELECT COUNT(*) as total FROM resources $whereClause";
    $countStmt = $pdo->prepare($countSql);
    $countStmt->execute($params);
    $total = $countStmt->fetch()['total'];
    
    // Calculate pagination
    $offset = ($page - 1) * $perPage;
    
    // Get resources
    $sql = "SELECT * FROM resources $whereClause ORDER BY $sortBy $sortOrder LIMIT ? OFFSET ?";
    $params[] = $perPage;
    $params[] = $offset;
    
    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);
    $resources = $stmt->fetchAll();
    
    // Process resources
    foreach ($resources as &$resource) {
        $resource['tags'] = json_decode($resource['tags'], true) ?: [];
        $resource['created_at'] = date('Y-m-d H:i:s', strtotime($resource['created_at']));
        $resource['updated_at'] = $resource['updated_at'] ? date('Y-m-d H:i:s', strtotime($resource['updated_at'])) : null;
    }
    
    ApiResponse::sendPaginated($resources, $total, $page, $perPage, 'Resources retrieved successfully');
}

/**
 * Get single resource by ID
 */
function getResource($pdo, $resourceId) {
    $sql = "SELECT * FROM resources WHERE id = ?";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([$resourceId]);
    $resource = $stmt->fetch();
    
    if (!$resource) {
        ApiResponse::sendError('Resource not found', 404);
        return;
    }
    
    // Process resource
    $resource['tags'] = json_decode($resource['tags'], true) ?: [];
    $resource['created_at'] = date('Y-m-d H:i:s', strtotime($resource['created_at']));
    $resource['updated_at'] = $resource['updated_at'] ? date('Y-m-d H:i:s', strtotime($resource['updated_at'])) : null;
    
    ApiResponse::sendSuccess($resource, 'Resource retrieved successfully');
}

/**
 * Create new resource
 */
function createResource($pdo, $input) {
    // Validate input
    $rules = [
        'title' => 'required|max:255',
        'description' => 'required',
        'url' => 'required|url',
        'category' => 'required|max:100',
        'type' => 'required|max:50'
    ];
    
    $errors = validateInput($input, $rules);
    if (!empty($errors)) {
        ApiResponse::sendError('Validation failed: ' . json_encode($errors), 400);
        return;
    }
    
    // Sanitize input
    $input = sanitizeInput($input);
    
    // Prepare tags
    $tags = is_array($input['tags'] ?? []) ? json_encode($input['tags']) : json_encode([]);
    
    $sql = "INSERT INTO resources (title, description, url, category, type, tags, image, created_at) 
            VALUES (?, ?, ?, ?, ?, ?, ?, NOW())";
    
    $stmt = $pdo->prepare($sql);
    $stmt->execute([
        $input['title'],
        $input['description'],
        $input['url'],
        $input['category'],
        $input['type'],
        $tags,
        $input['image'] ?? null
    ]);
    
    $resourceId = $pdo->lastInsertId();
    
    // Get the created resource
    $sql = "SELECT * FROM resources WHERE id = ?";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([$resourceId]);
    $resource = $stmt->fetch();
    
    $resource['tags'] = json_decode($resource['tags'], true) ?: [];
    
    logMessage('INFO', "Resource created: ID $resourceId");
    ApiResponse::sendSuccess($resource, 'Resource created successfully', 201);
}

/**
 * Update resource
 */
function updateResource($pdo, $resourceId, $input) {
    // Check if resource exists
    $checkSql = "SELECT id FROM resources WHERE id = ?";
    $checkStmt = $pdo->prepare($checkSql);
    $checkStmt->execute([$resourceId]);
    
    if (!$checkStmt->fetch()) {
        ApiResponse::sendError('Resource not found', 404);
        return;
    }
    
    // Sanitize input
    $input = sanitizeInput($input);
    
    // Build update fields
    $updateFields = [];
    $params = [];
    
    $allowedFields = ['title', 'description', 'url', 'category', 'type', 'tags', 'image'];
    
    foreach ($allowedFields as $field) {
        if (isset($input[$field])) {
            $updateFields[] = "$field = ?";
            if ($field === 'tags' && is_array($input[$field])) {
                $params[] = json_encode($input[$field]);
            } else {
                $params[] = $input[$field];
            }
        }
    }
    
    if (empty($updateFields)) {
        ApiResponse::sendError('No valid fields to update', 400);
        return;
    }
    
    $updateFields[] = "updated_at = NOW()";
    $params[] = $resourceId;
    
    $sql = "UPDATE resources SET " . implode(', ', $updateFields) . " WHERE id = ?";
    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);
    
    // Get updated resource
    $sql = "SELECT * FROM resources WHERE id = ?";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([$resourceId]);
    $resource = $stmt->fetch();
    
    $resource['tags'] = json_decode($resource['tags'], true) ?: [];
    
    logMessage('INFO', "Resource updated: ID $resourceId");
    ApiResponse::sendSuccess($resource, 'Resource updated successfully');
}

/**
 * Delete resource
 */
function deleteResource($pdo, $resourceId) {
    // Check if resource exists
    $checkSql = "SELECT id FROM resources WHERE id = ?";
    $checkStmt = $pdo->prepare($checkSql);
    $checkStmt->execute([$resourceId]);
    
    if (!$checkStmt->fetch()) {
        ApiResponse::sendError('Resource not found', 404);
        return;
    }
    
    $sql = "DELETE FROM resources WHERE id = ?";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([$resourceId]);
    
    logMessage('INFO', "Resource deleted: ID $resourceId");
    ApiResponse::sendSuccess(['id' => $resourceId], 'Resource deleted successfully');
}
?> 