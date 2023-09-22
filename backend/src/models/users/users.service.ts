import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { comparePwd, hashPwd } from 'src/common/helper/bcrypt';
import { IsNull, Not, Repository } from 'typeorm';
import { AvatarsService } from '../avatars/avatars.service';
import { AvatarDto } from '../avatars/dto/avatar.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UserDto } from './dto/user.dto';
import { User, UserStatus } from './entities/user.entity';

@Injectable()
export class UsersService {

  //  This creates a Repository of the User instance for the UsersService class
  constructor(
    private httpService: HttpService,
    private avatarService: AvatarsService,
    @InjectRepository(User) private userRepository: Repository<User>,
    ) {}


  //  Utility method to get dto object from entity
  private entityToDto(user: User): UserDto {
    const userDto = new UserDto();

    userDto.id = user.id;
    userDto.name = user.name;
    userDto.status = user.status;
    userDto.avatars = user.avatars;
    userDto.wins = user.wins;
    userDto.loses = user.loses;
    userDto.friends = user.friends? user.friends.map(x => this.entityToDto(x)): [];
    userDto.blocked = user.blocked? user.blocked.map(x => this.entityToDto(x)): [];
    userDto.currentAvatar = user.currentAvatarId? {id: user.currentAvatarId, data:user.currentAvatarData} : null;
    userDto.twoFactAuth = user.twoFactAuth;

    return userDto;
  }

  //  Create a user.
  public async create(createUserDto: CreateUserDto) {

    //  Create user entity based on createUserDto
    const user: User = new User();
    user.name = createUserDto.name;
    user.id = createUserDto.id;
    user.wins = 0;
    user.loses = 0;

    try {
      await this.userRepository.save(user);
    }
    catch(error) {
      user.name = null;
      await this.userRepository.save(user);
    }

    const userDto = this.entityToDto(user);

    const imageData: Buffer = await this.downloadImage(createUserDto.photoUrl);
    await this.addAvatar(userDto, imageData);

    
    return userDto;
  }
  
  public async downloadImage(url : string) {
    
    const response = await this.httpService.axiosRef({
      url: url,
      method: 'GET',
      responseType: 'arraybuffer'
    });
    
    return Buffer.from(response.data, 'binary');
  }
  
  //  Find all users.
  public async findAll() {
    const users: User[] = await this.userRepository.find({
      where: {
        name:  Not(IsNull()) 
      }
    });

    const usersDto: UserDto[] = users.map(x => this.entityToDto(x));

    return usersDto;
  }
  
  //  Find one user by id.
  public async findOneById(id: number) {
    const user: User = await this.userRepository.findOne({ 
      where: {id: id},
      relations:{blocked: true, friends: true}
    })
    
    if (!user) {
      return null;
    }

    const userDto: UserDto = this.entityToDto(user);

    return userDto;
  }

  public async setStatus(id: number, status: UserStatus): Promise<UserDto> {
    const user: User = await this.userRepository.findOne({ 
      where: {id: id},
      relations:{blocked: true, friends: true}
    })
    
    if (!user) {
      return null;
    }
    user.status = status;
    await this.userRepository.save(user);

    const userDto: UserDto = this.entityToDto(user);

    return userDto;
  }

  public async addWin(id: number) {
    const user: User = await this.userRepository.findOne({ 
      where: {id: id},
    })
    
    if (!user) {
      return null;
    }

    user.wins += 1;

    await this.userRepository.save(user);
  }

  public async addLose(id: number) {
    const user: User = await this.userRepository.findOne({ 
      where: {id: id},
    })
    
    if (!user) {
      return null;
    }

    user.loses += 1;

    await this.userRepository.save(user);
  }

  public async updateName(id: number, name: string) {
    const user: User = await this.userRepository.findOne({ 
      where: {id: id},
      relations:{blocked: true, friends: true}
    })

    user.name = name;
    try {
      await this.userRepository.save(user);
    }
    catch(error) {
      return null;
    }

    const userDto: UserDto = this.entityToDto(user);
    return userDto;
  }

  public async addBlocked(userId: number, blockedId: number) {
    const user: User = await this.userRepository.findOne({ 
      where: {id: userId}, 
      relations:{blocked: true, friends: true}
    })
    const blocked: User = await this.userRepository.findOneBy({ id: blockedId });

    if (userId !== blockedId) {
      if (user.blocked) {
        user.blocked.push(blocked);
      }
      else {
        user.blocked = [blocked];
      }
      await this.userRepository.save(user);
    }

    const userDto: UserDto = this.entityToDto(user);
    return userDto;
  }

