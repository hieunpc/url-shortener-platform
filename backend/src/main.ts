import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Enable CORS for frontend connection
  app.enableCors({
    origin: ['http://localhost:8080', 'http://localhost:5173'], // Vite default ports
    credentials: true,
  });
  
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
