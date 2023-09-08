import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { ChatGateway } from './chat/chat.gateway';

@Module({
  imports: [
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
    // other modules
  ],
})
export class AppModule {}


