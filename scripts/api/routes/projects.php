<?php
/**
 * Projects API Routes
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
$projectId = null;

// Check if endpoint is a numeric ID
if (is_numeric($endpoint)) {
    $projectId = (int)$endpoint;
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
            if ($projectId) {
                // Get single project
                getProject($pdo, $projectId);
            } else {
                // Get projects with pagination and filters
                getProjects($pdo);
            }
            break;
            
        case 'POST':
            // Create new project
            createProject($pdo, $input);
            break;
            
        case 'PUT':
            if ($projectId) {
                // Update project
                updateProject($pdo, $projectId, $input);
            } else {
                ApiResponse::sendError('Project ID is required for update', 400);
            }
            break;
            
        case 'DELETE':
            if ($projectId) {
                // Delete project
                deleteProject($pdo, $projectId);
            } else {
                ApiResponse::sendError('Project ID is required for deletion', 400);
            }
            break;
            
        default:
            ApiResponse::sendError('Method not allowed', 405);
            break;
    }
    
} catch (Exception $e) {
    logMessage('ERROR', 'Projects API Error: ' . $e->getMessage());
    ApiResponse::sendError('Internal server error', 500);
}

/**
 * Get all projects with pagination and filters
 */
function getProjects($pdo) {
    // Get query parameters
    $page = max(1, (int)($_GET['page'] ?? 1));
    $perPage = min(MAX_PAGE_SIZE, max(1, (int)($_GET['per_page'] ?? DEFAULT_PAGE_SIZE)));
    $search = $_GET['search'] ?? '';
    $category = $_GET['category'] ?? '';
    $technologies = $_GET['technologies'] ?? '';
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
        $whereConditions[] = "(title LIKE ? OR description LIKE ?)";
        $params[] = "%$search%";
        $params[] = "%$search%";
    }
    
    if ($category) {
        $whereConditions[] = "category = ?";
        $params[] = $category;
    }
    
    if ($technologies) {
        $whereConditions[] = "technologies LIKE ?";
        $params[] = "%$technologies%";
    }
    
    $whereClause = !empty($whereConditions) ? 'WHERE ' . implode(' AND ', $whereConditions) : '';
    
    // Get total count
    $countSql = "SELECT COUNT(*) as total FROM projects $whereClause";
    $countStmt = $pdo->prepare($countSql);
    $countStmt->execute($params);
    $total = $countStmt->fetch()['total'];
    
    // Calculate pagination
    $offset = ($page - 1) * $perPage;
    
    // Get projects
    $sql = "SELECT * FROM projects $whereClause ORDER BY $sortBy $sortOrder LIMIT ? OFFSET ?";
    $params[] = $perPage;
    $params[] = $offset;
    
    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);
    $projects = $stmt->fetchAll();
    
    // Process projects
    foreach ($projects as &$project) {
        $project['technologies'] = json_decode($project['technologies'], true) ?: [];
        $project['images'] = json_decode($project['images'], true) ?: [];
        $project['created_at'] = date('Y-m-d H:i:s', strtotime($project['created_at']));
        $project['updated_at'] = $project['updated_at'] ? date('Y-m-d H:i:s', strtotime($project['updated_at'])) : null;
    }
    
    ApiResponse::sendPaginated($projects, $total, $page, $perPage, 'Projects retrieved successfully');
}

/**
 * Get single project by ID
 */
function getProject($pdo, $projectId) {
    $sql = "SELECT * FROM projects WHERE id = ?";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([$projectId]);
    $project = $stmt->fetch();
    
    if (!$project) {
        ApiResponse::sendError('Project not found', 404);
        return;
    }
    
    // Process project
    $project['technologies'] = json_decode($project['technologies'], true) ?: [];
    $project['images'] = json_decode($project['images'], true) ?: [];
    $project['created_at'] = date('Y-m-d H:i:s', strtotime($project['created_at']));
    $project['updated_at'] = $project['updated_at'] ? date('Y-m-d H:i:s', strtotime($project['updated_at'])) : null;
    
    ApiResponse::sendSuccess($project, 'Project retrieved successfully');
}

