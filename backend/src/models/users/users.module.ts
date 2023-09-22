import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { AvatarsModule } from '../avatars/avatars.module';
import { HttpModule } from '@nestjs/axios';
import { UsersGateway } from './users.gateway';

@Module({
  controllers: [UsersController],
  providers: [UsersGateway, UsersService],
   
  //  Import repository for entity User
  imports: [
    HttpModule,
    TypeOrmModule.forFeature([User]),
    AvatarsModule,
  ],
  exports: [UsersService]
})
export class UsersModule {}