import { Stack, Typography } from "@mui/material";
import React from "react";
import { UserDto } from "../../../api/dto/user.dto";
import { UserContext } from "../../../App";
import { FriendBadge } from "./FriendBadge";

export const FriendList = () => {

    const user: UserDto | null = React.useContext(UserContext);
    
    return (
        <>
            {user?.friends && user?.friends.length > 0 ? user?.friends.map((friend: UserDto) => {
            return (
                <Stack key={friend.id}>

                <FriendBadge friend={friend}/>

                <Typography variant="h6" display="flex" >
                    {friend.name.substring(0, 6)}
                    {friend.name.length > 6 ? '..' : ''}
                </Typography>
                </Stack>

            )}
            ):'No Friends'}
        </>
    );
}