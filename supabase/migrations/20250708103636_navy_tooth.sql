-- =====================================================
-- Luxone Quotation System Database
-- Complete SQL structure for localhost/phpMyAdmin
-- =====================================================

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

-- Create Database
CREATE DATABASE IF NOT EXISTS `luxone_quotation_system` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `luxone_quotation_system`;

-- =====================================================
-- Table: admin_users
-- =====================================================
CREATE TABLE `admin_users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `email` varchar(100) DEFAULT NULL,
  `full_name` varchar(100) DEFAULT NULL,
  `role` enum('admin','manager','viewer') DEFAULT 'admin',
  `is_active` tinyint(1) DEFAULT 1,
  `last_login` timestamp NULL DEFAULT NULL,
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert default admin user
INSERT INTO `admin_users` (`username`, `password`, `email`, `full_name`, `role`) VALUES
('admin', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin@theluxone.com', 'System Administrator', 'admin');

-- =====================================================
-- Table: company_settings
-- =====================================================
CREATE TABLE `company_settings` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `company_name` varchar(100) DEFAULT 'Luxone',
  `website` varchar(100) DEFAULT 'www.theluxone.com',
  `address` text DEFAULT 'Dubai, UAE\nPremium Worktop Solutions',
  `whatsapp_india` varchar(20) DEFAULT '+919648555355',
  `whatsapp_uae` varchar(20) DEFAULT '+971585815601',
  `admin_email` varchar(100) DEFAULT 'admin@theluxone.com',
  `price_per_sqft` decimal(10,2) DEFAULT 150.00,
  `aed_to_usd_rate` decimal(10,4) DEFAULT 3.6700,
  `vat_rate` decimal(5,2) DEFAULT 5.00,
  `consultant_name` varchar(100) DEFAULT 'Ahmed Al-Rashid',
  `consultant_phone` varchar(20) DEFAULT '+971501234567',
  `consultant_email` varchar(100) DEFAULT 'ahmed@theluxone.com',
  `logo_url` varchar(255) DEFAULT 'https://demo.theluxone.com/wp-content/uploads/2025/06/cropped-Luxone_HQ-1.png',
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert default company settings
INSERT INTO `company_settings` (`id`) VALUES (1);

-- =====================================================
-- Table: form_fields
-- =====================================================
CREATE TABLE `form_fields` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `field_id` varchar(50) NOT NULL,
  `field_type` enum('text','select','radio','checkbox','textarea','number','file') NOT NULL,
  `label` varchar(255) NOT NULL,
  `placeholder` varchar(255) DEFAULT NULL,
  `is_required` tinyint(1) DEFAULT 0,
  `options` json DEFAULT NULL,
  `validation_rules` json DEFAULT NULL,
  `step_number` int(11) DEFAULT 1,
  `category` varchar(50) DEFAULT NULL,
  `display_order` int(11) DEFAULT 0,
  `is_visible` tinyint(1) DEFAULT 1,
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `field_id` (`field_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert default form fields
INSERT INTO `form_fields` (`field_id`, `field_type`, `label`, `is_required`, `options`, `step_number`, `category`, `display_order`, `is_visible`) VALUES
('serviceLevel', 'radio', 'Scope of Work', 1, '["Fabrication Only", "Fabrication & Delivery", "Fabrication, Delivery & Installation"]', 1, 'Service', 1, 1),
('materialSource', 'radio', 'Material Source', 1, '["By Luxone Own Material", "By Yourself", "Luxone Others"]', 2, 'Material', 2, 1),
('materialType', 'select', 'Material Type', 0, '["Luxone Quartz", "Luxone Porcelain"]', 2, 'Material', 3, 1),
('worktopLayout', 'radio', 'Worktop Layout', 1, '["U + Island", "U Shape", "L + Island", "L Shape", "Galley", "1 Piece", "Custom"]', 3, 'Layout', 4, 1),
('customEdge', 'radio', 'Custom Edge Required', 0, '["YES", "NO"]', 5, 'Design', 5, 1),
('sinkCutOut', 'select', 'Sink Cut Out', 0, '["0", "1", "2"]', 5, 'Design', 6, 1),
('hobCutOut', 'select', 'Hob Cut Out', 0, '["0", "1", "2"]', 5, 'Design', 7, 1),
('underMountedSink', 'radio', 'Under Mounted Sink', 0, '["YES", "NO"]', 5, 'Design', 8, 1),
('steelFrame', 'radio', 'Steel Frame', 0, '["YES", "NO"]', 5, 'Design', 9, 1),
('timeline', 'radio', 'Project Timeline', 1, '["ASAP to 2 Weeks", "3 to 6 Weeks", "6 Weeks or more"]', 6, 'Timeline', 10, 1),
('sinkOption', 'select', 'Sink Options', 1, '["No thanks", "I will supply my own sink", "Stainless Steel - 1 Full Bowl", "Stainless Steel - 1 + 1/2 Bowl", "Stainless Steel - 2 Bowls"]', 7, 'Sink', 11, 1),
('projectType', 'select', 'Project Type & Application', 1, '["Kitchen - Ready for worktops now / ASAP", "Kitchen - Under renovation", "Kitchen - Planning stage", "Bathroom - Ready for worktops now / ASAP", "Bathroom - Under renovation", "Bathroom - Planning stage", "Commercial - Office space", "Commercial - Restaurant/Hotel", "Commercial - Retail", "Residential - New construction", "Residential - Renovation", "Other - Please specify in comments"]', 8, 'Project', 12, 1),
('name', 'text', 'Your Name', 1, NULL, 9, 'Contact', 13, 1),
('email', 'text', 'Email Address', 1, NULL, 9, 'Contact', 14, 1),
('contactNumber', 'text', 'Contact Number', 1, NULL, 9, 'Contact', 15, 1),
('location', 'select', 'Location', 1, '["Dubai", "Abu Dhabi", "Sharjah", "Ajman", "Umm Al Quwain", "Ras Al Khaimah", "Fujairah"]', 9, 'Contact', 16, 1),
('additionalComments', 'textarea', 'Additional Comments or Questions', 0, NULL, 9, 'Contact', 17, 1);

