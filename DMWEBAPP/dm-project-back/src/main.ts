import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import helmet from 'helmet';
import compression from 'compression';
import { NestExpressApplication } from '@nestjs/platform-express';
import { LoggingFilter } from './common/logging.filter';
import { ValidationExceptionFilter } from './common/validation-catch.filter';
async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.enableCors({
    origin: true, // Allow all origins in development
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'x-lang'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  });
  app.getHttpAdapter().get('/', (req: any, res: any) => {
    res.json({ message: 'Welcome to the back of our data mining project!' });
  });

  // Enable gzip/brotli compression for faster data transfer
  app.use(compression({ level: 6, threshold: 1024 }));
  app.use(helmet({}));
  app.setGlobalPrefix('api');
  app.useGlobalFilters(new LoggingFilter(), new ValidationExceptionFilter());

  await app.listen(process.env.PORT || 3001);
  console.log(
    `🚀 Server ready at http://localhost:${process.env.PORT || 3001}`,
  );
}
bootstrap().catch((err) => {
  console.error('❌ Failed to start server:', err);
  process.exit(1);
});
