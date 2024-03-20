import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';
import { ServerEnv } from './config/evn/server-env';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  await app.listen(ServerEnv.PORT || 3000);
}
bootstrap();
