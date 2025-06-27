<?php
/**
 * Articles API Routes
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

// Extract endpoint from path (assuming URL like /api/articles or /api/articles/123)
$endpoint = end($pathParts);
$articleId = null;

// Check if endpoint is a numeric ID
if (is_numeric($endpoint)) {
    $articleId = (int)$endpoint;
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
            if ($articleId) {
                // Get single article
                getArticle($pdo, $articleId);
            } else {
                // Get articles with pagination and filters
                getArticles($pdo);
            }
            break;
            
        case 'POST':
            // Create new article
            createArticle($pdo, $input);
            break;
            
        case 'PUT':
            if ($articleId) {
                // Update article
                updateArticle($pdo, $articleId, $input);
            } else {
                ApiResponse::sendError('Article ID is required for update', 400);
            }
            break;
            
        case 'DELETE':
            if ($articleId) {
                // Delete article
                deleteArticle($pdo, $articleId);
            } else {
                ApiResponse::sendError('Article ID is required for deletion', 400);
            }
            break;
            
        default:
            ApiResponse::sendError('Method not allowed', 405);
            break;
    }
    
} catch (Exception $e) {
    logMessage('ERROR', 'Articles API Error: ' . $e->getMessage());
    ApiResponse::sendError('Internal server error', 500);
}

/**
 * Get all articles with pagination and filters
 */
function getArticles($pdo) {
    // Get query parameters
    $page = max(1, (int)($_GET['page'] ?? 1));
    $perPage = min(MAX_PAGE_SIZE, max(1, (int)($_GET['per_page'] ?? DEFAULT_PAGE_SIZE)));
    $search = $_GET['search'] ?? '';
    $category = $_GET['category'] ?? '';
    $tags = $_GET['tags'] ?? '';
    $sortBy = $_GET['sort_by'] ?? 'date';
    $sortOrder = strtoupper($_GET['sort_order'] ?? 'DESC');
    
    // Validate sort order
    if (!in_array($sortOrder, ['ASC', 'DESC'])) {
        $sortOrder = 'DESC';
    }
    
    // Build WHERE clause
    $whereConditions = [];
    $params = [];
    
    if ($search) {
        $whereConditions[] = "(title LIKE ? OR content LIKE ?)";
        $params[] = "%$search%";
        $params[] = "%$search%";
    }
    
    if ($category) {
        $whereConditions[] = "category = ?";
        $params[] = $category;
    }
    
    if ($tags) {
        $whereConditions[] = "tags LIKE ?";
        $params[] = "%$tags%";
    }
    
    $whereClause = !empty($whereConditions) ? 'WHERE ' . implode(' AND ', $whereConditions) : '';
    
    // Get total count
    $countSql = "SELECT COUNT(*) as total FROM articles $whereClause";
    $countStmt = $pdo->prepare($countSql);
    $countStmt->execute($params);
    $total = $countStmt->fetch()['total'];
    
    // Calculate pagination
    $offset = ($page - 1) * $perPage;
    
    // Get articles
    $sql = "SELECT * FROM articles $whereClause ORDER BY $sortBy $sortOrder LIMIT ? OFFSET ?";
    $params[] = $perPage;
    $params[] = $offset;
    
    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);
    $articles = $stmt->fetchAll();
    
    // Process articles
    foreach ($articles as &$article) {
        $article['tags'] = json_decode($article['tags'], true) ?: [];
        $article['date'] = date('Y-m-d H:i:s', strtotime($article['date']));
        $article['created_at'] = date('Y-m-d H:i:s', strtotime($article['created_at']));
        $article['updated_at'] = $article['updated_at'] ? date('Y-m-d H:i:s', strtotime($article['updated_at'])) : null;
    }
    
    ApiResponse::sendPaginated($articles, $total, $page, $perPage, 'Articles retrieved successfully');
}

/**
 * Get single article by ID
 */
function getArticle($pdo, $articleId) {
    $sql = "SELECT * FROM articles WHERE id = ?";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([$articleId]);
    $article = $stmt->fetch();
    
    if (!$article) {
        ApiResponse::sendError('Article not found', 404);
        return;
    }
    
    // Process article
    $article['tags'] = json_decode($article['tags'], true) ?: [];
    $article['date'] = date('Y-m-d H:i:s', strtotime($article['date']));
    $article['created_at'] = date('Y-m-d H:i:s', strtotime($article['created_at']));
    $article['updated_at'] = $article['updated_at'] ? date('Y-m-d H:i:s', strtotime($article['updated_at'])) : null;
    
    ApiResponse::sendSuccess($article, 'Article retrieved successfully');
}

