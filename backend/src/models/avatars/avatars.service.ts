import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AvatarDto } from './dto/avatar.dto';
import { CreateAvatarDto } from './dto/create-avatar.dto';
import { Avatar } from './entities/avatar.entity';

@Injectable()
export class AvatarsService {
  constructor(
    @InjectRepository(Avatar) private avatarRepository: Repository<Avatar>
    ) {}

  public entityToDto(avatar: Avatar) {
    const avatarDto: AvatarDto = new AvatarDto();
    avatarDto.data = avatar.data;
    avatarDto.id = avatar.id;

    return avatarDto;
  }

  public async create(createAvatarDto: CreateAvatarDto) {
      const avatar: Avatar = new Avatar();
      avatar.user = createAvatarDto.user;
      avatar.data = createAvatarDto.data;
  
      await this.avatarRepository.save(avatar);

      const avatarDto: AvatarDto = this.entityToDto(avatar);
  
      return avatarDto;
  }

  public async findOneById(id: number)
  {
    const avatar: Avatar = await this.avatarRepository.findOneBy({id: id});
    if (!avatar) {
      return ;
    }

    const avatarDto: AvatarDto = this.entityToDto(avatar);

    return avatarDto;
  }

  public async remove(avatarId: number) {
    this.avatarRepository.delete({id : avatarId});
  }
}