import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  ConnectedSocket,
  OnGatewayConnection,
} from '@nestjs/websockets';
import { Server, Socket} from 'socket.io';
import { ChatService, MessageDto, RoomDto, RoomReturnDto } from './chat.service';
import { Inject } from '@nestjs/common';
import { UserDto } from 'src/models/users/dto/user.dto';
import { comparePwd } from 'src/common/helper/bcrypt';


@WebSocketGateway({
  cors: {
    origin: true,
    credentials: true,
  },
})
export class ChatGateway implements OnGatewayConnection {

  @WebSocketServer()
  server: Server;

  constructor(@Inject(ChatService) private chatService: ChatService) {}

  async handleConnection(@ConnectedSocket() client: Socket, ...args: any[]) {
    this.chatService.addSocketToRooms(client);
  }

                        /*********************** CREATE ROOM  ************************/
  
  @SubscribeMessage('createRoom')
  async createRoom(@ConnectedSocket() socket: Socket, @MessageBody() body : {roomName: string, password: string}) {

    if (this.chatService.roomExist(body.roomName)) {
      this.server.to(socket.id).emit('chatNotif', {notif: 'Room name already taken'});
      return ;
    }

    const userDto: UserDto = await this.chatService.getUserFromSocket(socket);

    const newRoom: RoomDto = await this.chatService.createRoom(body.roomName, body.password, userDto);

    const roomReturn: RoomReturnDto = this.chatService.getReturnRoom(newRoom);

    this.server.to('user_' + userDto.id.toString()).emit('addRoom',{ room: roomReturn });
    this.server.to(socket.id).emit('chatNotif', {notif: `Room ${body.roomName} created successfully!`});
    this.server.emit('roomCreated', {roomName: body.roomName})
  }

                      /*********************** JOIN ROOM  ************************/

  @SubscribeMessage('joinRoom')
  async joinRoom(@ConnectedSocket() socket: Socket, @MessageBody() body : {roomName: string, password: string}) {
    if (!this.chatService.roomExist(body.roomName)) {
      this.server.to(socket.id).emit('chatNotif', {notif: 'This room does not exist.'});
      return ;
    }

    let roomDto: RoomDto = this.chatService.getRoomFromName(body.roomName);

    if (roomDto.password !== '' && body.password === '') {
      this.server.to(socket.id).emit('chatNotif', {notif: 'This room is locked by a password.'});
      return ;
    }
    
    if (roomDto.password !== '' && await comparePwd(body.password, roomDto.password) === false) {
      this.server.to(socket.id).emit('chatNotif', {notif: 'Wrong password.'});
      return ;
    }

    const userDto: UserDto = await this.chatService.getUserFromSocket(socket);

    if (this.chatService.isBanned(roomDto, userDto.id)) {
      this.server.to(socket.id).emit('chatNotif', {notif: 'You are banned from this room.'});
      return ;
    }

    this.chatService.addToRoom(userDto, roomDto);

    const roomReturn: RoomReturnDto = this.chatService.getReturnRoom(roomDto);
    this.server.to('user_' + userDto.id.toString()).emit('addRoom',{ room: roomReturn });
    this.server.to(socket.id).emit('chatNotif', {notif: 'Room joined successfully!'});
    this.server.to(roomDto.roomName).except('user_'+ userDto.id.toString()).emit('roomChanged', { newRoom: roomReturn });
  };

                        /*********************** ROOM MESSAGES ************************/

  @SubscribeMessage('roomMessage')
  async roomMessage(@ConnectedSocket() socket: Socket, @MessageBody() body: {roomName: string, message: string}) {
    if (!this.chatService.roomExist(body.roomName)) {
      this.server.to(socket.id).emit('chatNotif', {notif: 'This room no longer exists.'});
      return ;
    }

    const userDto: UserDto = await this.chatService.getUserFromSocket(socket);
    const roomDto: RoomDto = this.chatService.getRoomFromName(body.roomName);

    if (this.chatService.isMuted(roomDto, userDto.id)) {
      this.server.to(socket.id).emit('chatNotif', {notif: 'You are muted from this room.'});
      return ;
    }

    const messageDto: MessageDto = this.chatService.addNewRoomMessage(roomDto, userDto, body.message);
    this.server.to(body.roomName).emit('newRoomMessage', {roomName: body.roomName, messageDto: messageDto });
  };


