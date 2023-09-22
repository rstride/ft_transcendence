import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as cookieParser from 'cookie-parser';
import { AppModule } from './app.module';

async function bootstrap() {
  //  Use Express platform ; allow exclusive methods from that platform
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  //  Get our config service, to retrieve port and base url
  const config: ConfigService = app.get(ConfigService);
  const port: number = config.get<number>('PORT');

  //  Needed to parse cookies
  app.use(cookieParser());

  //  Enable cross-origin ressource sharing
  app.enableCors({
    origin: true,
    credentials: true,
  });

  await app.listen(port, () => {
    console.log('[WEB]', config.get<string>('BASE_URL'));
  });

}
bootstrap();
