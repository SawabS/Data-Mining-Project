import {
  Catch,
  ExceptionFilter,
  ArgumentsHost,
  HttpException,
  Injectable,
} from '@nestjs/common';
import { Response } from 'express';

@Injectable()
@Catch(HttpException)
export class ValidationExceptionFilter implements ExceptionFilter {
  constructor() {}

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    const errorResponse = exception.getResponse();

    // Send response back to the client
    response.status(status).json({
      statusCode: status,
      message: errorResponse['message'],
    });
  }
}
