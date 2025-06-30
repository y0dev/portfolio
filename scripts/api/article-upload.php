<?php
/**
 * Article Upload Endpoint
 * 
 * @author Devontae Reid
 * @version 1.0
 */

require_once '../config/config.php';

// Set CORS headers
setCorsHeaders();

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Only allow POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit();
}

// Check rate limiting
$clientIP = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
if (!checkRateLimit($clientIP)) {
    http_response_code(429);
    echo json_encode(['error' => 'Rate limit exceeded. Please try again later.']);
    exit();
}

try {
    // Get JSON input
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (!$input) {
        throw new Exception('Invalid JSON input');
    }
    
    // Validate required fields
    $requiredFields = ['title', 'id', 'description', 'date', 'type', 'status'];
    foreach ($requiredFields as $field) {
        if (empty($input[$field])) {
            throw new Exception("Missing required field: $field");
        }
    }
    
    // Validate status
    if (!in_array($input['status'], ['draft', 'published'])) {
        throw new Exception('Invalid status. Must be "draft" or "published"');
    }
    
    // Validate type
    if (!in_array($input['type'], ['article', 'note'])) {
        throw new Exception('Invalid type. Must be "article" or "note"');
    }
    
    // Connect to database
    $pdo = getDatabaseConnection();
    
    // Prepare the article data
    $articleData = [
        'title' => trim($input['title']),
        'slug' => trim($input['id']),
        'description' => trim($input['description']),
        'content' => $input['html'] ?? $input['markdown'] ?? '',
        'date' => $input['date'],
        'tags' => json_encode($input['tags'] ?? []),
        'type' => $input['type'],
        'status' => $input['status'],
        'image' => json_encode(['name' => $input['image'] ?? '', 'alt' => '']),
        'like_count' => 0,
        'share_count' => 0
    ];
    
    // Insert or update article
    $sql = "INSERT INTO articles 
            (title, slug, description, content, date, tags, type, status, image, like_count, share_count, created_at, updated_at) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
            ON DUPLICATE KEY UPDATE
                title = VALUES(title),
                description = VALUES(description),
                content = VALUES(content),
                date = VALUES(date),
                tags = VALUES(tags),
                type = VALUES(type),
                status = VALUES(status),
                image = VALUES(image),
                updated_at = NOW()";
    
    $stmt = $pdo->prepare($sql);
    $stmt->execute([
        $articleData['title'],
        $articleData['slug'],
        $articleData['description'],
        $articleData['content'],
        $articleData['date'],
        $articleData['tags'],
        $articleData['type'],
        $articleData['status'],
        $articleData['image'],
        $articleData['like_count'],
        $articleData['share_count']
    ]);
    
    $articleId = $pdo->lastInsertId();
    
    // Log the action
    logMessage('INFO', "Article uploaded: ID $articleId, Title: {$articleData['title']}, Status: {$articleData['status']}");
    
    // Return success response
    http_response_code(200);
    echo json_encode([
        'success' => true,
        'message' => 'Article uploaded successfully',
        'data' => [
            'id' => $articleId,
            'slug' => $articleData['slug'],
            'title' => $articleData['title'],
            'status' => $articleData['status']
        ]
    ]);
    
} catch (Exception $e) {
    logMessage('ERROR', 'Article upload error: ' . $e->getMessage());
    
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
}
?> 