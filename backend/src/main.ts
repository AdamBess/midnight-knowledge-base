import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // TODO: restrict origins for production (e.g. app.enableCors({ origin: 'https://yourdomain.com' }))
  app.enableCors();
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
