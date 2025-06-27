<?php
/**
 * Configuration file for Portfolio Database API
 * 
 * @author Devontae Reid
 * @version 1.0
 */

// Database Configuration
define('DB_HOST', 'localhost');
define('DB_NAME', 'portfolio_db');
define('DB_USERNAME', 'your_username');
define('DB_PASSWORD', 'your_password');
define('DB_CHARSET', 'utf8mb4');

// API Configuration
define('API_VERSION', '1.0');
define('API_BASE_URL', 'http://localhost/scripts/database_api.php');
define('API_RATE_LIMIT', 100); // requests per minute
define('API_CACHE_DURATION', 300); // 5 minutes

// Security Configuration
define('JWT_SECRET', 'your-secret-key-here');
define('JWT_EXPIRY', 3600); // 1 hour
define('PASSWORD_SALT', 'your-salt-here');

// File Upload Configuration
define('UPLOAD_MAX_SIZE', 5242880); // 5MB
define('ALLOWED_IMAGE_TYPES', ['jpg', 'jpeg', 'png', 'gif', 'webp']);
define('UPLOAD_PATH', '../uploads/');

// Email Configuration (for future use)
define('SMTP_HOST', 'smtp.gmail.com');
define('SMTP_PORT', 587);
define('SMTP_USERNAME', 'your-email@gmail.com');
define('SMTP_PASSWORD', 'your-app-password');
define('SMTP_FROM_EMAIL', 'noreply@devontaereid.com');
define('SMTP_FROM_NAME', 'Devontae Reid Portfolio');

// CORS Configuration
define('ALLOWED_ORIGINS', [
    'http://localhost:3000',
    'http://localhost:8081',
    'https://devontaereid.com',
    'https://www.devontaereid.com'
]);

// Logging Configuration
define('LOG_ENABLED', true);
define('LOG_PATH', '../logs/');
define('LOG_LEVEL', 'INFO'); // DEBUG, INFO, WARNING, ERROR

// Cache Configuration
define('CACHE_ENABLED', true);
define('CACHE_PATH', '../cache/');
define('CACHE_DURATION', 3600); // 1 hour

// Pagination Configuration
define('DEFAULT_PAGE_SIZE', 10);
define('MAX_PAGE_SIZE', 100);

// Error Reporting (set to false in production)
define('DEBUG_MODE', true);

if (DEBUG_MODE) {
    error_reporting(E_ALL);
    ini_set('display_errors', 1);
} else {
    error_reporting(0);
    ini_set('display_errors', 0);
}

// Timezone
date_default_timezone_set('UTC');

// Database connection function
function getDatabaseConnection() {
    try {
        $dsn = "mysql:host=" . DB_HOST . 
               ";dbname=" . DB_NAME . 
               ";charset=" . DB_CHARSET;
        
        $pdo = new PDO($dsn, DB_USERNAME, DB_PASSWORD, [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES => false,
        ]);
        
        return $pdo;
    } catch (PDOException $e) {
        throw new Exception('Database connection failed: ' . $e->getMessage());
    }
}

// Logging function
function logMessage($level, $message, $context = []) {
    if (!LOG_ENABLED) return;
    
    $logFile = LOG_PATH . date('Y-m-d') . '.log';
    $timestamp = date('Y-m-d H:i:s');
    $contextStr = !empty($context) ? ' ' . json_encode($context) : '';
    
    $logEntry = "[$timestamp] [$level] $message$contextStr" . PHP_EOL;
    
    if (!is_dir(LOG_PATH)) {
        mkdir(LOG_PATH, 0755, true);
    }
    
    file_put_contents($logFile, $logEntry, FILE_APPEND | LOCK_EX);
}

// CORS headers function
function setCorsHeaders() {
    $origin = $_SERVER['HTTP_ORIGIN'] ?? '';
    
    if (in_array($origin, ALLOWED_ORIGINS)) {
        header("Access-Control-Allow-Origin: $origin");
    }
    
    header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
    header('Access-Control-Max-Age: 86400'); // 24 hours
}

// Rate limiting function
function checkRateLimit($ip) {
    $cacheFile = CACHE_PATH . "rate_limit_$ip.json";
    
    if (!is_dir(CACHE_PATH)) {
        mkdir(CACHE_PATH, 0755, true);
    }
    
    if (file_exists($cacheFile)) {
        $data = json_decode(file_get_contents($cacheFile), true);
        
        if ($data['timestamp'] > time() - 60) { // Within 1 minute
            if ($data['count'] >= API_RATE_LIMIT) {
                return false; // Rate limit exceeded
            }
            $data['count']++;
        } else {
            $data = ['timestamp' => time(), 'count' => 1];
        }
    } else {
        $data = ['timestamp' => time(), 'count' => 1];
    }
    
    file_put_contents($cacheFile, json_encode($data));
    return true;
}

