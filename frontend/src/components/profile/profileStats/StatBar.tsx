import { Typography } from "@mui/material";
import { UserDto } from "api/dto/user.dto";
import React from "react";

export const StatBar = ({ user }: { user: UserDto | null }) => {
  return (
    <>
      <Typography variant="h6" display="flex" sx={{ mb: 3 }}>
        Stats:
      </Typography>
      Wins: {user?.wins}
      <br />
      Loses: {user?.loses}
      <br />
    </>
  );
};
