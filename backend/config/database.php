<?php
/**
 * Database Configuration for Luxone Quotation System
 * 
 * This file contains database connection settings and configuration
 * for the Luxone quotation system backend API.
 */

class Database {
    // Database configuration
    private $host = 'localhost';
    private $db_name = 'luxone_quotation_system';
    private $username = 'root'; // Change this for production
    private $password = '';     // Change this for production
    private $charset = 'utf8mb4';
    
    private $pdo;
    private $error;

    /**
     * Database connection
     */
    public function connect() {
        if ($this->pdo === null) {
            $dsn = "mysql:host={$this->host};dbname={$this->db_name};charset={$this->charset}";
            
            $options = [
                PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES   => false,
                PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES {$this->charset}"
            ];

            try {
                $this->pdo = new PDO($dsn, $this->username, $this->password, $options);
            } catch (PDOException $e) {
                $this->error = $e->getMessage();
                throw new Exception("Database connection failed: " . $this->error);
            }
        }

        return $this->pdo;
    }

    /**
     * Get the last error
     */
    public function getError() {
        return $this->error;
    }

    /**
     * Close database connection
     */
    public function close() {
        $this->pdo = null;
    }

    /**
     * Begin transaction
     */
    public function beginTransaction() {
        return $this->connect()->beginTransaction();
    }

    /**
     * Commit transaction
     */
    public function commit() {
        return $this->connect()->commit();
    }

    /**
     * Rollback transaction
     */
    public function rollback() {
        return $this->connect()->rollBack();
    }

    /**
     * Execute a prepared statement
     */
    public function execute($sql, $params = []) {
        try {
            $stmt = $this->connect()->prepare($sql);
            $stmt->execute($params);
            return $stmt;
        } catch (PDOException $e) {
            throw new Exception("Query execution failed: " . $e->getMessage());
        }
    }

    /**
     * Fetch single row
     */
    public function fetchOne($sql, $params = []) {
        $stmt = $this->execute($sql, $params);
        return $stmt->fetch();
    }

    /**
     * Fetch all rows
     */
    public function fetchAll($sql, $params = []) {
        $stmt = $this->execute($sql, $params);
        return $stmt->fetchAll();
    }

    /**
     * Get last insert ID
     */
    public function lastInsertId() {
        return $this->connect()->lastInsertId();
    }

    /**
     * Get row count
     */
    public function rowCount($sql, $params = []) {
        $stmt = $this->execute($sql, $params);
        return $stmt->rowCount();
    }
}

// Database configuration constants
define('DB_HOST', 'localhost');
define('DB_NAME', 'luxone_quotation_system');
define('DB_USER', 'root');
define('DB_PASS', '');
define('DB_CHARSET', 'utf8mb4');

// API Configuration
define('API_VERSION', 'v1');
define('API_BASE_URL', '/api/' . API_VERSION);

// File upload settings
define('UPLOAD_MAX_SIZE', 3 * 1024 * 1024); // 3MB
define('UPLOAD_ALLOWED_TYPES', ['jpg', 'jpeg', 'png', 'gif', 'pdf']);
define('UPLOAD_PATH', __DIR__ . '/../uploads/');

// Ensure upload directory exists
if (!file_exists(UPLOAD_PATH)) {
    mkdir(UPLOAD_PATH, 0755, true);
}

// CORS settings
define('CORS_ALLOWED_ORIGINS', [
    'http://localhost:5173',
    'http://localhost:3000',
    'https://your-domain.com' // Add your production domain
]);

// JWT settings (for future authentication)
define('JWT_SECRET', 'your-secret-key-change-in-production');
define('JWT_EXPIRY', 3600); // 1 hour

// Email settings
define('SMTP_HOST', 'smtp.gmail.com');
define('SMTP_PORT', 587);
define('SMTP_USERNAME', 'your-email@gmail.com');
define('SMTP_PASSWORD', 'your-app-password');
define('FROM_EMAIL', 'noreply@theluxone.com');
define('FROM_NAME', 'Luxone Quotation System');

?>