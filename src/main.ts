import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { AppService } from './app.service';
import * as dotenv from 'dotenv';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Swagger 설정
  const config = new DocumentBuilder()
    .setTitle('BetMeme API')
    .setDescription('The BetMeme API description')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const appService = app.get(AppService);

  setInterval(async () => {
    await appService.monitorGames();
  }, 3000); // 1분마다 실행

  await app.listen(3000);
}
bootstrap();
