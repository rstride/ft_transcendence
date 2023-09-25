import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { User } from 'src/models/users/entities/user.entity';
import { UsersModule } from 'src/models/users/users.module';
import { GameController } from './game.controller';
import { GameGateway } from './game.gateway';
import { GameService } from './game.service';
import { Games } from './models/entities/game.entity';
import { GamePlayer } from './models/entities/game_player.entity';

@Module({
  controllers: [GameController],
  imports: [AuthModule, UsersModule, TypeOrmModule.forFeature([Games, GamePlayer, User])],
  providers: [GameGateway, GameService],
})
export class GameModule {}
