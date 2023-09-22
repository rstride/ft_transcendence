import { Module } from '@nestjs/common';
import { AvatarsService } from './avatars.service';
import { Avatar } from './entities/avatar.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  controllers: [],
  providers: [AvatarsService],

  //  Import repository for entity User
  imports: [TypeOrmModule.forFeature([Avatar])],
  exports: [AvatarsService]
})
export class AvatarsModule {}
