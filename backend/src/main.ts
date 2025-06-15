import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('PetCare API')
    .setDescription('API pour la gestion des utilisateurs, rôles, animaux, etc.')
    .setVersion('1.0')
    .addBearerAuth() // pour JWT
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document); // Swagger sur localhost:3000/api

  await app.listen(3000);
}
bootstrap();
