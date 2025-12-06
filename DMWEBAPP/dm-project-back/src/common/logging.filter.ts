// src/filters/logging.filter.ts
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class LoggingFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    // Get status code
    const status =
      exception instanceof HttpException ? exception.getStatus() : 500;
    // Get the response message
    const responseMessage =
      exception instanceof HttpException
        ? exception.getResponse()
        : {
            message: (exception as Error).message || 'Internal server error',
            ...(process.env.NODE_ENV !== 'production' && {
              stack: (exception as Error).stack,
            }),
          };

    // Format for console logging
    const logEntry = {
      status,
      path: request.url,
      error: this.deepFormat(responseMessage),
      timestamp: new Date().toISOString(),
    };

    // Use console.dir for better object inspection
    console.dir(logEntry, { depth: null, colors: true });

    // Send response
    response.status(status).json({
      statusCode: status,
      ...(typeof responseMessage === 'string'
        ? { message: responseMessage }
        : responseMessage),
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }

  private deepFormat(obj: any): any {
    if (Array.isArray(obj)) {
      return obj.map((item) => this.deepFormat(item));
    }
    if (obj && typeof obj === 'object') {
      return Object.fromEntries(
        Object.entries(obj).map(([key, value]) => [
          key,
          this.deepFormat(value),
        ]),
      );
    }
    return obj;
  }
}
