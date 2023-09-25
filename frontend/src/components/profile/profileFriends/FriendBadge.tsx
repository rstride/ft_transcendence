import { Avatar, Tooltip} from "@mui/material";
import { UserDto } from "api/dto/user.dto";
import React from "react";
import defaultAvatar from '../../../default_avatar/-1.png';
import { FriendButton } from "./FriendButton";
import { UserStatusBadge } from "./UserStatusBadge";


export const FriendBadge = ({friend}: {friend: UserDto}) => {

    return (
        <FriendButton friend={friend}>


        <UserStatusBadge status={friend.status}>
            <Tooltip title={friend.name}>
                <Avatar
                    src={friend?.currentAvatar? `data:image/png;base64,${friend.currentAvatar.data}`: defaultAvatar}
                    alt='avatar'
                    sx={{ width: 56, height: 56 }}                 
                />
            </Tooltip>
        </UserStatusBadge>

        </FriendButton>
    );
}