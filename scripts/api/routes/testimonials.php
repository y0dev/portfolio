<?php
/**
 * Testimonials API Routes
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

// Extract endpoint from path
$endpoint = end($pathParts);
$testimonialId = null;

// Check if endpoint is a numeric ID
if (is_numeric($endpoint)) {
    $testimonialId = (int)$endpoint;
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
            if ($testimonialId) {
                // Get single testimonial
                getTestimonial($pdo, $testimonialId);
            } else {
                // Get testimonials with pagination and filters
                getTestimonials($pdo);
            }
            break;
            
        case 'POST':
            // Create new testimonial
            createTestimonial($pdo, $input);
            break;
            
        case 'PUT':
            if ($testimonialId) {
                // Update testimonial
                updateTestimonial($pdo, $testimonialId, $input);
            } else {
                ApiResponse::sendError('Testimonial ID is required for update', 400);
            }
            break;
            
        case 'DELETE':
            if ($testimonialId) {
                // Delete testimonial
                deleteTestimonial($pdo, $testimonialId);
            } else {
                ApiResponse::sendError('Testimonial ID is required for deletion', 400);
            }
            break;
            
        default:
            ApiResponse::sendError('Method not allowed', 405);
            break;
    }
    
} catch (Exception $e) {
    logMessage('ERROR', 'Testimonials API Error: ' . $e->getMessage());
    ApiResponse::sendError('Internal server error', 500);
}

/**
 * Get all testimonials with pagination and filters
 */
function getTestimonials($pdo) {
    // Get query parameters
    $page = max(1, (int)($_GET['page'] ?? 1));
    $perPage = min(MAX_PAGE_SIZE, max(1, (int)($_GET['per_page'] ?? DEFAULT_PAGE_SIZE)));
    $search = $_GET['search'] ?? '';
    $rating = $_GET['rating'] ?? '';
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
        $whereConditions[] = "(name LIKE ? OR content LIKE ? OR company LIKE ?)";
        $params[] = "%$search%";
        $params[] = "%$search%";
        $params[] = "%$search%";
    }
    
    if ($rating && is_numeric($rating)) {
        $whereConditions[] = "rating = ?";
        $params[] = $rating;
    }
    
    $whereClause = !empty($whereConditions) ? 'WHERE ' . implode(' AND ', $whereConditions) : '';
    
    // Get total count
    $countSql = "SELECT COUNT(*) as total FROM testimonials $whereClause";
    $countStmt = $pdo->prepare($countSql);
    $countStmt->execute($params);
    $total = $countStmt->fetch()['total'];
    
    // Calculate pagination
    $offset = ($page - 1) * $perPage;
    
    // Get testimonials
    $sql = "SELECT * FROM testimonials $whereClause ORDER BY $sortBy $sortOrder LIMIT ? OFFSET ?";
    $params[] = $perPage;
    $params[] = $offset;
    
    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);
    $testimonials = $stmt->fetchAll();
    
    // Process testimonials
    foreach ($testimonials as &$testimonial) {
        $testimonial['created_at'] = date('Y-m-d H:i:s', strtotime($testimonial['created_at']));
        $testimonial['updated_at'] = $testimonial['updated_at'] ? date('Y-m-d H:i:s', strtotime($testimonial['updated_at'])) : null;
    }
    
    ApiResponse::sendPaginated($testimonials, $total, $page, $perPage, 'Testimonials retrieved successfully');
}

/**
 * Get single testimonial by ID
 */
function getTestimonial($pdo, $testimonialId) {
    $sql = "SELECT * FROM testimonials WHERE id = ?";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([$testimonialId]);
    $testimonial = $stmt->fetch();
    
    if (!$testimonial) {
        ApiResponse::sendError('Testimonial not found', 404);
        return;
    }
    
    // Process testimonial
    $testimonial['created_at'] = date('Y-m-d H:i:s', strtotime($testimonial['created_at']));
    $testimonial['updated_at'] = $testimonial['updated_at'] ? date('Y-m-d H:i:s', strtotime($testimonial['updated_at'])) : null;
    
    ApiResponse::sendSuccess($testimonial, 'Testimonial retrieved successfully');
}