                    /*********************** KICK EVENT && LEAVE EVENT ************************/

  @SubscribeMessage('leaveRoom')
  async leaveCurrentRoom(@ConnectedSocket() socket: Socket, @MessageBody() body: { roomName: string }) {
    if (!this.chatService.roomExist(body.roomName)) {
      this.server.to(socket.id).emit('chatNotif', {notif: 'This room no longer exists.'});
      return ;
    }
    const userDto: UserDto = await this.chatService.getUserFromSocket(socket);
    const roomDto: RoomDto = this.chatService.getRoomFromName(body.roomName);

    if (roomDto.owner === userDto.id) {
      this.chatService.destroyRoom(roomDto);
      this.server.emit('deleteRoom',{ roomName: body.roomName });
      this.server.to(body.roomName).emit('notif',{ notif: `Room ${body.roomName} has been deleted.`});
      this.server.socketsLeave(body.roomName);
      return ;
    }

    this.chatService.leaveRoom(userDto.id, roomDto);
    this.server.to('user_' + userDto.id.toString()).emit('deleteRoom',{ roomName: body.roomName });
    this.server.to(socket.id).emit('chatNotif', {notif: `You left ${body.roomName}!`});
    const roomReturn: RoomReturnDto = this.chatService.getReturnRoom(roomDto);
    this.server.to(roomDto.roomName).emit('roomChanged', { newRoom: roomReturn });
  };


    /*********************** CHANGE PASSWORD  ************************/

  @SubscribeMessage('changePassword')
  async changePassword(@ConnectedSocket() socket: Socket,@MessageBody() body : {roomName: string, password: string}) {
    if (!this.chatService.roomExist(body.roomName)) {
      this.server.to(socket.id).emit('chatNotif', {notif: 'This room no longer exists.'});
      return ;
    }

    const userDto: UserDto = await this.chatService.getUserFromSocket(socket);
    const roomDto: RoomDto = this.chatService.getRoomFromName(body.roomName);

    if (roomDto.owner !== userDto.id) {
      this.server.to(socket.id).emit('chatNotif', {notif: `An error has occured.`});
      return ;
    }

    await this.chatService.changePassword(roomDto, body.password);
    this.server.to(socket.id).emit('chatNotif', {notif: `Password changed successfully.`});
  };

  @SubscribeMessage('kickUser')
  async kickUser(@ConnectedSocket() socket: Socket, @MessageBody() body: {roomName: string, userId: number}) {
    if (!this.chatService.roomExist(body.roomName)) {
      this.server.to(socket.id).emit('chatNotif', {notif: 'This room no longer exists.'});
      return ;
    }

    const userDto: UserDto = await this.chatService.getUserFromSocket(socket);
    const roomDto: RoomDto = this.chatService.getRoomFromName(body.roomName);

    if (!this.chatService.isAdminFromRoom(userDto.id, roomDto)) {
      this.server.to(socket.id).emit('chatNotif', {notif: 'An error has occured.'});
      return ;
    }

    if (roomDto.owner === body.userId) {
      this.server.to(socket.id).emit('chatNotif', {notif: 'An error has occured.'});
      return ;
    }

    if (!roomDto.users.find(({id}) => id === body.userId)) {
      this.server.to(socket.id).emit('chatNotif', {notif: 'This user is no longer in the room.'});
      return ;
    }

    this.chatService.leaveRoom(body.userId, roomDto);
    this.server.to('user_' + body.userId.toString()).emit('deleteRoom',{ roomName: body.roomName });
    this.server.to('user_' + body.userId.toString()).emit('notif',{ 
      notif: `You got kicked from ${body.roomName}! Watch your manners, or begin a revolution against abuse of power!`});
      
    const roomReturn: RoomReturnDto = this.chatService.getReturnRoom(roomDto);
    this.server.to(roomDto.roomName).emit('roomChanged', { newRoom: roomReturn });
  };


