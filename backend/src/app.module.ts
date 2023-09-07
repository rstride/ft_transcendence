import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { ChatGateway } from './chat/chat.gateway';

TypeOrmModule.forRoot({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'your_username',
  password: 'your_password',
  database: 'your_database',
  entities: [/* your entities here */],
  synchronize: true,
}),

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'rstride',
      password: 'garen',
      database: 'database',
      entities: [/* your entities here */],
      synchronize: true,
    }),
    UsersModule,
  ],
  providers: [ChatGateway],
})
export class AppModule {}
