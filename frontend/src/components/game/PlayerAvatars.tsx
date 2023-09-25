import { Avatar, Grid, Tooltip, Typography } from "@mui/material";
import { UserDto } from "api/dto/user.dto";
import { UserAPI } from "api/user.api";
import { UserStatusBadge } from "components/profile/profileFriends/UserStatusBadge";
import React from "react";
import defaultAvatar from "../../default_avatar/-1.png";

export const PlayerAvatars = ({ id1, id2 }: { id1: number; id2: number }) => {
  const [player1, setPlayer1] = React.useState<UserDto | null>(null);
  const [player2, setPlayer2] = React.useState<UserDto | null>(null);

  React.useEffect(() => {
    const fetchUsers = async () => {
      const user1 = await UserAPI.getOneUserById(id1.toString());
      setPlayer1(user1);
      const user2 = await UserAPI.getOneUserById(id2.toString());
      setPlayer2(user2);
    };

    fetchUsers();
  }, [id1, id2]);

  return (
    <Grid container spacing={3} sx={{ ml: 1, mt: 1 }}>
      <Grid item xs={2}></Grid>

      <Grid item xs={2}>
        <UserStatusBadge status={player1 ? player1.status : 1}>
          <Tooltip title={player1 ? player1.name : ""}>
            <Avatar
              src={
                player1?.currentAvatar
                  ? `data:image/png;base64,${player1.currentAvatar.data}`
                  : defaultAvatar
              }
              alt="avatar"
              sx={{ width: 56, height: 56 }}
            />
          </Tooltip>
        </UserStatusBadge>

        <Typography variant="h4" display="flex">
          {player1?.name.substring(0, 10)}
          {player1 && player1.name.length > 10 ? ".." : ""}
        </Typography>
      </Grid>

      <Grid item xs={2}></Grid>

      <Grid item xs={2}></Grid>

      <Grid item xs={2}>
        <UserStatusBadge status={player2 ? player2.status : 1}>
          <Tooltip title={player2 ? player2.name : ""}>
            <Avatar
              src={
                player2?.currentAvatar
                  ? `data:image/png;base64,${player2.currentAvatar.data}`
                  : defaultAvatar
              }
              alt="avatar"
              sx={{ width: 56, height: 56 }}
            />
          </Tooltip>
        </UserStatusBadge>

        <Typography variant="h4" display="flex">
          {player2?.name.substring(0, 10)}
          {player2 && player2.name.length > 10 ? ".." : ""}
        </Typography>
      </Grid>

      <Grid item xs={2}></Grid>
    </Grid>
  );
};
