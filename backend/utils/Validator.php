<?php
/**
 * Validator Utility Class
 * 
 * Provides validation functionality for API inputs.
 */

class Validator {
    private $errors = [];
    
    /**
     * Validate data against rules
     */
    public function validate($data, $rules) {
        $this->errors = [];
        
        foreach ($rules as $field => $ruleString) {
            $fieldRules = explode('|', $ruleString);
            $value = $data[$field] ?? null;
            
            foreach ($fieldRules as $rule) {
                $this->applyRule($field, $value, $rule, $data);
            }
        }
        
        return empty($this->errors);
    }
    
    /**
     * Get validation errors
     */
    public function getErrors() {
        return $this->errors;
    }
    
    /**
     * Apply individual validation rule
     */
    private function applyRule($field, $value, $rule, $allData) {
        $ruleParts = explode(':', $rule);
        $ruleName = $ruleParts[0];
        $ruleValue = $ruleParts[1] ?? null;
        
        switch ($ruleName) {
            case 'required':
                if (empty($value) && $value !== '0' && $value !== 0) {
                    $this->addError($field, "The {$field} field is required.");
                }
                break;
                
            case 'string':
                if (!is_string($value) && $value !== null) {
                    $this->addError($field, "The {$field} field must be a string.");
                }
                break;
                
            case 'integer':
                if (!is_numeric($value) || (int)$value != $value) {
                    $this->addError($field, "The {$field} field must be an integer.");
                }
                break;
                
            case 'numeric':
                if (!is_numeric($value)) {
                    $this->addError($field, "The {$field} field must be numeric.");
                }
                break;
                
            case 'email':
                if (!filter_var($value, FILTER_VALIDATE_EMAIL)) {
                    $this->addError($field, "The {$field} field must be a valid email address.");
                }
                break;
                
            case 'min':
                if (is_string($value) && strlen($value) < $ruleValue) {
                    $this->addError($field, "The {$field} field must be at least {$ruleValue} characters.");
                } elseif (is_numeric($value) && $value < $ruleValue) {
                    $this->addError($field, "The {$field} field must be at least {$ruleValue}.");
                }
                break;
                
            case 'max':
                if (is_string($value) && strlen($value) > $ruleValue) {
                    $this->addError($field, "The {$field} field must not exceed {$ruleValue} characters.");
                } elseif (is_numeric($value) && $value > $ruleValue) {
                    $this->addError($field, "The {$field} field must not exceed {$ruleValue}.");
                }
                break;
                
            case 'in':
                $allowedValues = explode(',', $ruleValue);
                if (!in_array($value, $allowedValues)) {
                    $allowedStr = implode(', ', $allowedValues);
                    $this->addError($field, "The {$field} field must be one of: {$allowedStr}.");
                }
                break;
                
            case 'array':
                if (!is_array($value)) {
                    $this->addError($field, "The {$field} field must be an array.");
                }
                break;
                
            case 'url':
                if (!filter_var($value, FILTER_VALIDATE_URL)) {
                    $this->addError($field, "The {$field} field must be a valid URL.");
                }
                break;
                
            case 'date':
                if (!strtotime($value)) {
                    $this->addError($field, "The {$field} field must be a valid date.");
                }
                break;
                
            case 'boolean':
                if (!is_bool($value) && !in_array($value, [0, 1, '0', '1', 'true', 'false'])) {
                    $this->addError($field, "The {$field} field must be a boolean value.");
                }
                break;
                
            case 'unique':
                // This would require database checking - implement as needed
                break;
                
            case 'exists':
                // This would require database checking - implement as needed
                break;
        }
    }
    
    /**
     * Add validation error
     */
    private function addError($field, $message) {
        if (!isset($this->errors[$field])) {
            $this->errors[$field] = [];
        }
        $this->errors[$field][] = $message;
    }
    
    /**
     * Sanitize input data
     */
    public static function sanitize($data) {
        if (is_array($data)) {
            return array_map([self::class, 'sanitize'], $data);
        }
        
        return htmlspecialchars(trim($data), ENT_QUOTES, 'UTF-8');
    }
    
    /**
     * Validate file upload
     */
    public static function validateFile($file, $allowedTypes = [], $maxSize = null) {
        $errors = [];
        
        if ($file['error'] !== UPLOAD_ERR_OK) {
            $errors[] = 'File upload error.';
            return $errors;
        }
        
        if ($maxSize && $file['size'] > $maxSize) {
            $maxSizeMB = $maxSize / (1024 * 1024);
            $errors[] = "File size must not exceed {$maxSizeMB}MB.";
        }
        
        if (!empty($allowedTypes)) {
            $extension = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
            if (!in_array($extension, $allowedTypes)) {
                $allowedStr = implode(', ', $allowedTypes);
                $errors[] = "File type must be one of: {$allowedStr}.";
            }
        }
        
        return $errors;
    }
}

?>