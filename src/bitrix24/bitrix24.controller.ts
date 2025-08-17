import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Query, 
  HttpStatus, 
  HttpException,
  Logger,
  Render
} from '@nestjs/common';
import { 
  ApiTags, 
  ApiOperation, 
  ApiResponse, 
  ApiBody,
  ApiQuery 
} from '@nestjs/swagger';

import { Bitrix24Service } from './bitrix24.service';
import { BitrixAuthDto } from './dto/bitrix-auth.dto';
import { ApiCallDto, ContactListQueryDto } from './dto/api-call.dto';

@ApiTags('bitrix24')
@Controller()
export class Bitrix24Controller {
  private readonly logger = new Logger(Bitrix24Controller.name);

  constructor(private readonly bitrix24Service: Bitrix24Service) {}

  @Get('/install')
  @ApiOperation({ 
    summary: 'Display installation page',
    description: 'Shows the installation page for Bitrix24 local application'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Installation page displayed successfully' 
  })
  @Render('install')
  async getInstallPage(@Query() query: any) {
    this.logger.log('Installation page requested', { query });
    
    return {
      title: 'NestJS Bitrix24 OAuth Installation',
      query,
      timestamp: new Date().toISOString()
    };
  }

  @Post('/install')
  @ApiOperation({ 
    summary: 'Process app installation',
    description: 'Handles OAuth data from Bitrix24 during app installation'
  })
  @ApiBody({ type: BitrixAuthDto })
  @ApiResponse({ 
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
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Invalid installation data' 
  })
  async handleInstall(
    @Body() authData: BitrixAuthDto,
    @Query() queryParams: any
  ) {
    try {
      // Merge query parameters with body data (Bitrix24 sends domain in query)
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

      // Log raw request body for debugging
      this.logger.log('📝 Raw auth data received:', JSON.stringify(mergedData, null, 2));

      const result = await this.bitrix24Service.processInstallation(mergedData);

      this.logger.log('✅ Installation processed successfully', result);

      return {
        success: true,
        message: 'Application installed successfully',
        data: result
      };

    } catch (error) {
      this.logger.error('❌ Installation failed', {
        error: error.message,
        stack: error.stack,
        authData: authData
      });

      throw new HttpException({
        success: false,
        message: 'Installation failed',
        error: error.message
      }, HttpStatus.BAD_REQUEST);
    }
  }

  @Get('/oauth/callback')
  @ApiOperation({ 
    summary: 'OAuth callback handler',
    description: 'Handles OAuth callback from Bitrix24 authorization'
  })
  @ApiQuery({ name: 'code', required: false, description: 'Authorization code' })
  @ApiQuery({ name: 'state', required: false, description: 'State parameter' })
  @ApiResponse({ 
    status: 200, 
    description: 'OAuth callback processed successfully' 
  })
  async handleOAuthCallback(
    @Query('code') code: string,
    @Query('state') state: string,
    @Query() query: any
  ) {
    try {
      this.logger.log('🔐 OAuth callback received', {
        hasCode: !!code,
        state,
        query
      });

      if (!code) {
        throw new HttpException('Authorization code not provided', HttpStatus.BAD_REQUEST);
      }

      const result = await this.bitrix24Service.exchangeCodeForToken(code, state);

      this.logger.log('✅ OAuth callback processed successfully', result);

      return {
        success: true,
        message: 'Authorization completed successfully',
        data: result
      };

    } catch (error) {
      this.logger.error('❌ OAuth callback failed', {
        error: error.message,
        code,
        state
      });

      throw new HttpException(
        `OAuth callback failed: ${error.message}`,
        HttpStatus.BAD_REQUEST
      );
    }
  }

  @Get('/bitrix24/contacts')
  @ApiOperation({ 
    summary: 'Get contacts from Bitrix24',
    description: 'Retrieves contact list from Bitrix24 CRM'
  })
  @ApiQuery({ name: 'limit', required: false, description: 'Number of contacts to return' })
  @ApiQuery({ name: 'start', required: false, description: 'Offset for pagination' })
  @ApiQuery({ name: 'select', required: false, description: 'Fields to select (comma-separated)' })
  @ApiResponse({ 
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
  })
  async getContacts(@Query() query: ContactListQueryDto) {
    try {
      this.logger.log('📞 Fetching contacts from Bitrix24', query);

      const params: any = {};
      
      if (query.limit) params.limit = query.limit;
      if (query.start) params.start = query.start;
      if (query.select) {
        params.select = query.select.split(',').map(field => field.trim());
      }

      const result = await this.bitrix24Service.callBitrixAPI('crm.contact.list', params);

      this.logger.log('✅ Contacts fetched successfully', {
        count: result.result?.length || 0,
        total: result.total
      });

      return result;

    } catch (error) {
      this.logger.error('❌ Failed to fetch contacts', {
        error: error.message,
        query
      });

      throw new HttpException(
        `Failed to fetch contacts: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Post('/bitrix24/api')
  @ApiOperation({ 
    summary: 'Generic Bitrix24 API proxy',
    description: 'Makes generic API calls to Bitrix24 REST API'
  })
  @ApiBody({ type: ApiCallDto })
  @ApiResponse({ 
    status: 200, 
    description: 'API call executed successfully' 
  })
  async proxyApiCall(@Body() apiCall: ApiCallDto) {
    try {
      this.logger.log('🔄 Proxying API call to Bitrix24', {
        method: apiCall.method,
        hasParams: !!apiCall.params
      });

      const result = await this.bitrix24Service.callBitrixAPI(
        apiCall.method, 
        apiCall.params || {}
      );

      this.logger.log('✅ API call completed successfully', {
        method: apiCall.method,
        hasResult: !!result.result
      });

      return result;

    } catch (error) {
      this.logger.error('❌ API call failed', {
        method: apiCall.method,
        error: error.message
      });

      throw new HttpException(
        `API call failed: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get('/bitrix24/token/status')
  @ApiOperation({ 
    summary: 'Get token status',
    description: 'Returns current OAuth token status and information'
  })
  @ApiResponse({ 
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
  })
  async getTokenStatus() {
    try {
      const status = await this.bitrix24Service.getTokenStatus();
      
      this.logger.log('📊 Token status retrieved', status);
      
      return status;

    } catch (error) {
      this.logger.error('❌ Failed to get token status', {
        error: error.message
      });

      throw new HttpException(
        `Failed to get token status: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Post('/bitrix24/token/refresh')
  @ApiOperation({ 
    summary: 'Manually refresh token',
    description: 'Forces refresh of OAuth access token using refresh token'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Token refreshed successfully' 
  })
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

    } catch (error) {
      this.logger.error('❌ Token refresh failed', {
        error: error.message
      });

      throw new HttpException(
        `Token refresh failed: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}
