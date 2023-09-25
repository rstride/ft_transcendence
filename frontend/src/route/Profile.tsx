import { Card, Grid, Paper, styled, Typography } from "@mui/material";
import React from "react";
import { SetUserContext, UserContext } from "../App";
import ProfileName from "../components/profile/profileName/ProfileName";
import TfaToggle from "../components/profile/twoFactAuth/TfaToggle";
import { UserDto } from "../api/dto/user.dto";
import { FriendBar } from "../components/profile/profileFriends/FriendBar";
import UserProfileImageModificator from "../components/profile/ProfileImage/UserProfileImageModificator";
import ProfileImage from "../components/profile/ProfileImage/ProfileImage";
import { StatBar } from "components/profile/profileStats/StatBar";
import { HistoryBar } from "components/profile/profileHistory/HistoryBar";
import { UserAPI } from "api/user.api";
import { WebsocketContext } from "contexts/WebsocketContext";

export const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

export const Profile = () => {
  const user: UserDto | null = React.useContext(UserContext);
  const setUser: Function = React.useContext(SetUserContext);

  const socket = React.useContext(WebsocketContext);
  React.useEffect(() => {
    const fetchProfile = async () => {
      const resp = await UserAPI.getUserProfile();
      setUser(resp);
    };

    socket.on("onUserChange", () => {
      fetchProfile();
    });

    return () => {
      socket.off("onUserChange");
    };
  }, [socket, setUser]);

  return (
    <>
      <Grid container spacing={3} sx={{ ml: 1, mt: 1 }}>
        <Grid item xs={12} container spacing={3} alignItems={"center"}>
          <Grid item xs={4}>
            <Card>
              <UserProfileImageModificator>
                <ProfileImage profileImage={user?.currentAvatar} />
              </UserProfileImageModificator>
            </Card>
          </Grid>

          <Grid item xs={1}></Grid>

          <Grid item xs={6}>
            <Item>
              <Typography variant="h2" display="flex">
                {user?.name}'s profile
              </Typography>
            </Item>
          </Grid>
          <Grid item xs={1}></Grid>
        </Grid>

        <Grid item xs={4} container spacing={3} direction={"column"}>
          <Grid item>
            <Item>
              <ProfileName />
            </Item>
          </Grid>

          <Grid item>
            <Item>
              <TfaToggle />
            </Item>
          </Grid>
        </Grid>

        <Grid item xs={1}></Grid>

        <Grid item xs={6} container spacing={3} direction={"column"}>
          <Grid item>
            <Item>
              <StatBar user={user} />
            </Item>
          </Grid>
          <Grid item>
            <Item>{user ? <HistoryBar userId={user.id} /> : ""}</Item>
          </Grid>
          <Grid item>
            <Item>
              <FriendBar />
            </Item>
          </Grid>
        </Grid>
        <Grid item xs={1}></Grid>
      </Grid>
    </>
  );
};
