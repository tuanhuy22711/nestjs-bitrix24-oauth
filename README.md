# 🚀 NestJS Bitrix24 OAuth 2.0 Integration

**Bài Kiểm Tra Đánh Giá Kỹ Năng Lập Trình API với NestJS**

Ứng dụng NestJS tích hợp với Bitrix24 REST API thông qua cơ chế OAuth 2.0, hỗ trợ quản lý token tự động và xử lý các API calls.

## 📋 Yêu cầu bài kiểm tra

### Bài 1: Triển khai cơ chế OAuth 2.0 với Bitrix24

1. ✅ **Nhận sự kiện Install App**: Endpoint `/install` xử lý cài đặt ứng dụng
2. ✅ **Lưu trữ và quản lý token**: SQLite database hoặc JSON file
3. ✅ **Tự động làm mới token**: Auto-refresh khi token hết hạn
4. ✅ **Gọi API Bitrix24**: Hàm `callBitrixAPI` tổng quát
5. ✅ **Xử lý lỗi**: Comprehensive error handling
6. ✅ **Tích hợp ngrok**: Public domain cho webhook

### Bài 2: Xây dựng API quản lý Contact

1. ✅ **CRUD Operations**: GET, POST, PUT, DELETE cho contacts
2. ✅ **Thông tin chi tiết**: Tên, địa chỉ, điện thoại, email, website
3. ✅ **Thông tin ngân hàng**: Tích hợp với Bitrix24 Requisites API
4. ✅ **Validation**: Email format, required fields
5. ✅ **API Security**: API Key authentication
6. ✅ **Error Handling**: Clear error messages
7. ✅ **Swagger Documentation**: Auto-generated API docs

## 🛠️ Công nghệ sử dụng

- **NestJS**: Framework backend
- **TypeScript**: Ngôn ngữ lập trình  
- **Axios**: HTTP client cho API calls
- **SQLite**: Database lưu trữ token
- **ngrok**: Public tunnel cho development
- **Swagger**: API documentation

## 🚀 Quick Start

### 1. Cài đặt dependencies
```bash
cd nestjs-bitrix24-oauth
npm install
```

### 2. Cấu hình environment
```bash
cp .env.example .env
# Chỉnh sửa file .env với thông tin Bitrix24
```

### 3. Chạy ngrok
```bash
# Terminal 1: Start ngrok
ngrok http 3000

# Copy HTTPS URL (e.g., https://abc123.ngrok.io)
```

### 4. Cấu hình Bitrix24 Local Application
```
Application URL: https://abc123.ngrok.io
Installation Path: /install
```

### 5. Khởi động ứng dụng
```bash
npm run start:dev
```

### 6. Test integration
```bash
# Install app từ Bitrix24
# Check logs để verify OAuth flow
```

## 📁 Cấu trúc project

```
src/
├── app.module.ts              # Root module
├── main.ts                    # Bootstrap application
├── bitrix24/                  # Bitrix24 integration module
│   ├── bitrix24.module.ts
│   ├── bitrix24.controller.ts # Install endpoint & legacy API routes
│   ├── bitrix24-api.controller.ts # API proxy routes
│   ├── bitrix24.service.ts    # OAuth logic & API calls
│   ├── contacts/              # Contact management (Bài 2)
│   │   ├── contacts.module.ts
│   │   └── contacts.controller.ts # CRUD operations
│   └── dto/                   # Data transfer objects
│       ├── bitrix-auth.dto.ts
│       ├── contact.dto.ts     # Contact & bank info DTOs
│       └── api-call.dto.ts
├── database/                  # Database module
│   ├── database.module.ts
│   └── database.service.ts    # SQLite operations
├── health/                    # Health check
│   └── health.controller.ts
└── common/                    # Shared utilities
    ├── filters/               # Exception filters
    ├── interceptors/          # Response interceptors
    ├── guards/                # API Key authentication
    └── decorators/            # Custom decorators
```

## 🔗 API Endpoints

