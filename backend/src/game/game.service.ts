import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Games } from './models/entities/game.entity';
import { GamePlayer } from './models/entities/game_player.entity';
import { Server, Socket } from 'socket.io';
import { ConnectedSocket } from '@nestjs/websockets';
import { Game } from './classes/game.classes';
import { updateGame } from './utils/game.utils';
import { AuthService } from 'src/auth/auth.service';
import { UserDto } from 'src/models/users/dto/user.dto';
import { CreateGamePlayerDto } from './models/dto/create-gamePlayer.dto';
import { User, UserStatus } from 'src/models/users/entities/user.entity';
import { UsersService } from 'src/models/users/users.service';
import { Result } from './interfaces/game.interfaces';

@Injectable()
export class GameService {
  constructor(
    private authService: AuthService,
    private userService: UsersService,
    @InjectRepository(Games) private gamesRepository: Repository<Games>,
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(GamePlayer) private gamePlayerRepository: Repository<GamePlayer>,
  ) {
    this.queue = new Map();
    this.gameSessions = new Map();
    this.newInvitationList = new Map();
  }

  /* Queue and game sessions */
  public queue: Map<string, Socket>;
  public gameSessions: Map<string, Game>;
  public newInvitationList: Map<number, { userIds: number[]; userSocket: Socket }[]>;

  /*
   **
   ** @Match Making
   **
   */

  async pushToQueue(client: Socket) {
    const currentUser: UserDto | null = await this.authService.getUserFromSocket(client);
    if (!currentUser || !this.authService.isUserConnected(currentUser.id)) {
      client.emit('errorMsg', 'You have to be logged in to join a game!');
      return;
    }

    if (currentUser.status === UserStatus.InGame) {
      client.emit('errorMsg', 'You are already in a game!');
      return;
    }

    if (this.queue.size === 1) {
      const userInQueue: UserDto | null = await this.authService.getUserFromSocket(
        this.queue.get(Array.from(this.queue.keys())[0]),
      );
      if (currentUser.id === userInQueue.id) {
        client.emit('errorMsg', 'You are already in queue, sit tight!');
        return;
      }
    }
    this.queue.set(client.id, client);
  }

  async removeFromQueue(client: Socket) {
    this.queue.delete(client.id);
  }

  async monitorQueue(server: Server) {
    if (this.queue.size === 2) {
      await this.setUpGame(
        this.queue.get(Array.from(this.queue.keys())[0]),
        this.queue.get(Array.from(this.queue.keys())[1]),
        server,
      );
      this.queue.clear();
    }
  }

  /*
   **
   ** @Game logic
   **
   */

  /* Set up game once two players have been match-maked */
  async setUpGame(@ConnectedSocket() id1: Socket, @ConnectedSocket() id2: Socket, server: Server) {
    const user1: UserDto | null = await this.authService.getUserFromSocket(id1);
    const user2: UserDto | null = await this.authService.getUserFromSocket(id2);

    /* close all invitations */
    this.closeAllInvitationsFromUser(server, user1.id);
    this.closeAllInvitationsFromUser(server, user2.id);

    /* set up game */
    const gameInfo = new Game();
    gameInfo.player1.socketID = id1.id;
    gameInfo.player1.userName = user1.name;
    gameInfo.player1.userID = user1.id;
    gameInfo.player2.socketID = id2.id;
    gameInfo.player2.userName = user2.name;
    gameInfo.player2.userID = user2.id;
    gameInfo.gameStatus = 'running';

    /* update player status to 'In game' */
    await this.userService.setStatus(user1.id, UserStatus.InGame);
    await this.userService.setStatus(user2.id, UserStatus.InGame);
    server.emit('onUserChange');

    /* set up room for game */
    gameInfo.gameID = id1.id + id2.id;
    id1.join(gameInfo.gameID);
    id2.join(gameInfo.gameID);

    /* add that game info to the gameSessions */
    this.gameSessions.set(gameInfo.gameID, gameInfo);

    /* send all active game sessions */
    const gameSessions = [];

    this.gameSessions.forEach((value: Game, key: string) => {
      if (value.gameStatus === 'running') {
        gameSessions.push(value);
      }
    });
    server.emit('currentGameSessions', gameSessions);

    server.to(gameInfo.gameID).emit('gameReady');
    server.to(gameInfo.gameID).emit('gameLaunched', this.gameSessions.get(gameInfo.gameID));
    await this.serverLoop(server, gameInfo.gameID);
  }

  /* Update game status in case one player left early or got disconnected */
  async updateGameStatus(@ConnectedSocket() client: Socket) {
    for (const key of this.gameSessions.keys()) {
      if (key.includes(client.id) === true) {
        let gameInfo: Game = this.gameSessions.get(key);
        const user: UserDto | null = await this.authService.getUserFromSocket(client);
        gameInfo.gameStatus = 'stopped';
        gameInfo.gameLoser = user.name;
        this.gameSessions.set(key, gameInfo);
      }
    }
  }