/**
 * Create new project
 */
function createProject($pdo, $input) {
    // Validate input
    $rules = [
        'title' => 'required|max:255',
        'description' => 'required',
        'category' => 'required|max:100',
        'technologies' => 'required'
    ];
    
    $errors = validateInput($input, $rules);
    if (!empty($errors)) {
        ApiResponse::sendError('Validation failed: ' . json_encode($errors), 400);
        return;
    }
    
    // Sanitize input
    $input = sanitizeInput($input);
    
    // Prepare arrays
    $technologies = is_array($input['technologies']) ? json_encode($input['technologies']) : $input['technologies'];
    $images = is_array($input['images'] ?? []) ? json_encode($input['images']) : json_encode([]);
    
    $sql = "INSERT INTO projects (title, description, category, technologies, images, github_url, live_url, created_at) 
            VALUES (?, ?, ?, ?, ?, ?, ?, NOW())";
    
    $stmt = $pdo->prepare($sql);
    $stmt->execute([
        $input['title'],
        $input['description'],
        $input['category'],
        $technologies,
        $images,
        $input['github_url'] ?? null,
        $input['live_url'] ?? null
    ]);
    
    $projectId = $pdo->lastInsertId();
    
    // Get the created project
    $sql = "SELECT * FROM projects WHERE id = ?";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([$projectId]);
    $project = $stmt->fetch();
    
    $project['technologies'] = json_decode($project['technologies'], true) ?: [];
    $project['images'] = json_decode($project['images'], true) ?: [];
    
    logMessage('INFO', "Project created: ID $projectId");
    ApiResponse::sendSuccess($project, 'Project created successfully', 201);
}

/**
 * Update project
 */
function updateProject($pdo, $projectId, $input) {
    // Check if project exists
    $checkSql = "SELECT id FROM projects WHERE id = ?";
    $checkStmt = $pdo->prepare($checkSql);
    $checkStmt->execute([$projectId]);
    
    if (!$checkStmt->fetch()) {
        ApiResponse::sendError('Project not found', 404);
        return;
    }
    
    // Sanitize input
    $input = sanitizeInput($input);
    
    // Build update fields
    $updateFields = [];
    $params = [];
    
    $allowedFields = ['title', 'description', 'category', 'technologies', 'images', 'github_url', 'live_url'];
    
    foreach ($allowedFields as $field) {
        if (isset($input[$field])) {
            $updateFields[] = "$field = ?";
            if (in_array($field, ['technologies', 'images']) && is_array($input[$field])) {
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
    $params[] = $projectId;
    
    $sql = "UPDATE projects SET " . implode(', ', $updateFields) . " WHERE id = ?";
    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);
    
    // Get updated project
    $sql = "SELECT * FROM projects WHERE id = ?";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([$projectId]);
    $project = $stmt->fetch();
    
    $project['technologies'] = json_decode($project['technologies'], true) ?: [];
    $project['images'] = json_decode($project['images'], true) ?: [];
    
    logMessage('INFO', "Project updated: ID $projectId");
    ApiResponse::sendSuccess($project, 'Project updated successfully');
}

/**
 * Delete project
 */
function deleteProject($pdo, $projectId) {
    // Check if project exists
    $checkSql = "SELECT id FROM projects WHERE id = ?";
    $checkStmt = $pdo->prepare($checkSql);
    $checkStmt->execute([$projectId]);
    
    if (!$checkStmt->fetch()) {
        ApiResponse::sendError('Project not found', 404);
        return;
    }
    
    $sql = "DELETE FROM projects WHERE id = ?";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([$projectId]);
    
    logMessage('INFO', "Project deleted: ID $projectId");
    ApiResponse::sendSuccess(['id' => $projectId], 'Project deleted successfully');
}
?> 