  /*********************** SET ADMIN EVENT  ************************/

  @SubscribeMessage('setAdmin')
  async setAdmin(@ConnectedSocket() socket: Socket,@MessageBody() body: {roomName: string, userId: number}) {
    if (!this.chatService.roomExist(body.roomName)) {
      this.server.to(socket.id).emit('chatNotif', {notif: 'This room no longer exists.'});
      return ;
    }

    const userDto: UserDto = await this.chatService.getUserFromSocket(socket);
    const roomDto: RoomDto = this.chatService.getRoomFromName(body.roomName);

    if (roomDto.owner !== userDto.id) {
      this.server.to(socket.id).emit('chatNotif', {notif: 'An error has occured.'});
      return ;
    }

    if (!roomDto.users.find(({id}) => id === userDto.id)) {
      this.server.to(socket.id).emit('chatNotif', {notif: 'This user is no longer in the room.'});
      return ;
    }

    this.chatService.setAdmin(roomDto, body.userId);

    const roomReturn: RoomReturnDto = this.chatService.getReturnRoom(roomDto);
    this.server.to('user_' + body.userId).to('user_' + userDto.id).emit('roomChanged', { newRoom: roomReturn });

    const newAdmin: UserDto = await this.chatService.getUserFromId(body.userId);
    this.server.to(socket.id).emit('chatNotif', {notif: `${newAdmin.name} is now admin!`});
  };

  @SubscribeMessage('unsetAdmin')
  async unsetAdmin(@ConnectedSocket() socket: Socket, @MessageBody() body: {roomName: string, userId: number}) {
    if (!this.chatService.roomExist(body.roomName)) {
      this.server.to(socket.id).emit('chatNotif', {notif: 'This room no longer exists.'});
      return ;
    }

    const userDto: UserDto = await this.chatService.getUserFromSocket(socket);
    const roomDto: RoomDto = this.chatService.getRoomFromName(body.roomName);

    if (roomDto.owner !== userDto.id) {
      this.server.to(socket.id).emit('chatNotif', {notif: 'An error has occured.'});
      return ;
    }

    if (!roomDto.users.find(({id}) => id === userDto.id)) {
      this.server.to(socket.id).emit('chatNotif', {notif: 'This user is no longer in the room.'});
      return ;
    }

    this.chatService.unsetAdmin(roomDto, body.userId);

    const roomReturn: RoomReturnDto = this.chatService.getReturnRoom(roomDto);
    this.server.to('user_' + body.userId).to('user_' + userDto.id).emit('roomChanged', { newRoom: roomReturn });

    const newAdmin: UserDto = await this.chatService.getUserFromId(body.userId);
    this.server.to(socket.id).emit('chatNotif', {notif: `${newAdmin.name} is no longer admin!`});
  };


                        /*********************** BAN EVENT  ************************/


