import { User } from "src/models/users/entities/user.entity";

export class CreateAvatarDto {
    user?: User;
    data: string;
}