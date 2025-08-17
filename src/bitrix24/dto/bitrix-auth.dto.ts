import { IsString, IsOptional, IsNumber } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class BitrixAuthDto {
  @ApiPropertyOptional({
    description: 'Access token for Bitrix24 API (OAuth2)',
    example: 'a1b2c3d4e5f6g7h8i9j0'
  })
  @IsOptional()
  @IsString()
  access_token?: string;

  @ApiPropertyOptional({
    description: 'Auth ID from Bitrix24 (alternative to access_token)',
    example: 'auth_id_here'
  })
  @IsOptional()
  @IsString()
  AUTH_ID?: string;

  @ApiPropertyOptional({
    description: 'Refresh token for token renewal (OAuth2)',
    example: 'r1e2f3r4e5s6h7t8o9k0'
  })
  @IsOptional()
  @IsString()
  refresh_token?: string;

  @ApiPropertyOptional({
    description: 'Refresh ID from Bitrix24 (alternative to refresh_token)',
    example: 'refresh_id_here'
  })
  @IsOptional()
  @IsString()
  REFRESH_ID?: string;

  @ApiPropertyOptional({
    description: 'Token expiration time in seconds',
    example: 3600
  })
  @IsOptional()
  @IsNumber()
  expires_in?: number;

  @ApiPropertyOptional({
    description: 'Auth expiration from Bitrix24',
    example: '3600'
  })
  @IsOptional()
  @IsString()
  AUTH_EXPIRES?: string;

  @ApiPropertyOptional({
    description: 'Authorization scope',
    example: 'crm'
  })
  @IsOptional()
  @IsString()
  scope?: string;

  @ApiPropertyOptional({
    description: 'Bitrix24 domain',
    example: 'company.bitrix24.com'
  })
  @IsOptional()
  @IsString()
  domain?: string;

  @ApiPropertyOptional({
    description: 'Bitrix24 domain from URL parameter',
    example: 'company.bitrix24.com'
  })
  @IsOptional()
  @IsString()
  DOMAIN?: string;

  @ApiPropertyOptional({
    description: 'Protocol version',
    example: '1'
  })
  @IsOptional()
  @IsString()
  PROTOCOL?: string;

  @ApiPropertyOptional({
    description: 'Language code',
    example: 'vn'
  })
  @IsOptional()
  @IsString()
  LANG?: string;

  @ApiPropertyOptional({
    description: 'Application session ID',
    example: '2d475fca884753909e8d03a28d4f9881'
  })
  @IsOptional()
  @IsString()
  APP_SID?: string;

  @ApiPropertyOptional({
    description: 'Server endpoint URL',
    example: 'https://oauth.bitrix.info/rest/'
  })
  @IsOptional()
  @IsString()
  server_endpoint?: string;

  @ApiPropertyOptional({
    description: 'Client endpoint URL',
    example: 'https://company.bitrix24.com/rest/'
  })
  @IsOptional()
  @IsString()
  client_endpoint?: string;

  @ApiPropertyOptional({
    description: 'Member ID in Bitrix24',
    example: 'abcd1234-5678-9012-3456-789012345678'
  })
  @IsOptional()
  @IsString()
  member_id?: string;

  @ApiPropertyOptional({
    description: 'Application status',
    example: 'L'
  })
  @IsOptional()
  @IsString()
  status?: string;

  @ApiPropertyOptional({
    description: 'Application token',
    example: 'app_token_here'
  })
  @IsOptional()
  @IsString()
  application_token?: string;

  @ApiPropertyOptional({
    description: 'Authorization method (oauth2, simplified_auth)',
    example: 'simplified_auth'
  })
  @IsOptional()
  @IsString()
  method?: string;

  @ApiPropertyOptional({
    description: 'Placement information',
    example: 'DEFAULT'
  })
  @IsOptional()
  @IsString()
  placement?: string;

  @ApiPropertyOptional({
    description: 'Placement from Bitrix24',
    example: 'DEFAULT'
  })
  @IsOptional()
  @IsString()
  PLACEMENT?: string;

  @ApiPropertyOptional({
    description: 'Placement options from Bitrix24',
    example: '{}'
  })
  @IsOptional()
  @IsString()
  PLACEMENT_OPTIONS?: string;

  @ApiPropertyOptional({
    description: 'Auth expiration time for simplified auth',
    example: '3600'
  })
  @IsOptional()
  @IsString()
  authExpires?: string;
}