  /* Update a player's paddle position */
  updatePaddle(clientID: string, gameID: string, upOrDown: string, keyPress: boolean) {
    if (clientID == this.gameSessions.get(gameID).player1.socketID) {
      if (upOrDown == 'down') {
        this.gameSessions.get(gameID).player1.arrowDown = keyPress;
      } else if (upOrDown == 'up') {
        this.gameSessions.get(gameID).player1.arrowUp = keyPress;
      }
    } else if (clientID == this.gameSessions.get(gameID).player2.socketID) {
      if (upOrDown == 'down') {
        this.gameSessions.get(gameID).player2.arrowDown = keyPress;
      } else if (upOrDown == 'up') {
        this.gameSessions.get(gameID).player2.arrowUp = keyPress;
      }
    }
  }

  /*
   **
   ** @Server loop
   **
   */

  async endGame(myInterval: any, gameSession: Game, server: Server, gameID: string) {
    clearInterval(myInterval);
    if (gameSession.gameStatus === 'stopped') {
      server.to(gameID).emit('gameFinishedEarly', gameSession.gameLoser);
    } else {
      if (gameSession.player1.score >= 5) {
        gameSession.gameWinner = gameSession.player1.userName;
        gameSession.gameLoser = gameSession.player2.userName;
        await this.userService.addWin(gameSession.player1.userID);
        await this.userService.addLose(gameSession.player2.userID);
      } else {
        gameSession.gameWinner = gameSession.player2.userName;
        gameSession.gameLoser = gameSession.player1.userName;
        await this.userService.addWin(gameSession.player2.userID);
        await this.userService.addLose(gameSession.player1.userID);
      }
      gameSession.gameStatus = 'stopped';
      server.to(gameID).emit('gameFinished', gameSession.gameWinner);


      this.createGame().then(async (game) => {
        const player1Dto: CreateGamePlayerDto = {
          user: await this.userRepository.findOneBy({
            id: gameSession.player1.userID,
          }),
          game: game,
          score: gameSession.player1.score,
          winner: gameSession.player1.score > gameSession.player2.score,
        };

        const player2Dto: CreateGamePlayerDto = {
          user: await this.userRepository.findOneBy({
            id: gameSession.player2.userID,
          }),
          game: game,
          score: gameSession.player2.score,
          winner: gameSession.player2.score > gameSession.player1.score,
        };

        await this.createGamePlayer(player1Dto);
        await this.createGamePlayer(player2Dto);
      });
    }

    /* update player status to 'Online' */
    if (this.authService.isUserConnected(gameSession.player1.userID)) {
      await this.userService.setStatus(gameSession.player1.userID, UserStatus.Online);
    }
    if (this.authService.isUserConnected(gameSession.player2.userID)) {
      await this.userService.setStatus(gameSession.player2.userID, UserStatus.Online);
    }
    server.emit('onUserChange');

    /* send all active game sessions */
    const gameSessions = [];

    this.gameSessions.forEach((value: Game, key: string) => {
      if (value.gameStatus === 'running') {
        gameSessions.push(value);
      }
    });

    server.emit('currentGameSessions', gameSessions);
  }

  async serverLoop(server: Server, gameID: string) {
    const myInterval = setInterval(() => {
      const gameSession: Game = this.gameSessions.get(gameID);
      updateGame(gameSession);

      if (gameSession.player1.score >= 5 || gameSession.player2.score >= 5 || gameSession.gameStatus === 'stopped') {
        this.endGame(myInterval, gameSession, server, gameID);
      } else {
        server.to(gameID).emit('gameUpdate', this.gameSessions.get(gameID));
      }
    }, 1000 / 60);
  }

  /*
   **
   ** @Spectator
   **
   */

  sendGameSessions(server: Server, client: Socket) {
    const gameSessions = [];

    this.gameSessions.forEach((value: Game, key: string) => {
      if (value.gameStatus === 'running') {
        gameSessions.push(value);
      }
    });
    server.to(client.id).emit('currentGameSessions', gameSessions);
  }

  getCurrentGames() {
    const gameSessions = [];

    this.gameSessions.forEach((value: Game, key: string) => {
      if (value.gameStatus === 'running') {
        gameSessions.push(value);
      }
    });
    return gameSessions;
  }

  joinAsSpectator(client: Socket, roomID: string) {
    client.join(this.gameSessions.get(roomID).gameID);
  }
  /*
   **
   ** @InviteToGame
   **
   */

  deleteUserData(socket: Socket, server: Server) {
    for (const [key, data] of this.newInvitationList) {
      for (let i = 0; i < data.length; ++i) {
        if (data[i].userSocket.id === socket.id)
        {
          this.closeAllInvitationsFromUser(server, key);
          return ;
        }
      }
    }
  }

