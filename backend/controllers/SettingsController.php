<?php
/**
 * Settings Controller
 * 
 * Handles all settings-related operations including company settings,
 * cost rules, form fields, and PDF templates.
 */

require_once '../utils/Response.php';
require_once '../utils/Validator.php';

class SettingsController {
    private $db;
    
    public function __construct($database) {
        $this->db = $database;
    }

    /**
     * Get all settings
     */
    public function getAllSettings() {
        try {
            $settings = [
                'company' => $this->getCompanySettingsData(),
                'cost_rules' => $this->getCostRulesData(),
                'form_fields' => $this->getFormFieldsData(),
                'pdf_templates' => $this->getPdfTemplatesData(),
                'system' => $this->getSystemSettingsData()
            ];

            Response::success($settings);

        } catch (Exception $e) {
            Response::error('Failed to fetch settings: ' . $e->getMessage(), 500);
        }
    }

    /**
     * Get company settings
     */
    public function getCompanySettings() {
        try {
            $settings = $this->getCompanySettingsData();
            Response::success($settings);

        } catch (Exception $e) {
            Response::error('Failed to fetch company settings: ' . $e->getMessage(), 500);
        }
    }

    /**
     * Update company settings
     */
    public function updateCompanySettings() {
        try {
            $input = json_decode(file_get_contents('php://input'), true);
            
            $allowedFields = [
                'company_name', 'website', 'address', 'whatsapp_india', 'whatsapp_uae',
                'admin_email', 'price_per_sqft', 'aed_to_usd_rate', 'vat_rate',
                'consultant_name', 'consultant_phone', 'consultant_email'
            ];

            $updateFields = [];
            $params = [];

            foreach ($allowedFields as $field) {
                if (isset($input[$field])) {
                    $updateFields[] = "$field = :$field";
                    $params[":$field"] = $input[$field];
                }
            }

            if (empty($updateFields)) {
                Response::error('No valid fields to update', 400);
                return;
            }

            $sql = "UPDATE company_settings SET " . implode(', ', $updateFields) . " WHERE id = 1";
            $this->db->prepare($sql)->execute($params);

            $settings = $this->getCompanySettingsData();
            Response::success($settings, 'Company settings updated successfully');

        } catch (Exception $e) {
            Response::error('Failed to update company settings: ' . $e->getMessage(), 500);
        }
    }

    /**
     * Get cost rules
     */
    public function getCostRules() {
        try {
            $rules = $this->getCostRulesData();
            Response::success($rules);

        } catch (Exception $e) {
            Response::error('Failed to fetch cost rules: ' . $e->getMessage(), 500);
        }
    }

    /**
     * Create cost rule
     */
    public function createCostRule() {
        try {
            $input = json_decode(file_get_contents('php://input'), true);
            
            $validator = new Validator();
            $rules = [
                'id' => 'required|string|max:50',
                'name' => 'required|string|max:100',
                'category' => 'required|in:material,fabrication,installation,addon,delivery,business',
                'type' => 'required|in:fixed,per_sqm,per_piece,percentage',
                'value' => 'required|numeric|min:0',
                'description' => 'string'
            ];

            if (!$validator->validate($input, $rules)) {
                Response::error('Validation failed', 400, $validator->getErrors());
                return;
            }

            $sql = "INSERT INTO cost_rules (id, name, category, type, value, description, is_active) 
                    VALUES (:id, :name, :category, :type, :value, :description, :is_active)";
            
            $params = [
                ':id' => $input['id'],
                ':name' => $input['name'],
                ':category' => $input['category'],
                ':type' => $input['type'],
                ':value' => $input['value'],
                ':description' => $input['description'] ?? '',
                ':is_active' => $input['is_active'] ?? true
            ];

            $this->db->prepare($sql)->execute($params);

            $rule = $this->getCostRuleById($input['id']);
            Response::success($rule, 'Cost rule created successfully', 201);

        } catch (Exception $e) {
            if (strpos($e->getMessage(), 'Duplicate entry') !== false) {
                Response::error('Cost rule ID already exists', 409);
            } else {
                Response::error('Failed to create cost rule: ' . $e->getMessage(), 500);
            }
        }
    }

