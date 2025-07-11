<?php
/**
 * Admin Controller
 * 
 * Handles admin authentication, dashboard statistics, and admin-specific operations.
 */

require_once '../utils/Response.php';

class AdminController {
    private $db;
    
    public function __construct($database) {
        $this->db = $database;
    }

    /**
     * Admin login
     */
    public function login() {
        try {
            $input = json_decode(file_get_contents('php://input'), true);
            
            if (!isset($input['username']) || !isset($input['password'])) {
                Response::error('Username and password are required', 400);
                return;
            }

            $sql = "SELECT id, username, password_hash, email, full_name, role, is_active 
                    FROM admin_users WHERE username = :username AND is_active = TRUE";
            $stmt = $this->db->prepare($sql);
            $stmt->execute([':username' => $input['username']]);
            $user = $stmt->fetch();

            if (!$user || !password_verify($input['password'], $user['password_hash'])) {
                Response::error('Invalid credentials', 401);
                return;
            }

            // Update last login
            $updateSql = "UPDATE admin_users SET last_login = NOW() WHERE id = :id";
            $this->db->prepare($updateSql)->execute([':id' => $user['id']]);

            // Remove password hash from response
            unset($user['password_hash']);

            // In a real application, you would generate a JWT token here
            $token = base64_encode(json_encode([
                'user_id' => $user['id'],
                'username' => $user['username'],
                'role' => $user['role'],
                'exp' => time() + 3600 // 1 hour
            ]));

            Response::success([
                'user' => $user,
                'token' => $token,
                'expires_in' => 3600
            ], 'Login successful');

        } catch (Exception $e) {
            Response::error('Login failed: ' . $e->getMessage(), 500);
        }
    }

