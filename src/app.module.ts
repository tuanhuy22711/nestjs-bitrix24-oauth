import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';

import { Bitrix24Module } from './bitrix24/bitrix24.module';
import { ContactsModule } from './bitrix24/contacts/contacts.module';
import { DatabaseModule } from './database/database.module';
import { HealthController } from './health/health.controller';

@Module({
  imports: [
    // Configuration module
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      cache: true,
    }),
    
    // Database module
    DatabaseModule,
    
    // Bitrix24 integration module
    Bitrix24Module,
    
    // Contacts management module
    ContactsModule,
    
    // HTTP module for health checks
    HttpModule,
  ],
  controllers: [HealthController],
  providers: [],
})
export class AppModule {}