    /**
     * Update cost rule
     */
    public function updateCostRule($id) {
        try {
            $input = json_decode(file_get_contents('php://input'), true);
            
            $allowedFields = ['name', 'category', 'type', 'value', 'description', 'is_active'];
            $updateFields = [];
            $params = [':id' => $id];

            foreach ($allowedFields as $field) {
                if (isset($input[$field])) {
                    $updateFields[] = "$field = :$field";
                    $params[":$field"] = $input[$field];
                }
            }

            if (empty($updateFields)) {
                Response::error('No valid fields to update', 400);
                return;
            }

            $sql = "UPDATE cost_rules SET " . implode(', ', $updateFields) . " WHERE id = :id";
            $result = $this->db->prepare($sql)->execute($params);

            if ($result) {
                $rule = $this->getCostRuleById($id);
                Response::success($rule, 'Cost rule updated successfully');
            } else {
                Response::error('Cost rule not found', 404);
            }

        } catch (Exception $e) {
            Response::error('Failed to update cost rule: ' . $e->getMessage(), 500);
        }
    }

    /**
     * Delete cost rule
     */
    public function deleteCostRule($id) {
        try {
            $sql = "DELETE FROM cost_rules WHERE id = :id";
            $stmt = $this->db->prepare($sql);
            $result = $stmt->execute([':id' => $id]);

            if ($stmt->rowCount() > 0) {
                Response::success(null, 'Cost rule deleted successfully');
            } else {
                Response::error('Cost rule not found', 404);
            }

        } catch (Exception $e) {
            Response::error('Failed to delete cost rule: ' . $e->getMessage(), 500);
        }
    }

    /**
     * Get form fields
     */
    public function getFormFields() {
        try {
            $fields = $this->getFormFieldsData();
            Response::success($fields);

        } catch (Exception $e) {
            Response::error('Failed to fetch form fields: ' . $e->getMessage(), 500);
        }
    }

    /**
     * Create form field
     */
    public function createFormField() {
        try {
            $input = json_decode(file_get_contents('php://input'), true);
            
            $validator = new Validator();
            $rules = [
                'id' => 'required|string|max:50',
                'type' => 'required|in:text,select,number,textarea,checkbox,radio,file',
                'label' => 'required|string|max:200',
                'step_number' => 'required|integer|min:1|max:10',
                'display_order' => 'required|integer|min:1'
            ];

            if (!$validator->validate($input, $rules)) {
                Response::error('Validation failed', 400, $validator->getErrors());
                return;
            }

            $sql = "INSERT INTO form_fields (id, type, label, placeholder, required, options, validation, step_number, category, display_order, is_visible) 
                    VALUES (:id, :type, :label, :placeholder, :required, :options, :validation, :step_number, :category, :display_order, :is_visible)";
            
            $params = [
                ':id' => $input['id'],
                ':type' => $input['type'],
                ':label' => $input['label'],
                ':placeholder' => $input['placeholder'] ?? null,
                ':required' => $input['required'] ?? false,
                ':options' => isset($input['options']) ? json_encode($input['options']) : null,
                ':validation' => isset($input['validation']) ? json_encode($input['validation']) : null,
                ':step_number' => $input['step_number'],
                ':category' => $input['category'] ?? null,
                ':display_order' => $input['display_order'],
                ':is_visible' => $input['is_visible'] ?? true
            ];

            $this->db->prepare($sql)->execute($params);

            $field = $this->getFormFieldById($input['id']);
            Response::success($field, 'Form field created successfully', 201);

        } catch (Exception $e) {
            if (strpos($e->getMessage(), 'Duplicate entry') !== false) {
                Response::error('Form field ID already exists', 409);
            } else {
                Response::error('Failed to create form field: ' . $e->getMessage(), 500);
            }
        }
    }

    /**
     * Update form field
     */
    public function updateFormField($id) {
        try {
            $input = json_decode(file_get_contents('php://input'), true);
            
            $allowedFields = ['type', 'label', 'placeholder', 'required', 'options', 'validation', 'step_number', 'category', 'display_order', 'is_visible'];
            $updateFields = [];
            $params = [':id' => $id];

            foreach ($allowedFields as $field) {
                if (isset($input[$field])) {
                    if (in_array($field, ['options', 'validation']) && is_array($input[$field])) {
                        $updateFields[] = "$field = :$field";
                        $params[":$field"] = json_encode($input[$field]);
                    } else {
                        $updateFields[] = "$field = :$field";
                        $params[":$field"] = $input[$field];
                    }
                }
            }

            if (empty($updateFields)) {
                Response::error('No valid fields to update', 400);
                return;
            }

            $sql = "UPDATE form_fields SET " . implode(', ', $updateFields) . " WHERE id = :id";
            $result = $this->db->prepare($sql)->execute($params);

            if ($result) {
                $field = $this->getFormFieldById($id);
                Response::success($field, 'Form field updated successfully');
            } else {
                Response::error('Form field not found', 404);
            }

        } catch (Exception $e) {
            Response::error('Failed to update form field: ' . $e->getMessage(), 500);
        }
    }