/**
 * Create new article
 */
function createArticle($pdo, $input) {
    // Validate input
    $rules = [
        'title' => 'required|max:255',
        'content' => 'required',
        'category' => 'required|max:100',
        'tags' => 'required'
    ];
    
    $errors = validateInput($input, $rules);
    if (!empty($errors)) {
        ApiResponse::sendError('Validation failed: ' . json_encode($errors), 400);
        return;
    }
    
    // Sanitize input
    $input = sanitizeInput($input);
    
    // Sanitize HTML content if present
    $content = $input['content'];
    if (isset($input['html_content']) && $input['html_content']) {
        $content = sanitizeHtml($input['html_content']);
    }
    
    // Prepare tags
    $tags = is_array($input['tags']) ? json_encode($input['tags']) : $input['tags'];
    
    $sql = "INSERT INTO articles (title, content, category, tags, image, date, created_at) 
            VALUES (?, ?, ?, ?, ?, NOW(), NOW())";
    
    $stmt = $pdo->prepare($sql);
    $stmt->execute([
        $input['title'],
        $content,  // This can be HTML
        $input['category'],
        $tags,
        $input['image'] ?? null
    ]);
    
    $articleId = $pdo->lastInsertId();
    
    // Get the created article
    $sql = "SELECT * FROM articles WHERE id = ?";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([$articleId]);
    $article = $stmt->fetch();
    
    $article['tags'] = json_decode($article['tags'], true) ?: [];
    
    logMessage('INFO', "Article created: ID $articleId");
    ApiResponse::sendSuccess($article, 'Article created successfully', 201);
}

/**
 * Sanitize HTML content
 */
function sanitizeHtml($html) {
    // Basic HTML sanitization - allow common safe tags
    $allowedTags = '<h1><h2><h3><h4><h5><h6><p><br><strong><em><ul><ol><li><a><img><div><span><blockquote><code><pre>';
    
    // Remove potentially dangerous attributes
    $html = preg_replace('/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/mi', '', $html);
    $html = preg_replace('/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/mi', '', $html);
    $html = preg_replace('/on\w+\s*=\s*["\'][^"\']*["\']/i', '', $html);
    
    // Strip tags except allowed ones
    $html = strip_tags($html, $allowedTags);
    
    // Clean up whitespace
    $html = preg_replace('/\s+/', ' ', $html);
    $html = trim($html);
    
    return $html;
}

/**
 * Update article
 */
function updateArticle($pdo, $articleId, $input) {
    // Check if article exists
    $checkSql = "SELECT id FROM articles WHERE id = ?";
    $checkStmt = $pdo->prepare($checkSql);
    $checkStmt->execute([$articleId]);
    
    if (!$checkStmt->fetch()) {
        ApiResponse::sendError('Article not found', 404);
        return;
    }
    
    // Sanitize input
    $input = sanitizeInput($input);
    
    // Build update fields
    $updateFields = [];
    $params = [];
    
    $allowedFields = ['title', 'content', 'category', 'tags', 'image'];
    
    foreach ($allowedFields as $field) {
        if (isset($input[$field])) {
            $updateFields[] = "$field = ?";
            $params[] = $field === 'tags' && is_array($input[$field]) 
                ? json_encode($input[$field]) 
                : $input[$field];
        }
    }
    
    if (empty($updateFields)) {
        ApiResponse::sendError('No valid fields to update', 400);
        return;
    }
    
    $updateFields[] = "updated_at = NOW()";
    $params[] = $articleId;
    
    $sql = "UPDATE articles SET " . implode(', ', $updateFields) . " WHERE id = ?";
    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);
    
    // Get updated article
    $sql = "SELECT * FROM articles WHERE id = ?";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([$articleId]);
    $article = $stmt->fetch();
    
    $article['tags'] = json_decode($article['tags'], true) ?: [];
    
    logMessage('INFO', "Article updated: ID $articleId");
    ApiResponse::sendSuccess($article, 'Article updated successfully');
}

/**
 * Delete article
 */
function deleteArticle($pdo, $articleId) {
    // Check if article exists
    $checkSql = "SELECT id FROM articles WHERE id = ?";
    $checkStmt = $pdo->prepare($checkSql);
    $checkStmt->execute([$articleId]);
    
    if (!$checkStmt->fetch()) {
        ApiResponse::sendError('Article not found', 404);
        return;
    }
    
    $sql = "DELETE FROM articles WHERE id = ?";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([$articleId]);
    
    logMessage('INFO', "Article deleted: ID $articleId");
    ApiResponse::sendSuccess(['id' => $articleId], 'Article deleted successfully');
}
?> 