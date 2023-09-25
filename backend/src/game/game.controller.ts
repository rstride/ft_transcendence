import { Controller, Get, UseGuards, Param } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { GameService } from './game.service';
import { Result } from './interfaces/game.interfaces';

@Controller('game')
export class GameController {
  constructor(private readonly gameService: GameService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  public async getAll() {
    const games = this.gameService.getCurrentGames();

    return { games: games };
  }

  @Get('gameStats/:userId')
  @UseGuards(JwtAuthGuard)
  public async getOneById(
    @Param('userId') userId: string
    ) {

	const games: Result[] = await this.gameService.getGameStatForPlayer(parseInt(userId))
    return ({games: games});
    }
}