    /**
     * Delete form field
     */
    public function deleteFormField($id) {
        try {
            $sql = "DELETE FROM form_fields WHERE id = :id";
            $stmt = $this->db->prepare($sql);
            $result = $stmt->execute([':id' => $id]);

            if ($stmt->rowCount() > 0) {
                Response::success(null, 'Form field deleted successfully');
            } else {
                Response::error('Form field not found', 404);
            }

        } catch (Exception $e) {
            Response::error('Failed to delete form field: ' . $e->getMessage(), 500);
        }
    }

    /**
     * Get PDF templates
     */
    public function getPdfTemplates() {
        try {
            $templates = $this->getPdfTemplatesData();
            Response::success($templates);

        } catch (Exception $e) {
            Response::error('Failed to fetch PDF templates: ' . $e->getMessage(), 500);
        }
    }

    /**
     * Create PDF template
     */
    public function createPdfTemplate() {
        try {
            $input = json_decode(file_get_contents('php://input'), true);
            
            $validator = new Validator();
            $rules = [
                'id' => 'required|string|max:50',
                'name' => 'required|string|max:100',
                'layout' => 'in:standard,modern,minimal'
            ];

            if (!$validator->validate($input, $rules)) {
                Response::error('Validation failed', 400, $validator->getErrors());
                return;
            }

            $sql = "INSERT INTO pdf_templates (id, name, header_logo, header_text, footer_text, colors, fonts, sections, layout, is_active) 
                    VALUES (:id, :name, :header_logo, :header_text, :footer_text, :colors, :fonts, :sections, :layout, :is_active)";
            
            $params = [
                ':id' => $input['id'],
                ':name' => $input['name'],
                ':header_logo' => $input['header_logo'] ?? null,
                ':header_text' => $input['header_text'] ?? null,
                ':footer_text' => $input['footer_text'] ?? null,
                ':colors' => isset($input['colors']) ? json_encode($input['colors']) : null,
                ':fonts' => isset($input['fonts']) ? json_encode($input['fonts']) : null,
                ':sections' => isset($input['sections']) ? json_encode($input['sections']) : null,
                ':layout' => $input['layout'] ?? 'standard',
                ':is_active' => $input['is_active'] ?? false
            ];

            $this->db->prepare($sql)->execute($params);

            $template = $this->getPdfTemplateById($input['id']);
            Response::success($template, 'PDF template created successfully', 201);

        } catch (Exception $e) {
            if (strpos($e->getMessage(), 'Duplicate entry') !== false) {
                Response::error('PDF template ID already exists', 409);
            } else {
                Response::error('Failed to create PDF template: ' . $e->getMessage(), 500);
            }
        }
    }

    /**
     * Update PDF template
     */
    public function updatePdfTemplate($id) {
        try {
            $input = json_decode(file_get_contents('php://input'), true);
            
            $allowedFields = ['name', 'header_logo', 'header_text', 'footer_text', 'colors', 'fonts', 'sections', 'layout', 'is_active'];
            $updateFields = [];
            $params = [':id' => $id];

            foreach ($allowedFields as $field) {
                if (isset($input[$field])) {
                    if (in_array($field, ['colors', 'fonts', 'sections']) && is_array($input[$field])) {
                        $updateFields[] = "$field = :$field";
                        $params[":$field"] = json_encode($input[$field]);
                    } else {
                        $updateFields[] = "$field = :$field";
                        $params[":$field"] = $input[$field];
                    }
                }
            }

            if (empty($updateFields)) {
                Response::error('No valid fields to update', 400);
                return;
            }

            $sql = "UPDATE pdf_templates SET " . implode(', ', $updateFields) . " WHERE id = :id";
            $result = $this->db->prepare($sql)->execute($params);

            if ($result) {
                $template = $this->getPdfTemplateById($id);
                Response::success($template, 'PDF template updated successfully');
            } else {
                Response::error('PDF template not found', 404);
            }

        } catch (Exception $e) {
            Response::error('Failed to update PDF template: ' . $e->getMessage(), 500);
        }
    }

