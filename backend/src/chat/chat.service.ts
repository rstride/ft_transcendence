import { Injectable } from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { UserDto } from 'src/models/users/dto/user.dto';
import { UsersService } from 'src/models/users/users.service';
import { Socket } from 'socket.io';
import { hashPwd } from 'src/common/helper/bcrypt';

export class MessageDto {
  userId : number;
  userName : string;
  message : string;
};

export class PrivateMsgsDto {
  userDto : UserDto;
  messages : Array<MessageDto>;
};

export class RoomDto {
  roomName : string;
  owner : number;
  admins : Array<number>;
  users : Array<UserDto>;
  messages : Array<MessageDto>;
  password : string;
  mutedMap : Map<number,number>;
  banMap : Map<number,number>;
};

export class RoomReturnDto {
  roomName : string;
  owner : number;
  admins : Array<number>;
  users : Array<UserDto>;
  messages : Array<MessageDto>;
};

@Injectable()
export class ChatService {

    constructor(
      private userService: UsersService, 
      private authService: AuthService
    ) {
      this.RoomList = new Map();
      this.PrivateMsgList = new Map();

    }

    public RoomList: Map<string, RoomDto>;
    public PrivateMsgList: Map<number, PrivateMsgsDto[]>;

    /*
    **
    ** @Gateway
    **
    */
               /*********************** CREATE ROOM  ************************/


  async createRoom(roomName: string, password: string, userDto: UserDto): Promise<RoomDto> {
    const roomDto = new RoomDto();

    roomDto.roomName = roomName;
    roomDto.owner = userDto.id;
    roomDto.admins = [userDto.id];
    roomDto.users = [];
    roomDto.messages = [];
    if (password && password !== '') {
      roomDto.password = await hashPwd(password);
    }
    else {
      roomDto.password = password;
    }
    roomDto.mutedMap = new Map();
    roomDto.banMap = new Map();

    this.RoomList.set(roomName.toUpperCase(), roomDto);
    this.addToRoom(userDto, roomDto);
    return roomDto;
  }

                   /*********************** JOIN ROOM  ************************/


  addToRoom(userDto: UserDto, room: RoomDto) {
    if (room.users.find(({id}) => id === userDto.id )) {
      return ;
    }

    room.users.push(userDto);
    this.RoomList.set(room.roomName.toUpperCase(), room);

    const sockets: Socket[] = this.authService.getSocketsFromUser(userDto.id);
    sockets.forEach(socket => socket.join(room.roomName));
  }

      /*********************** SEND MESSAGE ROOM && PRIVATE MESSAGE ************************/

  addNewRoomMessage(room: RoomDto, user: UserDto, message: string): MessageDto {
    const messageDto: MessageDto = new MessageDto();
    messageDto.message = message;
    messageDto.userId = user.id;
    messageDto.userName = user.name;

    room.messages.push(messageDto);
    this.RoomList.set(room.roomName.toUpperCase(), room);
    return messageDto;
  }

       /*********************** LEAVE ROOM  ************************/


  leaveRoom(userId: number, room: RoomDto) {
    const userIndex = room.users.findIndex(({id}) => id === userId);

    if (userIndex > -1) {
      room.users.splice(userIndex, 1);
    }

    const adminIndex = room.admins.indexOf(userId);

    if (adminIndex > -1) {
      room.admins.splice(adminIndex, 1);
    }

    this.RoomList.set(room.roomName.toUpperCase(), room);

    const sockets: Socket[] = this.authService.getSocketsFromUser(userId);
    sockets.forEach((socket) => { socket.leave(room.roomName) });
  }

  destroyRoom(room: RoomDto) {
   this.RoomList.delete(room.roomName.toUpperCase());
  }

       /*********************** CHANGE PW ************************/

  async changePassword(roomDto: RoomDto, password: string) {
    if (password === '') {
      roomDto.password = '';
    }
    else {
      roomDto.password = await hashPwd(password);
    }
    this.RoomList.set(roomDto.roomName.toUpperCase(), roomDto);
  }


    /*********************** Set Admin  ************************/

  setAdmin(roomDto: RoomDto, userId: number) {
    if (!this.isAdminFromRoom(userId, roomDto)) {
      roomDto.admins.push(userId);
      this.RoomList.set(roomDto.roomName.toUpperCase(), roomDto);
    }
  }

  unsetAdmin(roomDto: RoomDto, userId: number) {
    const adminIndex = roomDto.admins.indexOf(userId);

    if (adminIndex > -1) {
      roomDto.admins.splice(adminIndex, 1);
    }

    this.RoomList.set(roomDto.roomName.toUpperCase(), roomDto);

  }

  setBanTime(roomDto: RoomDto, userId: number, time: number) {
    if (time <= 0) {
      roomDto.banMap.delete(userId);
    }
    else {
      roomDto.banMap.set(userId, time * 60 * 1000 + Date.now());
    }
    this.RoomList.set(roomDto.roomName.toUpperCase(), roomDto);
  }

