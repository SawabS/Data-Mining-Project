// src/filters/debug.filter.ts
import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common';

@Catch()
export class DebugFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    console.log('Original Exception:', {
      name: exception.name,
      message: exception.message,
      status: exception.getStatus?.(), // Check if it's an HttpException
      stack: exception.stack,
    });
    throw exception; // Re-throw to see default behavior
  }
}
