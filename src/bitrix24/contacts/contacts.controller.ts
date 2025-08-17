import { 
  Controller, 
  Get, 
  Post, 
  Put, 
  Delete, 
  Body, 
  Param, 
  Query, 
  HttpStatus, 
  HttpException,
  Logger,
  UseGuards
} from '@nestjs/common';
import { 
  ApiTags, 
  ApiOperation, 
  ApiResponse, 
  ApiBody,
  ApiParam,
  ApiQuery,
  ApiSecurity
} from '@nestjs/swagger';

import { Bitrix24Service } from '../bitrix24.service';
import { 
  CreateContactDto, 
  UpdateContactDto, 
  ContactResponseDto,
  ContactAddressDto,
  BankInfoDto
} from '../dto/contact.dto';
import { ContactListQueryDto } from '../dto/api-call.dto';

@ApiTags('contacts')
@Controller('contacts')
@ApiSecurity('api-key')
export class ContactsController {
  private readonly logger = new Logger(ContactsController.name);

  constructor(private readonly bitrix24Service: Bitrix24Service) {}

  @Get()
  @ApiOperation({ 
    summary: 'Lấy danh sách contact',
    description: 'Lấy danh sách contact từ Bitrix24 CRM với phân trang và lọc'
  })
  @ApiQuery({ name: 'limit', required: false, description: 'Số lượng contact trả về (mặc định: 50)' })
  @ApiQuery({ name: 'start', required: false, description: 'Vị trí bắt đầu (phân trang)' })
  @ApiQuery({ name: 'select', required: false, description: 'Các trường cần lấy (cách nhau bởi dấu phẩy)' })
  @ApiQuery({ name: 'filter', required: false, description: 'Bộ lọc (JSON string)' })
  @ApiResponse({ 
    status: 200, 
    description: 'Danh sách contact được lấy thành công',
    type: [ContactResponseDto]
  })
  @ApiResponse({ 
    status: 500, 
    description: 'Lỗi server khi lấy danh sách contact' 
  })
  async getContacts(@Query() query: ContactListQueryDto) {
    try {
      this.logger.log('📞 Fetching contacts from Bitrix24', query);

      const params: any = {
        order: { DATE_CREATE: 'DESC' }
      };
      
      if (query.limit) params.limit = query.limit;
      if (query.start) params.start = query.start;
      if (query.select) {
        params.select = query.select.split(',').map(field => field.trim());
      } else {
        // Default fields to select
        params.select = [
          'ID', 'NAME', 'SECOND_NAME', 'LAST_NAME', 'EMAIL', 'PHONE', 'WEB',
          'ADDRESS', 'ADDRESS_CITY', 'ADDRESS_REGION', 'ADDRESS_POSTAL_CODE',
          'ADDRESS_COUNTRY', 'COMMENTS', 'TYPE_ID', 'SOURCE_ID',
          'DATE_CREATE', 'DATE_MODIFY', 'CREATED_BY_ID', 'MODIFY_BY_ID'
        ];
      }

      // Add filter if provided
      if (query.filter) {
        try {
          params.filter = JSON.parse(query.filter);
        } catch (error) {
          throw new HttpException('Invalid filter format. Must be valid JSON.', HttpStatus.BAD_REQUEST);
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

  @Get(':id')
  @ApiOperation({ 
    summary: 'Lấy thông tin contact theo ID',
    description: 'Lấy thông tin chi tiết contact từ Bitrix24 bao gồm cả thông tin ngân hàng'
  })
  @ApiParam({ name: 'id', description: 'ID của contact' })
  @ApiResponse({ 
    status: 200, 
    description: 'Thông tin contact được lấy thành công',
    type: ContactResponseDto
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Contact không tồn tại' 
  })
  async getContactById(@Param('id') id: string) {
    try {
      this.logger.log('📞 Fetching contact by ID', { id });

      // Get contact details
      const contactResult = await this.bitrix24Service.callBitrixAPI('crm.contact.get', { id });

      if (!contactResult.result) {
        throw new HttpException('Contact không tồn tại', HttpStatus.NOT_FOUND);
      }

      // Get bank information (requisites)
      let bankInfo = null;
      try {
        const requisitesResult = await this.bitrix24Service.callBitrixAPI('crm.requisite.list', {
          filter: { ENTITY_TYPE_ID: 3, ENTITY_ID: id }
        });
        
        if (requisitesResult.result && requisitesResult.result.length > 0) {
          bankInfo = requisitesResult.result[0];
        }
      } catch (error) {
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

    } catch (error) {
      this.logger.error('❌ Failed to fetch contact', {
        error: error.message,
        id
      });

      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException(
        `Failed to fetch contact: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Post()
  @ApiOperation({ 
    summary: 'Thêm contact mới',
    description: 'Tạo contact mới trong Bitrix24 CRM bao gồm thông tin địa chỉ và ngân hàng'
  })
  @ApiBody({ type: CreateContactDto })
  @ApiResponse({ 
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
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Dữ liệu đầu vào không hợp lệ' 
  })
  async createContact(@Body() createContactDto: CreateContactDto) {
    try {
      this.logger.log('📞 Creating new contact', { 
        name: createContactDto.name,
        hasEmail: !!createContactDto.email,
        hasPhone: !!createContactDto.phone,
        hasBankInfo: !!createContactDto.bank_info
      });

      // Prepare contact data for Bitrix24
      const contactData: any = {
        NAME: createContactDto.name,
        TYPE_ID: createContactDto.type_id || 'CLIENT',
        SOURCE_ID: createContactDto.source_id || 'WEB'
      };

      if (createContactDto.second_name) contactData.SECOND_NAME = createContactDto.second_name;
      if (createContactDto.last_name) contactData.LAST_NAME = createContactDto.last_name;
      if (createContactDto.comments) contactData.COMMENTS = createContactDto.comments;

      // Handle email
      if (createContactDto.email) {
        contactData.EMAIL = [{ VALUE: createContactDto.email, VALUE_TYPE: 'WORK' }];
      }

      // Handle phone
      if (createContactDto.phone) {
        contactData.PHONE = [{ VALUE: createContactDto.phone, VALUE_TYPE: 'WORK' }];
      }

      // Handle website
      if (createContactDto.website) {
        contactData.WEB = [{ VALUE: createContactDto.website, VALUE_TYPE: 'WORK' }];
      }

      // Handle address
      if (createContactDto.address) {
        const addr = createContactDto.address;
        if (addr.address) contactData.ADDRESS = addr.address;
        if (addr.province) contactData.ADDRESS_CITY = addr.province;
        if (addr.district) contactData.ADDRESS_REGION = addr.district;
        if (addr.postal_code) contactData.ADDRESS_POSTAL_CODE = addr.postal_code;
        if (addr.ward) {
          // Combine ward with address if exists
          const fullAddress = [addr.address, addr.ward].filter(Boolean).join(', ');
          contactData.ADDRESS = fullAddress;
        }
      }

      // Create contact in Bitrix24
      const result = await this.bitrix24Service.callBitrixAPI('crm.contact.add', { fields: contactData });

      if (!result.result) {
        throw new HttpException('Failed to create contact in Bitrix24', HttpStatus.INTERNAL_SERVER_ERROR);
      }

      const contactId = result.result;

      // Handle bank information (requisites)
      let bankResult = null;
      if (createContactDto.bank_info) {
        try {
          const requisiteData = {
            ENTITY_TYPE_ID: 3, // Contact entity type
            ENTITY_ID: contactId,
            PRESET_ID: 1, // Default preset
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
        } catch (error) {
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

    } catch (error) {
      this.logger.error('❌ Failed to create contact', {
        error: error.message,
        contactData: {
          name: createContactDto.name,
          email: createContactDto.email,
          phone: createContactDto.phone
        }
      });

      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException(
        `Failed to create contact: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Put(':id')
  @ApiOperation({ 
    summary: 'Cập nhật thông tin contact',
    description: 'Cập nhật thông tin contact trong Bitrix24 CRM bao gồm thông tin địa chỉ và ngân hàng'
  })
  @ApiParam({ name: 'id', description: 'ID của contact cần cập nhật' })
  @ApiBody({ type: UpdateContactDto })
  @ApiResponse({ 
    status: 200, 
    description: 'Contact được cập nhật thành công' 
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Contact không tồn tại' 
  })
  async updateContact(@Param('id') id: string, @Body() updateContactDto: UpdateContactDto) {
    try {
      this.logger.log('📞 Updating contact', { 
        id,
        hasEmail: !!updateContactDto.email,
        hasPhone: !!updateContactDto.phone,
        hasBankInfo: !!updateContactDto.bank_info
      });

      // Check if contact exists
      const existingContact = await this.bitrix24Service.callBitrixAPI('crm.contact.get', { id });
      if (!existingContact.result) {
        throw new HttpException('Contact không tồn tại', HttpStatus.NOT_FOUND);
      }

      // Prepare update data
      const updateData: any = {};

      if (updateContactDto.name) updateData.NAME = updateContactDto.name;
      if (updateContactDto.second_name) updateData.SECOND_NAME = updateContactDto.second_name;
      if (updateContactDto.last_name) updateData.LAST_NAME = updateContactDto.last_name;
      if (updateContactDto.comments) updateData.COMMENTS = updateContactDto.comments;
      if (updateContactDto.type_id) updateData.TYPE_ID = updateContactDto.type_id;
      if (updateContactDto.source_id) updateData.SOURCE_ID = updateContactDto.source_id;

      // Handle email
      if (updateContactDto.email) {
        updateData.EMAIL = [{ VALUE: updateContactDto.email, VALUE_TYPE: 'WORK' }];
      }

      // Handle phone
      if (updateContactDto.phone) {
        updateData.PHONE = [{ VALUE: updateContactDto.phone, VALUE_TYPE: 'WORK' }];
      }

      // Handle website
      if (updateContactDto.website) {
        updateData.WEB = [{ VALUE: updateContactDto.website, VALUE_TYPE: 'WORK' }];
      }

      // Handle address
      if (updateContactDto.address) {
        const addr = updateContactDto.address;
        if (addr.address) updateData.ADDRESS = addr.address;
        if (addr.province) updateData.ADDRESS_CITY = addr.province;
        if (addr.district) updateData.ADDRESS_REGION = addr.district;
        if (addr.postal_code) updateData.ADDRESS_POSTAL_CODE = addr.postal_code;
        if (addr.ward) {
          const fullAddress = [addr.address, addr.ward].filter(Boolean).join(', ');
          updateData.ADDRESS = fullAddress;
        }
      }

      // Update contact in Bitrix24
      const result = await this.bitrix24Service.callBitrixAPI('crm.contact.update', { 
        id, 
        fields: updateData 
      });

      // Handle bank information update
      let bankResult = null;
      if (updateContactDto.bank_info) {
        try {
          // First, try to find existing requisite
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
            // Update existing requisite
            const requisiteId = existingRequisites.result[0].ID;
            bankResult = await this.bitrix24Service.callBitrixAPI('crm.requisite.update', {
              id: requisiteId,
              fields: requisiteData
            });
            this.logger.log('✅ Bank info updated', { id, requisiteId });
          } else {
            // Create new requisite
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
        } catch (error) {
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

    } catch (error) {
      this.logger.error('❌ Failed to update contact', {
        error: error.message,
        id
      });

      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException(
        `Failed to update contact: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Delete(':id')
  @ApiOperation({ 
    summary: 'Xóa contact',
    description: 'Xóa contact khỏi Bitrix24 CRM bao gồm cả thông tin ngân hàng liên quan'
  })
  @ApiParam({ name: 'id', description: 'ID của contact cần xóa' })
  @ApiResponse({ 
    status: 200, 
    description: 'Contact được xóa thành công' 
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Contact không tồn tại' 
  })
  async deleteContact(@Param('id') id: string) {
    try {
      this.logger.log('📞 Deleting contact', { id });

      // Check if contact exists
      const existingContact = await this.bitrix24Service.callBitrixAPI('crm.contact.get', { id });
      if (!existingContact.result) {
        throw new HttpException('Contact không tồn tại', HttpStatus.NOT_FOUND);
      }

      // Delete associated bank information (requisites) first
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
      } catch (error) {
        this.logger.warn('⚠️ Failed to delete bank info', { id, error: error.message });
      }

      // Delete contact
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

    } catch (error) {
      this.logger.error('❌ Failed to delete contact', {
        error: error.message,
        id
      });

      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException(
        `Failed to delete contact: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}
