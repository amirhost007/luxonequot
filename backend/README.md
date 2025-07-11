# Luxone Quotation System - PHP Backend API

## 📋 Overview

Complete PHP backend API for the Luxone Quotation System with MySQL database integration. This backend supports the new 8-step quotation flow with designer contact information and comprehensive admin cost management.

## 🚀 Quick Setup

### 1. Database Setup
```bash
# Import the database
mysql -u root -p < ../database/luxone_quotation_system.sql
```

### 2. Configure Database Connection
Edit `config/database.php`:
```php
private $host = 'localhost';
private $db_name = 'luxone_quotation_system';
private $username = 'your_username';
private $password = 'your_password';
```

### 3. Set Permissions
```bash
chmod 755 uploads/
chmod 644 .htaccess
```

### 4. Test API
```bash
curl http://localhost/api/v1/health
```

## 🔗 API Endpoints

### 📋 Quotations
```
GET    /api/v1/quotes              # List all quotations
POST   /api/v1/quotes              # Create new quotation
GET    /api/v1/quotes/{id}         # Get quotation details
PUT    /api/v1/quotes/{id}         # Update quotation
DELETE /api/v1/quotes/{id}         # Delete quotation
PUT    /api/v1/quotes/{id}/status  # Update status
POST   /api/v1/quotes/calculate    # Calculate pricing
GET    /api/v1/quotes/{id}/pdf     # Generate PDF
```

### 👨‍💼 Admin
```
POST   /api/v1/admin/login         # Admin login
GET    /api/v1/admin/dashboard     # Dashboard statistics
GET    /api/v1/admin/analytics     # Analytics data
GET    /api/v1/admin               # Admin data
```

### ⚙️ Settings
```
GET    /api/v1/settings                    # All settings
GET    /api/v1/settings/company           # Company settings
PUT    /api/v1/settings/company           # Update company settings
GET    /api/v1/settings/cost-rules        # Cost rules
POST   /api/v1/settings/cost-rules        # Create cost rule
PUT    /api/v1/settings/cost-rules/{id}   # Update cost rule
DELETE /api/v1/settings/cost-rules/{id}   # Delete cost rule
GET    /api/v1/settings/form-fields       # Form fields
POST   /api/v1/settings/form-fields       # Create form field
PUT    /api/v1/settings/form-fields/{id}  # Update form field
DELETE /api/v1/settings/form-fields/{id}  # Delete form field
GET    /api/v1/settings/pdf-templates     # PDF templates
POST   /api/v1/settings/pdf-templates     # Create PDF template
PUT    /api/v1/settings/pdf-templates/{id} # Update PDF template
DELETE /api/v1/settings/pdf-templates/{id} # Delete PDF template
```

### 📁 Files
```
GET    /api/v1/files              # List files
POST   /api/v1/files              # Upload file
GET    /api/v1/files/{id}         # Download file
DELETE /api/v1/files/{id}         # Delete file
```

## 📝 Request Examples

### Create Quotation
```json
POST /api/v1/quotes
{
  "service_level": "fabrication-delivery-installation",
  "material_source": "luxone",
  "material_type": "quartz",
  "material_color": "IMPERIAL WHITE",
  "worktop_layout": "l-shape",
  "sink_option": "luxone-customized",
  "timeline": "3-6weeks",
  "project_type": "Kitchen - Ready for worktops now / ASAP",
  "customer_name": "John Smith",
  "customer_email": "john@example.com",
  "customer_phone": "+971501234567",
  "customer_location": "Dubai",
  "designer_name": "Sarah Designer",
  "designer_contact": "+971509876543",
  "designer_email": "sarah@design.com",
  "pieces": {
    "A": {"length": "2400", "width": "600", "thickness": "20"},
    "B": {"length": "1800", "width": "600", "thickness": "20"}
  }
}
```

### Update Cost Rule
```json
PUT /api/v1/settings/cost-rules/material_base
{
  "name": "Base Material Cost",
  "category": "material",
  "type": "per_sqm",
  "value": 160.00,
  "description": "Updated base price per square meter",
  "is_active": true
}
```