// Input validation function
function validateInput($data, $rules) {
    $errors = [];
    
    foreach ($rules as $field => $rule) {
        if (!isset($data[$field]) || empty($data[$field])) {
            if (strpos($rule, 'required') !== false) {
                $errors[$field] = "$field is required";
            }
            continue;
        }
        
        $value = $data[$field];
        
        if (strpos($rule, 'email') !== false && !filter_var($value, FILTER_VALIDATE_EMAIL)) {
            $errors[$field] = "$field must be a valid email address";
        }
        
        if (strpos($rule, 'url') !== false && !filter_var($value, FILTER_VALIDATE_URL)) {
            $errors[$field] = "$field must be a valid URL";
        }
        
        if (preg_match('/min:(\d+)/', $rule, $matches)) {
            $min = $matches[1];
            if (strlen($value) < $min) {
                $errors[$field] = "$field must be at least $min characters long";
            }
        }
        
        if (preg_match('/max:(\d+)/', $rule, $matches)) {
            $max = $matches[1];
            if (strlen($value) > $max) {
                $errors[$field] = "$field must be no more than $max characters long";
            }
        }
    }
    
    return $errors;
}

// Sanitize input function
function sanitizeInput($data) {
    if (is_array($data)) {
        return array_map('sanitizeInput', $data);
    }
    
    return htmlspecialchars(trim($data), ENT_QUOTES, 'UTF-8');
}

// Generate JWT token function
function generateJWT($payload) {
    $header = json_encode(['typ' => 'JWT', 'alg' => 'HS256']);
    $payload = json_encode($payload);
    
    $base64Header = str_replace(['+', '/', '='], ['-', '_', ''], base64_encode($header));
    $base64Payload = str_replace(['+', '/', '='], ['-', '_', ''], base64_encode($payload));
    
    $signature = hash_hmac('sha256', $base64Header . "." . $base64Payload, JWT_SECRET, true);
    $base64Signature = str_replace(['+', '/', '='], ['-', '_', ''], base64_encode($signature));
    
    return $base64Header . "." . $base64Payload . "." . $base64Signature;
}

// Verify JWT token function
function verifyJWT($token) {
    $parts = explode('.', $token);
    
    if (count($parts) !== 3) {
        return false;
    }
    
    $header = base64_decode(str_replace(['-', '_'], ['+', '/'], $parts[0]));
    $payload = base64_decode(str_replace(['-', '_'], ['+', '/'], $parts[1]));
    $signature = base64_decode(str_replace(['-', '_'], ['+', '/'], $parts[2]));
    
    $expectedSignature = hash_hmac('sha256', $parts[0] . "." . $parts[1], JWT_SECRET, true);
    
    if (!hash_equals($signature, $expectedSignature)) {
        return false;
    }
    
    $payloadData = json_decode($payload, true);
    
    if ($payloadData['exp'] < time()) {
        return false;
    }
    
    return $payloadData;
}

// File upload function
function uploadFile($file, $allowedTypes = ALLOWED_IMAGE_TYPES) {
    if (!isset($file['tmp_name']) || !is_uploaded_file($file['tmp_name'])) {
        throw new Exception('No file uploaded');
    }
    
    if ($file['size'] > UPLOAD_MAX_SIZE) {
        throw new Exception('File size exceeds limit');
    }
    
    $fileExtension = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
    
    if (!in_array($fileExtension, $allowedTypes)) {
        throw new Exception('File type not allowed');
    }
    
    $fileName = uniqid() . '.' . $fileExtension;
    $uploadPath = UPLOAD_PATH . $fileName;
    
    if (!is_dir(UPLOAD_PATH)) {
        mkdir(UPLOAD_PATH, 0755, true);
    }
    
    if (!move_uploaded_file($file['tmp_name'], $uploadPath)) {
        throw new Exception('Failed to move uploaded file');
    }
    
    return $fileName;
}

// Cache functions
function getCache($key) {
    if (!CACHE_ENABLED) return null;
    
    $cacheFile = CACHE_PATH . md5($key) . '.json';
    
    if (file_exists($cacheFile)) {
        $data = json_decode(file_get_contents($cacheFile), true);
        
        if ($data['expires'] > time()) {
            return $data['value'];
        }
        
        unlink($cacheFile);
    }
    
    return null;
}

function setCache($key, $value, $duration = CACHE_DURATION) {
    if (!CACHE_ENABLED) return;
    
    if (!is_dir(CACHE_PATH)) {
        mkdir(CACHE_PATH, 0755, true);
    }
    
    $cacheFile = CACHE_PATH . md5($key) . '.json';
    $data = [
        'value' => $value,
        'expires' => time() + $duration
    ];
    
    file_put_contents($cacheFile, json_encode($data));
}

function clearCache($pattern = '*') {
    if (!CACHE_ENABLED) return;
    
    $files = glob(CACHE_PATH . $pattern . '.json');
    
    foreach ($files as $file) {
        unlink($file);
    }
}
?> 