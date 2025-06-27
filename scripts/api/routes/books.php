<?php
/**
 * Books API Routes
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
$bookId = null;

// Check if endpoint is a numeric ID
if (is_numeric($endpoint)) {
    $bookId = (int)$endpoint;
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
            if ($bookId) {
                // Get single book
                getBook($pdo, $bookId);
            } else {
                // Get books with pagination and filters
                getBooks($pdo);
            }
            break;
            
        case 'POST':
            // Create new book
            createBook($pdo, $input);
            break;
            
        case 'PUT':
            if ($bookId) {
                // Update book
                updateBook($pdo, $bookId, $input);
            } else {
                ApiResponse::sendError('Book ID is required for update', 400);
            }
            break;
            
        case 'DELETE':
            if ($bookId) {
                // Delete book
                deleteBook($pdo, $bookId);
            } else {
                ApiResponse::sendError('Book ID is required for deletion', 400);
            }
            break;
            
        default:
            ApiResponse::sendError('Method not allowed', 405);
            break;
    }
    
} catch (Exception $e) {
    logMessage('ERROR', 'Books API Error: ' . $e->getMessage());
    ApiResponse::sendError('Internal server error', 500);
}

/**
 * Get all books with pagination and filters
 */
function getBooks($pdo) {
    // Get query parameters
    $page = max(1, (int)($_GET['page'] ?? 1));
    $perPage = min(MAX_PAGE_SIZE, max(1, (int)($_GET['per_page'] ?? DEFAULT_PAGE_SIZE)));
    $search = $_GET['search'] ?? '';
    $category = $_GET['category'] ?? '';
    $author = $_GET['author'] ?? '';
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
        $whereConditions[] = "(title LIKE ? OR description LIKE ? OR author LIKE ?)";
        $params[] = "%$search%";
        $params[] = "%$search%";
        $params[] = "%$search%";
    }
    
    if ($category) {
        $whereConditions[] = "category = ?";
        $params[] = $category;
    }
    
    if ($author) {
        $whereConditions[] = "author LIKE ?";
        $params[] = "%$author%";
    }
    
    if ($rating && is_numeric($rating)) {
        $whereConditions[] = "rating = ?";
        $params[] = $rating;
    }
    
    $whereClause = !empty($whereConditions) ? 'WHERE ' . implode(' AND ', $whereConditions) : '';
    
    // Get total count
    $countSql = "SELECT COUNT(*) as total FROM books $whereClause";
    $countStmt = $pdo->prepare($countSql);
    $countStmt->execute($params);
    $total = $countStmt->fetch()['total'];
    
    // Calculate pagination
    $offset = ($page - 1) * $perPage;
    
    // Get books
    $sql = "SELECT * FROM books $whereClause ORDER BY $sortBy $sortOrder LIMIT ? OFFSET ?";
    $params[] = $perPage;
    $params[] = $offset;
    
    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);
    $books = $stmt->fetchAll();
    
    // Process books
    foreach ($books as &$book) {
        $book['created_at'] = date('Y-m-d H:i:s', strtotime($book['created_at']));
        $book['updated_at'] = $book['updated_at'] ? date('Y-m-d H:i:s', strtotime($book['updated_at'])) : null;
    }
    
    ApiResponse::sendPaginated($books, $total, $page, $perPage, 'Books retrieved successfully');
}

/**
 * Get single book by ID
 */
function getBook($pdo, $bookId) {
    $sql = "SELECT * FROM books WHERE id = ?";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([$bookId]);
    $book = $stmt->fetch();
    
    if (!$book) {
        ApiResponse::sendError('Book not found', 404);
        return;
    }
    
    // Process book
    $book['created_at'] = date('Y-m-d H:i:s', strtotime($book['created_at']));
    $book['updated_at'] = $book['updated_at'] ? date('Y-m-d H:i:s', strtotime($book['updated_at'])) : null;
    
    ApiResponse::sendSuccess($book, 'Book retrieved successfully');
}

/**
 * Create new book
 */
function createBook($pdo, $input) {
    // Validate input
    $rules = [
        'title' => 'required|max:255',
        'author' => 'required|max:255',
        'description' => 'required',
        'category' => 'required|max:100',
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
    
    $sql = "INSERT INTO books (title, author, description, category, rating, cover_image, amazon_url, created_at) 
            VALUES (?, ?, ?, ?, ?, ?, ?, NOW())";
    
    $stmt = $pdo->prepare($sql);
    $stmt->execute([
        $input['title'],
        $input['author'],
        $input['description'],
        $input['category'],
        $input['rating'],
        $input['cover_image'] ?? null,
        $input['amazon_url'] ?? null
    ]);
    
    $bookId = $pdo->lastInsertId();
    
    // Get the created book
    $sql = "SELECT * FROM books WHERE id = ?";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([$bookId]);
    $book = $stmt->fetch();
    
    logMessage('INFO', "Book created: ID $bookId");
    ApiResponse::sendSuccess($book, 'Book created successfully', 201);
}

/**
 * Update book
 */
function updateBook($pdo, $bookId, $input) {
    // Check if book exists
    $checkSql = "SELECT id FROM books WHERE id = ?";
    $checkStmt = $pdo->prepare($checkSql);
    $checkStmt->execute([$bookId]);
    
    if (!$checkStmt->fetch()) {
        ApiResponse::sendError('Book not found', 404);
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
    
    $allowedFields = ['title', 'author', 'description', 'category', 'rating', 'cover_image', 'amazon_url'];
    
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
    $params[] = $bookId;
    
    $sql = "UPDATE books SET " . implode(', ', $updateFields) . " WHERE id = ?";
    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);
    
    // Get updated book
    $sql = "SELECT * FROM books WHERE id = ?";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([$bookId]);
    $book = $stmt->fetch();
    
    logMessage('INFO', "Book updated: ID $bookId");
    ApiResponse::sendSuccess($book, 'Book updated successfully');
}

/**
 * Delete book
 */
function deleteBook($pdo, $bookId) {
    // Check if book exists
    $checkSql = "SELECT id FROM books WHERE id = ?";
    $checkStmt = $pdo->prepare($checkSql);
    $checkStmt->execute([$bookId]);
    
    if (!$checkStmt->fetch()) {
        ApiResponse::sendError('Book not found', 404);
        return;
    }
    
    $sql = "DELETE FROM books WHERE id = ?";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([$bookId]);
    
    logMessage('INFO', "Book deleted: ID $bookId");
    ApiResponse::sendSuccess(['id' => $bookId], 'Book deleted successfully');
}
?> 