  @SubscribeMessage('banUser')
  async banUser(@ConnectedSocket() socket: Socket, @MessageBody() body: {roomName: string, userId: number, time: number}) {
    if (!this.chatService.roomExist(body.roomName)) {
      this.server.to(socket.id).emit('chatNotif', {notif: 'This room no longer exists.'});
      return ;
    }

    const userDto: UserDto = await this.chatService.getUserFromSocket(socket);
    const roomDto: RoomDto = this.chatService.getRoomFromName(body.roomName);

    if (!this.chatService.isAdminFromRoom(userDto.id, roomDto)) {
      this.server.to(socket.id).emit('chatNotif', {notif: 'An error has occured.'});
      return ;
    }

    if (roomDto.owner === body.userId) {
      this.server.to(socket.id).emit('chatNotif', {notif: 'An error has occured.'});
      return ;
    }

    if (roomDto.users.find(({id}) => id === body.userId) && body.time >= 0) {
      this.chatService.leaveRoom(body.userId, roomDto);
      this.server.to('user_' + body.userId.toString()).emit('deleteRoom',{ roomName: body.roomName });
      this.server.to('user_' + body.userId.toString()).emit('notif',{ 
        notif: `You got banned from ${body.roomName} for ${body.time} minutes.`});
    }

    this.chatService.setBanTime(roomDto, body.userId, body.time);

    const roomReturn: RoomReturnDto = this.chatService.getReturnRoom(roomDto);
    this.server.to(roomDto.roomName).emit('roomChanged', { newRoom: roomReturn });
  };




                    /*********************** MUTE EVENT  ************************/

  @SubscribeMessage('muteUser')
  async muteUser(@ConnectedSocket() socket: Socket, @MessageBody() body: {roomName: string, userId: number, time: number}) {
    if (!this.chatService.roomExist(body.roomName)) {
      this.server.to(socket.id).emit('chatNotif', {notif: 'This room no longer exists.'});
      return ;
    }

    const userDto: UserDto = await this.chatService.getUserFromSocket(socket);
    const roomDto: RoomDto = this.chatService.getRoomFromName(body.roomName);

    if (!this.chatService.isAdminFromRoom(userDto.id, roomDto)) {
      this.server.to(socket.id).emit('chatNotif', {notif: 'An error has occured.'});
      return ;
    }

    if (roomDto.owner === body.userId) {
      this.server.to(socket.id).emit('chatNotif', {notif: 'An error has occured.'});
      return ;
    }

    if (roomDto.users.find(({id}) => id === body.userId) && body.time >= 0) {
      this.server.to('user_' + body.userId.toString()).emit('notif',{ 
        notif: `You got muted from ${body.roomName} for ${body.time} minutes.`
      });
    }

    this.chatService.setMuteTime(roomDto, body.userId, body.time);
  };

  /*********************** PRIVATE MESSAGE  ************************/

  @SubscribeMessage('newPrivateMessage')
  async privateMessage(@ConnectedSocket() socket: Socket, @MessageBody() body: {userId: number, message: string}) {
    const sender: UserDto = await this.chatService.getUserFromSocket(socket);
    const receiver: UserDto = await this.chatService.getUserFromId(body.userId);

    const message = this.chatService.addPrivateMessage(sender, receiver, body.message);

    this.server.to('user_' + sender.id.toString()).emit('receivePrivateMsg', {userId: receiver.id, messageDto: message});
    this.server.to('user_' + receiver.id.toString()).emit('receivePrivateMsg', {userId: sender.id, messageDto: message});
    this.server.to('user_' + receiver.id.toString()).emit('notif', {notif: `New message from ${sender.name}`});
  };

  @SubscribeMessage('sendPM')
  async newPMRoom(@ConnectedSocket() socket: Socket, @MessageBody() body: {userId: number}) {
    const sender: UserDto = await this.chatService.getUserFromSocket(socket);
    const receiver: UserDto = await this.chatService.getUserFromId(body.userId);

    this.chatService.addToPmList(sender, receiver);

    this.server.to('user_' + sender.id.toString()).emit('newPrivateMsgUser', {userDto: receiver});
    this.server.to('user_' + receiver.id.toString()).emit('newPrivateMsgUser', {userDto: sender});
    this.server.to('user_' + sender.id.toString()).emit('goToPM', {userDto: receiver});

  };

  @SubscribeMessage('notifClosed')
  async closeNotif(@ConnectedSocket() socket: Socket) {
    const userDto: UserDto = await this.chatService.getUserFromSocket(socket);
    if (!userDto) {
      return ;
    }
    this.server.to('user_' + userDto.id.toString()).emit('closeNotif');
  };
};
