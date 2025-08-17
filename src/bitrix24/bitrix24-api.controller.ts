import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Query, 
  HttpStatus, 
  HttpException,
  Logger
} from '@nestjs/common';
import { 
  ApiTags, 
  ApiOperation, 
  ApiResponse, 
  ApiBody,
  ApiQuery 
} from '@nestjs/swagger';

import { Bitrix24Service } from './bitrix24.service';
import { ApiCallDto, ContactListQueryDto } from './dto/api-call.dto';

@ApiTags('bitrix24-api')
@Controller('api/bitrix24')
export class Bitrix24ApiController {
  private readonly logger = new Logger(Bitrix24ApiController.name);

  constructor(private readonly bitrix24Service: Bitrix24Service) {}

  @Get('/contacts')
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

  @Post('/api')
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

  @Get('/token/status')
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

  @Post('/token/refresh')
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
