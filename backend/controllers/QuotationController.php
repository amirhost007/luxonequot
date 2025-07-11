<?php
/**
 * Quotation Controller
 * 
 * Handles all quotation-related operations including CRUD operations,
 * pricing calculations, and PDF generation.
 */

require_once '../utils/Response.php';
require_once '../utils/Validator.php';

class QuotationController {
    private $db;
    
    public function __construct($database) {
        $this->db = $database;
    }

    /**
     * Create a new quotation
     */
    public function createQuotation() {
        try {
            $input = json_decode(file_get_contents('php://input'), true);
            
            // Validate required fields
            $validator = new Validator();
            $rules = [
                'service_level' => 'required|in:fabrication,fabrication-delivery,fabrication-delivery-installation',
                'material_source' => 'required|in:luxone,yourself,luxone-others',
                'worktop_layout' => 'required',
                'sink_option' => 'required|in:client-provided,luxone-customized',
                'timeline' => 'required',
                'project_type' => 'required',
                'customer_name' => 'required|string|max:100',
                'customer_phone' => 'required|string|max:20',
                'customer_location' => 'required',
                'designer_name' => 'required|string|max:100',
                'designer_contact' => 'required|string|max:20',
                'designer_email' => 'required|email|max:100',
                'pieces' => 'required|array'
            ];
            
            if (!$validator->validate($input, $rules)) {
                Response::error('Validation failed', 400, $validator->getErrors());
                return;
            }

            $this->db->beginTransaction();

            // Generate quote ID
            $stmt = $this->db->prepare("CALL GenerateQuoteId(@new_id)");
            $stmt->execute();
            $result = $this->db->query("SELECT @new_id as quote_id")->fetch();
            $quoteId = $result['quote_id'];

            // Insert quotation
            $sql = "INSERT INTO quotations (
                quote_id, service_level, material_source, material_type, material_color,
                slab_size, thickness, finish, luxone_others_slab_size, luxone_others_thickness,
                luxone_others_finish, required_slabs, price_per_slab, brand_supplier,
                luxone_others_color_name, worktop_layout, sink_option, timeline, project_type,
                customer_name, customer_email, customer_phone, customer_location,
                additional_comments, designer_name, designer_contact, designer_email
            ) VALUES (
                :quote_id, :service_level, :material_source, :material_type, :material_color,
                :slab_size, :thickness, :finish, :luxone_others_slab_size, :luxone_others_thickness,
                :luxone_others_finish, :required_slabs, :price_per_slab, :brand_supplier,
                :luxone_others_color_name, :worktop_layout, :sink_option, :timeline, :project_type,
                :customer_name, :customer_email, :customer_phone, :customer_location,
                :additional_comments, :designer_name, :designer_contact, :designer_email
            )";

            $params = [
                ':quote_id' => $quoteId,
                ':service_level' => $input['service_level'],
                ':material_source' => $input['material_source'],
                ':material_type' => $input['material_type'] ?? null,
                ':material_color' => $input['material_color'] ?? null,
                ':slab_size' => $input['slab_size'] ?? null,
                ':thickness' => $input['thickness'] ?? null,
                ':finish' => $input['finish'] ?? null,
                ':luxone_others_slab_size' => $input['luxone_others_slab_size'] ?? null,
                ':luxone_others_thickness' => $input['luxone_others_thickness'] ?? null,
                ':luxone_others_finish' => $input['luxone_others_finish'] ?? null,
                ':required_slabs' => $input['required_slabs'] ?? null,
                ':price_per_slab' => $input['price_per_slab'] ?? null,
                ':brand_supplier' => $input['brand_supplier'] ?? null,
                ':luxone_others_color_name' => $input['luxone_others_color_name'] ?? null,
                ':worktop_layout' => $input['worktop_layout'],
                ':sink_option' => $input['sink_option'],
                ':timeline' => $input['timeline'],
                ':project_type' => $input['project_type'],
                ':customer_name' => $input['customer_name'],
                ':customer_email' => $input['customer_email'] ?? null,
                ':customer_phone' => $input['customer_phone'],
                ':customer_location' => $input['customer_location'],
                ':additional_comments' => $input['additional_comments'] ?? null,
                ':designer_name' => $input['designer_name'],
                ':designer_contact' => $input['designer_contact'],
                ':designer_email' => $input['designer_email']
            ];

            $stmt = $this->db->prepare($sql);
            $stmt->execute($params);
            $quotationId = $this->db->lastInsertId();

            // Insert pieces
            if (!empty($input['pieces'])) {
                $pieceSql = "INSERT INTO quotation_pieces (quotation_id, piece_label, length_mm, width_mm, thickness_mm) 
                            VALUES (:quotation_id, :piece_label, :length_mm, :width_mm, :thickness_mm)";
                $pieceStmt = $this->db->prepare($pieceSql);

                foreach ($input['pieces'] as $label => $piece) {
                    if (!empty($piece['length']) && !empty($piece['width']) && !empty($piece['thickness'])) {
                        $pieceStmt->execute([
                            ':quotation_id' => $quotationId,
                            ':piece_label' => $label,
                            ':length_mm' => (int)$piece['length'],
                            ':width_mm' => (int)$piece['width'],
                            ':thickness_mm' => (int)$piece['thickness']
                        ]);
                    }
                }
            }

            // Calculate pricing
            $stmt = $this->db->prepare("CALL CalculateQuotePricing(:quote_id, @total)");
            $stmt->execute([':quote_id' => $quoteId]);
            $result = $this->db->query("SELECT @total as total")->fetch();
            $totalAmount = $result['total'];

            // Update quotation with total amount
            $updateSql = "UPDATE quotations SET total_amount = :total WHERE id = :id";
            $this->db->prepare($updateSql)->execute([
                ':total' => $totalAmount,
                ':id' => $quotationId
            ]);

            $this->db->commit();

            // Return created quotation
            $quotation = $this->getQuotationData($quotationId);
            Response::success($quotation, 'Quotation created successfully', 201);

        } catch (Exception $e) {
            $this->db->rollback();
            Response::error('Failed to create quotation: ' . $e->getMessage(), 500);
        }
    }

    /**
     * Get all quotations with pagination and filtering
     */
    public function getAllQuotations() {
        try {
            $page = (int)($_GET['page'] ?? 1);
            $limit = (int)($_GET['limit'] ?? 20);
            $offset = ($page - 1) * $limit;
            
            $search = $_GET['search'] ?? '';
            $status = $_GET['status'] ?? '';
            $location = $_GET['location'] ?? '';
            $dateFrom = $_GET['date_from'] ?? '';
            $dateTo = $_GET['date_to'] ?? '';

            // Build WHERE clause
            $whereConditions = [];
            $params = [];

            if ($search) {
                $whereConditions[] = "(customer_name LIKE :search OR customer_email LIKE :search OR quote_id LIKE :search)";
                $params[':search'] = "%$search%";
            }

            if ($status) {
                $whereConditions[] = "status = :status";
                $params[':status'] = $status;
            }

            if ($location) {
                $whereConditions[] = "customer_location = :location";
                $params[':location'] = $location;
            }

            if ($dateFrom) {
                $whereConditions[] = "DATE(created_at) >= :date_from";
                $params[':date_from'] = $dateFrom;
            }

            if ($dateTo) {
                $whereConditions[] = "DATE(created_at) <= :date_to";
                $params[':date_to'] = $dateTo;
            }

            $whereClause = $whereConditions ? 'WHERE ' . implode(' AND ', $whereConditions) : '';

            // Get total count
            $countSql = "SELECT COUNT(*) as total FROM quotation_summary $whereClause";
            $totalResult = $this->db->prepare($countSql);
            $totalResult->execute($params);
            $total = $totalResult->fetch()['total'];

            // Get quotations
            $sql = "SELECT * FROM quotation_summary $whereClause ORDER BY created_at DESC LIMIT :limit OFFSET :offset";
            $params[':limit'] = $limit;
            $params[':offset'] = $offset;

            $stmt = $this->db->prepare($sql);
            $stmt->execute($params);
            $quotations = $stmt->fetchAll();

            Response::success([
                'data' => $quotations,
                'pagination' => [
                    'page' => $page,
                    'limit' => $limit,
                    'total' => (int)$total,
                    'pages' => ceil($total / $limit)
                ]
            ]);

        } catch (Exception $e) {
            Response::error('Failed to fetch quotations: ' . $e->getMessage(), 500);
        }
    }

    /**
     * Get single quotation by ID
     */
    public function getQuotation($id) {
        try {
            $quotation = $this->getQuotationData($id);
            
            if (!$quotation) {
                Response::error('Quotation not found', 404);
                return;
            }

            Response::success($quotation);

        } catch (Exception $e) {
            Response::error('Failed to fetch quotation: ' . $e->getMessage(), 500);
        }
    }

    /**
     * Update quotation
     */
    public function updateQuotation($id) {
        try {
            $input = json_decode(file_get_contents('php://input'), true);
            
            // Check if quotation exists
            $existing = $this->getQuotationData($id);
            if (!$existing) {
                Response::error('Quotation not found', 404);
                return;
            }

            $this->db->beginTransaction();

            // Build update query dynamically
            $updateFields = [];
            $params = [':id' => $id];

            $allowedFields = [
                'service_level', 'material_source', 'material_type', 'material_color',
                'worktop_layout', 'sink_option', 'timeline', 'project_type',
                'customer_name', 'customer_email', 'customer_phone', 'customer_location',
                'additional_comments', 'designer_name', 'designer_contact', 'designer_email',
                'status', 'total_amount'
            ];

            foreach ($allowedFields as $field) {
                if (isset($input[$field])) {
                    $updateFields[] = "$field = :$field";
                    $params[":$field"] = $input[$field];
                }
            }

            if (!empty($updateFields)) {
                $sql = "UPDATE quotations SET " . implode(', ', $updateFields) . " WHERE id = :id";
                $this->db->prepare($sql)->execute($params);
            }

            // Update pieces if provided
            if (isset($input['pieces'])) {
                // Delete existing pieces
                $this->db->prepare("DELETE FROM quotation_pieces WHERE quotation_id = :id")->execute([':id' => $id]);

                // Insert new pieces
                if (!empty($input['pieces'])) {
                    $pieceSql = "INSERT INTO quotation_pieces (quotation_id, piece_label, length_mm, width_mm, thickness_mm) 
                                VALUES (:quotation_id, :piece_label, :length_mm, :width_mm, :thickness_mm)";
                    $pieceStmt = $this->db->prepare($pieceSql);

                    foreach ($input['pieces'] as $label => $piece) {
                        if (!empty($piece['length']) && !empty($piece['width']) && !empty($piece['thickness'])) {
                            $pieceStmt->execute([
                                ':quotation_id' => $id,
                                ':piece_label' => $label,
                                ':length_mm' => (int)$piece['length'],
                                ':width_mm' => (int)$piece['width'],
                                ':thickness_mm' => (int)$piece['thickness']
                            ]);
                        }
                    }
                }
            }

            $this->db->commit();

            // Return updated quotation
            $quotation = $this->getQuotationData($id);
            Response::success($quotation, 'Quotation updated successfully');

        } catch (Exception $e) {
            $this->db->rollback();
            Response::error('Failed to update quotation: ' . $e->getMessage(), 500);
        }
    }

    /**
     * Update quotation status
     */
    public function updateStatus($id) {
        try {
            $input = json_decode(file_get_contents('php://input'), true);
            
            if (!isset($input['status'])) {
                Response::error('Status is required', 400);
                return;
            }

            $allowedStatuses = ['pending', 'reviewed', 'quoted', 'approved', 'rejected'];
            if (!in_array($input['status'], $allowedStatuses)) {
                Response::error('Invalid status', 400);
                return;
            }

            $sql = "UPDATE quotations SET status = :status WHERE id = :id";
            $result = $this->db->prepare($sql)->execute([
                ':status' => $input['status'],
                ':id' => $id
            ]);

            if ($result) {
                Response::success(['status' => $input['status']], 'Status updated successfully');
            } else {
                Response::error('Quotation not found', 404);
            }

        } catch (Exception $e) {
            Response::error('Failed to update status: ' . $e->getMessage(), 500);
        }
    }

    /**
     * Delete quotation
     */
    public function deleteQuotation($id) {
        try {
            $this->db->beginTransaction();

            // Delete pieces first (foreign key constraint)
            $this->db->prepare("DELETE FROM quotation_pieces WHERE quotation_id = :id")->execute([':id' => $id]);
            
            // Delete quotation
            $result = $this->db->prepare("DELETE FROM quotations WHERE id = :id")->execute([':id' => $id]);

            if ($result) {
                $this->db->commit();
                Response::success(null, 'Quotation deleted successfully');
            } else {
                $this->db->rollback();
                Response::error('Quotation not found', 404);
            }

        } catch (Exception $e) {
            $this->db->rollback();
            Response::error('Failed to delete quotation: ' . $e->getMessage(), 500);
        }
    }

    /**
     * Calculate pricing for quotation data
     */
    public function calculatePricing() {
        try {
            $input = json_decode(file_get_contents('php://input'), true);
            
            if (!isset($input['pieces']) || empty($input['pieces'])) {
                Response::error('Pieces data is required', 400);
                return;
            }

            // Calculate total area
            $totalArea = 0;
            foreach ($input['pieces'] as $piece) {
                if (!empty($piece['length']) && !empty($piece['width'])) {
                    $length = (float)$piece['length'];
                    $width = (float)$piece['width'];
                    $totalArea += ($length * $width) / 1000000; // Convert mm² to m²
                }
            }

            // Get cost rules
            $costRules = $this->getCostRulesArray();

            // Calculate costs
            $materialCost = $totalArea * ($costRules['material_base'] ?? 150);
            $fabricationCost = $totalArea * (
                ($costRules['cutting'] ?? 20) + 
                ($costRules['top_polishing'] ?? 50) + 
                ($costRules['edge_polishing'] ?? 30)
            );
            $installationCost = $totalArea * ($costRules['installation'] ?? 140);
            
            $addonCost = 0;
            if (isset($input['sink_option']) && $input['sink_option'] === 'luxone-customized') {
                $addonCost = $costRules['sink_luxone'] ?? 500;
            }

            $deliveryCost = 0;
            if (isset($input['customer_location'])) {
                if ($input['customer_location'] === 'Dubai') {
                    $deliveryCost = $costRules['delivery_dubai'] ?? 500;
                } else {
                    $deliveryCost = $costRules['delivery_uae'] ?? 800;
                }
            }

            $subtotal = $materialCost + $fabricationCost + $installationCost + $addonCost + $deliveryCost;
            $margin = $subtotal * (($costRules['margin'] ?? 20) / 100);
            $subtotalWithMargin = $subtotal + $margin;
            $vat = $subtotalWithMargin * (($costRules['vat'] ?? 5) / 100);
            $grandTotal = $subtotalWithMargin + $vat;

            $breakdown = [
                'material_cost' => round($materialCost, 2),
                'fabrication_cost' => round($fabricationCost, 2),
                'installation_cost' => round($installationCost, 2),
                'addon_cost' => round($addonCost, 2),
                'delivery_cost' => round($deliveryCost, 2),
                'subtotal' => round($subtotal, 2),
                'margin' => round($margin, 2),
                'subtotal_with_margin' => round($subtotalWithMargin, 2),
                'vat' => round($vat, 2),
                'grand_total' => round($grandTotal, 2),
                'total_area_sqm' => round($totalArea, 4)
            ];

            Response::success($breakdown);

        } catch (Exception $e) {
            Response::error('Failed to calculate pricing: ' . $e->getMessage(), 500);
        }
    }

    /**
     * Generate PDF for quotation
     */
    public function generatePDF($id) {
        try {
            $quotation = $this->getQuotationData($id);
            
            if (!$quotation) {
                Response::error('Quotation not found', 404);
                return;
            }

            // For now, return quotation data - PDF generation would require additional libraries
            Response::success([
                'message' => 'PDF generation endpoint ready',
                'quotation' => $quotation,
                'note' => 'Implement PDF generation using libraries like TCPDF or DOMPDF'
            ]);

        } catch (Exception $e) {
            Response::error('Failed to generate PDF: ' . $e->getMessage(), 500);
        }
    }

    /**
     * Get quotation data with pieces
     */
    private function getQuotationData($id) {
        // Get quotation
        $sql = "SELECT * FROM quotations WHERE id = :id OR quote_id = :id";
        $stmt = $this->db->prepare($sql);
        $stmt->execute([':id' => $id]);
        $quotation = $stmt->fetch();

        if (!$quotation) {
            return null;
        }

        // Get pieces
        $piecesSql = "SELECT * FROM quotation_pieces WHERE quotation_id = :id ORDER BY piece_label";
        $piecesStmt = $this->db->prepare($piecesSql);
        $piecesStmt->execute([':id' => $quotation['id']]);
        $pieces = $piecesStmt->fetchAll();

        $quotation['pieces'] = $pieces;
        return $quotation;
    }

    /**
     * Get cost rules as associative array
     */
    private function getCostRulesArray() {
        $sql = "SELECT id, value FROM cost_rules WHERE is_active = TRUE";
        $stmt = $this->db->prepare($sql);
        $stmt->execute();
        $rules = $stmt->fetchAll();

        $costRules = [];
        foreach ($rules as $rule) {
            $costRules[$rule['id']] = (float)$rule['value'];
        }

        return $costRules;
    }
}

?>