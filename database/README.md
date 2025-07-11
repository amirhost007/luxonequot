# Luxone Quotation System Database - Updated Schema

## 📋 Overview
Complete SQL database structure for the Luxone Quotation System with the new 8-step quotation flow, designer contact information, and comprehensive admin cost management.

## 🚀 Quick Setup

### 1. Import Database
1. Open **phpMyAdmin** in your browser (`http://localhost/phpmyadmin`)
2. Click **"Import"** tab
3. Choose the `luxone_quotation_system.sql` file
4. Click **"Go"** to import

### 2. Database Created
- **Database Name**: `luxone_quotation_system`
- **Character Set**: `utf8mb4_unicode_ci`
- **Tables**: 12 core tables + views and procedures

## 📊 Database Structure

### Core Tables

#### 1. **admin_users**
- Admin user management
- Default login: `admin` / `luxone2025`
- Role-based access control

#### 2. **company_settings**
- Company information
- Contact details
- Pricing configuration
- WhatsApp numbers

#### 3. **quotations** (Updated for 8 steps)
- Main quote records with new structure
- **NEW**: Designer contact fields
- **UPDATED**: Simplified sink options
- **REMOVED**: Detailed sink configurations
- JSON data storage for complex fields

#### 4. **quotation_pieces**
- Worktop piece dimensions (A-F)
- Area calculations (auto-calculated)
- Linked to main quotes

#### 5. **cost_rules** (NEW - Admin Configurable)
- Dynamic cost management
- Categories: material, fabrication, installation, addon, delivery, business
- Types: fixed, per_sqm, per_piece, percentage
- Enable/disable individual rules

#### 6. **form_fields**
- Dynamic form configuration for 8 steps
- Field types and validation
- Step-by-step organization

#### 7. **pdf_templates**
- PDF template management
- Color schemes and layouts
- Section visibility controls

#### 8. **material_options**
- Quartz and porcelain options
- Pricing per material
- Availability status

#### 9. **quotation_files**
- File upload management
- Slab photos and plans
- PDF storage with metadata

#### 10. **activity_logs**
- Audit trail for all changes
- User action tracking
- Data change history

#### 11. **email_templates**
- Email automation templates
- Variable substitution
- Admin and customer templates

#### 12. **system_settings**
- System configuration
- Feature toggles
- Performance settings

## 🆕 New Features in Updated Schema

### ✅ **8-Step Quotation Flow**
- **Step 1**: Scope of Work (fabrication, delivery, installation)
- **Step 2**: Material Options (luxone, yourself, luxone-others)
- **Step 3**: Worktop Layout (U+Island, L-Shape, etc.)
- **Step 4**: Worktop Dimensions (pieces A-F)
- **Step 5**: Design Options (simplified sink choices)
- **Step 6**: Timeline (ASAP, 3-6 weeks, 6+ weeks)
- **Step 7**: Project Type (kitchen, bathroom, commercial)
- **Step 8**: Contact Information (client + designer details)

### ✅ **Designer Contact Integration**
```sql
-- New fields in quotations table
designer_name VARCHAR(100) NOT NULL,
designer_contact VARCHAR(20) NOT NULL,
designer_email VARCHAR(100) NOT NULL
```

### ✅ **Comprehensive Cost Management**
```sql
-- Cost rules with categories and types
CREATE TABLE cost_rules (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    category ENUM('material', 'fabrication', 'installation', 'addon', 'delivery', 'business'),
    type ENUM('fixed', 'per_sqm', 'per_piece', 'percentage'),
    value DECIMAL(10,2) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE
);
```

### ✅ **Simplified Sink Options**
- **Option 1**: `client-provided` - Sink provided by Client
- **Option 2**: `luxone-customized` - Sink customized by Luxone
- **REMOVED**: Complex sink selection step

### ✅ **Enhanced File Management**
```sql
CREATE TABLE quotation_files (
    id INT PRIMARY KEY AUTO_INCREMENT,
    quotation_id INT NOT NULL,
    file_type ENUM('slab_photo', 'plan_sketch', 'pdf_quote'),
    original_filename VARCHAR(255),
    stored_filename VARCHAR(255),
    file_path VARCHAR(500),
    file_size INT,
    mime_type VARCHAR(100)
);
```

## 🔧 Default Cost Rules

