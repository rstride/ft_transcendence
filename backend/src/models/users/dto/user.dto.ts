import { AvatarDto } from "src/models/avatars/dto/avatar.dto";
import { UserStatus } from "../entities/user.entity";

//  Dto class for User
export class UserDto {
    id: number;
    name: string;
    status: UserStatus;
    friends: UserDto[];
    blocked: UserDto[];
    avatars: AvatarDto[];
    wins: number;
    loses: number;
    currentAvatar?: AvatarDto;
    twoFactAuth: boolean;
}