### Install & OAuth
- `GET /install` - Installation page
- `POST /install` - Process app installation
- `GET /oauth/callback` - OAuth callback handler

### Contact Management (Bài 2) 🆕
- `GET /contacts` - Lấy danh sách contact
- `GET /contacts/:id` - Lấy chi tiết contact theo ID
- `POST /contacts` - Thêm contact mới (bao gồm thông tin ngân hàng)
- `PUT /contacts/:id` - Cập nhật thông tin contact
- `DELETE /contacts/:id` - Xóa contact

### Bitrix24 API Proxy
- `GET /bitrix24/contacts` - Get contacts list (legacy)
- `POST /bitrix24/api` - Generic API proxy
- `GET /bitrix24/token/status` - Token status
- `POST /bitrix24/token/refresh` - Manual token refresh

### Health & Docs
- `GET /health` - Health check
- `GET /api` - Swagger documentation

## 🔧 Cấu hình

### Environment Variables (.env)
```env
# Server
PORT=3000
NODE_ENV=development

# API Security (Bài 2)
API_KEY=nestjs-bitrix24-demo-key-2025

# Bitrix24 OAuth
BITRIX24_CLIENT_ID=your_client_id
BITRIX24_CLIENT_SECRET=your_client_secret  
BITRIX24_DOMAIN=your-company.bitrix24.com
BITRIX24_REDIRECT_URI=https://your-ngrok.ngrok.io/oauth/callback

# Database
DATABASE_PATH=./data/tokens.db

# ngrok (for reference)
NGROK_DOMAIN=https://your-ngrok.ngrok.io
```

### Bitrix24 Local Application Setup
1. Vào **Applications** > **Developer resources** > **Other**
2. Click **"Create Local Application"**
3. Cấu hình:
   ```
   Application Name: NestJS OAuth Test
   Application Code: nestjs_oauth_test
   Application URL: https://your-ngrok.ngrok.io
   Installation Path: /install
   Permissions: crm (CRM access)
   ```

## 🏗️ Implementation Details

### OAuth 2.0 Flow
```typescript
// 1. Bitrix24 POST to /install với auth data
// 2. Extract access_token & refresh_token  
// 3. Save tokens to SQLite database
// 4. Ready for API calls

@Post('/install')
async handleInstall(@Body() authData: BitrixAuthDto) {
  const tokens = await this.bitrix24Service.processInstallation(authData);
  return { success: true, message: 'App installed successfully' };
}
```

### Contact Management API (Bài 2)
```typescript
// Contact với thông tin ngân hàng
@Post('/contacts')
async createContact(@Body() createContactDto: CreateContactDto) {
  // 1. Validate input data
  // 2. Create contact in Bitrix24 CRM
  // 3. Add bank info via Requisites API
  // 4. Return success response
  
  const contactData = {
    NAME: createContactDto.name,
    EMAIL: [{ VALUE: createContactDto.email, VALUE_TYPE: 'WORK' }],
    PHONE: [{ VALUE: createContactDto.phone, VALUE_TYPE: 'WORK' }],
    ADDRESS: createContactDto.address?.address,
    ADDRESS_CITY: createContactDto.address?.province
  };
  
  const contact = await this.bitrix24Service.callBitrixAPI('crm.contact.add', { 
    fields: contactData 
  });
  
  // Add bank information
  if (createContactDto.bank_info) {
    await this.bitrix24Service.callBitrixAPI('crm.requisite.add', {
      fields: {
        ENTITY_TYPE_ID: 3, // Contact entity
        ENTITY_ID: contact.result,
        RQ_BANK_NAME: createContactDto.bank_info.bank_name,
        RQ_ACC_NUM: createContactDto.bank_info.account_number
      }
    });
  }
}
```

### API Security
```typescript
@Injectable()
export class ApiKeyGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const apiKey = request.headers['x-api-key'];
    
    return apiKey === process.env.API_KEY;
  }
}

@Controller('contacts')
@UseGuards(ApiKeyGuard)
export class ContactsController {
  // Protected endpoints
}
```

