import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { IoAdapter } from '@nestjs/platform-socket.io';
interface HotModule {
  hot?: {
    accept: () => void;
    dispose: (callback: () => void) => void;
  };
}

declare const module: HotModule;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // Configure CORS for HTTP requests
  app.enableCors({
    origin: '*', // Allow all origins
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // Allowed HTTP methods
    credentials: true, // Allow credentials (cookies, authorization headers, etc.)
    allowedHeaders: 'Content-Type, Authorization', // Allowed headers
  });
  
  // Configure WebSocket adapter with CORS
  app.useWebSocketAdapter(new IoAdapter(app));
  const config = new DocumentBuilder()
    .setTitle('APIs for PetCare')
    .setDescription('API documentation for PetCare application')
    // .setVersion('1.0')
    //.addTag('pets')
    .addBearerAuth() // JWT
    .build();
  
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);


  await app.listen(process.env.PORT ?? 3000);
  
  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}

// Add void operator to handle the floating promise
void bootstrap();