  setMuteTime(roomDto: RoomDto, userId: number, time: number) {
    if (time === 0) {
      roomDto.mutedMap.delete(userId);
    }
    else {
      roomDto.mutedMap.set(userId, time * 60 * 1000 + Date.now());
    }
    this.RoomList.set(roomDto.roomName.toUpperCase(), roomDto);
  }

  addToPmList(sender: UserDto, receiver: UserDto) {
    let allSenderMsgs = this.PrivateMsgList.get(sender.id);
    let allReceiverMsgs = this.PrivateMsgList.get(receiver.id);


    if (!allSenderMsgs) {
      allSenderMsgs = [{userDto: receiver, messages: []}]
    }
    else {
      const userMessagesIdx = allSenderMsgs.findIndex(({userDto}) => userDto.id === receiver.id );

      if (userMessagesIdx < 0) {
        allSenderMsgs.push({userDto: receiver, messages: []});
      }
    }

    if (!allReceiverMsgs) {
      allReceiverMsgs = [{userDto: sender, messages: []}]
    }
    else {
      const userMessagesIdx = allReceiverMsgs.findIndex(({userDto}) => userDto.id === sender.id );

      if (userMessagesIdx < 0) {
        allReceiverMsgs.push({userDto: sender, messages: []});
      }
    }

    this.PrivateMsgList.set(sender.id, allSenderMsgs);
    this.PrivateMsgList.set(receiver.id, allReceiverMsgs);
  }

  addPrivateMessage(sender: UserDto, receiver: UserDto, message: string): MessageDto {
    let allSenderMsgs = this.PrivateMsgList.get(sender.id);
    let allReceiverMsgs = this.PrivateMsgList.get(receiver.id);

    const messageDto: MessageDto = new MessageDto();
    messageDto.message = message;
    messageDto.userId = sender.id;
    messageDto.userName = sender.name;

    allSenderMsgs.find(({userDto}) => userDto.id === receiver.id ).messages.push(messageDto);
    allReceiverMsgs.find(({userDto}) => userDto.id === sender.id ).messages.push(messageDto);

    this.PrivateMsgList.set(sender.id, allSenderMsgs);
    this.PrivateMsgList.set(receiver.id, allReceiverMsgs);
    return messageDto;
  }

  /*
  **
  ** @Controller
  **
  */

  getAllRoomsFromUser(userId : number): RoomDto[] {
    const userRooms = new Array<RoomDto>;
    this.RoomList.forEach((value) => { value.users.find( ({id}) => id === userId ) && userRooms.push(value); })
    return userRooms;
  }



  /* all room list string room name */
  getAllRoomNames(): string[] {
    const roomNames = new Array<string>;
    this.RoomList.forEach(element => roomNames.push(element.roomName));
    return roomNames;
  }

  /*
  **
  ** @Utils
  **
  */
 
  getUserPrivateMsgs(userId: number) {
    return this.PrivateMsgList.get(userId);
  }

  async getUserFromSocket(socket: Socket): Promise<UserDto> {
    const userDto: UserDto = await this.authService.getUserFromSocket(socket);
    return userDto;
  }

  getRoomFromName(name: string): RoomDto {
    return (this.RoomList.get(name.toUpperCase()));
  }

  isBanned(roomDto: RoomDto, userId: number): boolean {
    const time: number = roomDto.banMap.get(userId);
    if (!time) {
      return false;
    }
    if (time <= Date.now()) {
      roomDto.banMap.delete(userId);
      this.RoomList.set(roomDto.roomName.toUpperCase(), roomDto);
      return false;
    }
    return true;
  }

  isMuted(roomDto: RoomDto, userId: number): boolean {
    const time: number = roomDto.mutedMap.get(userId);
    if (!time) {
      return false;
    }
    if (time <= Date.now()) {
      roomDto.mutedMap.delete(userId);
      this.RoomList.set(roomDto.roomName.toUpperCase(), roomDto);
      return false;
    }
    return true;
  }

  roomExist(roomName: string): boolean {
    return (this.RoomList.has(roomName.toUpperCase()));
  }

  getReturnRoom(roomDto: RoomDto): RoomReturnDto {
    const roomReturnDto: RoomReturnDto = new RoomReturnDto();

    roomReturnDto.roomName = roomDto.roomName;
    roomReturnDto.owner = roomDto.owner;
    roomReturnDto.admins = roomDto.admins;
    roomReturnDto.users = roomDto.users;
    roomReturnDto.messages = roomDto.messages;

    return roomReturnDto;
  }

  async getUserFromId(id: number): Promise<UserDto> {
    return await this.userService.findOneById(id);
  }

  async addSocketToRooms(socket: Socket) {
    const userDto: UserDto = await this.authService.getUserFromSocket(socket);
    if (!userDto) {
      return ;
    }

    this.RoomList.forEach((value) => { value.users.find( ({id}) => id === userDto.id ) && socket.join(value.roomName); });
  }

  isAdminFromRoom(userId: number, roomDto: RoomDto): boolean {
    return (roomDto.admins.find(id => id === userId)? true : false);
  }
}