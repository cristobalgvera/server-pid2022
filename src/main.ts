import { EnvironmentService } from '@core/environment';
import { INestApplication, Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );

  const environmentService = app.get(EnvironmentService);

  if (environmentService.isSwaggerEnabled) enableSwagger(app);

  const port = environmentService.getEnvironmentValue('PORT');
  const logger = app.get(Logger);

  await app.listen(port, '0.0.0.0', (error, address) => {
    if (error) {
      logger.error(error.message, error.stack, 'Bootstrap');
      return;
    }

    logger.log(`Server listening on ${address}`, 'Bootstrap');
  });
}

function enableSwagger(app: INestApplication) {
  const config = new DocumentBuilder()
    .setTitle('Calculator Endpoints')
    .setDescription('The API description of PID2022 project')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api-doc', app, document);
}

bootstrap();
