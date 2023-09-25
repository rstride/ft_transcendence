import { Card, CardContent, Grid, Typography } from "@mui/material";
import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { UserDto } from "../api/dto/user.dto";
import { UserAPI } from "../api/user.api";
import { Item } from "./Profile";
import { AddFriendButton } from "../components/profile/profileFriends/AddFriendButton";
import ProfileImage from "components/profile/ProfileImage/ProfileImage";
import { BlockButton } from "components/profile/profileFriends/BlockButton";
import { UserStatus } from "api/dto/user.dto";
import { HistoryBar } from "components/profile/profileHistory/HistoryBar";
import { StatBar } from "components/profile/profileStats/StatBar";
import { WebsocketContext } from "contexts/WebsocketContext";

export const VisitorProfile = () => {
  const [visited, setVisited] = React.useState<UserDto | null>(null);
  const socket = React.useContext(WebsocketContext);
  const { id } = useParams<"id">();
  const navigate = useNavigate();

  React.useEffect(() => {
    const fetchProfile = async () => {
      const resp = await UserAPI.getOneUserById(id ? id : "");
      if (!resp || Object.keys(resp).length === 0) {
        navigate("/");
      }
      setVisited(resp);
    };
    fetchProfile();
  }, [id, navigate]);

  React.useEffect(() => {
    socket.on("onUserChange", () => {
      const fetchProfile = async () => {
        const resp = await UserAPI.getOneUserById(id ? id : "");
        if (!resp || Object.keys(resp).length === 0) {
          navigate("/");
        }
        setVisited(resp);
      };
      fetchProfile();
    });
    return () => {
      socket.off("onUserChange");
    };
  }, [socket, navigate, id]);

  return (
    <>
      <Grid container spacing={3} sx={{ ml: 1, mt: 1 }}>
        <Grid item xs={12} container spacing={3} alignItems={"center"}>
          <Grid item xs={4}>
            <Card>
              <ProfileImage profileImage={visited?.currentAvatar} />
              <CardContent>
                Status:
                {visited?.status === UserStatus.Offline
                  ? " Offline"
                  : visited?.status === UserStatus.Online
                  ? " Online"
                  : " In game"}
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={1}></Grid>

          <Grid item xs={6}>
            <Item>
              <Typography variant="h2" display="flex">
                {visited?.name}'s profile
              </Typography>
            </Item>
          </Grid>

          <Grid item xs={1}></Grid>
        </Grid>

        <Grid item xs={4} container spacing={3} direction={"column"} sx={{ mt: 5 }}>
          <Grid item>
            <Item>
              <AddFriendButton visited={visited} />
            </Item>
          </Grid>

          <Grid item>
            <Item>
              <BlockButton visited={visited} />
            </Item>
          </Grid>
        </Grid>

        <Grid item xs={1}></Grid>

        <Grid item xs={6} container spacing={3} direction={"column"}>
          <Grid item>
            <Item>
              <StatBar user={visited} />
            </Item>
          </Grid>
          <Grid item>
            <Item>{visited ? <HistoryBar userId={visited.id} /> : ""}</Item>
          </Grid>
        </Grid>
        <Grid item xs={1}></Grid>
      </Grid>
    </>
  );
};