    /**
     * Delete PDF template
     */
    public function deletePdfTemplate($id) {
        try {
            // Don't allow deletion of default template
            if ($id === 'default') {
                Response::error('Cannot delete default template', 400);
                return;
            }

            $sql = "DELETE FROM pdf_templates WHERE id = :id";
            $stmt = $this->db->prepare($sql);
            $result = $stmt->execute([':id' => $id]);

            if ($stmt->rowCount() > 0) {
                Response::success(null, 'PDF template deleted successfully');
            } else {
                Response::error('PDF template not found', 404);
            }

        } catch (Exception $e) {
            Response::error('Failed to delete PDF template: ' . $e->getMessage(), 500);
        }
    }

    // Private helper methods

    private function getCompanySettingsData() {
        $sql = "SELECT * FROM company_settings WHERE id = 1";
        return $this->db->query($sql)->fetch() ?: [];
    }

    private function getCostRulesData() {
        $sql = "SELECT * FROM cost_rules ORDER BY category, name";
        return $this->db->query($sql)->fetchAll();
    }

    private function getFormFieldsData() {
        $sql = "SELECT id, type, label, placeholder, required, 
                       JSON_UNQUOTE(options) as options,
                       JSON_UNQUOTE(validation) as validation,
                       step_number, category, display_order, is_visible, created_at, updated_at
                FROM form_fields ORDER BY step_number, display_order";
        $fields = $this->db->query($sql)->fetchAll();
        
        // Parse JSON fields
        foreach ($fields as &$field) {
            if ($field['options']) {
                $field['options'] = json_decode($field['options'], true);
            }
            if ($field['validation']) {
                $field['validation'] = json_decode($field['validation'], true);
            }
        }
        
        return $fields;
    }

    private function getPdfTemplatesData() {
        $sql = "SELECT id, name, header_logo, header_text, footer_text,
                       JSON_UNQUOTE(colors) as colors,
                       JSON_UNQUOTE(fonts) as fonts,
                       JSON_UNQUOTE(sections) as sections,
                       layout, is_active, created_at, updated_at
                FROM pdf_templates ORDER BY name";
        $templates = $this->db->query($sql)->fetchAll();
        
        // Parse JSON fields
        foreach ($templates as &$template) {
            if ($template['colors']) {
                $template['colors'] = json_decode($template['colors'], true);
            }
            if ($template['fonts']) {
                $template['fonts'] = json_decode($template['fonts'], true);
            }
            if ($template['sections']) {
                $template['sections'] = json_decode($template['sections'], true);
            }
        }
        
        return $templates;
    }

    private function getSystemSettingsData() {
        $sql = "SELECT setting_key, setting_value, setting_type FROM system_settings";
        $settings = $this->db->query($sql)->fetchAll();
        
        $result = [];
        foreach ($settings as $setting) {
            $value = $setting['setting_value'];
            
            // Convert value based on type
            switch ($setting['setting_type']) {
                case 'number':
                    $value = (float)$value;
                    break;
                case 'boolean':
                    $value = $value === 'true';
                    break;
                case 'json':
                    $value = json_decode($value, true);
                    break;
            }
            
            $result[$setting['setting_key']] = $value;
        }
        
        return $result;
    }

    private function getCostRuleById($id) {
        $sql = "SELECT * FROM cost_rules WHERE id = :id";
        $stmt = $this->db->prepare($sql);
        $stmt->execute([':id' => $id]);
        return $stmt->fetch();
    }

    private function getFormFieldById($id) {
        $sql = "SELECT * FROM form_fields WHERE id = :id";
        $stmt = $this->db->prepare($sql);
        $stmt->execute([':id' => $id]);
        $field = $stmt->fetch();
        
        if ($field) {
            if ($field['options']) {
                $field['options'] = json_decode($field['options'], true);
            }
            if ($field['validation']) {
                $field['validation'] = json_decode($field['validation'], true);
            }
        }
        
        return $field;
    }

    private function getPdfTemplateById($id) {
        $sql = "SELECT * FROM pdf_templates WHERE id = :id";
        $stmt = $this->db->prepare($sql);
        $stmt->execute([':id' => $id]);
        $template = $stmt->fetch();
        
        if ($template) {
            if ($template['colors']) {
                $template['colors'] = json_decode($template['colors'], true);
            }
            if ($template['fonts']) {
                $template['fonts'] = json_decode($template['fonts'], true);
            }
            if ($template['sections']) {
                $template['sections'] = json_decode($template['sections'], true);
            }
        }
        
        return $template;
    }
}

?>