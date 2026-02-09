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
    
    // Ensure likes table exists
    createLikesTable($pdo);
    
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
            // Check if this is a like action
            if (isset($_GET['action']) && $_GET['action'] === 'like') {
                if ($articleId) {
                    // Like/unlike article
                    toggleArticleLike($pdo, $articleId);
                } else {
                    ApiResponse::sendError('Article ID is required for like action', 400);
                }
            } elseif (isset($_GET['action']) && $_GET['action'] === 'share') {
                if ($articleId) {
                    // Increment share count
                    incrementArticleShare($pdo, $articleId);
                } else {
                    ApiResponse::sendError('Article ID is required for share action', 400);
                }
            } else {
                // Create new article
                createArticle($pdo, $input);
            }
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
    $status = $_GET['status'] ?? 'published'; // Default to published only
    $sortBy = $_GET['sort_by'] ?? 'date';
    $sortOrder = strtoupper($_GET['sort_order'] ?? 'DESC');
    
    // Validate sort order
    if (!in_array($sortOrder, ['ASC', 'DESC'])) {
        $sortOrder = 'DESC';
    }
    
    // Validate status
    if (!in_array($status, ['draft', 'published', 'all'])) {
        $status = 'published';
    }
    
    // Build WHERE clause
    $whereConditions = [];
    $params = [];
    
    // Always filter by status unless 'all' is requested
    if ($status !== 'all') {
        $whereConditions[] = "status = ?";
        $params[] = $status;
    }
    
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
    
    // Check if current user has liked this article
    $clientIP = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
    $likeCheckSql = "SELECT id FROM article_likes WHERE article_id = ? AND ip_address = ?";
    $likeCheckStmt = $pdo->prepare($likeCheckSql);
    $likeCheckStmt->execute([$articleId, $clientIP]);
    $userLiked = $likeCheckStmt->fetch() ? true : false;
    
    // Process article
    $article['tags'] = json_decode($article['tags'], true) ?: [];
    $article['date'] = date('Y-m-d H:i:s', strtotime($article['date']));
    $article['created_at'] = date('Y-m-d H:i:s', strtotime($article['created_at']));
    $article['updated_at'] = $article['updated_at'] ? date('Y-m-d H:i:s', strtotime($article['updated_at'])) : null;
    $article['user_liked'] = $userLiked;
    
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
        'tags' => 'required',
        'status' => 'in:draft,published'
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
    
    // Set default status if not provided
    $status = $input['status'] ?? 'draft';
    
    $sql = "INSERT INTO articles (title, content, category, tags, status, image, date, created_at) 
            VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())";
    
    $stmt = $pdo->prepare($sql);
    $stmt->execute([
        $input['title'],
        $content,  // This can be HTML
        $input['category'],
        $tags,
        $status,
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
    
    $allowedFields = ['title', 'content', 'category', 'tags', 'status', 'image'];
    
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

/**
 * Toggle article like status
 */
function toggleArticleLike($pdo, $articleId) {
    // Check if article exists
    $checkSql = "SELECT id, like_count FROM articles WHERE id = ?";
    $checkStmt = $pdo->prepare($checkSql);
    $checkStmt->execute([$articleId]);
    $article = $checkStmt->fetch();
    
    if (!$article) {
        ApiResponse::sendError('Article not found', 404);
        return;
    }
    
    // Get client IP for tracking likes
    $clientIP = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
    $userAgent = $_SERVER['HTTP_USER_AGENT'] ?? '';
    
    // Check if this IP has already liked this article
    $likeCheckSql = "SELECT id FROM article_likes WHERE article_id = ? AND ip_address = ?";
    $likeCheckStmt = $pdo->prepare($likeCheckSql);
    $likeCheckStmt->execute([$articleId, $clientIP]);
    $existingLike = $likeCheckStmt->fetch();
    
    if ($existingLike) {
        // Unlike: remove the like record and decrease count
        $deleteLikeSql = "DELETE FROM article_likes WHERE article_id = ? AND ip_address = ?";
        $deleteLikeStmt = $pdo->prepare($deleteLikeSql);
        $deleteLikeStmt->execute([$articleId, $clientIP]);
        
        $updateSql = "UPDATE articles SET like_count = GREATEST(0, like_count - 1) WHERE id = ?";
        $updateStmt = $pdo->prepare($updateSql);
        $updateStmt->execute([$articleId]);
        
        $action = 'unliked';
        $newCount = max(0, $article['like_count'] - 1);
    } else {
        // Like: add the like record and increase count
        $insertLikeSql = "INSERT INTO article_likes (article_id, ip_address, user_agent, created_at) VALUES (?, ?, ?, NOW())";
        $insertLikeStmt = $pdo->prepare($insertLikeSql);
        $insertLikeStmt->execute([$articleId, $clientIP, $userAgent]);
        
        $updateSql = "UPDATE articles SET like_count = like_count + 1 WHERE id = ?";
        $updateStmt = $pdo->prepare($updateSql);
        $updateStmt->execute([$articleId]);
        
        $action = 'liked';
        $newCount = $article['like_count'] + 1;
    }
    
    logMessage('INFO', "Article $action: ID $articleId by IP $clientIP");
    ApiResponse::sendSuccess([
        'article_id' => $articleId,
        'action' => $action,
        'like_count' => $newCount,
        'liked' => $action === 'liked'
    ], "Article $action successfully");
}

/**
 * Create article_likes table if it doesn't exist
 */
function createLikesTable($pdo) {
    $createTableSql = "
        CREATE TABLE IF NOT EXISTS article_likes (
            id INT AUTO_INCREMENT PRIMARY KEY,
            article_id INT NOT NULL,
            ip_address VARCHAR(45) NOT NULL,
            user_agent TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            UNIQUE KEY unique_like (article_id, ip_address),
            INDEX idx_article_id (article_id),
            INDEX idx_ip_address (ip_address),
            FOREIGN KEY (article_id) REFERENCES articles(id) ON DELETE CASCADE
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    ";
    
    try {
        $pdo->exec($createTableSql);
        logMessage('INFO', 'Article likes table created or already exists');
    } catch (Exception $e) {
        logMessage('ERROR', 'Failed to create article_likes table: ' . $e->getMessage());
    }
}

/**
 * Increment article share count
 */
function incrementArticleShare($pdo, $articleId) {
    // Check if article exists
    $checkSql = "SELECT id, share_count FROM articles WHERE id = ?";
    $checkStmt = $pdo->prepare($checkSql);
    $checkStmt->execute([$articleId]);
    $article = $checkStmt->fetch();
    
    if (!$article) {
        ApiResponse::sendError('Article not found', 404);
        return;
    }
    
    // Increment share count
    $updateSql = "UPDATE articles SET share_count = share_count + 1 WHERE id = ?";
    $updateStmt = $pdo->prepare($updateSql);
    $updateStmt->execute([$articleId]);
    
    $newShareCount = $article['share_count'] + 1;
    
    logMessage('INFO', "Article shared: ID $articleId");
    ApiResponse::sendSuccess([
        'article_id' => $articleId,
        'share_count' => $newShareCount
    ], 'Share count updated successfully');
}
?> 