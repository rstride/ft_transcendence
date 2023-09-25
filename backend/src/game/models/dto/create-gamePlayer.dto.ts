import { User } from 'src/models/users/entities/user.entity';
import { Games } from '../entities/game.entity';

export class CreateGamePlayerDto {
  readonly user: User;
  readonly game: Games;
  readonly score: number;
  readonly winner: boolean;
}