### Token Management
```typescript
@Injectable()
export class Bitrix24Service {
  async callBitrixAPI(method: string, params: any = {}) {
    // 1. Get current token
    // 2. Make API call  
    // 3. Handle token expiration
    // 4. Auto-refresh if needed
    // 5. Retry API call
  }
  
  async refreshTokenIfNeeded() {
    // Auto-refresh logic
  }
}
```

### Error Handling
```typescript
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    // Global error handling
    // Log errors
    // Return formatted response
  }
}
```

## 🧪 Testing

### API Contact Management Testing (Bài 2)

#### 1. Lấy danh sách contacts
```bash
curl -X GET "http://localhost:3000/contacts" \
  -H "X-API-Key: nestjs-bitrix24-demo-key-2025"

# Với filter và phân trang
curl -X GET "http://localhost:3000/contacts?limit=10&start=0&filter={\"NAME\":\"Nguyễn\"}" \
  -H "X-API-Key: nestjs-bitrix24-demo-key-2025"
```

#### 2. Lấy chi tiết contact theo ID
```bash
curl -X GET "http://localhost:3000/contacts/1" \
  -H "X-API-Key: nestjs-bitrix24-demo-key-2025"
```

#### 3. Tạo contact mới (có thông tin ngân hàng)
```bash
curl -X POST "http://localhost:3000/contacts" \
  -H "Content-Type: application/json" \
  -H "X-API-Key: nestjs-bitrix24-demo-key-2025" \
  -d '{
    "name": "Nguyễn",
    "last_name": "Văn A",
    "email": "nguyenvana@example.com",
    "phone": "+84901234567",
    "website": "https://nguyenvana.com",
    "address": {
      "address": "123 Lê Lợi",
      "ward": "Phường Bến Nghé",
      "district": "Quận 1",
      "province": "TP. Hồ Chí Minh",
      "postal_code": "700000"
    },
    "bank_info": {
      "bank_name": "Ngân hàng TMCP Công Thương Việt Nam (VietinBank)",
      "account_number": "1234567890123456",
      "account_holder": "Nguyễn Văn A",
      "branch": "Chi nhánh TP.HCM"
    },
    "comments": "Khách hàng VIP - Test từ API"
  }'
```

#### 4. Cập nhật contact
```bash
curl -X PUT "http://localhost:3000/contacts/10" \
  -H "Content-Type: application/json" \
  -H "X-API-Key: nestjs-bitrix24-demo-key-2025" \
  -d '{
    "name": "Nguyễn Updated",
    "phone": "+84987654321",
    "comments": "Thông tin đã được cập nhật"
  }'
```

#### 5. Xóa contact
```bash
curl -X DELETE "http://localhost:3000/contacts/10" \
  -H "X-API-Key: nestjs-bitrix24-demo-key-2025"
```

### OAuth Testing

#### 1. Check health
```bash
curl http://localhost:3000/health
```

#### 2. Install app từ Bitrix24 admin panel

#### 3. Check token status
```bash
curl http://localhost:3000/api/bitrix24/token/status
```

#### 4. Test legacy API call
```bash
curl http://localhost:3000/api/bitrix24/contacts
```

#### 5. Check logs
```bash
tail -f logs/app.log
```

### Unit Tests
```bash
npm run test
npm run test:watch
npm run test:cov
```

### E2E Tests  
```bash
npm run test:e2e
```

## 📊 Monitoring & Logs

### API Response Examples

#### Contact List Response
```json
{
  "success": true,
  "data": [
    {
      "ID": "1",
      "NAME": "Nguyễn",
      "LAST_NAME": "Văn A",
      "EMAIL": [{"VALUE": "nguyenvana@example.com", "VALUE_TYPE": "WORK"}],
      "PHONE": [{"VALUE": "+84901234567", "VALUE_TYPE": "WORK"}],
      "ADDRESS": "123 Lê Lợi, Phường Bến Nghé",
      "ADDRESS_CITY": "TP. Hồ Chí Minh",
      "TYPE_ID": "CLIENT",
      "SOURCE_ID": "WEB"
    }
  ],
  "total": 1,
  "has_more": false
}
```

