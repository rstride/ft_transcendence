import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { UsersModule } from './models/users/users.module';
import { AvatarsModule } from './models/avatars/avatars.module';
import { getEnvPath } from './common/helper/env.helper';
import { TypeOrmConfigService } from './config/typeorm/typeorm.service';
import { AuthModule } from './auth/auth.module';

//  Get the environment file
const envFilePath: string = getEnvPath(`${__dirname}/common/envs`);

//  Import environment variables with config modules and configure typeorm
@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath, isGlobal: true }),
    TypeOrmModule.forRootAsync({ useClass: TypeOrmConfigService }),
    UsersModule,
    AuthModule,
    AvatarsModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
