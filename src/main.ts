import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const fontend_url = configService.get<string>('CORS_URL', 'http://localhost:60228');
  app.use(cookieParser());
  app.enableCors({
    origin: [fontend_url],
    methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"],
    allowedHeaders: 'Content-Type, Accept, Authorization, X-Requested-With, Access-Control-Allow-Origin, Access-Control-Allow-Headers, Access-Control-Allow-Credentials, Access-Control-Allow-Methods',
    credentials: true,
  });
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  const config = new DocumentBuilder()
  .setTitle('BuddyCoach API')
  .setDescription('API documentation for BuddyCoach')
  .setVersion('1.0')
  .addBearerAuth()
  .build();
  
const document = SwaggerModule.createDocument(app, config);
SwaggerModule.setup('api-docs', app, document);
  await app.listen(configService.get<number>('SERVER_PORT', 3001));
}
bootstrap();
