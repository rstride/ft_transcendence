import {
  WebSocketGateway,
  SubscribeMessage,
  WebSocketServer,
  ConnectedSocket,
  MessageBody,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Inject } from '@nestjs/common';
import { GameService } from './game.service';
import { PaddleInfo } from './interfaces/game.interfaces';
import { UserStatus } from 'src/models/users/entities/user.entity';

@WebSocketGateway({
  cors: {
    origin: true,
    credentials: true,
  },
})
export class GameGateway implements OnGatewayDisconnect {
  @WebSocketServer() server: Server;

  constructor(@Inject(GameService) private gameService: GameService) {}

  async handleDisconnect(@ConnectedSocket() client: Socket) {
    await this.gameService.removeFromQueue(client);
    await this.gameService.updateGameStatus(client);
    this.gameService.deleteSocketData(client, this.server);
  }

  @SubscribeMessage('userLogout')
  async loggedOut(@ConnectedSocket() client: Socket) {
    await this.gameService.removeFromQueue(client);
    await this.gameService.updateGameStatus(client);
    this.gameService.deleteUserData(client, this.server);
  }

  @SubscribeMessage('joinQueue')
  async joinQueue(@ConnectedSocket() client: Socket) {
    await this.gameService.pushToQueue(client);
    await this.gameService.monitorQueue(this.server);
  }

  @SubscribeMessage('leaveQueue')
  async leaveQueue(@ConnectedSocket() client: Socket) {
    await this.gameService.removeFromQueue(client);
  }

  @SubscribeMessage('paddleDown')
  paddleDown(@ConnectedSocket() client: Socket, @MessageBody() paddleInfo: PaddleInfo) {
    this.gameService.updatePaddle(client.id, paddleInfo[1], 'down', paddleInfo[0]);
  }

  @SubscribeMessage('paddleUp')
  paddleUp(@ConnectedSocket() client: Socket, @MessageBody() paddleInfo: PaddleInfo) {
    this.gameService.updatePaddle(client.id, paddleInfo[1], 'up', paddleInfo[0]);
  }

  @SubscribeMessage('getGameSessions')
  retrieveGameSessions(@ConnectedSocket() client: Socket) {
    this.gameService.sendGameSessions(this.server, client);
  }

  @SubscribeMessage('spectator')
  joinSpectators(@ConnectedSocket() client: Socket, @MessageBody() roomID: string) {
    this.gameService.joinAsSpectator(client, roomID);
  }

  @SubscribeMessage('inviteGame')
  async inviteGame(@ConnectedSocket() inviterSocket: Socket, @MessageBody() inviteeID: number) {

    const inviterUser = await this.gameService.getUserFromSocket(inviterSocket);
    if (!inviterUser || inviterUser.status === UserStatus.Offline) {
      this.server.to(inviterSocket.id).emit('errorGameInvite', { errorMsg: 'An error has occured, please refresh the page.' });
      return;
    }

    if (inviterUser.status === UserStatus.InGame) {
      this.server.to(inviterSocket.id).emit('errorGameInvite', { errorMsg: 'You are already in game!' });
      return;
    }

    if (!this.gameService.isUserConnected(inviteeID)) {
      this.server.to(inviterSocket.id).emit('errorGameInvite', { errorMsg: 'User is not connected!' });
      return;
    }

    if (await this.gameService.isUserInGame(inviteeID)) {
      this.server.to(inviterSocket.id).emit('errorGameInvite', { errorMsg: 'User is already in game!' });
      return;
    }

    const inviter = await this.gameService.getUserFromSocket(inviterSocket);
    
    this.server
      .to('user_' + inviteeID.toString())
      .emit('wantToPlay', { name: inviter.name, userId: inviter.id, inviterSocketId: inviterSocket.id });
    this.server.to(inviterSocket.id).emit('inviteSuccessfullySent');

    await this.gameService.addToInvitationList(inviterSocket, inviteeID);
  }

  @SubscribeMessage('answerToInvite')
  async answerToInvite(
    @ConnectedSocket() inviteeSocket: Socket,
    @MessageBody()
    body: {
      answer: boolean;
      inviterId: number;
      inviterSocketId: string;
    },
  ) {
    const inviteeUser = await this.gameService.getUserFromSocket(inviteeSocket);

    this.server.to('user_' + inviteeUser.id.toString()).emit('closeInvite');

    const inviterSocket = this.gameService.getSocketFromId(body.inviterId, body.inviterSocketId)
    if (!inviterSocket) {
      this.server.to(inviteeSocket.id).emit('errorGameInvite', { errorMsg: 'An error has occured.' });
      return;
    }

    if (body.answer === false) {
      await this.gameService.removeFromInvitationList(inviteeSocket, body.inviterId);
      this.server.to(inviterSocket.id).emit('inviteRefused', { userName: inviteeUser.name });
    } else {
      this.gameService.setUpGame(inviteeSocket, inviterSocket, this.server);
    }
  }
}
