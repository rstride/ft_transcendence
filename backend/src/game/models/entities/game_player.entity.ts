import { User } from 'src/models/users/entities/user.entity';
import { Games } from './game.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';

@Entity()
export class GamePlayer {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.gamePlayer)
  user: User;

  @ManyToOne(() => Games, (game) => game.gamePlayer)
  game: Games;

  @Column()
  score: number;

  @Column()
  winner: boolean;
}
