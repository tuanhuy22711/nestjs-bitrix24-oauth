import { Injectable, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { AxiosError, AxiosResponse } from 'axios';

import { DatabaseService, TokenData } from '../database/database.service';
import { BitrixAuthDto } from './dto/bitrix-auth.dto';

export interface ApiResponse {
  success: boolean;
  result?: any;
  total?: number;
  time?: any;
  next?: number;
  error?: string;
  error_description?: string;
}

@Injectable()
export class Bitrix24Service {
  private readonly logger = new Logger(Bitrix24Service.name);
  
  private readonly clientId: string;
  private readonly clientSecret: string;
  private readonly domain: string;
  private readonly redirectUri: string;
  private readonly apiTimeout: number;
  private readonly retryAttempts: number;
  private readonly retryDelay: number;

  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
    private readonly databaseService: DatabaseService,
  ) {
    this.clientId = this.configService.get<string>('BITRIX24_CLIENT_ID');
    this.clientSecret = this.configService.get<string>('BITRIX24_CLIENT_SECRET');
    this.domain = this.configService.get<string>('BITRIX24_DOMAIN');
    this.redirectUri = this.configService.get<string>('BITRIX24_REDIRECT_URI');
    this.apiTimeout = this.configService.get<number>('BITRIX24_API_TIMEOUT', 10000);
    this.retryAttempts = this.configService.get<number>('BITRIX24_API_RETRY_ATTEMPTS', 3);
    this.retryDelay = this.configService.get<number>('BITRIX24_API_RETRY_DELAY', 1000);

    this.logger.log('🔧 Bitrix24Service initialized', {
      clientId: this.clientId ? '***' : 'NOT_SET',
      domain: this.domain,
      redirectUri: this.redirectUri
    });
  }

  /**
   * Process installation auth data from Bitrix24
   */
  async processInstallation(authData: BitrixAuthDto): Promise<any> {
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

      // Normalize data - prefer Bitrix24 format if available
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

      // Handle different auth methods
      if (normalizedData.method === 'simplified_auth' || !normalizedData.access_token) {
        return await this.processSimplifiedAuth({
          ...authData,
          domain: normalizedData.domain,
          authExpires: authData.AUTH_EXPIRES || authData.authExpires || '3600'
        });
      }

      // Handle OAuth2 flow
      if (!normalizedData.access_token) {
        throw new Error('Access token is required for OAuth2 flow');
      }

      // Calculate expiration date
      const expiresAt = new Date();
      expiresAt.setSeconds(expiresAt.getSeconds() + (normalizedData.expires_in || 3600));

      // Prepare token data for OAuth2
      const tokenData: TokenData = {
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

      // Save token to database
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

    } catch (error) {
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

  /**
   * Process simplified auth method
   */
  private async processSimplifiedAuth(authData: BitrixAuthDto): Promise<any> {
    try {
      this.logger.log('🔧 Processing simplified auth', {
        domain: authData.domain,
        memberId: authData.member_id,
        authExpires: authData.authExpires,
        fullAuthData: authData
      });

      // For simplified auth, we'll generate an access token using client credentials
      const accessToken = await this.generateAccessTokenForSimplifiedAuth(authData);

      this.logger.log('🔑 Generated access token for simplified auth', {
        tokenLength: accessToken.length,
        domain: authData.domain
      });

      // Calculate expiration date
      const expiresAt = new Date();
      const expiresIn = parseInt(authData.authExpires || '3600');
      expiresAt.setSeconds(expiresAt.getSeconds() + expiresIn);

      // Prepare token data for simplified auth
      const tokenData: TokenData = {
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
          access_token: '***MASKED***'  // Don't log full token
        }
      });

      // Save token to database
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

    } catch (error) {
      this.logger.error('❌ Simplified auth processing failed', {
        error: error.message,
        stack: error.stack,
        domain: authData.domain,
        authData: authData
      });
      throw error;
    }
  }

  /**
   * Call Bitrix24 API with simplified auth (using client credentials)
   */
  private async callBitrixAPIWithSimplifiedAuth(method: string, params: any, token: TokenData): Promise<ApiResponse> {
    try {
      this.logger.log('🔧 Calling Bitrix24 API with simplified auth', {
        method,
        domain: token.domain,
        memberId: token.member_id
      });

      // For simplified auth, we use webhook method with client credentials
      const webhookUrl = `https://${token.domain}/rest/${token.member_id}/${this.clientSecret}/${method}`;

      // Make API call using webhook URL
      const response: AxiosResponse = await firstValueFrom(
        this.httpService.post(webhookUrl, params, {
          timeout: this.apiTimeout,
          headers: {
            'Content-Type': 'application/json'
          }
        })
      );

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

    } catch (error) {
      this.logger.error('❌ Simplified auth API call failed', {
        method,
        error: error.message,
        response: error.response?.data
      });
      throw error;
    }
  }

  /**
   * Generate access token for simplified auth using client credentials
   */
  private async generateAccessTokenForSimplifiedAuth(authData: BitrixAuthDto): Promise<string> {
    try {
      const clientId = this.configService.get<string>('BITRIX24_CLIENT_ID');
      const clientSecret = this.configService.get<string>('BITRIX24_CLIENT_SECRET');
      const domain = authData.domain;

      if (!clientId || !clientSecret || !domain) {
        throw new Error('Missing required configuration for simplified auth');
      }

      // For Bitrix24 simplified auth, we can use client_id + client_secret as access token
      // This is a simplified approach - in production, you might want to call Bitrix24 API to get proper token
      const tokenBase = `${clientId}:${clientSecret}:${domain}:${authData.member_id}`;
      const accessToken = Buffer.from(tokenBase).toString('base64');

      this.logger.log('🔑 Generated access token for simplified auth', {
        domain,
        memberId: authData.member_id
      });

      return accessToken;

    } catch (error) {
      this.logger.error('❌ Failed to generate access token for simplified auth', {
        error: error.message
      });
      throw error;
    }
  }

  /**
   * Exchange authorization code for access token
   */
  async exchangeCodeForToken(code: string, state?: string): Promise<any> {
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

      const response = await firstValueFrom(
        this.httpService.post(tokenUrl, null, {
          params,
          timeout: this.apiTimeout,
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        })
      );

      const tokenData = response.data;

      if (tokenData.error) {
        throw new HttpException(
          `OAuth error: ${tokenData.error_description || tokenData.error}`,
          HttpStatus.BAD_REQUEST
        );
      }

      this.logger.log('✅ Token exchange successful', {
        hasAccessToken: !!tokenData.access_token,
        hasRefreshToken: !!tokenData.refresh_token,
        expiresIn: tokenData.expires_in,
        scope: tokenData.scope
      });

      // Save token similar to installation
      const authDto: BitrixAuthDto = {
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

    } catch (error) {
      this.logger.error('❌ Token exchange failed', {
        error: error.message,
        response: error.response?.data
      });
      throw error;
    }
  }

  /**
   * Get current token status
   */
  async getTokenStatus(): Promise<any> {
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

    } catch (error) {
      this.logger.error('❌ Failed to get token status', error);
      throw error;
    }
  }

  /**
   * Refresh access token if needed or forced
   */
  async refreshTokenIfNeeded(force: boolean = false): Promise<any> {
    try {
      const token = await this.databaseService.getCurrentToken();

      if (!token) {
        throw new HttpException('No token available for refresh', HttpStatus.BAD_REQUEST);
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

      const response = await firstValueFrom(
        this.httpService.post(tokenUrl, null, {
          params,
          timeout: this.apiTimeout,
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        })
      );

      const newTokenData = response.data;

      if (newTokenData.error) {
        throw new HttpException(
          `Token refresh error: ${newTokenData.error_description || newTokenData.error}`,
          HttpStatus.BAD_REQUEST
        );
      }

      // Update token in database
      const expiresAt = new Date();
      expiresAt.setSeconds(expiresAt.getSeconds() + newTokenData.expires_in);

      const updatedToken: Partial<TokenData> = {
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

    } catch (error) {
      this.logger.error('❌ Token refresh failed', {
        error: error.message,
        response: error.response?.data
      });
      throw error;
    }
  }

  /**
   * Generic function to call Bitrix24 API
   */
  async callBitrixAPI(method: string, params: any = {}): Promise<ApiResponse> {
    let attempt = 1;

    while (attempt <= this.retryAttempts) {
      try {
        this.logger.log(`🔄 Calling Bitrix24 API (attempt ${attempt})`, {
          method,
          hasParams: Object.keys(params).length > 0
        });

        // Get current token
        const token = await this.databaseService.getCurrentToken();
        if (!token) {
          throw new HttpException(
            'No access token available. Please complete OAuth authorization.',
            HttpStatus.UNAUTHORIZED
          );
        }

        // For simplified auth, don't check token expiration as it uses client credentials
        if (token.method === 'simplified_auth') {
          return await this.callBitrixAPIWithSimplifiedAuth(method, params, token);
        }

        // Check if token needs refresh (only for OAuth2)
        const now = new Date();
        if (token.access_token && now > token.expires_at) {
          this.logger.log('🔄 Token expired, refreshing...');
          await this.refreshTokenIfNeeded();
          // Get updated token
          const updatedToken = await this.databaseService.getCurrentToken();
          if (!updatedToken) {
            throw new HttpException('Failed to refresh token', HttpStatus.UNAUTHORIZED);
          }
        }

        // Prepare API URL
        const baseUrl = token.client_endpoint || `https://${token.domain}/rest/`;
        const apiUrl = `${baseUrl}${method}`;

        // Prepare request data
        const requestData = {
          ...params,
          auth: token.access_token
        };

        // Make API call
        const response: AxiosResponse = await firstValueFrom(
          this.httpService.post(apiUrl, requestData, {
            timeout: this.apiTimeout,
            headers: {
              'Content-Type': 'application/json'
            }
          })
        );

        const result = response.data;

        // Handle API errors
        if (result.error) {
          // Check if it's a token-related error
          if (this.isTokenError(result.error)) {
            this.logger.warn('🔄 Token error detected, attempting refresh', {
              error: result.error,
              attempt
            });

            if (attempt < this.retryAttempts) {
              await this.refreshTokenIfNeeded(true);
              attempt++;
              continue; // Retry the API call
            }
          }

          throw new HttpException(
            `Bitrix24 API error: ${result.error_description || result.error}`,
            HttpStatus.BAD_REQUEST
          );
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

      } catch (error) {
        this.logger.error(`❌ Bitrix24 API call failed (attempt ${attempt})`, {
          method,
          error: error.message,
          response: error.response?.data,
          status: error.response?.status
        });

        // If it's the last attempt or not a retryable error, throw
        if (attempt === this.retryAttempts || !this.isRetryableError(error)) {
          throw new HttpException(
            `Bitrix24 API call failed: ${error.message}`,
            error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR
          );
        }

        // Wait before retry
        await this.sleep(this.retryDelay * attempt);
        attempt++;
      }
    }
  }

  /**
   * Check if error is token-related
   */
  private isTokenError(error: string): boolean {
    const tokenErrors = [
      'expired_token',
      'invalid_token', 
      'WRONG_AUTH_TYPE',
      'unauthorized'
    ];
    return tokenErrors.some(tokenError => 
      error.toLowerCase().includes(tokenError.toLowerCase())
    );
  }

  /**
   * Check if error is retryable
   */
  private isRetryableError(error: AxiosError): boolean {
    if (!error.response) return true; // Network errors are retryable
    
    const status = error.response.status;
    return status >= 500 || status === 429; // Server errors and rate limiting
  }

  /**
   * Sleep utility for retry delays
   */
  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
