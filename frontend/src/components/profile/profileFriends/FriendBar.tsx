import { List, Stack, Typography } from "@mui/material";
import React from "react";
import { FriendList } from "./FriendList";

export const FriendBar = () => {
    
    return (
        <>
            <Typography variant="h6" display="flex" >
                Friends: 
            </Typography>

            <List component={Stack} direction="row" spacing={2} sx={{ maxWidth:500, overflow: 'auto' }}>
                <FriendList />
            </List>
        </>
    );
}