  public async removeBlocked(userId: number, blockedId: number) {
    const user: User = await this.userRepository.findOne({ 
      where: {id: userId},
      relations:{blocked: true, friends: true}
    })
    const blocked: User = await this.userRepository.findOneBy({ id: blockedId });

    for (var i = user.blocked.length - 1; i >= 0; i-- ) { 
      if ( user.blocked[i].id === blocked.id) { 
        user.blocked.splice(i, 1);
        break ;
      }
    }

    await this.userRepository.save(user);

    const userDto: UserDto = this.entityToDto(user);
    return userDto;
  }

  public async addFriend(userId: number, friendId: number) {
    const user: User = await this.userRepository.findOne({ 
      where: {id: userId},
      relations:{blocked: true, friends: true}
    })
    const friend: User = await this.userRepository.findOneBy({ id: friendId });

    if (userId !== friendId) {
      if (user.friends) {
        user.friends.push(friend);
      }
      else {
        user.friends = [friend];
      }
      await this.userRepository.save(user);
    }

    const userDto: UserDto = this.entityToDto(user);
    return userDto;
  }

  public async removeFriend(userId: number, friendId: number) {
    const user: User = await this.userRepository.findOne({ 
      where: {id: userId},
      relations:{blocked: true, friends: true}
    })
    const friend: User = await this.userRepository.findOneBy({ id: friendId });

    for (var i = user.friends.length - 1; i >= 0; i-- ) { 
      if ( user.friends[i].id === friend.id) { 
        user.friends.splice(i, 1);
        break ;
      }
    }

    await this.userRepository.save(user);

    const userDto: UserDto = this.entityToDto(user);
    return userDto;
  }

  public async updateSecret(id: number, secret: string) {
    const user: User = await this.userRepository.findOne({ 
      where: {id: id},
      relations:{blocked: true, friends: true}
    })
    user.secret = secret;
    await this.userRepository.save(user); 
  }

  public async getSecret(id: number) {
    const user: User = await this.userRepository.findOne({ 
      where: {id: id},
      relations:{blocked: true, friends: true}
    })
    return user.secret;
  }

  public async turnOnTfa(id: number) {
    const user: User = await this.userRepository.findOne({ 
      where: {id: id},
      relations:{blocked: true, friends: true}
    })
    user.twoFactAuth = true;
    await this.userRepository.save(user);
  }

  public async turnOffTfa(id: number) {
    const user: User = await this.userRepository.findOne({ 
      where: {id: id},
      relations:{blocked: true, friends: true}
    })
    user.twoFactAuth = false;
    await this.userRepository.save(user);
  }

  public async addAvatar(userDto: UserDto, data: Buffer)
  {
    const user: User = await this.userRepository.findOne({ 
      where: {id: userDto.id},
      relations:{blocked: true, friends: true}
    })
    
    const avatarDto: AvatarDto = await this.avatarService.create({
      user: user,
      data: data.toString('base64')
    });

    await this.updateCurrentAvatar(userDto, avatarDto.id);

    return avatarDto;
  }

  public async updateCurrentAvatar(userDto: UserDto, avatarId: number) {
    const avatarDto: AvatarDto = await this.avatarService.findOneById(avatarId);

    const user: User = await this.userRepository.findOne({ 
      where: {id: userDto.id},
      relations:{blocked: true, friends: true}
    })
    user.currentAvatarData = avatarDto.data;
    user.currentAvatarId = avatarDto.id;
    await this.userRepository.save(user);

    return avatarDto;
  };

  public async getAllAvatars(userDto: UserDto) {
    const user: User = await this.userRepository.findOne({ 
      where: {id: userDto.id},
      relations:{blocked: true, friends: true}
    })

    if (user.avatars.length == 0) {
      return null;
    }

    const avatarDtos: AvatarDto[] = user.avatars.map(x => this.avatarService.entityToDto(x));

    return avatarDtos;
  };

  public async removeAvatar(avatarId: number, userId: number) {
    await this.avatarService.remove(avatarId);

    const user: User = await this.userRepository.findOne({ 
      where: {id: userId},
      relations:{blocked: true, friends: true}
    })

    if (user.currentAvatarId == avatarId) {
      user.currentAvatarId = null;
      user.currentAvatarData = null;
      await this.userRepository.save(user);
    }
  }
}