import { EnvironmentService } from '@core/environment';
import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );

  const environmentService = app.get(EnvironmentService);
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
bootstrap();