### Calculate Pricing
```json
POST /api/v1/quotes/calculate
{
  "pieces": {
    "A": {"length": "2400", "width": "600", "thickness": "20"},
    "B": {"length": "1800", "width": "600", "thickness": "20"}
  },
  "sink_option": "luxone-customized",
  "customer_location": "Dubai"
}
```

## 🔧 Configuration

### Environment Variables
Create `.env` file:
```env
DB_HOST=localhost
DB_NAME=luxone_quotation_system
DB_USER=root
DB_PASS=

UPLOAD_MAX_SIZE=3145728
UPLOAD_PATH=./uploads/

SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USERNAME=your-email@gmail.com
SMTP_PASSWORD=your-app-password

JWT_SECRET=your-secret-key
```

### File Upload Settings
- **Max Size**: 3MB
- **Allowed Types**: jpg, jpeg, png, gif, pdf
- **Upload Path**: `./uploads/`

## 🗄️ Database Schema

### Key Tables
- **quotations**: Main quote data (8-step flow)
- **quotation_pieces**: Worktop dimensions
- **cost_rules**: Admin-configurable costs
- **form_fields**: Dynamic form configuration
- **pdf_templates**: PDF customization
- **quotation_files**: File uploads
- **admin_users**: Admin authentication

### New Features
- **Designer contact fields** in quotations
- **Comprehensive cost management** system
- **8-step quotation flow** (removed sink options step)
- **Admin-configurable pricing** rules
- **Enhanced file management**

## 🔒 Security Features

- **Input validation** and sanitization
- **SQL injection** prevention
- **File upload** security
- **CORS** configuration
- **Error handling** and logging
- **Admin authentication**

## 📊 Admin Features

### Dashboard Statistics
- Total quotations count
- Status distribution
- Monthly trends
- Location analytics
- Material type distribution
- Recent activity

### Cost Management
- Material costs (per sqm)
- Fabrication costs (cutting, polishing)
- Installation costs
- Addon costs (sinks, etc.)
- Delivery costs (Dubai vs UAE)
- Business margin and VAT

### Form Management
- Dynamic form field creation
- Step organization
- Field validation rules
- Visibility controls

## 🚀 Production Deployment

### 1. Server Requirements
- PHP 7.4+ with PDO MySQL
- MySQL 5.7+ or MariaDB 10.3+
- Apache with mod_rewrite
- SSL certificate

### 2. Security Checklist
- [ ] Change default database credentials
- [ ] Update JWT secret key
- [ ] Configure SMTP settings
- [ ] Set proper file permissions
- [ ] Enable HTTPS
- [ ] Configure firewall rules

### 3. Performance Optimization
- [ ] Enable PHP OPcache
- [ ] Configure MySQL query cache
- [ ] Set up database indexing
- [ ] Enable gzip compression
- [ ] Configure CDN for file uploads

## 🧪 Testing

### API Testing
```bash
# Test health endpoint
curl http://localhost/api/v1/health

# Test quotation creation
curl -X POST http://localhost/api/v1/quotes \
  -H "Content-Type: application/json" \
  -d @test_quote.json

# Test admin login
curl -X POST http://localhost/api/v1/admin/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"luxone2025"}'
```

### Database Testing
```sql
-- Test stored procedures
CALL GenerateQuoteId(@new_id);
SELECT @new_id;

CALL CalculateQuotePricing('LUX-2025-01-00001', @total);
SELECT @total;

-- Test views
SELECT * FROM quotation_summary LIMIT 5;
SELECT * FROM monthly_stats;
```

## 📈 Monitoring

### Log Files
- **Error logs**: Check PHP error logs
- **Access logs**: Monitor API usage
- **Database logs**: Track slow queries

### Performance Metrics
- Response times
- Database query performance
- File upload success rates
- Error rates by endpoint

## 🔄 Backup Strategy

### Database Backup
```bash
# Daily backup
mysqldump -u root -p luxone_quotation_system > backup_$(date +%Y%m%d).sql

# Restore backup
mysql -u root -p luxone_quotation_system < backup_20250120.sql
```

### File Backup
```bash
# Backup uploads directory
tar -czf uploads_backup_$(date +%Y%m%d).tar.gz uploads/
```

---

**🎯 Production-ready PHP backend with complete database integration!**

The system now supports the new 8-step quotation flow with designer details and comprehensive admin cost management.