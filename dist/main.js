/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ([
/* 0 */,
/* 1 */
/***/ ((module) => {

module.exports = require("@nestjs/core");

/***/ }),
/* 2 */
/***/ ((module) => {

module.exports = require("@nestjs/common");

/***/ }),
/* 3 */
/***/ ((module) => {

module.exports = require("@nestjs/swagger");

/***/ }),
/* 4 */
/***/ ((module) => {

module.exports = require("@nestjs/config");

/***/ }),
/* 5 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AppModule = void 0;
const common_1 = __webpack_require__(2);
const config_1 = __webpack_require__(4);
const axios_1 = __webpack_require__(6);
const bitrix24_module_1 = __webpack_require__(7);
const contacts_module_1 = __webpack_require__(20);
const database_module_1 = __webpack_require__(19);
const health_controller_1 = __webpack_require__(24);
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                envFilePath: '.env',
                cache: true,
            }),
            database_module_1.DatabaseModule,
            bitrix24_module_1.Bitrix24Module,
            contacts_module_1.ContactsModule,
            axios_1.HttpModule,
        ],
        controllers: [health_controller_1.HealthController],
        providers: [],
    })
], AppModule);


/***/ }),
/* 6 */
/***/ ((module) => {

module.exports = require("@nestjs/axios");

/***/ }),
/* 7 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Bitrix24Module = void 0;
const common_1 = __webpack_require__(2);
const axios_1 = __webpack_require__(6);
const config_1 = __webpack_require__(4);
const bitrix24_controller_1 = __webpack_require__(8);
const bitrix24_api_controller_1 = __webpack_require__(18);
const bitrix24_service_1 = __webpack_require__(9);
const database_module_1 = __webpack_require__(19);
let Bitrix24Module = class Bitrix24Module {
};
exports.Bitrix24Module = Bitrix24Module;
exports.Bitrix24Module = Bitrix24Module = __decorate([
    (0, common_1.Module)({
        imports: [
            axios_1.HttpModule.register({
                timeout: 10000,
                maxRedirects: 5,
            }),
            config_1.ConfigModule,
            database_module_1.DatabaseModule,
        ],
        controllers: [bitrix24_controller_1.Bitrix24Controller, bitrix24_api_controller_1.Bitrix24ApiController],
        providers: [bitrix24_service_1.Bitrix24Service],
        exports: [bitrix24_service_1.Bitrix24Service],
    })
], Bitrix24Module);


/***/ }),
/* 8 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var Bitrix24Controller_1;
var _a, _b, _c, _d;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Bitrix24Controller = void 0;
const common_1 = __webpack_require__(2);
const swagger_1 = __webpack_require__(3);
const bitrix24_service_1 = __webpack_require__(9);
const bitrix_auth_dto_1 = __webpack_require__(15);
const api_call_dto_1 = __webpack_require__(17);
let Bitrix24Controller = Bitrix24Controller_1 = class Bitrix24Controller {
    constructor(bitrix24Service) {
        this.bitrix24Service = bitrix24Service;
        this.logger = new common_1.Logger(Bitrix24Controller_1.name);
    }
    async getInstallPage(query) {
        this.logger.log('Installation page requested', { query });
        return {
            title: 'NestJS Bitrix24 OAuth Installation',
            query,
            timestamp: new Date().toISOString()
        };
    }
    async handleInstall(authData, queryParams) {
        try {
            const mergedData = {
                ...authData,
                domain: queryParams.DOMAIN || authData.domain || authData.DOMAIN,
                DOMAIN: queryParams.DOMAIN || authData.DOMAIN || authData.domain,
                PROTOCOL: queryParams.PROTOCOL || authData.PROTOCOL,
                LANG: queryParams.LANG || authData.LANG,
                APP_SID: queryParams.APP_SID || authData.APP_SID
            };
            this.logger.log('🚀 Processing Bitrix24 installation', {
                fullAuthData: mergedData,
                queryParams,
                hasAccessToken: !!mergedData.access_token,
                hasRefreshToken: !!mergedData.refresh_token,
                domain: mergedData.domain,
                scope: mergedData.scope,
                method: mergedData.method,
                memberId: mergedData.member_id,
                status: mergedData.status,
                authExpires: mergedData.authExpires,
                placement: mergedData.placement,
                clientEndpoint: mergedData.client_endpoint,
                serverEndpoint: mergedData.server_endpoint
            });
            this.logger.log('📝 Raw auth data received:', JSON.stringify(mergedData, null, 2));
            const result = await this.bitrix24Service.processInstallation(mergedData);
            this.logger.log('✅ Installation processed successfully', result);
            return {
                success: true,
                message: 'Application installed successfully',
                data: result
            };
        }
        catch (error) {
            this.logger.error('❌ Installation failed', {
                error: error.message,
                stack: error.stack,
                authData: authData
            });
            throw new common_1.HttpException({
                success: false,
                message: 'Installation failed',
                error: error.message
            }, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async handleOAuthCallback(code, state, query) {
        try {
            this.logger.log('🔐 OAuth callback received', {
                hasCode: !!code,
                state,
                query
            });
            if (!code) {
                throw new common_1.HttpException('Authorization code not provided', common_1.HttpStatus.BAD_REQUEST);
            }
            const result = await this.bitrix24Service.exchangeCodeForToken(code, state);
            this.logger.log('✅ OAuth callback processed successfully', result);
            return {
                success: true,
                message: 'Authorization completed successfully',
                data: result
            };
        }
        catch (error) {
            this.logger.error('❌ OAuth callback failed', {
                error: error.message,
                code,
                state
            });
            throw new common_1.HttpException(`OAuth callback failed: ${error.message}`, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async getContacts(query) {
        try {
            this.logger.log('📞 Fetching contacts from Bitrix24', query);
            const params = {};
            if (query.limit)
                params.limit = query.limit;
            if (query.start)
                params.start = query.start;
            if (query.select) {
                params.select = query.select.split(',').map(field => field.trim());
            }
            const result = await this.bitrix24Service.callBitrixAPI('crm.contact.list', params);
            this.logger.log('✅ Contacts fetched successfully', {
                count: result.result?.length || 0,
                total: result.total
            });
            return result;
        }
        catch (error) {
            this.logger.error('❌ Failed to fetch contacts', {
                error: error.message,
                query
            });
            throw new common_1.HttpException(`Failed to fetch contacts: ${error.message}`, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async proxyApiCall(apiCall) {
        try {
            this.logger.log('🔄 Proxying API call to Bitrix24', {
                method: apiCall.method,
                hasParams: !!apiCall.params
            });
            const result = await this.bitrix24Service.callBitrixAPI(apiCall.method, apiCall.params || {});
            this.logger.log('✅ API call completed successfully', {
                method: apiCall.method,
                hasResult: !!result.result
            });
            return result;
        }
        catch (error) {
            this.logger.error('❌ API call failed', {
                method: apiCall.method,
                error: error.message
            });
            throw new common_1.HttpException(`API call failed: ${error.message}`, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getTokenStatus() {
        try {
            const status = await this.bitrix24Service.getTokenStatus();
            this.logger.log('📊 Token status retrieved', status);
            return status;
        }
        catch (error) {
            this.logger.error('❌ Failed to get token status', {
                error: error.message
            });
            throw new common_1.HttpException(`Failed to get token status: ${error.message}`, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async refreshToken() {
        try {
            this.logger.log('🔄 Manual token refresh requested');
            const result = await this.bitrix24Service.refreshTokenIfNeeded(true);
            this.logger.log('✅ Token refreshed successfully', result);
            return {
                success: true,
                message: 'Token refreshed successfully',
                data: result
            };
        }
        catch (error) {
            this.logger.error('❌ Token refresh failed', {
                error: error.message
            });
            throw new common_1.HttpException(`Token refresh failed: ${error.message}`, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
};
exports.Bitrix24Controller = Bitrix24Controller;
__decorate([
    (0, common_1.Get)('/install'),
    (0, swagger_1.ApiOperation)({
        summary: 'Display installation page',
        description: 'Shows the installation page for Bitrix24 local application'
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Installation page displayed successfully'
    }),
    (0, common_1.Render)('install'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], Bitrix24Controller.prototype, "getInstallPage", null);
__decorate([
    (0, common_1.Post)('/install'),
    (0, swagger_1.ApiOperation)({
        summary: 'Process app installation',
        description: 'Handles OAuth data from Bitrix24 during app installation'
    }),
    (0, swagger_1.ApiBody)({ type: bitrix_auth_dto_1.BitrixAuthDto }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'App installed successfully',
        schema: {
            example: {
                success: true,
                message: 'Application installed successfully',
                data: {
                    domain: 'company.bitrix24.com',
                    hasToken: true,
                    expiresAt: '2025-08-17T13:00:00.000Z'
                }
            }
        }
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Invalid installation data'
    }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_b = typeof bitrix_auth_dto_1.BitrixAuthDto !== "undefined" && bitrix_auth_dto_1.BitrixAuthDto) === "function" ? _b : Object, Object]),
    __metadata("design:returntype", Promise)
], Bitrix24Controller.prototype, "handleInstall", null);
__decorate([
    (0, common_1.Get)('/oauth/callback'),
    (0, swagger_1.ApiOperation)({
        summary: 'OAuth callback handler',
        description: 'Handles OAuth callback from Bitrix24 authorization'
    }),
    (0, swagger_1.ApiQuery)({ name: 'code', required: false, description: 'Authorization code' }),
    (0, swagger_1.ApiQuery)({ name: 'state', required: false, description: 'State parameter' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'OAuth callback processed successfully'
    }),
    __param(0, (0, common_1.Query)('code')),
    __param(1, (0, common_1.Query)('state')),
    __param(2, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], Bitrix24Controller.prototype, "handleOAuthCallback", null);
__decorate([
    (0, common_1.Get)('/bitrix24/contacts'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get contacts from Bitrix24',
        description: 'Retrieves contact list from Bitrix24 CRM'
    }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, description: 'Number of contacts to return' }),
    (0, swagger_1.ApiQuery)({ name: 'start', required: false, description: 'Offset for pagination' }),
    (0, swagger_1.ApiQuery)({ name: 'select', required: false, description: 'Fields to select (comma-separated)' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Contacts retrieved successfully',
        schema: {
            example: {
                success: true,
                result: [
                    {
                        ID: '1',
                        NAME: 'John',
                        LAST_NAME: 'Doe',
                        EMAIL: [{ VALUE: 'john@example.com', VALUE_TYPE: 'WORK' }]
                    }
                ],
                total: 1
            }
        }
    }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_c = typeof api_call_dto_1.ContactListQueryDto !== "undefined" && api_call_dto_1.ContactListQueryDto) === "function" ? _c : Object]),
    __metadata("design:returntype", Promise)
], Bitrix24Controller.prototype, "getContacts", null);
__decorate([
    (0, common_1.Post)('/bitrix24/api'),
    (0, swagger_1.ApiOperation)({
        summary: 'Generic Bitrix24 API proxy',
        description: 'Makes generic API calls to Bitrix24 REST API'
    }),
    (0, swagger_1.ApiBody)({ type: api_call_dto_1.ApiCallDto }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'API call executed successfully'
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_d = typeof api_call_dto_1.ApiCallDto !== "undefined" && api_call_dto_1.ApiCallDto) === "function" ? _d : Object]),
    __metadata("design:returntype", Promise)
], Bitrix24Controller.prototype, "proxyApiCall", null);
__decorate([
    (0, common_1.Get)('/bitrix24/token/status'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get token status',
        description: 'Returns current OAuth token status and information'
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Token status retrieved successfully',
        schema: {
            example: {
                hasToken: true,
                domain: 'company.bitrix24.com',
                expiresAt: '2025-08-17T13:00:00.000Z',
                isExpired: false,
                timeRemaining: '45 minutes'
            }
        }
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], Bitrix24Controller.prototype, "getTokenStatus", null);
__decorate([
    (0, common_1.Post)('/bitrix24/token/refresh'),
    (0, swagger_1.ApiOperation)({
        summary: 'Manually refresh token',
        description: 'Forces refresh of OAuth access token using refresh token'
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Token refreshed successfully'
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], Bitrix24Controller.prototype, "refreshToken", null);
exports.Bitrix24Controller = Bitrix24Controller = Bitrix24Controller_1 = __decorate([
    (0, swagger_1.ApiTags)('bitrix24'),
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [typeof (_a = typeof bitrix24_service_1.Bitrix24Service !== "undefined" && bitrix24_service_1.Bitrix24Service) === "function" ? _a : Object])
], Bitrix24Controller);


/***/ }),
/* 9 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var Bitrix24Service_1;
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Bitrix24Service = void 0;
const common_1 = __webpack_require__(2);
const config_1 = __webpack_require__(4);
const axios_1 = __webpack_require__(6);
const rxjs_1 = __webpack_require__(10);
const database_service_1 = __webpack_require__(11);
let Bitrix24Service = Bitrix24Service_1 = class Bitrix24Service {
    constructor(configService, httpService, databaseService) {
        this.configService = configService;
        this.httpService = httpService;
        this.databaseService = databaseService;
        this.logger = new common_1.Logger(Bitrix24Service_1.name);
        this.clientId = this.configService.get('BITRIX24_CLIENT_ID');
        this.clientSecret = this.configService.get('BITRIX24_CLIENT_SECRET');
        this.domain = this.configService.get('BITRIX24_DOMAIN');
        this.redirectUri = this.configService.get('BITRIX24_REDIRECT_URI');
        this.apiTimeout = this.configService.get('BITRIX24_API_TIMEOUT', 10000);
        this.retryAttempts = this.configService.get('BITRIX24_API_RETRY_ATTEMPTS', 3);
        this.retryDelay = this.configService.get('BITRIX24_API_RETRY_DELAY', 1000);
        this.logger.log('🔧 Bitrix24Service initialized', {
            clientId: this.clientId ? '***' : 'NOT_SET',
            domain: this.domain,
            redirectUri: this.redirectUri
        });
    }
    async processInstallation(authData) {
        try {
            this.logger.log('🎯 Processing installation auth data', {
                hasAccessToken: !!(authData.access_token || authData.AUTH_ID),
                hasRefreshToken: !!(authData.refresh_token || authData.REFRESH_ID),
                domain: authData.domain || authData.DOMAIN,
                scope: authData.scope,
                expiresIn: authData.expires_in,
                method: authData.method,
                authExpires: authData.authExpires || authData.AUTH_EXPIRES,
                placement: authData.placement || authData.PLACEMENT,
                protocol: authData.PROTOCOL,
                lang: authData.LANG,
                appSid: authData.APP_SID
            });
            const normalizedData = {
                access_token: authData.AUTH_ID || authData.access_token,
                refresh_token: authData.REFRESH_ID || authData.refresh_token,
                expires_in: authData.AUTH_EXPIRES ? parseInt(authData.AUTH_EXPIRES) : authData.expires_in,
                domain: authData.DOMAIN || authData.domain,
                scope: authData.scope,
                method: authData.method || 'oauth2',
                placement: authData.PLACEMENT || authData.placement,
                member_id: authData.member_id,
                status: authData.status,
                client_endpoint: authData.client_endpoint,
                server_endpoint: authData.server_endpoint,
                application_token: authData.application_token
            };
            this.logger.log('🔄 Normalized auth data', normalizedData);
            if (normalizedData.method === 'simplified_auth' || !normalizedData.access_token) {
                return await this.processSimplifiedAuth({
                    ...authData,
                    domain: normalizedData.domain,
                    authExpires: authData.AUTH_EXPIRES || authData.authExpires || '3600'
                });
            }
            if (!normalizedData.access_token) {
                throw new Error('Access token is required for OAuth2 flow');
            }
            const expiresAt = new Date();
            expiresAt.setSeconds(expiresAt.getSeconds() + (normalizedData.expires_in || 3600));
            const tokenData = {
                access_token: normalizedData.access_token,
                refresh_token: normalizedData.refresh_token,
                expires_in: normalizedData.expires_in,
                expires_at: expiresAt,
                domain: normalizedData.domain,
                scope: normalizedData.scope,
                client_endpoint: normalizedData.client_endpoint,
                server_endpoint: normalizedData.server_endpoint,
                member_id: normalizedData.member_id,
                status: normalizedData.status,
                application_token: normalizedData.application_token,
                method: 'oauth2',
                created_at: new Date(),
                updated_at: new Date()
            };
            await this.databaseService.saveToken(tokenData);
            this.logger.log('💾 OAuth2 token saved successfully', {
                domain: tokenData.domain,
                expiresAt: tokenData.expires_at,
                memberId: tokenData.member_id
            });
            return {
                domain: tokenData.domain,
                hasToken: true,
                expiresAt: tokenData.expires_at,
                memberId: tokenData.member_id,
                scope: tokenData.scope,
                method: 'oauth2'
            };
        }
        catch (error) {
            this.logger.error('❌ Installation processing failed', {
                error: error.message,
                authData: {
                    domain: authData.domain || authData.DOMAIN,
                    hasAccessToken: !!(authData.access_token || authData.AUTH_ID),
                    method: authData.method
                }
            });
            throw error;
        }
    }
    async processSimplifiedAuth(authData) {
        try {
            this.logger.log('🔧 Processing simplified auth', {
                domain: authData.domain,
                memberId: authData.member_id,
                authExpires: authData.authExpires,
                fullAuthData: authData
            });
            const accessToken = await this.generateAccessTokenForSimplifiedAuth(authData);
            this.logger.log('🔑 Generated access token for simplified auth', {
                tokenLength: accessToken.length,
                domain: authData.domain
            });
            const expiresAt = new Date();
            const expiresIn = parseInt(authData.authExpires || '3600');
            expiresAt.setSeconds(expiresAt.getSeconds() + expiresIn);
            const tokenData = {
                access_token: accessToken,
                expires_in: expiresIn,
                expires_at: expiresAt,
                domain: authData.domain,
                member_id: authData.member_id,
                status: authData.status,
                method: 'simplified_auth',
                created_at: new Date(),
                updated_at: new Date()
            };
            this.logger.log('💾 Saving simplified auth token to database', {
                tokenData: {
                    ...tokenData,
                    access_token: '***MASKED***'
                }
            });
            await this.databaseService.saveToken(tokenData);
            this.logger.log('💾 Simplified auth token saved successfully', {
                domain: tokenData.domain,
                expiresAt: tokenData.expires_at,
                memberId: tokenData.member_id
            });
            return {
                domain: tokenData.domain,
                hasToken: true,
                expiresAt: tokenData.expires_at,
                memberId: tokenData.member_id,
                method: 'simplified_auth'
            };
        }
        catch (error) {
            this.logger.error('❌ Simplified auth processing failed', {
                error: error.message,
                stack: error.stack,
                domain: authData.domain,
                authData: authData
            });
            throw error;
        }
    }
    async callBitrixAPIWithSimplifiedAuth(method, params, token) {
        try {
            this.logger.log('🔧 Calling Bitrix24 API with simplified auth', {
                method,
                domain: token.domain,
                memberId: token.member_id
            });
            const webhookUrl = `https://${token.domain}/rest/${token.member_id}/${this.clientSecret}/${method}`;
            const response = await (0, rxjs_1.firstValueFrom)(this.httpService.post(webhookUrl, params, {
                timeout: this.apiTimeout,
                headers: {
                    'Content-Type': 'application/json'
                }
            }));
            const result = response.data;
            this.logger.log('✅ Simplified auth API call successful', {
                method,
                hasResult: !!result.result,
                total: result.total
            });
            return {
                success: true,
                result: result.result,
                total: result.total,
                time: result.time || null,
                next: result.next || null
            };
        }
        catch (error) {
            this.logger.error('❌ Simplified auth API call failed', {
                method,
                error: error.message,
                response: error.response?.data
            });
            throw error;
        }
    }
    async generateAccessTokenForSimplifiedAuth(authData) {
        try {
            const clientId = this.configService.get('BITRIX24_CLIENT_ID');
            const clientSecret = this.configService.get('BITRIX24_CLIENT_SECRET');
            const domain = authData.domain;
            if (!clientId || !clientSecret || !domain) {
                throw new Error('Missing required configuration for simplified auth');
            }
            const tokenBase = `${clientId}:${clientSecret}:${domain}:${authData.member_id}`;
            const accessToken = Buffer.from(tokenBase).toString('base64');
            this.logger.log('🔑 Generated access token for simplified auth', {
                domain,
                memberId: authData.member_id
            });
            return accessToken;
        }
        catch (error) {
            this.logger.error('❌ Failed to generate access token for simplified auth', {
                error: error.message
            });
            throw error;
        }
    }
    async exchangeCodeForToken(code, state) {
        try {
            this.logger.log('🔄 Exchanging authorization code for token', {
                hasCode: !!code,
                state
            });
            const tokenUrl = 'https://oauth.bitrix.info/oauth/token/';
            const params = {
                grant_type: 'authorization_code',
                client_id: this.clientId,
                client_secret: this.clientSecret,
                code: code,
                redirect_uri: this.redirectUri
            };
            const response = await (0, rxjs_1.firstValueFrom)(this.httpService.post(tokenUrl, null, {
                params,
                timeout: this.apiTimeout,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }));
            const tokenData = response.data;
            if (tokenData.error) {
                throw new common_1.HttpException(`OAuth error: ${tokenData.error_description || tokenData.error}`, common_1.HttpStatus.BAD_REQUEST);
            }
            this.logger.log('✅ Token exchange successful', {
                hasAccessToken: !!tokenData.access_token,
                hasRefreshToken: !!tokenData.refresh_token,
                expiresIn: tokenData.expires_in,
                scope: tokenData.scope
            });
            const authDto = {
                access_token: tokenData.access_token,
                refresh_token: tokenData.refresh_token,
                expires_in: tokenData.expires_in,
                scope: tokenData.scope,
                domain: tokenData.domain,
                client_endpoint: tokenData.client_endpoint,
                server_endpoint: tokenData.server_endpoint,
                member_id: tokenData.member_id,
                status: tokenData.status
            };
            return await this.processInstallation(authDto);
        }
        catch (error) {
            this.logger.error('❌ Token exchange failed', {
                error: error.message,
                response: error.response?.data
            });
            throw error;
        }
    }
    async getTokenStatus() {
        try {
            const token = await this.databaseService.getCurrentToken();
            if (!token) {
                return {
                    hasToken: false,
                    message: 'No token available. Please complete OAuth authorization.'
                };
            }
            const now = new Date();
            const isExpired = now > token.expires_at;
            const timeRemaining = isExpired ? 0 : Math.round((token.expires_at.getTime() - now.getTime()) / 1000 / 60);
            return {
                hasToken: true,
                domain: token.domain,
                expiresAt: token.expires_at,
                isExpired,
                timeRemaining: isExpired ? 'Expired' : `${timeRemaining} minutes`,
                scope: token.scope,
                memberId: token.member_id,
                status: token.status
            };
        }
        catch (error) {
            this.logger.error('❌ Failed to get token status', error);
            throw error;
        }
    }
    async refreshTokenIfNeeded(force = false) {
        try {
            const token = await this.databaseService.getCurrentToken();
            if (!token) {
                throw new common_1.HttpException('No token available for refresh', common_1.HttpStatus.BAD_REQUEST);
            }
            const now = new Date();
            const isExpired = now > token.expires_at;
            const needsRefresh = force || isExpired;
            if (!needsRefresh) {
                this.logger.log('🔋 Token is still valid, no refresh needed');
                return { refreshed: false, message: 'Token is still valid' };
            }
            this.logger.log('🔄 Refreshing access token', {
                isExpired,
                force,
                expiresAt: token.expires_at
            });
            const tokenUrl = 'https://oauth.bitrix.info/oauth/token/';
            const params = {
                grant_type: 'refresh_token',
                client_id: this.clientId,
                client_secret: this.clientSecret,
                refresh_token: token.refresh_token
            };
            const response = await (0, rxjs_1.firstValueFrom)(this.httpService.post(tokenUrl, null, {
                params,
                timeout: this.apiTimeout,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }));
            const newTokenData = response.data;
            if (newTokenData.error) {
                throw new common_1.HttpException(`Token refresh error: ${newTokenData.error_description || newTokenData.error}`, common_1.HttpStatus.BAD_REQUEST);
            }
            const expiresAt = new Date();
            expiresAt.setSeconds(expiresAt.getSeconds() + newTokenData.expires_in);
            const updatedToken = {
                access_token: newTokenData.access_token,
                refresh_token: newTokenData.refresh_token || token.refresh_token,
                expires_in: newTokenData.expires_in,
                expires_at: expiresAt,
                updated_at: new Date()
            };
            await this.databaseService.updateToken(token.id, updatedToken);
            this.logger.log('✅ Token refreshed successfully', {
                expiresAt,
                expiresIn: newTokenData.expires_in
            });
            return {
                refreshed: true,
                expiresAt,
                expiresIn: newTokenData.expires_in
            };
        }
        catch (error) {
            this.logger.error('❌ Token refresh failed', {
                error: error.message,
                response: error.response?.data
            });
            throw error;
        }
    }
    async callBitrixAPI(method, params = {}) {
        let attempt = 1;
        while (attempt <= this.retryAttempts) {
            try {
                this.logger.log(`🔄 Calling Bitrix24 API (attempt ${attempt})`, {
                    method,
                    hasParams: Object.keys(params).length > 0
                });
                const token = await this.databaseService.getCurrentToken();
                if (!token) {
                    throw new common_1.HttpException('No access token available. Please complete OAuth authorization.', common_1.HttpStatus.UNAUTHORIZED);
                }
                if (token.method === 'simplified_auth') {
                    return await this.callBitrixAPIWithSimplifiedAuth(method, params, token);
                }
                const now = new Date();
                if (token.access_token && now > token.expires_at) {
                    this.logger.log('🔄 Token expired, refreshing...');
                    await this.refreshTokenIfNeeded();
                    const updatedToken = await this.databaseService.getCurrentToken();
                    if (!updatedToken) {
                        throw new common_1.HttpException('Failed to refresh token', common_1.HttpStatus.UNAUTHORIZED);
                    }
                }
                const baseUrl = token.client_endpoint || `https://${token.domain}/rest/`;
                const apiUrl = `${baseUrl}${method}`;
                const requestData = {
                    ...params,
                    auth: token.access_token
                };
                const response = await (0, rxjs_1.firstValueFrom)(this.httpService.post(apiUrl, requestData, {
                    timeout: this.apiTimeout,
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }));
                const result = response.data;
                if (result.error) {
                    if (this.isTokenError(result.error)) {
                        this.logger.warn('🔄 Token error detected, attempting refresh', {
                            error: result.error,
                            attempt
                        });
                        if (attempt < this.retryAttempts) {
                            await this.refreshTokenIfNeeded(true);
                            attempt++;
                            continue;
                        }
                    }
                    throw new common_1.HttpException(`Bitrix24 API error: ${result.error_description || result.error}`, common_1.HttpStatus.BAD_REQUEST);
                }
                this.logger.log('✅ Bitrix24 API call successful', {
                    method,
                    hasResult: !!result.result,
                    total: result.total,
                    time: result.time?.duration
                });
                return {
                    success: true,
                    result: result.result,
                    total: result.total,
                    time: result.time
                };
            }
            catch (error) {
                this.logger.error(`❌ Bitrix24 API call failed (attempt ${attempt})`, {
                    method,
                    error: error.message,
                    response: error.response?.data,
                    status: error.response?.status
                });
                if (attempt === this.retryAttempts || !this.isRetryableError(error)) {
                    throw new common_1.HttpException(`Bitrix24 API call failed: ${error.message}`, error.response?.status || common_1.HttpStatus.INTERNAL_SERVER_ERROR);
                }
                await this.sleep(this.retryDelay * attempt);
                attempt++;
            }
        }
    }
    isTokenError(error) {
        const tokenErrors = [
            'expired_token',
            'invalid_token',
            'WRONG_AUTH_TYPE',
            'unauthorized'
        ];
        return tokenErrors.some(tokenError => error.toLowerCase().includes(tokenError.toLowerCase()));
    }
    isRetryableError(error) {
        if (!error.response)
            return true;
        const status = error.response.status;
        return status >= 500 || status === 429;
    }
    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
};
exports.Bitrix24Service = Bitrix24Service;
exports.Bitrix24Service = Bitrix24Service = Bitrix24Service_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof config_1.ConfigService !== "undefined" && config_1.ConfigService) === "function" ? _a : Object, typeof (_b = typeof axios_1.HttpService !== "undefined" && axios_1.HttpService) === "function" ? _b : Object, typeof (_c = typeof database_service_1.DatabaseService !== "undefined" && database_service_1.DatabaseService) === "function" ? _c : Object])
], Bitrix24Service);


/***/ }),
/* 10 */
/***/ ((module) => {

module.exports = require("rxjs");

/***/ }),
/* 11 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var DatabaseService_1;
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.DatabaseService = void 0;
const common_1 = __webpack_require__(2);
const config_1 = __webpack_require__(4);
const sqlite3 = __webpack_require__(12);
const path = __webpack_require__(13);
const fs = __webpack_require__(14);
class DatabaseWrapper {
    constructor(db) {
        this.db = db;
    }
    exec(sql) {
        return new Promise((resolve, reject) => {
            this.db.exec(sql, (err) => {
                if (err)
                    reject(err);
                else
                    resolve();
            });
        });
    }
    get(sql, params) {
        return new Promise((resolve, reject) => {
            this.db.get(sql, params || [], (err, row) => {
                if (err)
                    reject(err);
                else
                    resolve(row);
            });
        });
    }
    all(sql, params) {
        return new Promise((resolve, reject) => {
            this.db.all(sql, params || [], (err, rows) => {
                if (err)
                    reject(err);
                else
                    resolve(rows);
            });
        });
    }
    run(sql, params) {
        return new Promise((resolve, reject) => {
            this.db.run(sql, params || [], function (err) {
                if (err)
                    reject(err);
                else
                    resolve({ lastID: this.lastID, changes: this.changes });
            });
        });
    }
    close() {
        return new Promise((resolve, reject) => {
            this.db.close((err) => {
                if (err)
                    reject(err);
                else
                    resolve();
            });
        });
    }
}
let DatabaseService = DatabaseService_1 = class DatabaseService {
    constructor(configService) {
        this.configService = configService;
        this.logger = new common_1.Logger(DatabaseService_1.name);
        this.dbPath = this.configService.get('DATABASE_PATH') || './database.sqlite';
    }
    async onModuleInit() {
        await this.initializeDatabase();
    }
    async initializeDatabase() {
        try {
            const dbDir = path.dirname(this.dbPath);
            if (!fs.existsSync(dbDir)) {
                fs.mkdirSync(dbDir, { recursive: true });
            }
            this.db = await this.openDatabase();
            await this.createTables();
            this.logger.log(`🗄️ Database initialized at ${this.dbPath}`);
        }
        catch (error) {
            this.logger.error('❌ Database initialization failed:', error);
            throw error;
        }
    }
    async openDatabase() {
        return new Promise((resolve, reject) => {
            const db = new sqlite3.Database(this.dbPath, (err) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(new DatabaseWrapper(db));
                }
            });
        });
    }
    async createTables() {
        const createTokensTable = `
      CREATE TABLE IF NOT EXISTS tokens (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        access_token TEXT,
        refresh_token TEXT,
        expires_in INTEGER,
        expires_at TEXT,
        domain TEXT,
        scope TEXT,
        client_endpoint TEXT,
        server_endpoint TEXT,
        member_id TEXT,
        status TEXT DEFAULT 'active',
        application_token TEXT,
        method TEXT DEFAULT 'oauth2',
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
      )
    `;
        await this.db.exec(createTokensTable);
        const createIndexes = `
      CREATE INDEX IF NOT EXISTS idx_tokens_domain ON tokens(domain);
      CREATE INDEX IF NOT EXISTS idx_tokens_member_id ON tokens(member_id);
      CREATE INDEX IF NOT EXISTS idx_tokens_created_at ON tokens(created_at);
      CREATE INDEX IF NOT EXISTS idx_tokens_method ON tokens(method);
    `;
        await this.db.exec(createIndexes);
        this.logger.log('✅ Database tables created/verified');
    }
    async saveToken(tokenData) {
        try {
            this.logger.log('💾 Saving token to database', {
                domain: tokenData.domain,
                expiresAt: tokenData.expires_at,
                memberId: tokenData.member_id
            });
            if (tokenData.domain || tokenData.member_id) {
                await this.deleteExistingTokens(tokenData.domain, tokenData.member_id);
            }
            const insertSQL = `
        INSERT INTO tokens (
          access_token, refresh_token, expires_in, expires_at,
          domain, scope, client_endpoint, server_endpoint,
          member_id, status, application_token, method, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;
            const result = await this.db.run(insertSQL, [
                tokenData.access_token || null,
                tokenData.refresh_token || null,
                tokenData.expires_in || null,
                tokenData.expires_at.toISOString(),
                tokenData.domain,
                tokenData.scope,
                tokenData.client_endpoint,
                tokenData.server_endpoint,
                tokenData.member_id,
                tokenData.status,
                tokenData.application_token,
                tokenData.method || 'oauth2',
                new Date().toISOString(),
                new Date().toISOString()
            ]);
            this.logger.log('✅ Token saved successfully', {
                tokenId: result.lastID,
                domain: tokenData.domain
            });
            return result.lastID;
        }
        catch (error) {
            this.logger.error('❌ Failed to save token', {
                error: error.message,
                domain: tokenData.domain
            });
            throw error;
        }
    }
    async getCurrentToken() {
        try {
            const selectSQL = `
        SELECT * FROM tokens 
        ORDER BY created_at DESC 
        LIMIT 1
      `;
            const row = await this.db.get(selectSQL);
            if (!row) {
                this.logger.log('📋 No token found in database');
                return null;
            }
            const token = {
                id: row.id,
                access_token: row.access_token,
                refresh_token: row.refresh_token,
                expires_in: row.expires_in,
                expires_at: new Date(row.expires_at),
                domain: row.domain,
                scope: row.scope,
                client_endpoint: row.client_endpoint,
                server_endpoint: row.server_endpoint,
                member_id: row.member_id,
                status: row.status,
                application_token: row.application_token,
                method: row.method,
                created_at: new Date(row.created_at),
                updated_at: new Date(row.updated_at)
            };
            this.logger.log('📋 Token retrieved from database', {
                tokenId: token.id,
                domain: token.domain,
                expiresAt: token.expires_at
            });
            return token;
        }
        catch (error) {
            this.logger.error('❌ Failed to get current token', {
                error: error.message
            });
            throw error;
        }
    }
    async updateToken(tokenId, updates) {
        try {
            this.logger.log('🔄 Updating token in database', {
                tokenId,
                updateFields: Object.keys(updates)
            });
            const setClause = [];
            const values = [];
            if (updates.access_token) {
                setClause.push('access_token = ?');
                values.push(updates.access_token);
            }
            if (updates.refresh_token) {
                setClause.push('refresh_token = ?');
                values.push(updates.refresh_token);
            }
            if (updates.expires_in) {
                setClause.push('expires_in = ?');
                values.push(updates.expires_in);
            }
            if (updates.expires_at) {
                setClause.push('expires_at = ?');
                values.push(updates.expires_at.toISOString());
            }
            setClause.push('updated_at = ?');
            values.push(new Date().toISOString());
            if (setClause.length === 1) {
                this.logger.log('ℹ️ No fields to update besides timestamp');
                return;
            }
            values.push(tokenId);
            const updateSQL = `
        UPDATE tokens 
        SET ${setClause.join(', ')} 
        WHERE id = ?
      `;
            const result = await this.db.run(updateSQL, values);
            if (result.changes === 0) {
                throw new Error(`No token found with ID: ${tokenId}`);
            }
            this.logger.log('✅ Token updated successfully', {
                tokenId,
                changes: result.changes
            });
        }
        catch (error) {
            this.logger.error('❌ Failed to update token', {
                error: error.message,
                tokenId
            });
            throw error;
        }
    }
    async deleteExistingTokens(domain, memberId) {
        try {
            let deleteSQL = 'DELETE FROM tokens WHERE 1=1';
            const params = [];
            if (domain) {
                deleteSQL += ' AND domain = ?';
                params.push(domain);
            }
            if (memberId) {
                deleteSQL += ' AND member_id = ?';
                params.push(memberId);
            }
            if (params.length === 0) {
                return;
            }
            const result = await this.db.run(deleteSQL, params);
            if (result.changes > 0) {
                this.logger.log('🗑️ Deleted existing tokens', {
                    deletedCount: result.changes,
                    domain,
                    memberId
                });
            }
        }
        catch (error) {
            this.logger.error('❌ Failed to delete existing tokens', {
                error: error.message,
                domain,
                memberId
            });
        }
    }
    async getAllTokens() {
        try {
            const selectSQL = `
        SELECT * FROM tokens 
        ORDER BY created_at DESC
      `;
            const rows = await this.db.all(selectSQL);
            const tokens = rows.map(row => ({
                id: row.id,
                access_token: row.access_token,
                refresh_token: row.refresh_token,
                expires_in: row.expires_in,
                expires_at: new Date(row.expires_at),
                domain: row.domain,
                scope: row.scope,
                client_endpoint: row.client_endpoint,
                server_endpoint: row.server_endpoint,
                member_id: row.member_id,
                status: row.status,
                application_token: row.application_token,
                method: row.method,
                created_at: new Date(row.created_at),
                updated_at: new Date(row.updated_at)
            }));
            this.logger.log('📋 Retrieved all tokens', {
                count: tokens.length
            });
            return tokens;
        }
        catch (error) {
            this.logger.error('❌ Failed to get all tokens', {
                error: error.message
            });
            throw error;
        }
    }
    async deleteAllTokens() {
        try {
            const result = await this.db.run('DELETE FROM tokens');
            this.logger.log('🗑️ Deleted all tokens', {
                deletedCount: result.changes
            });
            return result.changes;
        }
        catch (error) {
            this.logger.error('❌ Failed to delete all tokens', {
                error: error.message
            });
            throw error;
        }
    }
    async closeConnection() {
        if (this.db) {
            await this.db.close();
            this.logger.log('📊 Database connection closed');
        }
    }
};
exports.DatabaseService = DatabaseService;
exports.DatabaseService = DatabaseService = DatabaseService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof config_1.ConfigService !== "undefined" && config_1.ConfigService) === "function" ? _a : Object])
], DatabaseService);


/***/ }),
/* 12 */
/***/ ((module) => {

module.exports = require("sqlite3");

/***/ }),
/* 13 */
/***/ ((module) => {

module.exports = require("path");

/***/ }),
/* 14 */
/***/ ((module) => {

module.exports = require("fs");

/***/ }),
/* 15 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.BitrixAuthDto = void 0;
const class_validator_1 = __webpack_require__(16);
const swagger_1 = __webpack_require__(3);
class BitrixAuthDto {
}
exports.BitrixAuthDto = BitrixAuthDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Access token for Bitrix24 API (OAuth2)',
        example: 'a1b2c3d4e5f6g7h8i9j0'
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], BitrixAuthDto.prototype, "access_token", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Auth ID from Bitrix24 (alternative to access_token)',
        example: 'auth_id_here'
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], BitrixAuthDto.prototype, "AUTH_ID", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Refresh token for token renewal (OAuth2)',
        example: 'r1e2f3r4e5s6h7t8o9k0'
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], BitrixAuthDto.prototype, "refresh_token", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Refresh ID from Bitrix24 (alternative to refresh_token)',
        example: 'refresh_id_here'
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], BitrixAuthDto.prototype, "REFRESH_ID", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Token expiration time in seconds',
        example: 3600
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], BitrixAuthDto.prototype, "expires_in", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Auth expiration from Bitrix24',
        example: '3600'
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], BitrixAuthDto.prototype, "AUTH_EXPIRES", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Authorization scope',
        example: 'crm'
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], BitrixAuthDto.prototype, "scope", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Bitrix24 domain',
        example: 'company.bitrix24.com'
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], BitrixAuthDto.prototype, "domain", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Bitrix24 domain from URL parameter',
        example: 'company.bitrix24.com'
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], BitrixAuthDto.prototype, "DOMAIN", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Protocol version',
        example: '1'
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], BitrixAuthDto.prototype, "PROTOCOL", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Language code',
        example: 'vn'
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], BitrixAuthDto.prototype, "LANG", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Application session ID',
        example: '2d475fca884753909e8d03a28d4f9881'
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], BitrixAuthDto.prototype, "APP_SID", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Server endpoint URL',
        example: 'https://oauth.bitrix.info/rest/'
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], BitrixAuthDto.prototype, "server_endpoint", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Client endpoint URL',
        example: 'https://company.bitrix24.com/rest/'
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], BitrixAuthDto.prototype, "client_endpoint", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Member ID in Bitrix24',
        example: 'abcd1234-5678-9012-3456-789012345678'
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], BitrixAuthDto.prototype, "member_id", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Application status',
        example: 'L'
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], BitrixAuthDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Application token',
        example: 'app_token_here'
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], BitrixAuthDto.prototype, "application_token", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Authorization method (oauth2, simplified_auth)',
        example: 'simplified_auth'
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], BitrixAuthDto.prototype, "method", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Placement information',
        example: 'DEFAULT'
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], BitrixAuthDto.prototype, "placement", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Placement from Bitrix24',
        example: 'DEFAULT'
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], BitrixAuthDto.prototype, "PLACEMENT", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Placement options from Bitrix24',
        example: '{}'
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], BitrixAuthDto.prototype, "PLACEMENT_OPTIONS", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Auth expiration time for simplified auth',
        example: '3600'
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], BitrixAuthDto.prototype, "authExpires", void 0);


/***/ }),
/* 16 */
/***/ ((module) => {

module.exports = require("class-validator");

/***/ }),
/* 17 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ContactListQueryDto = exports.ApiCallDto = void 0;
const class_validator_1 = __webpack_require__(16);
const swagger_1 = __webpack_require__(3);
class ApiCallDto {
}
exports.ApiCallDto = ApiCallDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Bitrix24 API method name',
        example: 'crm.contact.list'
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ApiCallDto.prototype, "method", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Parameters for the API call',
        example: { select: ['ID', 'NAME', 'EMAIL'] }
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", typeof (_a = typeof Record !== "undefined" && Record) === "function" ? _a : Object)
], ApiCallDto.prototype, "params", void 0);
class ContactListQueryDto {
}
exports.ContactListQueryDto = ContactListQueryDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Number of contacts to return',
        example: 10
    }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], ContactListQueryDto.prototype, "limit", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Offset for pagination',
        example: 0
    }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], ContactListQueryDto.prototype, "start", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Fields to select',
        example: 'ID,NAME,EMAIL,PHONE'
    }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], ContactListQueryDto.prototype, "select", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Filter conditions (JSON string)',
        example: '{"NAME": "John"}'
    }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], ContactListQueryDto.prototype, "filter", void 0);


/***/ }),
/* 18 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var Bitrix24ApiController_1;
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Bitrix24ApiController = void 0;
const common_1 = __webpack_require__(2);
const swagger_1 = __webpack_require__(3);
const bitrix24_service_1 = __webpack_require__(9);
const api_call_dto_1 = __webpack_require__(17);
let Bitrix24ApiController = Bitrix24ApiController_1 = class Bitrix24ApiController {
    constructor(bitrix24Service) {
        this.bitrix24Service = bitrix24Service;
        this.logger = new common_1.Logger(Bitrix24ApiController_1.name);
    }
    async getContacts(query) {
        try {
            this.logger.log('📞 Fetching contacts from Bitrix24', query);
            const params = {};
            if (query.limit)
                params.limit = query.limit;
            if (query.start)
                params.start = query.start;
            if (query.select) {
                params.select = query.select.split(',').map(field => field.trim());
            }
            const result = await this.bitrix24Service.callBitrixAPI('crm.contact.list', params);
            this.logger.log('✅ Contacts fetched successfully', {
                count: result.result?.length || 0,
                total: result.total
            });
            return result;
        }
        catch (error) {
            this.logger.error('❌ Failed to fetch contacts', {
                error: error.message,
                query
            });
            throw new common_1.HttpException(`Failed to fetch contacts: ${error.message}`, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async proxyApiCall(apiCall) {
        try {
            this.logger.log('🔄 Proxying API call to Bitrix24', {
                method: apiCall.method,
                hasParams: !!apiCall.params
            });
            const result = await this.bitrix24Service.callBitrixAPI(apiCall.method, apiCall.params || {});
            this.logger.log('✅ API call completed successfully', {
                method: apiCall.method,
                hasResult: !!result.result
            });
            return result;
        }
        catch (error) {
            this.logger.error('❌ API call failed', {
                method: apiCall.method,
                error: error.message
            });
            throw new common_1.HttpException(`API call failed: ${error.message}`, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getTokenStatus() {
        try {
            const status = await this.bitrix24Service.getTokenStatus();
            this.logger.log('📊 Token status retrieved', status);
            return status;
        }
        catch (error) {
            this.logger.error('❌ Failed to get token status', {
                error: error.message
            });
            throw new common_1.HttpException(`Failed to get token status: ${error.message}`, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async refreshToken() {
        try {
            this.logger.log('🔄 Manual token refresh requested');
            const result = await this.bitrix24Service.refreshTokenIfNeeded(true);
            this.logger.log('✅ Token refreshed successfully', result);
            return {
                success: true,
                message: 'Token refreshed successfully',
                data: result
            };
        }
        catch (error) {
            this.logger.error('❌ Token refresh failed', {
                error: error.message
            });
            throw new common_1.HttpException(`Token refresh failed: ${error.message}`, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
};
exports.Bitrix24ApiController = Bitrix24ApiController;
__decorate([
    (0, common_1.Get)('/contacts'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get contacts from Bitrix24',
        description: 'Retrieves contact list from Bitrix24 CRM'
    }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, description: 'Number of contacts to return' }),
    (0, swagger_1.ApiQuery)({ name: 'start', required: false, description: 'Offset for pagination' }),
    (0, swagger_1.ApiQuery)({ name: 'select', required: false, description: 'Fields to select (comma-separated)' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Contacts retrieved successfully',
        schema: {
            example: {
                success: true,
                result: [
                    {
                        ID: '1',
                        NAME: 'John',
                        LAST_NAME: 'Doe',
                        EMAIL: [{ VALUE: 'john@example.com', VALUE_TYPE: 'WORK' }]
                    }
                ],
                total: 1
            }
        }
    }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_b = typeof api_call_dto_1.ContactListQueryDto !== "undefined" && api_call_dto_1.ContactListQueryDto) === "function" ? _b : Object]),
    __metadata("design:returntype", Promise)
], Bitrix24ApiController.prototype, "getContacts", null);
__decorate([
    (0, common_1.Post)('/api'),
    (0, swagger_1.ApiOperation)({
        summary: 'Generic Bitrix24 API proxy',
        description: 'Makes generic API calls to Bitrix24 REST API'
    }),
    (0, swagger_1.ApiBody)({ type: api_call_dto_1.ApiCallDto }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'API call executed successfully'
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_c = typeof api_call_dto_1.ApiCallDto !== "undefined" && api_call_dto_1.ApiCallDto) === "function" ? _c : Object]),
    __metadata("design:returntype", Promise)
], Bitrix24ApiController.prototype, "proxyApiCall", null);
__decorate([
    (0, common_1.Get)('/token/status'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get token status',
        description: 'Returns current OAuth token status and information'
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Token status retrieved successfully',
        schema: {
            example: {
                hasToken: true,
                domain: 'company.bitrix24.com',
                expiresAt: '2025-08-17T13:00:00.000Z',
                isExpired: false,
                timeRemaining: '45 minutes'
            }
        }
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], Bitrix24ApiController.prototype, "getTokenStatus", null);
__decorate([
    (0, common_1.Post)('/token/refresh'),
    (0, swagger_1.ApiOperation)({
        summary: 'Manually refresh token',
        description: 'Forces refresh of OAuth access token using refresh token'
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Token refreshed successfully'
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], Bitrix24ApiController.prototype, "refreshToken", null);
exports.Bitrix24ApiController = Bitrix24ApiController = Bitrix24ApiController_1 = __decorate([
    (0, swagger_1.ApiTags)('bitrix24-api'),
    (0, common_1.Controller)('api/bitrix24'),
    __metadata("design:paramtypes", [typeof (_a = typeof bitrix24_service_1.Bitrix24Service !== "undefined" && bitrix24_service_1.Bitrix24Service) === "function" ? _a : Object])
], Bitrix24ApiController);


/***/ }),
/* 19 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.DatabaseModule = void 0;
const common_1 = __webpack_require__(2);
const config_1 = __webpack_require__(4);
const database_service_1 = __webpack_require__(11);
let DatabaseModule = class DatabaseModule {
};
exports.DatabaseModule = DatabaseModule;
exports.DatabaseModule = DatabaseModule = __decorate([
    (0, common_1.Global)(),
    (0, common_1.Module)({
        imports: [config_1.ConfigModule],
        providers: [database_service_1.DatabaseService],
        exports: [database_service_1.DatabaseService],
    })
], DatabaseModule);


/***/ }),
/* 20 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ContactsModule = void 0;
const common_1 = __webpack_require__(2);
const contacts_controller_1 = __webpack_require__(21);
const bitrix24_service_1 = __webpack_require__(9);
const database_module_1 = __webpack_require__(19);
const config_1 = __webpack_require__(4);
const axios_1 = __webpack_require__(6);
let ContactsModule = class ContactsModule {
};
exports.ContactsModule = ContactsModule;
exports.ContactsModule = ContactsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule,
            axios_1.HttpModule,
            database_module_1.DatabaseModule
        ],
        controllers: [contacts_controller_1.ContactsController],
        providers: [bitrix24_service_1.Bitrix24Service],
        exports: [bitrix24_service_1.Bitrix24Service]
    })
], ContactsModule);


/***/ }),
/* 21 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var ContactsController_1;
var _a, _b, _c, _d;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ContactsController = void 0;
const common_1 = __webpack_require__(2);
const swagger_1 = __webpack_require__(3);
const bitrix24_service_1 = __webpack_require__(9);
const contact_dto_1 = __webpack_require__(22);
const api_call_dto_1 = __webpack_require__(17);
let ContactsController = ContactsController_1 = class ContactsController {
    constructor(bitrix24Service) {
        this.bitrix24Service = bitrix24Service;
        this.logger = new common_1.Logger(ContactsController_1.name);
    }
    async getContacts(query) {
        try {
            this.logger.log('📞 Fetching contacts from Bitrix24', query);
            const params = {
                order: { DATE_CREATE: 'DESC' }
            };
            if (query.limit)
                params.limit = query.limit;
            if (query.start)
                params.start = query.start;
            if (query.select) {
                params.select = query.select.split(',').map(field => field.trim());
            }
            else {
                params.select = [
                    'ID', 'NAME', 'SECOND_NAME', 'LAST_NAME', 'EMAIL', 'PHONE', 'WEB',
                    'ADDRESS', 'ADDRESS_CITY', 'ADDRESS_REGION', 'ADDRESS_POSTAL_CODE',
                    'ADDRESS_COUNTRY', 'COMMENTS', 'TYPE_ID', 'SOURCE_ID',
                    'DATE_CREATE', 'DATE_MODIFY', 'CREATED_BY_ID', 'MODIFY_BY_ID'
                ];
            }
            if (query.filter) {
                try {
                    params.filter = JSON.parse(query.filter);
                }
                catch (error) {
                    throw new common_1.HttpException('Invalid filter format. Must be valid JSON.', common_1.HttpStatus.BAD_REQUEST);
                }
            }
            const result = await this.bitrix24Service.callBitrixAPI('crm.contact.list', params);
            this.logger.log('✅ Contacts fetched successfully', {
                count: result.result?.length || 0,
                total: result.total
            });
            return {
                success: true,
                data: result.result || [],
                total: result.total || 0,
                has_more: result.next || false
            };
        }
        catch (error) {
            this.logger.error('❌ Failed to fetch contacts', {
                error: error.message,
                query
            });
            throw new common_1.HttpException(`Failed to fetch contacts: ${error.message}`, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getContactById(id) {
        try {
            this.logger.log('📞 Fetching contact by ID', { id });
            const contactResult = await this.bitrix24Service.callBitrixAPI('crm.contact.get', { id });
            if (!contactResult.result) {
                throw new common_1.HttpException('Contact không tồn tại', common_1.HttpStatus.NOT_FOUND);
            }
            let bankInfo = null;
            try {
                const requisitesResult = await this.bitrix24Service.callBitrixAPI('crm.requisite.list', {
                    filter: { ENTITY_TYPE_ID: 3, ENTITY_ID: id }
                });
                if (requisitesResult.result && requisitesResult.result.length > 0) {
                    bankInfo = requisitesResult.result[0];
                }
            }
            catch (error) {
                this.logger.warn('⚠️ Failed to fetch bank info for contact', { id, error: error.message });
            }
            const contact = {
                ...contactResult.result,
                bank_info: bankInfo
            };
            this.logger.log('✅ Contact fetched successfully', { id });
            return {
                success: true,
                data: contact
            };
        }
        catch (error) {
            this.logger.error('❌ Failed to fetch contact', {
                error: error.message,
                id
            });
            if (error instanceof common_1.HttpException) {
                throw error;
            }
            throw new common_1.HttpException(`Failed to fetch contact: ${error.message}`, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async createContact(createContactDto) {
        try {
            this.logger.log('📞 Creating new contact', {
                name: createContactDto.name,
                hasEmail: !!createContactDto.email,
                hasPhone: !!createContactDto.phone,
                hasBankInfo: !!createContactDto.bank_info
            });
            const contactData = {
                NAME: createContactDto.name,
                TYPE_ID: createContactDto.type_id || 'CLIENT',
                SOURCE_ID: createContactDto.source_id || 'WEB'
            };
            if (createContactDto.second_name)
                contactData.SECOND_NAME = createContactDto.second_name;
            if (createContactDto.last_name)
                contactData.LAST_NAME = createContactDto.last_name;
            if (createContactDto.comments)
                contactData.COMMENTS = createContactDto.comments;
            if (createContactDto.email) {
                contactData.EMAIL = [{ VALUE: createContactDto.email, VALUE_TYPE: 'WORK' }];
            }
            if (createContactDto.phone) {
                contactData.PHONE = [{ VALUE: createContactDto.phone, VALUE_TYPE: 'WORK' }];
            }
            if (createContactDto.website) {
                contactData.WEB = [{ VALUE: createContactDto.website, VALUE_TYPE: 'WORK' }];
            }
            if (createContactDto.address) {
                const addr = createContactDto.address;
                if (addr.address)
                    contactData.ADDRESS = addr.address;
                if (addr.province)
                    contactData.ADDRESS_CITY = addr.province;
                if (addr.district)
                    contactData.ADDRESS_REGION = addr.district;
                if (addr.postal_code)
                    contactData.ADDRESS_POSTAL_CODE = addr.postal_code;
                if (addr.ward) {
                    const fullAddress = [addr.address, addr.ward].filter(Boolean).join(', ');
                    contactData.ADDRESS = fullAddress;
                }
            }
            const result = await this.bitrix24Service.callBitrixAPI('crm.contact.add', { fields: contactData });
            if (!result.result) {
                throw new common_1.HttpException('Failed to create contact in Bitrix24', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
            }
            const contactId = result.result;
            let bankResult = null;
            if (createContactDto.bank_info) {
                try {
                    const requisiteData = {
                        ENTITY_TYPE_ID: 3,
                        ENTITY_ID: contactId,
                        PRESET_ID: 1,
                        NAME: createContactDto.bank_info.bank_name,
                        RQ_BANK_NAME: createContactDto.bank_info.bank_name,
                        RQ_ACC_NUM: createContactDto.bank_info.account_number
                    };
                    if (createContactDto.bank_info.account_holder) {
                        requisiteData['RQ_ACC_NAME'] = createContactDto.bank_info.account_holder;
                    }
                    if (createContactDto.bank_info.branch) {
                        requisiteData['RQ_BANK_ADDR'] = createContactDto.bank_info.branch;
                    }
                    bankResult = await this.bitrix24Service.callBitrixAPI('crm.requisite.add', {
                        fields: requisiteData
                    });
                    this.logger.log('✅ Bank info added to contact', {
                        contactId,
                        requisiteId: bankResult.result
                    });
                }
                catch (error) {
                    this.logger.warn('⚠️ Failed to add bank info', {
                        contactId,
                        error: error.message
                    });
                }
            }
            this.logger.log('✅ Contact created successfully', {
                contactId,
                hasBankInfo: !!bankResult?.result
            });
            return {
                success: true,
                message: 'Contact được tạo thành công',
                data: {
                    ID: contactId,
                    bank_requisite_id: bankResult?.result || null,
                    created_at: new Date().toISOString()
                }
            };
        }
        catch (error) {
            this.logger.error('❌ Failed to create contact', {
                error: error.message,
                contactData: {
                    name: createContactDto.name,
                    email: createContactDto.email,
                    phone: createContactDto.phone
                }
            });
            if (error instanceof common_1.HttpException) {
                throw error;
            }
            throw new common_1.HttpException(`Failed to create contact: ${error.message}`, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async updateContact(id, updateContactDto) {
        try {
            this.logger.log('📞 Updating contact', {
                id,
                hasEmail: !!updateContactDto.email,
                hasPhone: !!updateContactDto.phone,
                hasBankInfo: !!updateContactDto.bank_info
            });
            const existingContact = await this.bitrix24Service.callBitrixAPI('crm.contact.get', { id });
            if (!existingContact.result) {
                throw new common_1.HttpException('Contact không tồn tại', common_1.HttpStatus.NOT_FOUND);
            }
            const updateData = {};
            if (updateContactDto.name)
                updateData.NAME = updateContactDto.name;
            if (updateContactDto.second_name)
                updateData.SECOND_NAME = updateContactDto.second_name;
            if (updateContactDto.last_name)
                updateData.LAST_NAME = updateContactDto.last_name;
            if (updateContactDto.comments)
                updateData.COMMENTS = updateContactDto.comments;
            if (updateContactDto.type_id)
                updateData.TYPE_ID = updateContactDto.type_id;
            if (updateContactDto.source_id)
                updateData.SOURCE_ID = updateContactDto.source_id;
            if (updateContactDto.email) {
                updateData.EMAIL = [{ VALUE: updateContactDto.email, VALUE_TYPE: 'WORK' }];
            }
            if (updateContactDto.phone) {
                updateData.PHONE = [{ VALUE: updateContactDto.phone, VALUE_TYPE: 'WORK' }];
            }
            if (updateContactDto.website) {
                updateData.WEB = [{ VALUE: updateContactDto.website, VALUE_TYPE: 'WORK' }];
            }
            if (updateContactDto.address) {
                const addr = updateContactDto.address;
                if (addr.address)
                    updateData.ADDRESS = addr.address;
                if (addr.province)
                    updateData.ADDRESS_CITY = addr.province;
                if (addr.district)
                    updateData.ADDRESS_REGION = addr.district;
                if (addr.postal_code)
                    updateData.ADDRESS_POSTAL_CODE = addr.postal_code;
                if (addr.ward) {
                    const fullAddress = [addr.address, addr.ward].filter(Boolean).join(', ');
                    updateData.ADDRESS = fullAddress;
                }
            }
            const result = await this.bitrix24Service.callBitrixAPI('crm.contact.update', {
                id,
                fields: updateData
            });
            let bankResult = null;
            if (updateContactDto.bank_info) {
                try {
                    const existingRequisites = await this.bitrix24Service.callBitrixAPI('crm.requisite.list', {
                        filter: { ENTITY_TYPE_ID: 3, ENTITY_ID: id }
                    });
                    const requisiteData = {
                        NAME: updateContactDto.bank_info.bank_name,
                        RQ_BANK_NAME: updateContactDto.bank_info.bank_name,
                        RQ_ACC_NUM: updateContactDto.bank_info.account_number
                    };
                    if (updateContactDto.bank_info.account_holder) {
                        requisiteData['RQ_ACC_NAME'] = updateContactDto.bank_info.account_holder;
                    }
                    if (updateContactDto.bank_info.branch) {
                        requisiteData['RQ_BANK_ADDR'] = updateContactDto.bank_info.branch;
                    }
                    if (existingRequisites.result && existingRequisites.result.length > 0) {
                        const requisiteId = existingRequisites.result[0].ID;
                        bankResult = await this.bitrix24Service.callBitrixAPI('crm.requisite.update', {
                            id: requisiteId,
                            fields: requisiteData
                        });
                        this.logger.log('✅ Bank info updated', { id, requisiteId });
                    }
                    else {
                        bankResult = await this.bitrix24Service.callBitrixAPI('crm.requisite.add', {
                            fields: {
                                ENTITY_TYPE_ID: 3,
                                ENTITY_ID: id,
                                PRESET_ID: 1,
                                ...requisiteData
                            }
                        });
                        this.logger.log('✅ Bank info created', { id, requisiteId: bankResult.result });
                    }
                }
                catch (error) {
                    this.logger.warn('⚠️ Failed to update bank info', { id, error: error.message });
                }
            }
            this.logger.log('✅ Contact updated successfully', {
                id,
                hasBankUpdate: !!bankResult
            });
            return {
                success: true,
                message: 'Contact được cập nhật thành công',
                data: {
                    ID: id,
                    updated_at: new Date().toISOString(),
                    bank_updated: !!bankResult
                }
            };
        }
        catch (error) {
            this.logger.error('❌ Failed to update contact', {
                error: error.message,
                id
            });
            if (error instanceof common_1.HttpException) {
                throw error;
            }
            throw new common_1.HttpException(`Failed to update contact: ${error.message}`, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async deleteContact(id) {
        try {
            this.logger.log('📞 Deleting contact', { id });
            const existingContact = await this.bitrix24Service.callBitrixAPI('crm.contact.get', { id });
            if (!existingContact.result) {
                throw new common_1.HttpException('Contact không tồn tại', common_1.HttpStatus.NOT_FOUND);
            }
            try {
                const requisitesResult = await this.bitrix24Service.callBitrixAPI('crm.requisite.list', {
                    filter: { ENTITY_TYPE_ID: 3, ENTITY_ID: id }
                });
                if (requisitesResult.result && requisitesResult.result.length > 0) {
                    for (const requisite of requisitesResult.result) {
                        await this.bitrix24Service.callBitrixAPI('crm.requisite.delete', {
                            id: requisite.ID
                        });
                        this.logger.log('✅ Bank info deleted', { contactId: id, requisiteId: requisite.ID });
                    }
                }
            }
            catch (error) {
                this.logger.warn('⚠️ Failed to delete bank info', { id, error: error.message });
            }
            const result = await this.bitrix24Service.callBitrixAPI('crm.contact.delete', { id });
            this.logger.log('✅ Contact deleted successfully', { id });
            return {
                success: true,
                message: 'Contact được xóa thành công',
                data: {
                    ID: id,
                    deleted_at: new Date().toISOString()
                }
            };
        }
        catch (error) {
            this.logger.error('❌ Failed to delete contact', {
                error: error.message,
                id
            });
            if (error instanceof common_1.HttpException) {
                throw error;
            }
            throw new common_1.HttpException(`Failed to delete contact: ${error.message}`, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
};
exports.ContactsController = ContactsController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Lấy danh sách contact',
        description: 'Lấy danh sách contact từ Bitrix24 CRM với phân trang và lọc'
    }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, description: 'Số lượng contact trả về (mặc định: 50)' }),
    (0, swagger_1.ApiQuery)({ name: 'start', required: false, description: 'Vị trí bắt đầu (phân trang)' }),
    (0, swagger_1.ApiQuery)({ name: 'select', required: false, description: 'Các trường cần lấy (cách nhau bởi dấu phẩy)' }),
    (0, swagger_1.ApiQuery)({ name: 'filter', required: false, description: 'Bộ lọc (JSON string)' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Danh sách contact được lấy thành công',
        type: [contact_dto_1.ContactResponseDto]
    }),
    (0, swagger_1.ApiResponse)({
        status: 500,
        description: 'Lỗi server khi lấy danh sách contact'
    }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_b = typeof api_call_dto_1.ContactListQueryDto !== "undefined" && api_call_dto_1.ContactListQueryDto) === "function" ? _b : Object]),
    __metadata("design:returntype", Promise)
], ContactsController.prototype, "getContacts", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({
        summary: 'Lấy thông tin contact theo ID',
        description: 'Lấy thông tin chi tiết contact từ Bitrix24 bao gồm cả thông tin ngân hàng'
    }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'ID của contact' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Thông tin contact được lấy thành công',
        type: contact_dto_1.ContactResponseDto
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Contact không tồn tại'
    }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ContactsController.prototype, "getContactById", null);
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Thêm contact mới',
        description: 'Tạo contact mới trong Bitrix24 CRM bao gồm thông tin địa chỉ và ngân hàng'
    }),
    (0, swagger_1.ApiBody)({ type: contact_dto_1.CreateContactDto }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Contact được tạo thành công',
        schema: {
            example: {
                success: true,
                data: {
                    ID: '10',
                    created_at: '2025-08-17T14:00:00Z'
                }
            }
        }
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Dữ liệu đầu vào không hợp lệ'
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_c = typeof contact_dto_1.CreateContactDto !== "undefined" && contact_dto_1.CreateContactDto) === "function" ? _c : Object]),
    __metadata("design:returntype", Promise)
], ContactsController.prototype, "createContact", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, swagger_1.ApiOperation)({
        summary: 'Cập nhật thông tin contact',
        description: 'Cập nhật thông tin contact trong Bitrix24 CRM bao gồm thông tin địa chỉ và ngân hàng'
    }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'ID của contact cần cập nhật' }),
    (0, swagger_1.ApiBody)({ type: contact_dto_1.UpdateContactDto }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Contact được cập nhật thành công'
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Contact không tồn tại'
    }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, typeof (_d = typeof contact_dto_1.UpdateContactDto !== "undefined" && contact_dto_1.UpdateContactDto) === "function" ? _d : Object]),
    __metadata("design:returntype", Promise)
], ContactsController.prototype, "updateContact", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({
        summary: 'Xóa contact',
        description: 'Xóa contact khỏi Bitrix24 CRM bao gồm cả thông tin ngân hàng liên quan'
    }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'ID của contact cần xóa' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Contact được xóa thành công'
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Contact không tồn tại'
    }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ContactsController.prototype, "deleteContact", null);
exports.ContactsController = ContactsController = ContactsController_1 = __decorate([
    (0, swagger_1.ApiTags)('contacts'),
    (0, common_1.Controller)('contacts'),
    (0, swagger_1.ApiSecurity)('api-key'),
    __metadata("design:paramtypes", [typeof (_a = typeof bitrix24_service_1.Bitrix24Service !== "undefined" && bitrix24_service_1.Bitrix24Service) === "function" ? _a : Object])
], ContactsController);


/***/ }),
/* 22 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ContactResponseDto = exports.UpdateContactDto = exports.CreateContactDto = exports.BankInfoDto = exports.ContactAddressDto = void 0;
const class_validator_1 = __webpack_require__(16);
const swagger_1 = __webpack_require__(3);
const class_transformer_1 = __webpack_require__(23);
class ContactAddressDto {
}
exports.ContactAddressDto = ContactAddressDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Phường/Xã',
        example: 'Phường Bến Nghé'
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ContactAddressDto.prototype, "ward", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Quận/Huyện',
        example: 'Quận 1'
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ContactAddressDto.prototype, "district", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Tỉnh/Thành phố',
        example: 'TP. Hồ Chí Minh'
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ContactAddressDto.prototype, "province", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Địa chỉ chi tiết',
        example: '123 Nguyễn Huệ'
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ContactAddressDto.prototype, "address", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Mã bưu điện',
        example: '700000'
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ContactAddressDto.prototype, "postal_code", void 0);
class BankInfoDto {
}
exports.BankInfoDto = BankInfoDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Tên ngân hàng',
        example: 'Ngân hàng TMCP Công Thương Việt Nam'
    }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], BankInfoDto.prototype, "bank_name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Số tài khoản ngân hàng',
        example: '1234567890123456'
    }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], BankInfoDto.prototype, "account_number", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Tên chủ tài khoản',
        example: 'Nguyễn Văn A'
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], BankInfoDto.prototype, "account_holder", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Chi nhánh ngân hàng',
        example: 'Chi nhánh TP.HCM'
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], BankInfoDto.prototype, "branch", void 0);
class CreateContactDto {
}
exports.CreateContactDto = CreateContactDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Tên contact (bắt buộc)',
        example: 'Nguyễn'
    }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateContactDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Họ đệm',
        example: 'Văn'
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateContactDto.prototype, "second_name", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Họ',
        example: 'A'
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateContactDto.prototype, "last_name", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Số điện thoại',
        example: '+84901234567'
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateContactDto.prototype, "phone", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Email',
        example: 'nguyen.van.a@example.com'
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], CreateContactDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Website',
        example: 'https://example.com'
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUrl)(),
    __metadata("design:type", String)
], CreateContactDto.prototype, "website", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Thông tin địa chỉ',
        type: ContactAddressDto
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => ContactAddressDto),
    __metadata("design:type", ContactAddressDto)
], CreateContactDto.prototype, "address", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Thông tin ngân hàng',
        type: BankInfoDto
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => BankInfoDto),
    __metadata("design:type", BankInfoDto)
], CreateContactDto.prototype, "bank_info", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Ghi chú',
        example: 'Khách hàng VIP'
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateContactDto.prototype, "comments", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Loại contact',
        example: 'CLIENT'
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateContactDto.prototype, "type_id", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Nguồn contact',
        example: 'WEB'
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateContactDto.prototype, "source_id", void 0);
class UpdateContactDto {
}
exports.UpdateContactDto = UpdateContactDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Tên contact',
        example: 'Nguyễn'
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateContactDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Họ đệm',
        example: 'Văn'
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateContactDto.prototype, "second_name", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Họ',
        example: 'A'
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateContactDto.prototype, "last_name", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Số điện thoại',
        example: '+84901234567'
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateContactDto.prototype, "phone", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Email',
        example: 'nguyen.van.a@example.com'
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], UpdateContactDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Website',
        example: 'https://example.com'
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUrl)(),
    __metadata("design:type", String)
], UpdateContactDto.prototype, "website", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Thông tin địa chỉ',
        type: ContactAddressDto
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => ContactAddressDto),
    __metadata("design:type", ContactAddressDto)
], UpdateContactDto.prototype, "address", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Thông tin ngân hàng',
        type: BankInfoDto
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => BankInfoDto),
    __metadata("design:type", BankInfoDto)
], UpdateContactDto.prototype, "bank_info", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Ghi chú',
        example: 'Khách hàng VIP'
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateContactDto.prototype, "comments", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Loại contact',
        example: 'CLIENT'
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateContactDto.prototype, "type_id", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Nguồn contact',
        example: 'WEB'
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateContactDto.prototype, "source_id", void 0);
class ContactResponseDto {
}
exports.ContactResponseDto = ContactResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'ID của contact' }),
    __metadata("design:type", String)
], ContactResponseDto.prototype, "ID", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Tên contact' }),
    __metadata("design:type", String)
], ContactResponseDto.prototype, "NAME", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Họ đệm' }),
    __metadata("design:type", String)
], ContactResponseDto.prototype, "SECOND_NAME", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Họ' }),
    __metadata("design:type", String)
], ContactResponseDto.prototype, "LAST_NAME", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Email' }),
    __metadata("design:type", Array)
], ContactResponseDto.prototype, "EMAIL", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Số điện thoại' }),
    __metadata("design:type", Array)
], ContactResponseDto.prototype, "PHONE", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Website' }),
    __metadata("design:type", Array)
], ContactResponseDto.prototype, "WEB", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Địa chỉ' }),
    __metadata("design:type", String)
], ContactResponseDto.prototype, "ADDRESS", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Thành phố' }),
    __metadata("design:type", String)
], ContactResponseDto.prototype, "ADDRESS_CITY", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Vùng/Tỉnh' }),
    __metadata("design:type", String)
], ContactResponseDto.prototype, "ADDRESS_REGION", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Mã bưu điện' }),
    __metadata("design:type", String)
], ContactResponseDto.prototype, "ADDRESS_POSTAL_CODE", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Quốc gia' }),
    __metadata("design:type", String)
], ContactResponseDto.prototype, "ADDRESS_COUNTRY", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Ghi chú' }),
    __metadata("design:type", String)
], ContactResponseDto.prototype, "COMMENTS", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Loại contact' }),
    __metadata("design:type", String)
], ContactResponseDto.prototype, "TYPE_ID", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Nguồn contact' }),
    __metadata("design:type", String)
], ContactResponseDto.prototype, "SOURCE_ID", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Ngày tạo' }),
    __metadata("design:type", String)
], ContactResponseDto.prototype, "DATE_CREATE", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Ngày sửa đổi' }),
    __metadata("design:type", String)
], ContactResponseDto.prototype, "DATE_MODIFY", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Người tạo' }),
    __metadata("design:type", String)
], ContactResponseDto.prototype, "CREATED_BY_ID", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Người sửa đổi' }),
    __metadata("design:type", String)
], ContactResponseDto.prototype, "MODIFY_BY_ID", void 0);


/***/ }),
/* 23 */
/***/ ((module) => {

module.exports = require("class-transformer");

/***/ }),
/* 24 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var HealthController_1;
var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.HealthController = void 0;
const common_1 = __webpack_require__(2);
const swagger_1 = __webpack_require__(3);
const database_service_1 = __webpack_require__(11);
const bitrix24_service_1 = __webpack_require__(9);
let HealthController = HealthController_1 = class HealthController {
    constructor(databaseService, bitrix24Service) {
        this.databaseService = databaseService;
        this.bitrix24Service = bitrix24Service;
        this.logger = new common_1.Logger(HealthController_1.name);
    }
    async check() {
        const health = {
            status: 'ok',
            info: {},
            error: {},
            details: {},
            timestamp: new Date().toISOString()
        };
        try {
            const dbHealth = await this.checkDatabase();
            health.info['database'] = dbHealth;
            health.details['database'] = dbHealth;
        }
        catch (error) {
            health.status = 'error';
            health.error['database'] = { status: 'down', message: error.message };
            health.details['database'] = { status: 'down', message: error.message };
        }
        try {
            const bitrixHealth = await this.checkBitrix24();
            health.info['bitrix24'] = bitrixHealth;
            health.details['bitrix24'] = bitrixHealth;
        }
        catch (error) {
            health.error['bitrix24'] = { status: 'down', message: error.message };
            health.details['bitrix24'] = { status: 'down', message: error.message };
        }
        const memoryHealth = this.checkMemory();
        health.info['memory'] = memoryHealth;
        health.details['memory'] = memoryHealth;
        this.logger.log('🏥 Health check completed', {
            status: health.status,
            checks: Object.keys(health.info).length
        });
        return health;
    }
    async checkDatabase() {
        try {
            await this.databaseService.getCurrentToken();
            return { status: 'up', message: 'Database connection successful' };
        }
        catch (error) {
            throw new Error(`Database connection failed: ${error.message}`);
        }
    }
    async checkBitrix24() {
        try {
            const tokenStatus = await this.bitrix24Service.getTokenStatus();
            return {
                status: 'up',
                hasToken: tokenStatus.hasToken,
                domain: tokenStatus.domain,
                isExpired: tokenStatus.isExpired,
                message: tokenStatus.hasToken ? 'Token available' : 'No token available'
            };
        }
        catch (error) {
            throw new Error(`Bitrix24 integration failed: ${error.message}`);
        }
    }
    checkMemory() {
        const memoryUsage = process.memoryUsage();
        const memoryLimitMB = 200;
        const usedMB = Math.round(memoryUsage.heapUsed / 1024 / 1024);
        return {
            status: usedMB < memoryLimitMB ? 'up' : 'warning',
            heapUsed: `${usedMB}MB`,
            heapTotal: `${Math.round(memoryUsage.heapTotal / 1024 / 1024)}MB`,
            rss: `${Math.round(memoryUsage.rss / 1024 / 1024)}MB`,
            external: `${Math.round(memoryUsage.external / 1024 / 1024)}MB`,
        };
    }
    simpleCheck() {
        return {
            status: 'ok',
            timestamp: new Date().toISOString(),
            uptime: process.uptime(),
            version: process.env.npm_package_version || '1.0.0',
            node: process.version,
            platform: process.platform,
            arch: process.arch,
            memory: process.memoryUsage(),
        };
    }
};
exports.HealthController = HealthController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Health check',
        description: 'Comprehensive health check including database and Bitrix24 integration'
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Health check passed',
        schema: {
            example: {
                status: 'ok',
                info: {
                    database: { status: 'up' },
                    bitrix24: { status: 'up', hasToken: true },
                    memory: { status: 'up' }
                },
                timestamp: '2025-08-17T12:00:00.000Z'
            }
        }
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], HealthController.prototype, "check", null);
__decorate([
    (0, common_1.Get)('/simple'),
    (0, swagger_1.ApiOperation)({
        summary: 'Simple health check',
        description: 'Basic health check without dependencies'
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Service is running',
        schema: {
            example: {
                status: 'ok',
                timestamp: '2025-08-17T12:00:00.000Z',
                uptime: 3600,
                version: '1.0.0'
            }
        }
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], HealthController.prototype, "simpleCheck", null);
exports.HealthController = HealthController = HealthController_1 = __decorate([
    (0, swagger_1.ApiTags)('health'),
    (0, common_1.Controller)('health'),
    __metadata("design:paramtypes", [typeof (_a = typeof database_service_1.DatabaseService !== "undefined" && database_service_1.DatabaseService) === "function" ? _a : Object, typeof (_b = typeof bitrix24_service_1.Bitrix24Service !== "undefined" && bitrix24_service_1.Bitrix24Service) === "function" ? _b : Object])
], HealthController);


/***/ }),
/* 25 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var AllExceptionsFilter_1;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AllExceptionsFilter = void 0;
const common_1 = __webpack_require__(2);
let AllExceptionsFilter = AllExceptionsFilter_1 = class AllExceptionsFilter {
    constructor() {
        this.logger = new common_1.Logger(AllExceptionsFilter_1.name);
    }
    catch(exception, host) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const request = ctx.getRequest();
        let status;
        let message;
        let error;
        if (exception instanceof common_1.HttpException) {
            status = exception.getStatus();
            const exceptionResponse = exception.getResponse();
            if (typeof exceptionResponse === 'string') {
                message = exceptionResponse;
                error = exception.constructor.name;
            }
            else {
                message = exceptionResponse.message || exception.message;
                error = exceptionResponse.error || exception.constructor.name;
            }
        }
        else if (exception instanceof Error) {
            status = common_1.HttpStatus.INTERNAL_SERVER_ERROR;
            message = exception.message || 'Internal server error';
            error = exception.constructor.name;
        }
        else {
            status = common_1.HttpStatus.INTERNAL_SERVER_ERROR;
            message = 'Unknown error occurred';
            error = 'UnknownError';
        }
        const errorResponse = {
            success: false,
            statusCode: status,
            error,
            message,
            timestamp: new Date().toISOString(),
            path: request.url,
            method: request.method,
        };
        this.logger.error('❌ Exception caught by global filter', {
            ...errorResponse,
            userAgent: request.get('User-Agent'),
            ip: request.ip,
            stack: exception instanceof Error ? exception.stack : undefined,
        });
        response.status(status).json(errorResponse);
    }
};
exports.AllExceptionsFilter = AllExceptionsFilter;
exports.AllExceptionsFilter = AllExceptionsFilter = AllExceptionsFilter_1 = __decorate([
    (0, common_1.Catch)()
], AllExceptionsFilter);


/***/ }),
/* 26 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var LoggingInterceptor_1;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.LoggingInterceptor = void 0;
const common_1 = __webpack_require__(2);
const operators_1 = __webpack_require__(27);
let LoggingInterceptor = LoggingInterceptor_1 = class LoggingInterceptor {
    constructor() {
        this.logger = new common_1.Logger(LoggingInterceptor_1.name);
    }
    intercept(context, next) {
        const ctx = context.switchToHttp();
        const request = ctx.getRequest();
        const response = ctx.getResponse();
        const startTime = Date.now();
        const { method, url, ip } = request;
        const userAgent = request.get('User-Agent') || '';
        this.logger.log('📨 Incoming request', {
            method,
            url,
            ip,
            userAgent: userAgent.substring(0, 100),
        });
        return next.handle().pipe((0, operators_1.tap)({
            next: (data) => {
                const duration = Date.now() - startTime;
                const { statusCode } = response;
                let responseSize = 0;
                try {
                    responseSize = JSON.stringify(data).length;
                }
                catch (error) {
                    responseSize = -1;
                }
                this.logger.log('📤 Request completed', {
                    method,
                    url,
                    statusCode,
                    duration: `${duration}ms`,
                    ip,
                    responseSize: responseSize === -1 ? 'Non-serializable' : responseSize,
                });
            },
            error: (error) => {
                const duration = Date.now() - startTime;
                const statusCode = error.status || 500;
                this.logger.error('📤 Request failed', {
                    method,
                    url,
                    statusCode,
                    duration: `${duration}ms`,
                    ip,
                    error: error.message,
                });
            },
        }));
    }
};
exports.LoggingInterceptor = LoggingInterceptor;
exports.LoggingInterceptor = LoggingInterceptor = LoggingInterceptor_1 = __decorate([
    (0, common_1.Injectable)()
], LoggingInterceptor);


/***/ }),
/* 27 */
/***/ ((module) => {

module.exports = require("rxjs/operators");

/***/ })
/******/ 	]);
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry needs to be wrapped in an IIFE because it needs to be isolated against other modules in the chunk.
(() => {
var exports = __webpack_exports__;

Object.defineProperty(exports, "__esModule", ({ value: true }));
const core_1 = __webpack_require__(1);
const common_1 = __webpack_require__(2);
const swagger_1 = __webpack_require__(3);
const config_1 = __webpack_require__(4);
const app_module_1 = __webpack_require__(5);
const all_exceptions_filter_1 = __webpack_require__(25);
const logging_interceptor_1 = __webpack_require__(26);
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    const configService = app.get(config_1.ConfigService);
    const port = configService.get('PORT', 3000);
    const nodeEnv = configService.get('NODE_ENV', 'development');
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        disableErrorMessages: nodeEnv === 'production',
    }));
    app.useGlobalFilters(new all_exceptions_filter_1.AllExceptionsFilter());
    app.useGlobalInterceptors(new logging_interceptor_1.LoggingInterceptor());
    app.enableCors({
        origin: true,
        methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
        credentials: true,
    });
    if (nodeEnv !== 'production') {
        const config = new swagger_1.DocumentBuilder()
            .setTitle('NestJS Bitrix24 OAuth API')
            .setDescription('API for Bitrix24 OAuth 2.0 integration and CRM operations')
            .setVersion('1.0')
            .addTag('bitrix24', 'Bitrix24 OAuth and API operations')
            .addTag('health', 'Health check endpoints')
            .addBearerAuth()
            .build();
        const document = swagger_1.SwaggerModule.createDocument(app, config);
        swagger_1.SwaggerModule.setup('api', app, document, {
            swaggerOptions: {
                persistAuthorization: true,
            },
        });
    }
    await app.listen(port);
    console.log(`
🚀 NestJS Bitrix24 OAuth API
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📡 Server: http://localhost:${port}
🌍 Environment: ${nodeEnv}
📚 Swagger Docs: http://localhost:${port}/api
❤️  Health Check: http://localhost:${port}/api/health
🔧 Install Endpoint: http://localhost:${port}/api/install
🔐 OAuth Callback: http://localhost:${port}/api/oauth/callback
📞 Contacts API: http://localhost:${port}/api/bitrix24/contacts
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  `);
}
bootstrap().catch((error) => {
    console.error('❌ Failed to start application:', error);
    process.exit(1);
});

})();

/******/ })()
;