/**
 * Create new testimonial
 */
function createTestimonial($pdo, $input) {
    // Validate input
    $rules = [
        'name' => 'required|max:255',
        'content' => 'required',
        'company' => 'required|max:255',
        'rating' => 'required'
    ];
    
    $errors = validateInput($input, $rules);
    if (!empty($errors)) {
        ApiResponse::sendError('Validation failed: ' . json_encode($errors), 400);
        return;
    }
    
    // Validate rating
    if (!is_numeric($input['rating']) || $input['rating'] < 1 || $input['rating'] > 5) {
        ApiResponse::sendError('Rating must be a number between 1 and 5', 400);
        return;
    }
    
    // Sanitize input
    $input = sanitizeInput($input);
    
    $sql = "INSERT INTO testimonials (name, content, company, rating, image, created_at) 
            VALUES (?, ?, ?, ?, ?, NOW())";
    
    $stmt = $pdo->prepare($sql);
    $stmt->execute([
        $input['name'],
        $input['content'],
        $input['company'],
        $input['rating'],
        $input['image'] ?? null
    ]);
    
    $testimonialId = $pdo->lastInsertId();
    
    // Get the created testimonial
    $sql = "SELECT * FROM testimonials WHERE id = ?";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([$testimonialId]);
    $testimonial = $stmt->fetch();
    
    logMessage('INFO', "Testimonial created: ID $testimonialId");
    ApiResponse::sendSuccess($testimonial, 'Testimonial created successfully', 201);
}

/**
 * Update testimonial
 */
function updateTestimonial($pdo, $testimonialId, $input) {
    // Check if testimonial exists
    $checkSql = "SELECT id FROM testimonials WHERE id = ?";
    $checkStmt = $pdo->prepare($checkSql);
    $checkStmt->execute([$testimonialId]);
    
    if (!$checkStmt->fetch()) {
        ApiResponse::sendError('Testimonial not found', 404);
        return;
    }
    
    // Validate rating if provided
    if (isset($input['rating']) && (!is_numeric($input['rating']) || $input['rating'] < 1 || $input['rating'] > 5)) {
        ApiResponse::sendError('Rating must be a number between 1 and 5', 400);
        return;
    }
    
    // Sanitize input
    $input = sanitizeInput($input);
    
    // Build update fields
    $updateFields = [];
    $params = [];
    
    $allowedFields = ['name', 'content', 'company', 'rating', 'image'];
    
    foreach ($allowedFields as $field) {
        if (isset($input[$field])) {
            $updateFields[] = "$field = ?";
            $params[] = $input[$field];
        }
    }
    
    if (empty($updateFields)) {
        ApiResponse::sendError('No valid fields to update', 400);
        return;
    }
    
    $updateFields[] = "updated_at = NOW()";
    $params[] = $testimonialId;
    
    $sql = "UPDATE testimonials SET " . implode(', ', $updateFields) . " WHERE id = ?";
    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);
    
    // Get updated testimonial
    $sql = "SELECT * FROM testimonials WHERE id = ?";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([$testimonialId]);
    $testimonial = $stmt->fetch();
    
    logMessage('INFO', "Testimonial updated: ID $testimonialId");
    ApiResponse::sendSuccess($testimonial, 'Testimonial updated successfully');
}

/**
 * Delete testimonial
 */
function deleteTestimonial($pdo, $testimonialId) {
    // Check if testimonial exists
    $checkSql = "SELECT id FROM testimonials WHERE id = ?";
    $checkStmt = $pdo->prepare($checkSql);
    $checkStmt->execute([$testimonialId]);
    
    if (!$checkStmt->fetch()) {
        ApiResponse::sendError('Testimonial not found', 404);
        return;
    }
    
    $sql = "DELETE FROM testimonials WHERE id = ?";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([$testimonialId]);
    
    logMessage('INFO', "Testimonial deleted: ID $testimonialId");
    ApiResponse::sendSuccess(['id' => $testimonialId], 'Testimonial deleted successfully');
}
?> 