-- =====================================================
-- Table: pdf_templates
-- =====================================================
CREATE TABLE `pdf_templates` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `template_id` varchar(50) NOT NULL,
  `name` varchar(100) NOT NULL,
  `header_logo` varchar(255) DEFAULT 'https://demo.theluxone.com/wp-content/uploads/2025/06/cropped-Luxone_HQ-1.png',
  `header_text` varchar(255) DEFAULT 'Luxone - Premium Worktop Solutions',
  `footer_text` text DEFAULT '© 2025 Luxone - Premium Worktop Solutions | UAE | www.theluxone.com',
  `primary_color` varchar(7) DEFAULT '#3B82F6',
  `secondary_color` varchar(7) DEFAULT '#8B5CF6',
  `accent_color` varchar(7) DEFAULT '#F59E0B',
  `heading_font` varchar(100) DEFAULT 'Arial, sans-serif',
  `body_font` varchar(100) DEFAULT 'Arial, sans-serif',
  `show_client_info` tinyint(1) DEFAULT 1,
  `show_project_specs` tinyint(1) DEFAULT 1,
  `show_pricing` tinyint(1) DEFAULT 1,
  `show_terms` tinyint(1) DEFAULT 1,
  `custom_sections` json DEFAULT NULL,
  `layout_style` enum('standard','modern','minimal') DEFAULT 'standard',
  `is_active` tinyint(1) DEFAULT 1,
  `is_default` tinyint(1) DEFAULT 0,
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `template_id` (`template_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert default PDF template
INSERT INTO `pdf_templates` (`template_id`, `name`, `is_default`) VALUES
('default', 'Default Template', 1);

-- =====================================================
-- Table: quotations
-- =====================================================
CREATE TABLE `quotations` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `quote_id` varchar(50) NOT NULL,
  `customer_name` varchar(100) NOT NULL,
  `customer_email` varchar(100) DEFAULT NULL,
  `customer_phone` varchar(20) NOT NULL,
  `customer_location` varchar(50) DEFAULT NULL,
  `service_level` varchar(50) DEFAULT NULL,
  `material_source` varchar(50) DEFAULT NULL,
  `material_type` varchar(50) DEFAULT NULL,
  `material_color` varchar(100) DEFAULT NULL,
  `worktop_layout` varchar(50) DEFAULT NULL,
  `project_type` varchar(100) DEFAULT NULL,
  `timeline` varchar(50) DEFAULT NULL,
  `sink_option` varchar(100) DEFAULT NULL,
  `additional_comments` text DEFAULT NULL,
  `quote_data` json NOT NULL,
  `pricing_data` json DEFAULT NULL,
  `total_amount` decimal(12,2) DEFAULT NULL,
  `currency` varchar(3) DEFAULT 'AED',
  `status` enum('pending','reviewed','approved','rejected','completed') DEFAULT 'pending',
  `pdf_generated` tinyint(1) DEFAULT 0,
  `pdf_path` varchar(255) DEFAULT NULL,
  `admin_notes` text DEFAULT NULL,
  `follow_up_date` date DEFAULT NULL,
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `quote_id` (`quote_id`),
  KEY `idx_customer_email` (`customer_email`),
  KEY `idx_status` (`status`),
  KEY `idx_created_at` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- Table: quotation_pieces
-- =====================================================
CREATE TABLE `quotation_pieces` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `quotation_id` int(11) NOT NULL,
  `piece_letter` varchar(5) NOT NULL,
  `length_mm` decimal(10,2) DEFAULT NULL,
  `width_mm` decimal(10,2) DEFAULT NULL,
  `thickness_mm` decimal(10,2) DEFAULT NULL,
  `area_sqm` decimal(10,4) DEFAULT NULL,
  `notes` text DEFAULT NULL,
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `quotation_id` (`quotation_id`),
  CONSTRAINT `quotation_pieces_ibfk_1` FOREIGN KEY (`quotation_id`) REFERENCES `quotations` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- Table: quotation_files
-- =====================================================
CREATE TABLE `quotation_files` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `quotation_id` int(11) NOT NULL,
  `file_type` enum('slab_photo','plan_sketch','pdf_quote','other') NOT NULL,
  `original_filename` varchar(255) NOT NULL,
  `stored_filename` varchar(255) NOT NULL,
  `file_path` varchar(500) NOT NULL,
  `file_size` int(11) DEFAULT NULL,
  `mime_type` varchar(100) DEFAULT NULL,
  `uploaded_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `quotation_id` (`quotation_id`),
  CONSTRAINT `quotation_files_ibfk_1` FOREIGN KEY (`quotation_id`) REFERENCES `quotations` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- Table: material_options
-- =====================================================
CREATE TABLE `material_options` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `category` enum('quartz','porcelain','other') NOT NULL,
  `brand` varchar(100) DEFAULT NULL,
  `name` varchar(100) NOT NULL,
  `color_code` varchar(50) DEFAULT NULL,
  `price_per_sqft` decimal(10,2) DEFAULT NULL,
  `slab_size` varchar(50) DEFAULT NULL,
  `thickness_options` json DEFAULT NULL,
  `finish_options` json DEFAULT NULL,
  `is_available` tinyint(1) DEFAULT 1,
  `display_order` int(11) DEFAULT 0,
  `image_url` varchar(255) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_category` (`category`),
  KEY `idx_available` (`is_available`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert default material options
INSERT INTO `material_options` (`category`, `brand`, `name`, `price_per_sqft`, `slab_size`, `thickness_options`, `finish_options`, `display_order`) VALUES
('quartz', 'Luxone', 'AMBIENCE TOUCH', 150.00, '3200x1600mm', '["20mm", "30mm"]', '["Polished", "Honed"]', 1),
('quartz', 'Luxone', 'GOLDEN TRACK', 150.00, '3200x1600mm', '["20mm", "30mm"]', '["Polished", "Honed"]', 2),
('quartz', 'Luxone', 'GREY LEATHER', 150.00, '3200x1600mm', '["20mm", "30mm"]', '["Polished", "Honed"]', 3),
('quartz', 'Luxone', 'GOLDEN RIVER', 150.00, '3200x1600mm', '["20mm", "30mm"]', '["Polished", "Honed"]', 4),
('quartz', 'Luxone', 'IMPERIAL WHITE', 150.00, '3200x1600mm', '["20mm", "30mm"]', '["Polished", "Honed"]', 5),
('porcelain', 'Luxone', 'ARCTIC WHITE', 140.00, '3200x1600mm', '["12mm", "20mm"]', '["Polished", "Matt"]', 1),
('porcelain', 'Luxone', 'CHARCOAL GREY', 140.00, '3200x1600mm', '["12mm", "20mm"]', '["Polished", "Matt"]', 2),
('porcelain', 'Luxone', 'CREAM MARBLE', 140.00, '3200x1600mm', '["12mm", "20mm"]', '["Polished", "Matt"]', 3);

-- =====================================================
-- Table: sink_options
-- =====================================================
CREATE TABLE `sink_options` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `category` varchar(50) NOT NULL,
  `name` varchar(100) NOT NULL,
  `model_number` varchar(50) DEFAULT NULL,
  `material` varchar(50) DEFAULT NULL,
  `bowl_configuration` varchar(50) DEFAULT NULL,
  `price` decimal(10,2) DEFAULT NULL,
  `dimensions` varchar(100) DEFAULT NULL,
  `is_available` tinyint(1) DEFAULT 1,
  `display_order` int(11) DEFAULT 0,
  `image_url` varchar(255) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_category` (`category`),
  KEY `idx_available` (`is_available`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert default sink options
INSERT INTO `sink_options` (`category`, `name`, `model_number`, `material`, `bowl_configuration`, `price`, `display_order`) VALUES
('No Sink', 'No thanks', NULL, NULL, NULL, 0.00, 1),
('No Sink', 'I will supply my own sink', NULL, NULL, NULL, 0.00, 2),
('Stainless Steel', 'Stainless Steel - 1 Full Bowl', 'SS-1B', 'Stainless Steel', '1 Bowl', 250.00, 3),
('Stainless Steel', 'Stainless Steel - 1 + 1/2 Bowl', 'SS-1.5B', 'Stainless Steel', '1.5 Bowl', 320.00, 4),
('Stainless Steel', 'Stainless Steel - 2 Bowls', 'SS-2B', 'Stainless Steel', '2 Bowl', 380.00, 5),
('Corian', 'Tasty 9610 Corian Sink', '9610', 'Corian', '1 Bowl', 450.00, 6),
('Corian', 'Rounded 9310 Corian Sink', '9310', 'Corian', '1 Bowl', 420.00, 7),
('Corian', 'Salty 9410 Corian Sink', '9410', 'Corian', '1 Bowl', 440.00, 8);

-- =====================================================
-- Table: pricing_rules
-- =====================================================
CREATE TABLE `pricing_rules` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `rule_name` varchar(100) NOT NULL,
  `rule_type` enum('base','addon','multiplier','fixed') NOT NULL,
  `category` varchar(50) DEFAULT NULL,
  `condition_field` varchar(50) DEFAULT NULL,
  `condition_value` varchar(100) DEFAULT NULL,
  `price_value` decimal(10,2) NOT NULL,
  `unit` varchar(20) DEFAULT 'AED',
  `is_active` tinyint(1) DEFAULT 1,
  `description` text DEFAULT NULL,
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_rule_type` (`rule_type`),
  KEY `idx_active` (`is_active`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert default pricing rules
INSERT INTO `pricing_rules` (`rule_name`, `rule_type`, `category`, `condition_field`, `condition_value`, `price_value`, `unit`, `description`) VALUES
('Base Material Cost', 'base', 'material', NULL, NULL, 150.00, 'per_sqft', 'Base price per square foot for materials'),
('Cutting Cost', 'addon', 'fabrication', NULL, NULL, 20.00, 'per_sqm', 'Cost for cutting per square meter'),
('Top Polishing', 'addon', 'fabrication', NULL, NULL, 50.00, 'per_sqm', 'Top polishing cost per square meter'),
('Edge Polishing', 'addon', 'fabrication', NULL, NULL, 30.00, 'per_sqm', 'Edge polishing cost per square meter'),
('Installation Cost', 'addon', 'installation', NULL, NULL, 140.00, 'per_sqm', 'Installation cost per square meter (2x70)'),
('Custom Edge', 'addon', 'design', 'customEdge', 'YES', 120.00, 'fixed', 'Custom edge work'),
('Sink Cut Out', 'addon', 'design', 'sinkCutOut', '1', 40.00, 'per_piece', 'Single sink cut out'),
('Hob Cut Out', 'addon', 'design', 'hobCutOut', '1', 40.00, 'per_piece', 'Single hob cut out'),
('Under Mounted Sink', 'addon', 'design', 'underMountedSink', 'YES', 340.00, 'fixed', 'Under mounted sink installation'),
('Drain Grooves', 'addon', 'design', 'drainGrooves', '1', 250.00, 'per_set', 'Drain grooves per set'),
('Tap Holes', 'addon', 'design', 'tapHoles', '1', 35.00, 'per_hole', 'Tap hole drilling'),
('Steel Frame', 'addon', 'design', 'steelFrame', 'YES', 300.00, 'fixed', 'Steel frame support'),
('Dubai Delivery', 'addon', 'delivery', 'location', 'Dubai', 500.00, 'fixed', 'Delivery within Dubai'),
('UAE Delivery', 'addon', 'delivery', 'location', 'other_uae', 800.00, 'fixed', 'Delivery to other UAE emirates'),
('Margin', 'multiplier', 'business', NULL, NULL, 20.00, 'percent', '20% business margin'),
('VAT', 'multiplier', 'tax', NULL, NULL, 5.00, 'percent', '5% VAT');

-- =====================================================
-- Table: activity_logs
-- =====================================================
CREATE TABLE `activity_logs` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) DEFAULT NULL,
  `action` varchar(100) NOT NULL,
  `table_name` varchar(50) DEFAULT NULL,
  `record_id` int(11) DEFAULT NULL,
  `old_values` json DEFAULT NULL,
  `new_values` json DEFAULT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `user_agent` varchar(500) DEFAULT NULL,
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `idx_action` (`action`),
  KEY `idx_created_at` (`created_at`),
  CONSTRAINT `activity_logs_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `admin_users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- Table: email_templates
-- =====================================================
CREATE TABLE `email_templates` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `template_name` varchar(100) NOT NULL,
  `template_type` enum('quote_confirmation','admin_notification','follow_up','reminder') NOT NULL,
  `subject` varchar(255) NOT NULL,
  `body_html` text NOT NULL,
  `body_text` text DEFAULT NULL,
  `variables` json DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_template_type` (`template_type`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert default email templates
INSERT INTO `email_templates` (`template_name`, `template_type`, `subject`, `body_html`, `variables`) VALUES
('Quote Confirmation', 'quote_confirmation', 'Your Luxone Quotation Request - {{quote_id}}', 
'<h2>Thank you for your quotation request!</h2>
<p>Dear {{customer_name}},</p>
<p>We have received your quotation request with ID: <strong>{{quote_id}}</strong></p>
<p>Our team will review your requirements and contact you within 24 hours.</p>
<p>Best regards,<br>Luxone Team</p>', 
'["quote_id", "customer_name", "customer_email", "total_amount"]'),

('Admin Notification', 'admin_notification', 'New Quote Request - {{quote_id}}', 
'<h2>New Quotation Request Received</h2>
<p>Quote ID: {{quote_id}}</p>
<p>Customer: {{customer_name}}</p>
<p>Email: {{customer_email}}</p>
<p>Phone: {{customer_phone}}</p>
<p>Total Amount: {{total_amount}} AED</p>
<p>Please review and follow up.</p>', 
'["quote_id", "customer_name", "customer_email", "customer_phone", "total_amount"]');

-- =====================================================
-- Table: system_settings
-- =====================================================
CREATE TABLE `system_settings` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `setting_key` varchar(100) NOT NULL,
  `setting_value` text DEFAULT NULL,
  `setting_type` enum('string','number','boolean','json') DEFAULT 'string',
  `description` text DEFAULT NULL,
  `is_public` tinyint(1) DEFAULT 0,
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `setting_key` (`setting_key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert default system settings
INSERT INTO `system_settings` (`setting_key`, `setting_value`, `setting_type`, `description`) VALUES
('site_maintenance', '0', 'boolean', 'Enable/disable site maintenance mode'),
('max_file_upload_size', '3145728', 'number', 'Maximum file upload size in bytes (3MB)'),
('allowed_file_types', '["jpg","jpeg","png","gif","pdf"]', 'json', 'Allowed file upload types'),
('quote_id_prefix', 'LUX', 'string', 'Prefix for quote ID generation'),
('quote_validity_days', '30', 'number', 'Number of days quote remains valid'),
('auto_email_notifications', '1', 'boolean', 'Enable automatic email notifications'),
('backup_retention_days', '90', 'number', 'Number of days to retain database backups');

-- =====================================================
-- Views for easier data access
-- =====================================================

-- View: quotation_summary
CREATE VIEW `quotation_summary` AS
SELECT 
    q.id,
    q.quote_id,
    q.customer_name,
    q.customer_email,
    q.customer_phone,
    q.customer_location,
    q.service_level,
    q.material_source,
    q.project_type,
    q.total_amount,
    q.status,
    q.created_at,
    COUNT(qp.id) as piece_count,
    SUM(qp.area_sqm) as total_area_sqm
FROM quotations q
LEFT JOIN quotation_pieces qp ON q.id = qp.quotation_id
GROUP BY q.id;

-- View: monthly_stats
CREATE VIEW `monthly_stats` AS
SELECT 
    YEAR(created_at) as year,
    MONTH(created_at) as month,
    COUNT(*) as total_quotes,
    SUM(total_amount) as total_value,
    AVG(total_amount) as avg_quote_value,
    COUNT(CASE WHEN status = 'approved' THEN 1 END) as approved_quotes,
    COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending_quotes
FROM quotations
GROUP BY YEAR(created_at), MONTH(created_at)
ORDER BY year DESC, month DESC;

-- =====================================================
-- Indexes for better performance
-- =====================================================
CREATE INDEX idx_quotations_customer_search ON quotations(customer_name, customer_email, customer_phone);
CREATE INDEX idx_quotations_date_range ON quotations(created_at, status);
CREATE INDEX idx_form_fields_step ON form_fields(step_number, display_order);
CREATE INDEX idx_material_options_search ON material_options(category, brand, is_available);

-- =====================================================
-- Stored Procedures
-- =====================================================

DELIMITER //

-- Procedure to generate quote ID
CREATE PROCEDURE GenerateQuoteId(OUT new_quote_id VARCHAR(50))
BEGIN
    DECLARE prefix VARCHAR(10);
    DECLARE year_part VARCHAR(4);
    DECLARE month_part VARCHAR(2);
    DECLARE random_part VARCHAR(10);
    
    SELECT setting_value INTO prefix FROM system_settings WHERE setting_key = 'quote_id_prefix';
    SET year_part = YEAR(NOW());
    SET month_part = LPAD(MONTH(NOW()), 2, '0');
    SET random_part = UPPER(SUBSTRING(MD5(RAND()), 1, 5));
    
    SET new_quote_id = CONCAT(prefix, '-', year_part, '-', month_part, '-', random_part);
END //

-- Procedure to calculate quote pricing
CREATE PROCEDURE CalculateQuotePricing(
    IN quote_id_param VARCHAR(50),
    OUT total_amount DECIMAL(12,2)
)
BEGIN
    DECLARE base_cost DECIMAL(12,2) DEFAULT 0;
    DECLARE addon_cost DECIMAL(12,2) DEFAULT 0;
    DECLARE subtotal DECIMAL(12,2) DEFAULT 0;
    DECLARE margin_amount DECIMAL(12,2) DEFAULT 0;
    DECLARE vat_amount DECIMAL(12,2) DEFAULT 0;
    
    -- Calculate base material cost
    SELECT COALESCE(SUM(qp.area_sqm * cs.price_per_sqft * 10.764), 0) INTO base_cost
    FROM quotations q
    JOIN quotation_pieces qp ON q.id = qp.quotation_id
    CROSS JOIN company_settings cs
    WHERE q.quote_id = quote_id_param;
    
    -- Add fabrication and installation costs
    SELECT base_cost + COALESCE(SUM(qp.area_sqm * 240), 0) INTO base_cost
    FROM quotations q
    JOIN quotation_pieces qp ON q.id = qp.quotation_id
    WHERE q.quote_id = quote_id_param;
    
    -- Calculate addon costs based on quote data
    -- This would need to be expanded based on specific quote options
    
    SET subtotal = base_cost + addon_cost;
    SET margin_amount = subtotal * 0.20;
    SET vat_amount = (subtotal + margin_amount) * 0.05;
    SET total_amount = subtotal + margin_amount + vat_amount;
    
    -- Update the quotation record
    UPDATE quotations 
    SET total_amount = total_amount 
    WHERE quote_id = quote_id_param;
END //

DELIMITER ;

-- =====================================================
-- Triggers for audit logging
-- =====================================================

DELIMITER //

CREATE TRIGGER quotations_after_insert
AFTER INSERT ON quotations
FOR EACH ROW
BEGIN
    INSERT INTO activity_logs (action, table_name, record_id, new_values)
    VALUES ('INSERT', 'quotations', NEW.id, JSON_OBJECT(
        'quote_id', NEW.quote_id,
        'customer_name', NEW.customer_name,
        'customer_email', NEW.customer_email,
        'total_amount', NEW.total_amount
    ));
END //

CREATE TRIGGER quotations_after_update
AFTER UPDATE ON quotations
FOR EACH ROW
BEGIN
    INSERT INTO activity_logs (action, table_name, record_id, old_values, new_values)
    VALUES ('UPDATE', 'quotations', NEW.id, 
        JSON_OBJECT('status', OLD.status, 'total_amount', OLD.total_amount),
        JSON_OBJECT('status', NEW.status, 'total_amount', NEW.total_amount)
    );
END //

DELIMITER ;

-- =====================================================
-- Sample Data for Testing
-- =====================================================

-- Insert sample quotations
INSERT INTO `quotations` (
    `quote_id`, `customer_name`, `customer_email`, `customer_phone`, 
    `customer_location`, `service_level`, `material_source`, `project_type`,
    `quote_data`, `total_amount`, `status`
) VALUES 
('LUX-2025-01-ABC12', 'John Smith', 'john.smith@email.com', '+971501234567', 
 'Dubai', 'fabrication-delivery-installation', 'luxone', 'Kitchen - Ready for worktops now / ASAP',
 '{"serviceLevel":"fabrication-delivery-installation","materialSource":"luxone","materialType":"quartz","materialColor":"IMPERIAL WHITE","worktopLayout":"l-shape","timeline":"3-6weeks"}',
 8500.00, 'pending'),

('LUX-2025-01-DEF34', 'Sarah Ahmed', 'sarah.ahmed@email.com', '+971509876543',
 'Abu Dhabi', 'fabrication-delivery', 'yourself', 'Kitchen - Under renovation',
 '{"serviceLevel":"fabrication-delivery","materialSource":"yourself","worktopLayout":"u-shape","timeline":"6weeks-plus"}',
 6200.00, 'reviewed'),

('LUX-2025-01-GHI56', 'Mohammed Ali', 'mohammed.ali@email.com', '+971507654321',
 'Sharjah', 'fabrication-delivery-installation', 'luxone-others', 'Bathroom - Planning stage',
 '{"serviceLevel":"fabrication-delivery-installation","materialSource":"luxone-others","brandSupplier":"Caesarstone","timeline":"asap-2weeks"}',
 12300.00, 'approved');

-- Insert sample quotation pieces
INSERT INTO `quotation_pieces` (`quotation_id`, `piece_letter`, `length_mm`, `width_mm`, `thickness_mm`, `area_sqm`) VALUES
(1, 'A', 2400.00, 600.00, 20.00, 1.44),
(1, 'B', 1800.00, 600.00, 20.00, 1.08),
(2, 'A', 3200.00, 600.00, 20.00, 1.92),
(2, 'B', 2000.00, 600.00, 20.00, 1.20),
(2, 'C', 1500.00, 600.00, 20.00, 0.90),
(3, 'A', 1200.00, 500.00, 20.00, 0.60);

COMMIT;

-- =====================================================
-- Database Setup Complete
-- =====================================================

-- Display setup completion message
SELECT 'Luxone Quotation System Database Setup Complete!' as message,
       'Import this file into phpMyAdmin to create the complete database structure' as instruction,
       'Default admin login: admin / luxone2025' as admin_access;