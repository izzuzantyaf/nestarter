import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const logger = new Logger('NestApplication');

  const app = await NestFactory.create(AppModule, {
    cors: true,
    logger: process.env.APP_ENV === 'production' ? ['log'] : ['debug'],
  });

  app.setGlobalPrefix('api');

  if (process.env.APP_ENV !== 'production') {
    const config = new DocumentBuilder()
      .setTitle('Nestarter app OpenAPI')
      .setDescription('Nestarter app API Documentation')
      .setVersion('1.0.0')
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);
  }

  await app
    .listen(process.env.PORT)
    .then(() => {
      logger.log(`Server running on http://localhost:${process.env.PORT}`);
    })
    .catch(() => {
      logger.error('Server failed to start');
    });
}
bootstrap();
