import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Request, Response } from 'express';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggingInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();
    
    const startTime = Date.now();
    const { method, url, ip } = request;
    const userAgent = request.get('User-Agent') || '';

    // Log request
    this.logger.log('📨 Incoming request', {
      method,
      url,
      ip,
      userAgent: userAgent.substring(0, 100), // Truncate long user agents
    });

    return next.handle().pipe(
      tap({
        next: (data) => {
          const duration = Date.now() - startTime;
          const { statusCode } = response;

          // Safely calculate response size
          let responseSize = 0;
          try {
            responseSize = JSON.stringify(data).length;
          } catch (error) {
            responseSize = -1; // Indicates circular reference or non-serializable data
          }

          this.logger.log('📤 Request completed', {
            method,
            url,
            statusCode,
            duration: `${duration}ms`,
            ip,
            responseSize: responseSize === -1 ? 'Non-serializable' : responseSize,
          });
        },
        error: (error) => {
          const duration = Date.now() - startTime;
          const statusCode = error.status || 500;

          this.logger.error('📤 Request failed', {
            method,
            url,
            statusCode,
            duration: `${duration}ms`,
            ip,
            error: error.message,
          });
        },
      })
    );
  }
}
