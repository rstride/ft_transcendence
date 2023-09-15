import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
// import { FortyTwoStrategy } from './auth/passport.strategy';
// import { AuthService } from './auth/auth.service';
import { UserService } from './user/user.service';
import { UserController } from './user/user.controller';
import { AppService } from './app.service';
import { ChatGateway } from './chat/chat.gateway';
import { UserModule } from './user/user.module';
import { AppController } from './app.controller';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'postgres', // Use the service name from docker-compose.yml
      port: 5432,
      username: 'transcendence',
      password: 'garen',
      database: 'database',
      autoLoadEntities: true,
      synchronize: true,
    }),
    PassportModule.register({ defaultStrategy: '42' }),
    UserModule,
  ],
  controllers: [AppController, UserController],
  providers: [
    AppService,
    ChatGateway,
    // AuthService,
    UserService, // Rename this import
    // FortyTwoStrategy,
    ConfigService,
  ],
})
export class AppModule {}