The system includes these configurable cost rules:

| Rule ID | Name | Category | Type | Default Value |
|---------|------|----------|------|---------------|
| `material_base` | Base Material Cost | material | per_sqm | 150.00 AED |
| `cutting` | Cutting Cost | fabrication | per_sqm | 20.00 AED |
| `top_polishing` | Top Polishing | fabrication | per_sqm | 50.00 AED |
| `edge_polishing` | Edge Polishing | fabrication | per_sqm | 30.00 AED |
| `installation` | Installation Cost | installation | per_sqm | 140.00 AED |
| `sink_luxone` | Luxone Sink Cost | addon | fixed | 500.00 AED |
| `delivery_dubai` | Dubai Delivery | delivery | fixed | 500.00 AED |
| `delivery_uae` | UAE Delivery | delivery | fixed | 800.00 AED |
| `margin` | Business Margin | business | percentage | 20% |
| `vat` | VAT | business | percentage | 5% |

## 📈 Sample Data Included

### ✅ **3 Sample Quotations**
- Different service levels and materials
- Complete with pieces and designer info
- Various statuses (pending, reviewed, quoted)

### ✅ **Default Form Fields**
- All 8 steps configured
- Proper field types and validation
- Display order and visibility settings

### ✅ **Material Options**
- **Quartz**: 10 color options with pricing
- **Porcelain**: 5 color options with pricing
- Availability flags

### ✅ **Admin Configuration**
- Default admin user (admin/luxone2025)
- Company settings with UAE contact info
- PDF template with Luxone branding
- Email templates for notifications

## 🔍 Key Views

### quotation_summary
```sql
SELECT * FROM quotation_summary;
```
Complete overview with piece counts, total areas, and designer info.

### monthly_stats
```sql
SELECT * FROM monthly_stats;
```
Monthly statistics for quotes and revenue analysis.

## 🛠 Stored Procedures

### GenerateQuoteId()
```sql
CALL GenerateQuoteId(@new_id);
SELECT @new_id; -- Returns: LUX-2025-01-00001
```

### CalculateQuotePricing()
```sql
CALL CalculateQuotePricing('LUX-2025-01-00001', @total);
SELECT @total; -- Returns calculated total with all costs
```

## 🔐 Security Features

### ✅ **Data Protection**
- Password hashing for admin users
- SQL injection prevention
- Input validation and sanitization
- File upload security

### ✅ **Audit Trail**
- All changes logged in `activity_logs`
- User action tracking
- Data change history
- Timestamp tracking

### ✅ **Access Control**
- Role-based admin permissions
- Session management
- Secure file storage

## 📊 Analytics Capabilities

### ✅ **Quote Analytics**
- Conversion tracking by status
- Revenue analysis by period
- Location distribution
- Material popularity
- Designer performance metrics

### ✅ **Business Intelligence**
- Monthly trends and patterns
- Average quote values
- Service level preferences
- Timeline analysis

## 🚀 Integration Ready

### ✅ **Frontend Integration**
- React components mapped to database fields
- 8-step flow matches table structure
- Designer fields integrated
- Cost rules for admin panel

### ✅ **API Ready**
- RESTful endpoint structure
- JSON data handling
- File upload support
- Pagination and filtering

### ✅ **Reporting Tools**
- Views for quick reporting
- Stored procedures for calculations
- Export-friendly data structure
- Analytics dashboard support

## 🔄 Migration from Previous Version

### ✅ **Schema Updates**
- Added designer contact fields
- Simplified sink options
- Added cost_rules table
- Updated form_fields for 8 steps
- Enhanced file management

### ✅ **Data Migration**
- Existing quotes preserved
- New fields with default values
- Cost rules populated
- Form fields updated

## 📞 Support

### Database Operations
- **Backup**: `mysqldump luxone_quotation_system > backup.sql`
- **Restore**: `mysql luxone_quotation_system < backup.sql`
- **Optimize**: `OPTIMIZE TABLE quotations, quotation_pieces;`

### Performance Tuning
- Indexes on frequently queried columns
- Optimized views for reporting
- Efficient stored procedures
- Proper foreign key constraints

---

**🎯 Production-ready database with complete 8-step quotation flow!**

The updated schema supports the new simplified quotation process with designer integration and comprehensive admin cost management.