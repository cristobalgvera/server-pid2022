import { EnvironmentModule } from '@core/environment';
import { Logger, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [EnvironmentModule],
  controllers: [AppController],
  providers: [AppService, Logger],
})
export class AppModule {}
