<?php
/**
 * Database API for Portfolio
 * Handles CRUD operations for articles, projects, testimonials, books, and resources
 * 
 * @author Devontae Reid
 * @version 1.0
 */

// Enable CORS for cross-origin requests
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Content-Type: application/json; charset=utf-8');

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Database configuration
class DatabaseConfig {
    const HOST = 'localhost';
    const DBNAME = 'portfolio_db';
    const USERNAME = 'your_username';
    const PASSWORD = 'your_password';
    const CHARSET = 'utf8mb4';
}

// Database connection class
class Database {
    private $pdo;
    
    public function __construct() {
        try {
            $dsn = "mysql:host=" . DatabaseConfig::HOST . 
                   ";dbname=" . DatabaseConfig::DBNAME . 
                   ";charset=" . DatabaseConfig::CHARSET;
            
            $this->pdo = new PDO($dsn, DatabaseConfig::USERNAME, DatabaseConfig::PASSWORD, [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES => false,
            ]);
        } catch (PDOException $e) {
            $this->sendError('Database connection failed: ' . $e->getMessage(), 500);
        }
    }
    
    public function getConnection() {
        return $this->pdo;
    }
}

// API Response class
class ApiResponse {
    public static function sendSuccess($data, $message = 'Success', $code = 200) {
        http_response_code($code);
        echo json_encode([
            'success' => true,
            'message' => $message,
            'data' => $data,
            'timestamp' => date('Y-m-d H:i:s')
        ], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
    }
    
    public static function sendError($message, $code = 400) {
        http_response_code($code);
        echo json_encode([
            'success' => false,
            'message' => $message,
            'timestamp' => date('Y-m-d H:i:s')
        ], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
    }
}

// Articles API
class ArticlesAPI {
    private $db;
    
    public function __construct($db) {
        $this->db = $db;
    }
    
    public function getAllArticles($limit = null, $offset = 0) {
        try {
            $sql = "SELECT * FROM articles ORDER BY date DESC";
            if ($limit) {
                $sql .= " LIMIT :limit OFFSET :offset";
            }
            
            $stmt = $this->db->prepare($sql);
            if ($limit) {
                $stmt->bindParam(':limit', $limit, PDO::PARAM_INT);
                $stmt->bindParam(':offset', $offset, PDO::PARAM_INT);
            }
            $stmt->execute();
            
            return $stmt->fetchAll();
        } catch (PDOException $e) {
            throw new Exception('Failed to fetch articles: ' . $e->getMessage());
        }
    }
    
    public function getArticleById($id) {
        try {
            $stmt = $this->db->prepare("SELECT * FROM articles WHERE id = :id");
            $stmt->bindParam(':id', $id);
            $stmt->execute();
            
            $article = $stmt->fetch();
            if (!$article) {
                throw new Exception('Article not found');
            }
            
            return $article;
        } catch (PDOException $e) {
            throw new Exception('Failed to fetch article: ' . $e->getMessage());
        }
    }
    
    public function getArticlesByTag($tag) {
        try {
            $stmt = $this->db->prepare("SELECT * FROM articles WHERE tags LIKE :tag ORDER BY date DESC");
            $tagParam = '%' . $tag . '%';
            $stmt->bindParam(':tag', $tagParam);
            $stmt->execute();
            
            return $stmt->fetchAll();
        } catch (PDOException $e) {
            throw new Exception('Failed to fetch articles by tag: ' . $e->getMessage());
        }
    }
    
    public function createArticle($data) {
        try {
            $stmt = $this->db->prepare("
                INSERT INTO articles (title, description, content, date, tags, type, image, author_id) 
                VALUES (:title, :description, :content, :date, :tags, :type, :image, :author_id)
            ");
            
            $stmt->bindParam(':title', $data['title']);
            $stmt->bindParam(':description', $data['description']);
            $stmt->bindParam(':content', $data['content']);
            $stmt->bindParam(':date', $data['date']);
            $stmt->bindParam(':tags', $data['tags']);
            $stmt->bindParam(':type', $data['type']);
            $stmt->bindParam(':image', $data['image']);
            $stmt->bindParam(':author_id', $data['author_id']);
            
            $stmt->execute();
            
            return $this->db->lastInsertId();
        } catch (PDOException $e) {
            throw new Exception('Failed to create article: ' . $e->getMessage());
        }
    }
    
    public function updateArticle($id, $data) {
        try {
            $stmt = $this->db->prepare("
                UPDATE articles 
                SET title = :title, description = :description, content = :content, 
                    date = :date, tags = :tags, type = :type, image = :image 
                WHERE id = :id
            ");
            
            $stmt->bindParam(':id', $id);
            $stmt->bindParam(':title', $data['title']);
            $stmt->bindParam(':description', $data['description']);
            $stmt->bindParam(':content', $data['content']);
            $stmt->bindParam(':date', $data['date']);
            $stmt->bindParam(':tags', $data['tags']);
            $stmt->bindParam(':type', $data['type']);
            $stmt->bindParam(':image', $data['image']);
            
            $stmt->execute();
            
            return $stmt->rowCount() > 0;
        } catch (PDOException $e) {
            throw new Exception('Failed to update article: ' . $e->getMessage());
        }
    }
    
    public function deleteArticle($id) {
        try {
            $stmt = $this->db->prepare("DELETE FROM articles WHERE id = :id");
            $stmt->bindParam(':id', $id);
            $stmt->execute();
            
            return $stmt->rowCount() > 0;
        } catch (PDOException $e) {
            throw new Exception('Failed to delete article: ' . $e->getMessage());
        }
    }
}

// Projects API
class ProjectsAPI {
    private $db;
    
    public function __construct($db) {
        $this->db = $db;
    }
    
    public function getAllProjects($limit = null, $offset = 0) {
        try {
            $sql = "SELECT * FROM projects ORDER BY date_created DESC";
            if ($limit) {
                $sql .= " LIMIT :limit OFFSET :offset";
            }
            
            $stmt = $this->db->prepare($sql);
            if ($limit) {
                $stmt->bindParam(':limit', $limit, PDO::PARAM_INT);
                $stmt->bindParam(':offset', $offset, PDO::PARAM_INT);
            }
            $stmt->execute();
            
            return $stmt->fetchAll();
        } catch (PDOException $e) {
            throw new Exception('Failed to fetch projects: ' . $e->getMessage());
        }
    }
    
    public function getProjectById($id) {
        try {
            $stmt = $this->db->prepare("SELECT * FROM projects WHERE id = :id");
            $stmt->bindParam(':id', $id);
            $stmt->execute();
            
            $project = $stmt->fetch();
            if (!$project) {
                throw new Exception('Project not found');
            }
            
            return $project;
        } catch (PDOException $e) {
            throw new Exception('Failed to fetch project: ' . $e->getMessage());
        }
    }
    
    public function getProjectsByCategory($category) {
        try {
            $stmt = $this->db->prepare("SELECT * FROM projects WHERE category = :category ORDER BY date_created DESC");
            $stmt->bindParam(':category', $category);
            $stmt->execute();
            
            return $stmt->fetchAll();
        } catch (PDOException $e) {
            throw new Exception('Failed to fetch projects by category: ' . $e->getMessage());
        }
    }
    
    public function createProject($data) {
        try {
            $stmt = $this->db->prepare("
                INSERT INTO projects (title, description, image, link, github_link, technologies, category, date_created) 
                VALUES (:title, :description, :image, :link, :github_link, :technologies, :category, :date_created)
            ");
            
            $stmt->bindParam(':title', $data['title']);
            $stmt->bindParam(':description', $data['description']);
            $stmt->bindParam(':image', $data['image']);
            $stmt->bindParam(':link', $data['link']);
            $stmt->bindParam(':github_link', $data['github_link']);
            $stmt->bindParam(':technologies', $data['technologies']);
            $stmt->bindParam(':category', $data['category']);
            $stmt->bindParam(':date_created', $data['date_created']);
            
            $stmt->execute();
            
            return $this->db->lastInsertId();
        } catch (PDOException $e) {
            throw new Exception('Failed to create project: ' . $e->getMessage());
        }
    }
}

// Testimonials API
class TestimonialsAPI {
    private $db;
    
    public function __construct($db) {
        $this->db = $db;
    }
    
    public function getAllTestimonials() {
        try {
            $stmt = $this->db->prepare("SELECT * FROM testimonials ORDER BY date_created DESC");
            $stmt->execute();
            
            return $stmt->fetchAll();
        } catch (PDOException $e) {
            throw new Exception('Failed to fetch testimonials: ' . $e->getMessage());
        }
    }
    
    public function getTestimonialById($id) {
        try {
            $stmt = $this->db->prepare("SELECT * FROM testimonials WHERE id = :id");
            $stmt->bindParam(':id', $id);
            $stmt->execute();
            
            $testimonial = $stmt->fetch();
            if (!$testimonial) {
                throw new Exception('Testimonial not found');
            }
            
            return $testimonial;
        } catch (PDOException $e) {
            throw new Exception('Failed to fetch testimonial: ' . $e->getMessage());
        }
    }
    
    public function createTestimonial($data) {
        try {
            $stmt = $this->db->prepare("
                INSERT INTO testimonials (name, role, company, content, rating, image, date_created) 
                VALUES (:name, :role, :company, :content, :rating, :image, :date_created)
            ");
            
            $stmt->bindParam(':name', $data['name']);
            $stmt->bindParam(':role', $data['role']);
            $stmt->bindParam(':company', $data['company']);
            $stmt->bindParam(':content', $data['content']);
            $stmt->bindParam(':rating', $data['rating']);
            $stmt->bindParam(':image', $data['image']);
            $stmt->bindParam(':date_created', $data['date_created']);
            
            $stmt->execute();
            
            return $this->db->lastInsertId();
        } catch (PDOException $e) {
            throw new Exception('Failed to create testimonial: ' . $e->getMessage());
        }
    }
}

// Books API
class BooksAPI {
    private $db;
    
    public function __construct($db) {
        $this->db = $db;
    }
    
    public function getAllBooks($limit = null, $offset = 0) {
        try {
            $sql = "SELECT * FROM books ORDER BY date_added DESC";
            if ($limit) {
                $sql .= " LIMIT :limit OFFSET :offset";
            }
            
            $stmt = $this->db->prepare($sql);
            if ($limit) {
                $stmt->bindParam(':limit', $limit, PDO::PARAM_INT);
                $stmt->bindParam(':offset', $offset, PDO::PARAM_INT);
            }
            $stmt->execute();
            
            return $stmt->fetchAll();
        } catch (PDOException $e) {
            throw new Exception('Failed to fetch books: ' . $e->getMessage());
        }
    }
    
    public function getBookById($id) {
        try {
            $stmt = $this->db->prepare("SELECT * FROM books WHERE id = :id");
            $stmt->bindParam(':id', $id);
            $stmt->execute();
            
            $book = $stmt->fetch();
            if (!$book) {
                throw new Exception('Book not found');
            }
            
            return $book;
        } catch (PDOException $e) {
            throw new Exception('Failed to fetch book: ' . $e->getMessage());
        }
    }
    
    public function getBooksByCategory($category) {
        try {
            $stmt = $this->db->prepare("SELECT * FROM books WHERE category = :category ORDER BY date_added DESC");
            $stmt->bindParam(':category', $category);
            $stmt->execute();
            
            return $stmt->fetchAll();
        } catch (PDOException $e) {
            throw new Exception('Failed to fetch books by category: ' . $e->getMessage());
        }
    }
    
    public function createBook($data) {
        try {
            $stmt = $this->db->prepare("
                INSERT INTO books (title, author, description, cover_image, category, rating, amazon_link, date_added) 
                VALUES (:title, :author, :description, :cover_image, :category, :rating, :amazon_link, :date_added)
            ");
            
            $stmt->bindParam(':title', $data['title']);
            $stmt->bindParam(':author', $data['author']);
            $stmt->bindParam(':description', $data['description']);
            $stmt->bindParam(':cover_image', $data['cover_image']);
            $stmt->bindParam(':category', $data['category']);
            $stmt->bindParam(':rating', $data['rating']);
            $stmt->bindParam(':amazon_link', $data['amazon_link']);
            $stmt->bindParam(':date_added', $data['date_added']);
            
            $stmt->execute();
            
            return $this->db->lastInsertId();
        } catch (PDOException $e) {
            throw new Exception('Failed to create book: ' . $e->getMessage());
        }
    }
}

// Resources API
class ResourcesAPI {
    private $db;
    
    public function __construct($db) {
        $this->db = $db;
    }
    
    public function getAllResources($limit = null, $offset = 0) {
        try {
            $sql = "SELECT * FROM resources ORDER BY date_added DESC";
            if ($limit) {
                $sql .= " LIMIT :limit OFFSET :offset";
            }
            
            $stmt = $this->db->prepare($sql);
            if ($limit) {
                $stmt->bindParam(':limit', $limit, PDO::PARAM_INT);
                $stmt->bindParam(':offset', $offset, PDO::PARAM_INT);
            }
            $stmt->execute();
            
            return $stmt->fetchAll();
        } catch (PDOException $e) {
            throw new Exception('Failed to fetch resources: ' . $e->getMessage());
        }
    }
    
    public function getResourceById($id) {
        try {
            $stmt = $this->db->prepare("SELECT * FROM resources WHERE id = :id");
            $stmt->bindParam(':id', $id);
            $stmt->execute();
            
            $resource = $stmt->fetch();
            if (!$resource) {
                throw new Exception('Resource not found');
            }
            
            return $resource;
        } catch (PDOException $e) {
            throw new Exception('Failed to fetch resource: ' . $e->getMessage());
        }
    }
    
    public function getResourcesByCategory($category) {
        try {
            $stmt = $this->db->prepare("SELECT * FROM resources WHERE category = :category ORDER BY date_added DESC");
            $stmt->bindParam(':category', $category);
            $stmt->execute();
            
            return $stmt->fetchAll();
        } catch (PDOException $e) {
            throw new Exception('Failed to fetch resources by category: ' . $e->getMessage());
        }
    }
    
    public function createResource($data) {
        try {
            $stmt = $this->db->prepare("
                INSERT INTO resources (title, description, link, category, type, date_added) 
                VALUES (:title, :description, :link, :category, :type, :date_added)
            ");
            
            $stmt->bindParam(':title', $data['title']);
            $stmt->bindParam(':description', $data['description']);
            $stmt->bindParam(':link', $data['link']);
            $stmt->bindParam(':category', $data['category']);
            $stmt->bindParam(':type', $data['type']);
            $stmt->bindParam(':date_added', $data['date_added']);
            
            $stmt->execute();
            
            return $this->db->lastInsertId();
        } catch (PDOException $e) {
            throw new Exception('Failed to create resource: ' . $e->getMessage());
        }
    }
}

// Main API Router
class ApiRouter {
    private $db;
    private $articlesAPI;
    private $projectsAPI;
    private $testimonialsAPI;
    private $booksAPI;
    private $resourcesAPI;
    
    public function __construct() {
        $database = new Database();
        $this->db = $database->getConnection();
        
        $this->articlesAPI = new ArticlesAPI($this->db);
        $this->projectsAPI = new ProjectsAPI($this->db);
        $this->testimonialsAPI = new TestimonialsAPI($this->db);
        $this->booksAPI = new BooksAPI($this->db);
        $this->resourcesAPI = new ResourcesAPI($this->db);
    }
    
    public function handleRequest() {
        $method = $_SERVER['REQUEST_METHOD'];
        $path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
        $pathParts = explode('/', trim($path, '/'));
        
        // Remove 'scripts' and 'database_api.php' from path
        $pathParts = array_filter($pathParts, function($part) {
            return $part !== 'scripts' && $part !== 'database_api.php';
        });
        
        $resource = $pathParts[1] ?? '';
        $id = $pathParts[2] ?? null;
        
        try {
            switch ($resource) {
                case 'articles':
                    $this->handleArticles($method, $id);
                    break;
                case 'projects':
                    $this->handleProjects($method, $id);
                    break;
                case 'testimonials':
                    $this->handleTestimonials($method, $id);
                    break;
                case 'books':
                    $this->handleBooks($method, $id);
                    break;
                case 'resources':
                    $this->handleResources($method, $id);
                    break;
                default:
                    ApiResponse::sendError('Resource not found', 404);
            }
        } catch (Exception $e) {
            ApiResponse::sendError($e->getMessage(), 500);
        }
    }
    
    private function handleArticles($method, $id) {
        switch ($method) {
            case 'GET':
                if ($id) {
                    $article = $this->articlesAPI->getArticleById($id);
                    ApiResponse::sendSuccess($article, 'Article retrieved successfully');
                } else {
                    $limit = $_GET['limit'] ?? null;
                    $offset = $_GET['offset'] ?? 0;
                    $tag = $_GET['tag'] ?? null;
                    
                    if ($tag) {
                        $articles = $this->articlesAPI->getArticlesByTag($tag);
                    } else {
                        $articles = $this->articlesAPI->getAllArticles($limit, $offset);
                    }
                    ApiResponse::sendSuccess($articles, 'Articles retrieved successfully');
                }
                break;
            case 'POST':
                $data = json_decode(file_get_contents('php://input'), true);
                $articleId = $this->articlesAPI->createArticle($data);
                ApiResponse::sendSuccess(['id' => $articleId], 'Article created successfully', 201);
                break;
            case 'PUT':
                if (!$id) {
                    ApiResponse::sendError('Article ID required', 400);
                }
                $data = json_decode(file_get_contents('php://input'), true);
                $success = $this->articlesAPI->updateArticle($id, $data);
                if ($success) {
                    ApiResponse::sendSuccess(null, 'Article updated successfully');
                } else {
                    ApiResponse::sendError('Article not found', 404);
                }
                break;
            case 'DELETE':
                if (!$id) {
                    ApiResponse::sendError('Article ID required', 400);
                }
                $success = $this->articlesAPI->deleteArticle($id);
                if ($success) {
                    ApiResponse::sendSuccess(null, 'Article deleted successfully');
                } else {
                    ApiResponse::sendError('Article not found', 404);
                }
                break;
            default:
                ApiResponse::sendError('Method not allowed', 405);
        }
    }
    
    private function handleProjects($method, $id) {
        switch ($method) {
            case 'GET':
                if ($id) {
                    $project = $this->projectsAPI->getProjectById($id);
                    ApiResponse::sendSuccess($project, 'Project retrieved successfully');
                } else {
                    $limit = $_GET['limit'] ?? null;
                    $offset = $_GET['offset'] ?? 0;
                    $category = $_GET['category'] ?? null;
                    
                    if ($category) {
                        $projects = $this->projectsAPI->getProjectsByCategory($category);
                    } else {
                        $projects = $this->projectsAPI->getAllProjects($limit, $offset);
                    }
                    ApiResponse::sendSuccess($projects, 'Projects retrieved successfully');
                }
                break;
            case 'POST':
                $data = json_decode(file_get_contents('php://input'), true);
                $projectId = $this->projectsAPI->createProject($data);
                ApiResponse::sendSuccess(['id' => $projectId], 'Project created successfully', 201);
                break;
            default:
                ApiResponse::sendError('Method not allowed', 405);
        }
    }
    
    private function handleTestimonials($method, $id) {
        switch ($method) {
            case 'GET':
                if ($id) {
                    $testimonial = $this->testimonialsAPI->getTestimonialById($id);
                    ApiResponse::sendSuccess($testimonial, 'Testimonial retrieved successfully');
                } else {
                    $testimonials = $this->testimonialsAPI->getAllTestimonials();
                    ApiResponse::sendSuccess($testimonials, 'Testimonials retrieved successfully');
                }
                break;
            case 'POST':
                $data = json_decode(file_get_contents('php://input'), true);
                $testimonialId = $this->testimonialsAPI->createTestimonial($data);
                ApiResponse::sendSuccess(['id' => $testimonialId], 'Testimonial created successfully', 201);
                break;
            default:
                ApiResponse::sendError('Method not allowed', 405);
        }
    }
    
    private function handleBooks($method, $id) {
        switch ($method) {
            case 'GET':
                if ($id) {
                    $book = $this->booksAPI->getBookById($id);
                    ApiResponse::sendSuccess($book, 'Book retrieved successfully');
                } else {
                    $limit = $_GET['limit'] ?? null;
                    $offset = $_GET['offset'] ?? 0;
                    $category = $_GET['category'] ?? null;
                    
                    if ($category) {
                        $books = $this->booksAPI->getBooksByCategory($category);
                    } else {
                        $books = $this->booksAPI->getAllBooks($limit, $offset);
                    }
                    ApiResponse::sendSuccess($books, 'Books retrieved successfully');
                }
                break;
            case 'POST':
                $data = json_decode(file_get_contents('php://input'), true);
                $bookId = $this->booksAPI->createBook($data);
                ApiResponse::sendSuccess(['id' => $bookId], 'Book created successfully', 201);
                break;
            default:
                ApiResponse::sendError('Method not allowed', 405);
        }
    }
    
    private function handleResources($method, $id) {
        switch ($method) {
            case 'GET':
                if ($id) {
                    $resource = $this->resourcesAPI->getResourceById($id);
                    ApiResponse::sendSuccess($resource, 'Resource retrieved successfully');
                } else {
                    $limit = $_GET['limit'] ?? null;
                    $offset = $_GET['offset'] ?? 0;
                    $category = $_GET['category'] ?? null;
                    
                    if ($category) {
                        $resources = $this->resourcesAPI->getResourcesByCategory($category);
                    } else {
                        $resources = $this->resourcesAPI->getAllResources($limit, $offset);
                    }
                    ApiResponse::sendSuccess($resources, 'Resources retrieved successfully');
                }
                break;
            case 'POST':
                $data = json_decode(file_get_contents('php://input'), true);
                $resourceId = $this->resourcesAPI->createResource($data);
                ApiResponse::sendSuccess(['id' => $resourceId], 'Resource created successfully', 201);
                break;
            default:
                ApiResponse::sendError('Method not allowed', 405);
        }
    }
}

// Initialize and run the API
$api = new ApiRouter();
$api->handleRequest();
?> 