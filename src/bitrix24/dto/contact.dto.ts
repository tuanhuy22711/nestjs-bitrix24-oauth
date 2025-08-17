import { IsString, IsOptional, IsEmail, IsPhoneNumber, IsUrl, ValidateNested, IsNotEmpty } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class ContactAddressDto {
  @ApiPropertyOptional({
    description: 'Phường/Xã',
    example: 'Phường Bến Nghé'
  })
  @IsOptional()
  @IsString()
  ward?: string;

  @ApiPropertyOptional({
    description: 'Quận/Huyện',
    example: 'Quận 1'
  })
  @IsOptional()
  @IsString()
  district?: string;

  @ApiPropertyOptional({
    description: 'Tỉnh/Thành phố',
    example: 'TP. Hồ Chí Minh'
  })
  @IsOptional()
  @IsString()
  province?: string;

  @ApiPropertyOptional({
    description: 'Địa chỉ chi tiết',
    example: '123 Nguyễn Huệ'
  })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiPropertyOptional({
    description: 'Mã bưu điện',
    example: '700000'
  })
  @IsOptional()
  @IsString()
  postal_code?: string;
}

export class BankInfoDto {
  @ApiProperty({
    description: 'Tên ngân hàng',
    example: 'Ngân hàng TMCP Công Thương Việt Nam'
  })
  @IsNotEmpty()
  @IsString()
  bank_name: string;

  @ApiProperty({
    description: 'Số tài khoản ngân hàng',
    example: '1234567890123456'
  })
  @IsNotEmpty()
  @IsString()
  account_number: string;

  @ApiPropertyOptional({
    description: 'Tên chủ tài khoản',
    example: 'Nguyễn Văn A'
  })
  @IsOptional()
  @IsString()
  account_holder?: string;

  @ApiPropertyOptional({
    description: 'Chi nhánh ngân hàng',
    example: 'Chi nhánh TP.HCM'
  })
  @IsOptional()
  @IsString()
  branch?: string;
}

export class CreateContactDto {
  @ApiProperty({
    description: 'Tên contact (bắt buộc)',
    example: 'Nguyễn'
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiPropertyOptional({
    description: 'Họ đệm',
    example: 'Văn'
  })
  @IsOptional()
  @IsString()
  second_name?: string;

  @ApiPropertyOptional({
    description: 'Họ',
    example: 'A'
  })
  @IsOptional()
  @IsString()
  last_name?: string;

  @ApiPropertyOptional({
    description: 'Số điện thoại',
    example: '+84901234567'
  })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional({
    description: 'Email',
    example: 'nguyen.van.a@example.com'
  })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({
    description: 'Website',
    example: 'https://example.com'
  })
  @IsOptional()
  @IsUrl()
  website?: string;

  @ApiPropertyOptional({
    description: 'Thông tin địa chỉ',
    type: ContactAddressDto
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => ContactAddressDto)
  address?: ContactAddressDto;

  @ApiPropertyOptional({
    description: 'Thông tin ngân hàng',
    type: BankInfoDto
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => BankInfoDto)
  bank_info?: BankInfoDto;

  @ApiPropertyOptional({
    description: 'Ghi chú',
    example: 'Khách hàng VIP'
  })
  @IsOptional()
  @IsString()
  comments?: string;

  @ApiPropertyOptional({
    description: 'Loại contact',
    example: 'CLIENT'
  })
  @IsOptional()
  @IsString()
  type_id?: string;

  @ApiPropertyOptional({
    description: 'Nguồn contact',
    example: 'WEB'
  })
  @IsOptional()
  @IsString()
  source_id?: string;
}

export class UpdateContactDto {
  @ApiPropertyOptional({
    description: 'Tên contact',
    example: 'Nguyễn'
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({
    description: 'Họ đệm',
    example: 'Văn'
  })
  @IsOptional()
  @IsString()
  second_name?: string;

  @ApiPropertyOptional({
    description: 'Họ',
    example: 'A'
  })
  @IsOptional()
  @IsString()
  last_name?: string;

  @ApiPropertyOptional({
    description: 'Số điện thoại',
    example: '+84901234567'
  })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional({
    description: 'Email',
    example: 'nguyen.van.a@example.com'
  })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({
    description: 'Website',
    example: 'https://example.com'
  })
  @IsOptional()
  @IsUrl()
  website?: string;

  @ApiPropertyOptional({
    description: 'Thông tin địa chỉ',
    type: ContactAddressDto
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => ContactAddressDto)
  address?: ContactAddressDto;

  @ApiPropertyOptional({
    description: 'Thông tin ngân hàng',
    type: BankInfoDto
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => BankInfoDto)
  bank_info?: BankInfoDto;

  @ApiPropertyOptional({
    description: 'Ghi chú',
    example: 'Khách hàng VIP'
  })
  @IsOptional()
  @IsString()
  comments?: string;

  @ApiPropertyOptional({
    description: 'Loại contact',
    example: 'CLIENT'
  })
  @IsOptional()
  @IsString()
  type_id?: string;

  @ApiPropertyOptional({
    description: 'Nguồn contact',
    example: 'WEB'
  })
  @IsOptional()
  @IsString()
  source_id?: string;
}

export class ContactResponseDto {
  @ApiProperty({ description: 'ID của contact' })
  ID: string;

  @ApiProperty({ description: 'Tên contact' })
  NAME: string;

  @ApiPropertyOptional({ description: 'Họ đệm' })
  SECOND_NAME?: string;

  @ApiPropertyOptional({ description: 'Họ' })
  LAST_NAME?: string;

  @ApiPropertyOptional({ description: 'Email' })
  EMAIL?: any[];

  @ApiPropertyOptional({ description: 'Số điện thoại' })
  PHONE?: any[];

  @ApiPropertyOptional({ description: 'Website' })
  WEB?: any[];

  @ApiPropertyOptional({ description: 'Địa chỉ' })
  ADDRESS?: string;

  @ApiPropertyOptional({ description: 'Thành phố' })
  ADDRESS_CITY?: string;

  @ApiPropertyOptional({ description: 'Vùng/Tỉnh' })
  ADDRESS_REGION?: string;

  @ApiPropertyOptional({ description: 'Mã bưu điện' })
  ADDRESS_POSTAL_CODE?: string;

  @ApiPropertyOptional({ description: 'Quốc gia' })
  ADDRESS_COUNTRY?: string;

  @ApiPropertyOptional({ description: 'Ghi chú' })
  COMMENTS?: string;

  @ApiPropertyOptional({ description: 'Loại contact' })
  TYPE_ID?: string;

  @ApiPropertyOptional({ description: 'Nguồn contact' })
  SOURCE_ID?: string;

  @ApiPropertyOptional({ description: 'Ngày tạo' })
  DATE_CREATE?: string;

  @ApiPropertyOptional({ description: 'Ngày sửa đổi' })
  DATE_MODIFY?: string;

  @ApiPropertyOptional({ description: 'Người tạo' })
  CREATED_BY_ID?: string;

  @ApiPropertyOptional({ description: 'Người sửa đổi' })
  MODIFY_BY_ID?: string;
}
