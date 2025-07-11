<?php
/**
 * Main API Router for Luxone Quotation System
 * 
 * This file handles all API requests and routes them to appropriate controllers.
 */

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Include required files
require_once '../config/database.php';
require_once '../controllers/QuotationController.php';
require_once '../controllers/AdminController.php';
require_once '../controllers/SettingsController.php';
require_once '../controllers/FileController.php';
require_once '../utils/Response.php';
require_once '../utils/Validator.php';

// Error handling
set_error_handler(function($severity, $message, $file, $line) {
    throw new ErrorException($message, 0, $severity, $file, $line);
});

try {
    // Get request method and URI
    $method = $_SERVER['REQUEST_METHOD'];
    $uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
    
    // Remove base path if exists
    $basePath = '/api/v1';
    if (strpos($uri, $basePath) === 0) {
        $uri = substr($uri, strlen($basePath));
    }
    
    // Remove leading slash
    $uri = ltrim($uri, '/');
    
    // Split URI into segments
    $segments = explode('/', $uri);
    $resource = $segments[0] ?? '';
    $id = $segments[1] ?? null;
    $action = $segments[2] ?? null;

    // Initialize database
    $database = new Database();
    $db = $database->connect();

    // Route requests
    switch ($resource) {
        case 'quotes':
        case 'quotations':
            $controller = new QuotationController($db);
            handleQuotationRoutes($controller, $method, $id, $action);
            break;
            
        case 'admin':
            $controller = new AdminController($db);
            handleAdminRoutes($controller, $method, $id, $action);
            break;
            
        case 'settings':
            $controller = new SettingsController($db);
            handleSettingsRoutes($controller, $method, $id, $action);
            break;
            
        case 'files':
            $controller = new FileController($db);
            handleFileRoutes($controller, $method, $id, $action);
            break;
            
        case 'health':
            Response::success(['status' => 'OK', 'timestamp' => date('c')]);
            break;
            
        default:
            Response::error('Endpoint not found', 404);
    }

} catch (Exception $e) {
    error_log("API Error: " . $e->getMessage());
    Response::error('Internal server error: ' . $e->getMessage(), 500);
}

/**
 * Handle quotation-related routes
 */
function handleQuotationRoutes($controller, $method, $id, $action) {
    switch ($method) {
        case 'GET':
            if ($id) {
                if ($action === 'pdf') {
                    $controller->generatePDF($id);
                } else {
                    $controller->getQuotation($id);
                }
            } else {
                $controller->getAllQuotations();
            }
            break;
            
        case 'POST':
            if ($action === 'calculate') {
                $controller->calculatePricing();
            } else {
                $controller->createQuotation();
            }
            break;
            
        case 'PUT':
            if ($id) {
                if ($action === 'status') {
                    $controller->updateStatus($id);
                } else {
                    $controller->updateQuotation($id);
                }
            } else {
                Response::error('ID required for update', 400);
            }
            break;
            
        case 'DELETE':
            if ($id) {
                $controller->deleteQuotation($id);
            } else {
                Response::error('ID required for delete', 400);
            }
            break;
            
        default:
            Response::error('Method not allowed', 405);
    }
}

/**
 * Handle admin-related routes
 */
function handleAdminRoutes($controller, $method, $id, $action) {
    switch ($method) {
        case 'GET':
            if ($action === 'dashboard') {
                $controller->getDashboardStats();
            } elseif ($action === 'analytics') {
                $controller->getAnalytics();
            } else {
                $controller->getAdminData();
            }
            break;
            
        case 'POST':
            if ($action === 'login') {
                $controller->login();
            } else {
                Response::error('Action not found', 404);
            }
            break;
            
        default:
            Response::error('Method not allowed', 405);
    }
}

/**
 * Handle settings-related routes
 */
function handleSettingsRoutes($controller, $method, $id, $action) {
    switch ($method) {
        case 'GET':
            if ($id === 'company') {
                $controller->getCompanySettings();
            } elseif ($id === 'cost-rules') {
                $controller->getCostRules();
            } elseif ($id === 'form-fields') {
                $controller->getFormFields();
            } elseif ($id === 'pdf-templates') {
                $controller->getPdfTemplates();
            } else {
                $controller->getAllSettings();
            }
            break;
            
        case 'POST':
            if ($id === 'cost-rules') {
                $controller->createCostRule();
            } elseif ($id === 'form-fields') {
                $controller->createFormField();
            } elseif ($id === 'pdf-templates') {
                $controller->createPdfTemplate();
            } else {
                Response::error('Invalid endpoint', 400);
            }
            break;
            
        case 'PUT':
            if ($id === 'company') {
                $controller->updateCompanySettings();
            } elseif ($id === 'cost-rules' && $action) {
                $controller->updateCostRule($action);
            } elseif ($id === 'form-fields' && $action) {
                $controller->updateFormField($action);
            } elseif ($id === 'pdf-templates' && $action) {
                $controller->updatePdfTemplate($action);
            } else {
                Response::error('Invalid endpoint', 400);
            }
            break;
            
        case 'DELETE':
            if ($id === 'cost-rules' && $action) {
                $controller->deleteCostRule($action);
            } elseif ($id === 'form-fields' && $action) {
                $controller->deleteFormField($action);
            } elseif ($id === 'pdf-templates' && $action) {
                $controller->deletePdfTemplate($action);
            } else {
                Response::error('Invalid endpoint', 400);
            }
            break;
            
        default:
            Response::error('Method not allowed', 405);
    }
}

/**
 * Handle file-related routes
 */
function handleFileRoutes($controller, $method, $id, $action) {
    switch ($method) {
        case 'GET':
            if ($id) {
                $controller->downloadFile($id);
            } else {
                $controller->listFiles();
            }
            break;
            
        case 'POST':
            $controller->uploadFile();
            break;
            
        case 'DELETE':
            if ($id) {
                $controller->deleteFile($id);
            } else {
                Response::error('ID required for delete', 400);
            }
            break;
            
        default:
            Response::error('Method not allowed', 405);
    }
}

?>