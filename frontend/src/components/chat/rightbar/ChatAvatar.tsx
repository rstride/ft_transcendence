import { UserStatusBadge } from "components/profile/profileFriends/UserStatusBadge"
import { Avatar, Tooltip} from "@mui/material";
import defaultAvatar from '../../../default_avatar/-1.png';
import { UserDto } from "api/dto/user.dto";

export const ChatAvatar = ({user}: {user: UserDto}) => {

    return (
    <UserStatusBadge status={user.status}>
        <Tooltip title={user.name}>
            <Avatar
                src={user?.currentAvatar? `data:image/png;base64,${user.currentAvatar.data}`: defaultAvatar}
                alt='avatar'
                sx={{ width: 56, height: 56 }}                 
            />
        </Tooltip>
    </UserStatusBadge>
    )
}