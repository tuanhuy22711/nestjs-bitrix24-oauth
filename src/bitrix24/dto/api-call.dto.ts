import { IsString, IsOptional, IsObject } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ApiCallDto {
  @ApiProperty({
    description: 'Bitrix24 API method name',
    example: 'crm.contact.list'
  })
  @IsString()
  method: string;

  @ApiPropertyOptional({
    description: 'Parameters for the API call',
    example: { select: ['ID', 'NAME', 'EMAIL'] }
  })
  @IsOptional()
  @IsObject()
  params?: Record<string, any>;
}

export class ContactListQueryDto {
  @ApiPropertyOptional({
    description: 'Number of contacts to return',
    example: 10
  })
  @IsOptional()
  limit?: number;

  @ApiPropertyOptional({
    description: 'Offset for pagination',
    example: 0
  })
  @IsOptional()
  start?: number;

  @ApiPropertyOptional({
    description: 'Fields to select',
    example: 'ID,NAME,EMAIL,PHONE'
  })
  @IsOptional()
  select?: string;

  @ApiPropertyOptional({
    description: 'Filter conditions (JSON string)',
    example: '{"NAME": "John"}'
  })
  @IsOptional()
  filter?: string;
}