  deleteSocketData(socket: Socket, server: Server) {
    for (const [key, data] of this.newInvitationList) {
      for (let i = 0; i < data.length; ++i) {
        if (data[i].userSocket.id === socket.id)
        {
          const userSocketData = this.newInvitationList.get(key);

          for (let j = 0; j < userSocketData[i].userIds.length; ++j) {
            server.to('user_' + userSocketData[i].userIds[j].toString()).emit('closeInvite');
          }

          userSocketData.splice(i, 1);
          this.newInvitationList.set(key, userSocketData);
          return ;
        }
      }
    }
  }

  closeAllInvitationsFromUser(server: Server, userID: number) {
    const invitedUsers: { userIds: number[]; userSocket: Socket }[] = this.newInvitationList.get(userID);

    if (!invitedUsers) {
      return;
    }

    for (let i = 0; i < invitedUsers.length; ++i) {
      for (let k = 0; k < invitedUsers[i].userIds.length; ++k) {
        server.to('user_' + invitedUsers[i].userIds[k].toString()).emit('closeInvite');
      }
    }
    this.newInvitationList.delete(userID);
  }

  async addToInvitationList(inviterSocket: Socket, inviteeId: number) {
    const inviterUser: UserDto | null = await this.authService.getUserFromSocket(inviterSocket);

    let ids: { userIds: number[]; userSocket: Socket }[] = this.newInvitationList.get(inviterUser.id);
    if (!ids) {
      ids = [{ userIds: [inviteeId], userSocket: inviterSocket }];
    } 
    else {
      for (let i = 0; i < ids.length; ++i) {
        if (ids[i].userSocket.id === inviterSocket.id) ids[i].userIds.push(inviteeId);
      }
    }
    this.newInvitationList.set(inviterUser.id, ids);
  }

  async removeFromInvitationList(inviteeSocket: Socket, inviterId: number) {
    const inviteeUser: UserDto | null = await this.authService.getUserFromSocket(inviteeSocket);

    const ids: { userIds: number[]; userSocket: Socket }[] = this.newInvitationList.get(inviterId);

    for (let i = 0; i < ids.length; ++i) {
      const index = ids[i].userIds.indexOf(inviteeUser.id);

      if (index > -1) {
        ids[i].userIds.splice(index, 1);
        this.newInvitationList.set(inviterId, ids);
      }
    }
  }

  async getUserFromSocket(client: Socket) {
    const userDto = await this.authService.getUserFromSocket(client);
    return userDto;
  }

  getSocketFromId(userID: number, socketID: string): Socket | null {
    const data: { userIds: number[]; userSocket: Socket }[] = this.newInvitationList.get(userID);

    if (!data) {
      return null;
    }

    for (let i = 0; i < data.length; ++i) {
      if (data[i].userSocket.id === socketID) {
        return data[i].userSocket;
      }
    }
    return null;
  }

  isUserConnected(userID: number) {
    return this.authService.isUserConnected(userID);
  }

  async isUserInGame(userID: number) {
    const userDto = await this.userService.findOneById(userID);
    return (userDto.status === UserStatus.InGame);
  }

  /*
   **
   ** @Database (TypeORM)
   **
   */

  createGame(): Promise<Games> {
    const newGame = this.gamesRepository.create();
    return this.gamesRepository.save(newGame);
  }

  createGamePlayer(gamePlayer: CreateGamePlayerDto): Promise<GamePlayer> {
    const newGamePlayer = this.gamePlayerRepository.create(gamePlayer);
    return this.gamePlayerRepository.save(newGamePlayer);
  }

  async getGameStatForPlayer(userID: number): Promise<Result[]> {
    const gameStats: GamePlayer[] = await this.gamePlayerRepository
      .createQueryBuilder('gamePlayer')
      .leftJoinAndSelect('gamePlayer.user', 'user')
      .leftJoinAndSelect('gamePlayer.game', 'game')
      .select(['gamePlayer.id', 'gamePlayer.score', 'gamePlayer.winner', 'user.name', 'game.id', 'game.date'])
      .orderBy('game.date', 'ASC')
      .where((qb) => {
        const subQuery = qb
          .subQuery()
          .from(Games, 'game')
          .leftJoin('game.gamePlayer', 'gamePlayer')
          .leftJoin('gamePlayer.user', 'user')
          .select(['game.id'])
          .where('user.id = :id', { id: userID })
          .getQuery();
        return 'game.id IN ' + subQuery;
      })
      .getMany();

    let results: Result[] = [];

    for (let i: number = 0; i < gameStats.length - 1; i++) {
      if (gameStats[i].game.id == gameStats[i + 1].game.id) {
        let result = {
          key: i,
          date: gameStats[i].game.date.toDateString(),
          winner: gameStats[i].winner ? gameStats[i].user.name : gameStats[i + 1].user.name,
          loser: gameStats[i].winner ? gameStats[i + 1].user.name : gameStats[i].user.name,
          scoreWinner: gameStats[i].winner ? gameStats[i].score : gameStats[i + 1].score,
          scoreLoser: gameStats[i].winner ? gameStats[i + 1].score : gameStats[i].score,
        };
        results.push(result);
      }
    }
    return results;
  }
}
