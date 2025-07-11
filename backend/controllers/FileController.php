<?php
/**
 * File Controller
 * 
 * Handles file upload, download, and management operations.
 */

require_once '../utils/Response.php';

class FileController {
    private $db;
    private $uploadPath;
    private $allowedTypes;
    private $maxFileSize;
    
    public function __construct($database) {
        $this->db = $database;
        $this->uploadPath = UPLOAD_PATH;
        $this->allowedTypes = UPLOAD_ALLOWED_TYPES;
        $this->maxFileSize = UPLOAD_MAX_SIZE;
    }

    /**
     * Upload file
     */
    public function uploadFile() {
        try {
            if (!isset($_FILES['file'])) {
                Response::error('No file uploaded', 400);
                return;
            }

            $file = $_FILES['file'];
            $quotationId = $_POST['quotation_id'] ?? null;
            $fileType = $_POST['file_type'] ?? 'general';

            // Validate file
            $validation = $this->validateFile($file);
            if (!$validation['valid']) {
                Response::error($validation['error'], 400);
                return;
            }

            // Generate unique filename
            $extension = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
            $storedFilename = uniqid() . '_' . time() . '.' . $extension;
            $filePath = $this->uploadPath . $storedFilename;

            // Create upload directory if it doesn't exist
            if (!file_exists($this->uploadPath)) {
                mkdir($this->uploadPath, 0755, true);
            }

            // Move uploaded file
            if (!move_uploaded_file($file['tmp_name'], $filePath)) {
                Response::error('Failed to save file', 500);
                return;
            }

            // Save file info to database
            $sql = "INSERT INTO quotation_files (quotation_id, file_type, original_filename, stored_filename, file_path, file_size, mime_type) 
                    VALUES (:quotation_id, :file_type, :original_filename, :stored_filename, :file_path, :file_size, :mime_type)";
            
            $params = [
                ':quotation_id' => $quotationId,
                ':file_type' => $fileType,
                ':original_filename' => $file['name'],
                ':stored_filename' => $storedFilename,
                ':file_path' => $filePath,
                ':file_size' => $file['size'],
                ':mime_type' => $file['type']
            ];

            $this->db->prepare($sql)->execute($params);
            $fileId = $this->db->lastInsertId();

            // Return file info
            $fileInfo = [
                'id' => $fileId,
                'original_filename' => $file['name'],
                'stored_filename' => $storedFilename,
                'file_size' => $file['size'],
                'mime_type' => $file['type'],
                'file_type' => $fileType,
                'upload_url' => '/api/v1/files/' . $fileId
            ];

            Response::success($fileInfo, 'File uploaded successfully', 201);

        } catch (Exception $e) {
            Response::error('File upload failed: ' . $e->getMessage(), 500);
        }
    }

    /**
     * Download file
     */
    public function downloadFile($id) {
        try {
            $sql = "SELECT * FROM quotation_files WHERE id = :id";
            $stmt = $this->db->prepare($sql);
            $stmt->execute([':id' => $id]);
            $file = $stmt->fetch();

            if (!$file) {
                Response::error('File not found', 404);
                return;
            }

            if (!file_exists($file['file_path'])) {
                Response::error('File not found on disk', 404);
                return;
            }

            // Set headers for file download
            header('Content-Type: ' . $file['mime_type']);
            header('Content-Disposition: attachment; filename="' . $file['original_filename'] . '"');
            header('Content-Length: ' . $file['file_size']);
            header('Cache-Control: no-cache, must-revalidate');

            // Output file
            readfile($file['file_path']);
            exit;

        } catch (Exception $e) {
            Response::error('File download failed: ' . $e->getMessage(), 500);
        }
    }

    /**
     * List files
     */
    public function listFiles() {
        try {
            $quotationId = $_GET['quotation_id'] ?? null;
            $fileType = $_GET['file_type'] ?? null;

            $sql = "SELECT id, quotation_id, file_type, original_filename, file_size, mime_type, uploaded_at 
                    FROM quotation_files WHERE 1=1";
            $params = [];

            if ($quotationId) {
                $sql .= " AND quotation_id = :quotation_id";
                $params[':quotation_id'] = $quotationId;
            }

            if ($fileType) {
                $sql .= " AND file_type = :file_type";
                $params[':file_type'] = $fileType;
            }

            $sql .= " ORDER BY uploaded_at DESC";

            $stmt = $this->db->prepare($sql);
            $stmt->execute($params);
            $files = $stmt->fetchAll();

            // Add download URLs
            foreach ($files as &$file) {
                $file['download_url'] = '/api/v1/files/' . $file['id'];
            }

            Response::success($files);

        } catch (Exception $e) {
            Response::error('Failed to list files: ' . $e->getMessage(), 500);
        }
    }

    /**
     * Delete file
     */
    public function deleteFile($id) {
        try {
            $sql = "SELECT * FROM quotation_files WHERE id = :id";
            $stmt = $this->db->prepare($sql);
            $stmt->execute([':id' => $id]);
            $file = $stmt->fetch();

            if (!$file) {
                Response::error('File not found', 404);
                return;
            }

            // Delete file from disk
            if (file_exists($file['file_path'])) {
                unlink($file['file_path']);
            }

            // Delete from database
            $deleteSql = "DELETE FROM quotation_files WHERE id = :id";
            $this->db->prepare($deleteSql)->execute([':id' => $id]);

            Response::success(null, 'File deleted successfully');

        } catch (Exception $e) {
            Response::error('File deletion failed: ' . $e->getMessage(), 500);
        }
    }

    /**
     * Validate uploaded file
     */
    private function validateFile($file) {
        // Check for upload errors
        if ($file['error'] !== UPLOAD_ERR_OK) {
            return ['valid' => false, 'error' => 'File upload error: ' . $file['error']];
        }

        // Check file size
        if ($file['size'] > $this->maxFileSize) {
            $maxSizeMB = $this->maxFileSize / (1024 * 1024);
            return ['valid' => false, 'error' => "File size exceeds maximum allowed size of {$maxSizeMB}MB"];
        }

        // Check file type
        $extension = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
        if (!in_array($extension, $this->allowedTypes)) {
            $allowedTypesStr = implode(', ', $this->allowedTypes);
            return ['valid' => false, 'error' => "File type not allowed. Allowed types: {$allowedTypesStr}"];
        }

        // Check MIME type (basic validation)
        $allowedMimeTypes = [
            'jpg' => 'image/jpeg',
            'jpeg' => 'image/jpeg',
            'png' => 'image/png',
            'gif' => 'image/gif',
            'pdf' => 'application/pdf'
        ];

        if (isset($allowedMimeTypes[$extension])) {
            $expectedMimeType = $allowedMimeTypes[$extension];
            if ($file['type'] !== $expectedMimeType) {
                return ['valid' => false, 'error' => 'File MIME type does not match extension'];
            }
        }

        return ['valid' => true];
    }
}

?>