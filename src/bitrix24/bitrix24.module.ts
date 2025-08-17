import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';

import { Bitrix24Controller } from './bitrix24.controller';
import { Bitrix24ApiController } from './bitrix24-api.controller';
import { Bitrix24Service } from './bitrix24.service';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [
    HttpModule.register({
      timeout: 10000,
      maxRedirects: 5,
    }),
    ConfigModule,
    DatabaseModule,
  ],
  controllers: [Bitrix24Controller, Bitrix24ApiController],
  providers: [Bitrix24Service],
  exports: [Bitrix24Service],
})
export class Bitrix24Module {}
