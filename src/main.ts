import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const fontend_url = configService.get<string>('CORS_URL', 'http://localhost:3000');
  app.enableCors({
    origin: [fontend_url],
    methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"],
    allowedHeaders: 'Content-Type, Accept, Authorization, X-Requested-With, Access-Control-Allow-Origin, Access-Control-Allow-Headers, Access-Control-Allow-Credentials, Access-Control-Allow-Methods',
    credentials: true,
  });
  await app.listen(configService.get<number>('SERVER_PORT', 4000));
}
bootstrap();
