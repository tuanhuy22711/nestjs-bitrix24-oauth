import { Test, TestingModule } from '@nestjs/testing';
import { Bitrix24Service } from './bitrix24.service';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { DatabaseService } from '../database/database.service';
import { of } from 'rxjs';

describe('Bitrix24Service', () => {
  let service: Bitrix24Service;
  let httpService: HttpService;
  let databaseService: DatabaseService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        Bitrix24Service,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string) => {
              const config = {
                BITRIX24_CLIENT_ID: 'test_id',
                BITRIX24_CLIENT_SECRET: 'test_secret',
                BITRIX24_DOMAIN: 'test.bitrix24.com',
                BITRIX24_REDIRECT_URI: 'http://localhost/callback',
                BITRIX24_API_TIMEOUT: 10000,
                BITRIX24_API_RETRY_ATTEMPTS: 3,
                BITRIX24_API_RETRY_DELAY: 1000,
              };
              return config[key];
            }),
          },
        },
        {
          provide: HttpService,
          useValue: {
            post: jest.fn(),
            get: jest.fn(),
          },
        },
        {
          provide: DatabaseService,
          useValue: {
            getToken: jest.fn(),
            saveToken: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<Bitrix24Service>(Bitrix24Service);
    httpService = module.get<HttpService>(HttpService);
    databaseService = module.get<DatabaseService>(DatabaseService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should process installation and save token', async () => {
    const authData = {
      access_token: 'token',
      refresh_token: 'refresh',
      domain: 'test.bitrix24.com',
      scope: 'crm',
    };
    databaseService.saveToken = jest.fn().mockResolvedValue(true);
    const result = await service.processInstallation(authData as any);
    expect(databaseService.saveToken).toHaveBeenCalled();
    expect(result).toBeDefined();
  });

  it('should call Bitrix24 API and return result', async () => {
  databaseService.getCurrentToken = jest.fn().mockResolvedValue({ access_token: 'token' });
    httpService.post = jest.fn().mockReturnValue(of({ data: { result: 'ok' } }));
    const result = await service.callBitrixAPI('crm.contact.add', { fields: { NAME: 'Test' } });
    expect(result.result).toBe('ok');
  });
});
