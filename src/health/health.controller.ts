import { Controller, Get, Logger } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

import { DatabaseService } from '../database/database.service';
import { Bitrix24Service } from '../bitrix24/bitrix24.service';

@ApiTags('health')
@Controller('health')
export class HealthController {
  private readonly logger = new Logger(HealthController.name);

  constructor(
    private databaseService: DatabaseService,
    private bitrix24Service: Bitrix24Service,
  ) {}

  @Get()
  @ApiOperation({ 
    summary: 'Health check',
    description: 'Comprehensive health check including database and Bitrix24 integration'
  })
  @ApiResponse({ 
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
  })
  async check() {
    const health = {
      status: 'ok',
      info: {},
      error: {},
      details: {},
      timestamp: new Date().toISOString()
    };

    try {
      // Database health check
      const dbHealth = await this.checkDatabase();
      health.info['database'] = dbHealth;
      health.details['database'] = dbHealth;
    } catch (error) {
      health.status = 'error';
      health.error['database'] = { status: 'down', message: error.message };
      health.details['database'] = { status: 'down', message: error.message };
    }

    try {
      // Bitrix24 integration health check
      const bitrixHealth = await this.checkBitrix24();
      health.info['bitrix24'] = bitrixHealth;
      health.details['bitrix24'] = bitrixHealth;
    } catch (error) {
      health.error['bitrix24'] = { status: 'down', message: error.message };
      health.details['bitrix24'] = { status: 'down', message: error.message };
    }

    // Memory health check
    const memoryHealth = this.checkMemory();
    health.info['memory'] = memoryHealth;
    health.details['memory'] = memoryHealth;

    this.logger.log('🏥 Health check completed', {
      status: health.status,
      checks: Object.keys(health.info).length
    });

    return health;
  }

  /**
   * Database health indicator
   */
  private async checkDatabase() {
    try {
      // Try to get current token to test database connection
      await this.databaseService.getCurrentToken();
      return { status: 'up', message: 'Database connection successful' };
    } catch (error) {
      throw new Error(`Database connection failed: ${error.message}`);
    }
  }

  /**
   * Bitrix24 integration health indicator
   */
  private async checkBitrix24() {
    try {
      const tokenStatus = await this.bitrix24Service.getTokenStatus();
      return {
        status: 'up',
        hasToken: tokenStatus.hasToken,
        domain: tokenStatus.domain,
        isExpired: tokenStatus.isExpired,
        message: tokenStatus.hasToken ? 'Token available' : 'No token available'
      };
    } catch (error) {
      throw new Error(`Bitrix24 integration failed: ${error.message}`);
    }
  }

  /**
   * Memory health indicator
   */
  private checkMemory() {
    const memoryUsage = process.memoryUsage();
    const memoryLimitMB = 200; // 200MB limit
    const usedMB = Math.round(memoryUsage.heapUsed / 1024 / 1024);
    
    return {
      status: usedMB < memoryLimitMB ? 'up' : 'warning',
      heapUsed: `${usedMB}MB`,
      heapTotal: `${Math.round(memoryUsage.heapTotal / 1024 / 1024)}MB`,
      rss: `${Math.round(memoryUsage.rss / 1024 / 1024)}MB`,
      external: `${Math.round(memoryUsage.external / 1024 / 1024)}MB`,
    };
  }

  @Get('/simple')
  @ApiOperation({ 
    summary: 'Simple health check',
    description: 'Basic health check without dependencies'
  })
  @ApiResponse({ 
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
  })
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
}
