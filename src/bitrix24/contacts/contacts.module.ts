import { Module } from '@nestjs/common';
import { ContactsController } from './contacts.controller';
import { Bitrix24Service } from '../bitrix24.service';
import { DatabaseModule } from '../../database/database.module';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    ConfigModule,
    HttpModule,
    DatabaseModule
  ],
  controllers: [ContactsController],
  providers: [Bitrix24Service],
  exports: [Bitrix24Service]
})
export class ContactsModule {}