    /**
     * Get dashboard statistics
     */
    public function getDashboardStats() {
        try {
            // Total quotations
            $totalQuotes = $this->db->query("SELECT COUNT(*) as count FROM quotations")->fetch()['count'];
            
            // Quotes by status
            $statusStats = $this->db->query("
                SELECT status, COUNT(*) as count 
                FROM quotations 
                GROUP BY status
            ")->fetchAll();

            // Monthly stats
            $monthlyStats = $this->db->query("
                SELECT 
                    YEAR(created_at) as year,
                    MONTH(created_at) as month,
                    COUNT(*) as quotes,
                    AVG(total_amount) as avg_amount,
                    SUM(total_amount) as total_revenue
                FROM quotations 
                WHERE created_at >= DATE_SUB(NOW(), INTERVAL 12 MONTH)
                GROUP BY YEAR(created_at), MONTH(created_at)
                ORDER BY year DESC, month DESC
                LIMIT 12
            ")->fetchAll();

            // Recent quotations
            $recentQuotes = $this->db->query("
                SELECT quote_id, customer_name, customer_location, total_amount, status, created_at
                FROM quotations 
                ORDER BY created_at DESC 
                LIMIT 10
            ")->fetchAll();

            // Location distribution
            $locationStats = $this->db->query("
                SELECT customer_location, COUNT(*) as count
                FROM quotations 
                GROUP BY customer_location
                ORDER BY count DESC
            ")->fetchAll();

            // Material type distribution
            $materialStats = $this->db->query("
                SELECT 
                    CASE 
                        WHEN material_source = 'luxone' THEN CONCAT('Luxone ', material_type)
                        WHEN material_source = 'yourself' THEN 'Customer Supplied'
                        WHEN material_source = 'luxone-others' THEN 'Luxone Others'
                        ELSE 'Unknown'
                    END as material_category,
                    COUNT(*) as count
                FROM quotations 
                GROUP BY material_category
                ORDER BY count DESC
            ")->fetchAll();

            Response::success([
                'total_quotes' => (int)$totalQuotes,
                'status_stats' => $statusStats,
                'monthly_stats' => $monthlyStats,
                'recent_quotes' => $recentQuotes,
                'location_stats' => $locationStats,
                'material_stats' => $materialStats,
                'generated_at' => date('c')
            ]);

        } catch (Exception $e) {
            Response::error('Failed to fetch dashboard stats: ' . $e->getMessage(), 500);
        }
    }

    /**
     * Get analytics data
     */
    public function getAnalytics() {
        try {
            $period = $_GET['period'] ?? '30'; // days
            $startDate = date('Y-m-d', strtotime("-{$period} days"));

            // Quote trends
            $quoteTrends = $this->db->prepare("
                SELECT 
                    DATE(created_at) as date,
                    COUNT(*) as quotes,
                    AVG(total_amount) as avg_amount
                FROM quotations 
                WHERE created_at >= :start_date
                GROUP BY DATE(created_at)
                ORDER BY date ASC
            ");
            $quoteTrends->execute([':start_date' => $startDate]);
            $trends = $quoteTrends->fetchAll();

            // Conversion rates
            $conversionStats = $this->db->prepare("
                SELECT 
                    COUNT(*) as total_quotes,
                    COUNT(CASE WHEN status = 'approved' THEN 1 END) as approved_quotes,
                    COUNT(CASE WHEN status = 'rejected' THEN 1 END) as rejected_quotes,
                    COUNT(CASE WHEN status IN ('pending', 'reviewed', 'quoted') THEN 1 END) as pending_quotes
                FROM quotations 
                WHERE created_at >= :start_date
            ");
            $conversionStats->execute([':start_date' => $startDate]);
            $conversion = $conversionStats->fetch();

            // Average quote value by service level
            $serviceStats = $this->db->prepare("
                SELECT 
                    service_level,
                    COUNT(*) as count,
                    AVG(total_amount) as avg_amount,
                    MIN(total_amount) as min_amount,
                    MAX(total_amount) as max_amount
                FROM quotations 
                WHERE created_at >= :start_date AND total_amount IS NOT NULL
                GROUP BY service_level
            ");
            $serviceStats->execute([':start_date' => $startDate]);
            $serviceAnalytics = $serviceStats->fetchAll();

            // Top designers by quote volume
            $designerStats = $this->db->prepare("
                SELECT 
                    designer_name,
                    designer_email,
                    COUNT(*) as quote_count,
                    AVG(total_amount) as avg_quote_value
                FROM quotations 
                WHERE created_at >= :start_date
                GROUP BY designer_name, designer_email
                ORDER BY quote_count DESC
                LIMIT 10
            ");
            $designerStats->execute([':start_date' => $startDate]);
            $topDesigners = $designerStats->fetchAll();

            Response::success([
                'period_days' => (int)$period,
                'start_date' => $startDate,
                'quote_trends' => $trends,
                'conversion_stats' => $conversion,
                'service_analytics' => $serviceAnalytics,
                'top_designers' => $topDesigners,
                'generated_at' => date('c')
            ]);

        } catch (Exception $e) {
            Response::error('Failed to fetch analytics: ' . $e->getMessage(), 500);
        }
    }

    /**
     * Get admin data (users, logs, etc.)
     */
    public function getAdminData() {
        try {
            // Get admin users
            $users = $this->db->query("
                SELECT id, username, email, full_name, role, is_active, last_login, created_at
                FROM admin_users 
                ORDER BY created_at DESC
            ")->fetchAll();

            // Get recent activity logs
            $logs = $this->db->query("
                SELECT al.*, au.username
                FROM activity_logs al
                LEFT JOIN admin_users au ON al.user_id = au.id
                ORDER BY al.created_at DESC
                LIMIT 50
            ")->fetchAll();

            // System info
            $systemInfo = [
                'php_version' => PHP_VERSION,
                'mysql_version' => $this->db->query("SELECT VERSION() as version")->fetch()['version'],
                'server_time' => date('c'),
                'upload_max_filesize' => ini_get('upload_max_filesize'),
                'post_max_size' => ini_get('post_max_size'),
                'memory_limit' => ini_get('memory_limit')
            ];

            Response::success([
                'users' => $users,
                'recent_logs' => $logs,
                'system_info' => $systemInfo
            ]);

        } catch (Exception $e) {
            Response::error('Failed to fetch admin data: ' . $e->getMessage(), 500);
        }
    }
}

?>