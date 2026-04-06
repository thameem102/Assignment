import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS for frontend
  app.enableCors({
    origin: ['http://localhost:3000'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    credentials: true,
  });

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  // Swagger API documentation
  const config = new DocumentBuilder()
    .setTitle('Order Service API')
    .setDescription('REST API gateway for Order and Product microservices')
    .setVersion('1.0')
    .addTag('orders', 'Order management endpoints')
    .addTag('products', 'Product management endpoints (proxied to gRPC)')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(3003);
  console.log('🚀 Order Service (HTTP Gateway) is running on port 3003');
  console.log('📄 Swagger docs available at http://localhost:3003/api/docs');
}
bootstrap();
