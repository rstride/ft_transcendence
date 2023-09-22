import { User } from "src/models/users/entities/user.entity";

export class UpdateAvatarDto {
    id: number;
    user: User;
}