#### Contact Detail with Bank Info
```json
{
  "success": true,
  "data": {
    "ID": "1",
    "NAME": "Nguyễn",
    "LAST_NAME": "Văn A",
    "EMAIL": [{"VALUE": "nguyenvana@example.com", "VALUE_TYPE": "WORK"}],
    "PHONE": [{"VALUE": "+84901234567", "VALUE_TYPE": "WORK"}],
    "ADDRESS": "123 Lê Lợi, Phường Bến Nghé",
    "bank_info": {
      "ID": "1",
      "NAME": "Ngân hàng TMCP Công Thương Việt Nam",
      "RQ_BANK_NAME": "VietinBank",
      "RQ_ACC_NUM": "1234567890123456",
      "RQ_ACC_NAME": "Nguyễn Văn A"
    }
  }
}
```

#### Error Response
```json
{
  "success": false,
  "statusCode": 400,
  "error": "Bad Request",
  "message": "Email không hợp lệ",
  "timestamp": "2025-08-17T12:00:00.000Z",
  "path": "/contacts"
}
```

### Log Structure
```json
{
  "timestamp": "2025-08-17T12:00:00.000Z",
  "level": "info",
  "context": "ContactsController", 
  "message": "Contact created successfully",
  "data": {
    "contactId": "10",
    "hasEmail": true,
    "hasPhone": true,
    "hasBankInfo": true
  }
}
```

### Health Check Response
```json
{
  "status": "ok",
  "info": {
    "database": { "status": "up" },
    "bitrix24": { "status": "up", "hasToken": true }
  },
  "error": {},
  "details": {
    "database": { "status": "up" },
    "bitrix24": { "status": "up", "hasToken": true }
  }
}
```

## 🔒 Security

### Best Practices
- ✅ Environment variables cho secrets
- ✅ Input validation với class-validator
- ✅ Error sanitization
- ✅ Rate limiting
- ✅ CORS configuration
- ✅ Helmet security headers

### Token Security
```typescript
// Encrypt tokens in database
const encryptedToken = encrypt(accessToken, process.env.ENCRYPTION_KEY);
await this.databaseService.saveToken(encryptedToken);
```

## 📚 Documentation

### Swagger API Docs
Access tại: `http://localhost:3000/api`

### Bitrix24 References
- [OAuth Documentation](https://training.bitrix24.com/rest_help/oauth/index.php)
- [CRM Contacts API](https://training.bitrix24.com/rest_help/crm/contacts/index.php)
- [CRM Requisites API](https://training.bitrix24.com/rest_help/crm/requisite/index.php) - Bank info
- [REST API Help](https://training.bitrix24.com/rest_help/)

### NestJS References
- [NestJS Documentation](https://docs.nestjs.com/)
- [Class Validator](https://github.com/typestack/class-validator)
- [Swagger/OpenAPI](https://docs.nestjs.com/openapi/introduction)

## 🚀 Deployment

### Development
```bash
npm run start:dev
# Server chạy với hot-reload
```

### Production
```bash
npm run build
npm run start:prod
```

### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY dist ./dist
EXPOSE 3000
CMD ["npm", "run", "start:prod"]
```

## ❗ Troubleshooting

### Common Issues

1. **ngrok URL thay đổi**
   ```bash
   # Update Bitrix24 app settings với URL mới
   # Restart ngrok với same domain (paid plan)
   ```

2. **Token expired**
   ```bash
   # Check auto-refresh logs
   # Manual refresh: POST /bitrix24/token/refresh
   ```

3. **Database connection**
   ```bash
   # Check DATABASE_PATH
   # Verify SQLite file permissions
   ```

## 📞 Support

- **Email**: tuanhuy227@gmail.com
- **GitHub Issues**: [Create Issue](https://github.com/tuanhuy22711/nestjs-bitrix24-oauth/issues)

---

**Made with ❤️ for NestJS Bitrix24 Integration Assessment**
