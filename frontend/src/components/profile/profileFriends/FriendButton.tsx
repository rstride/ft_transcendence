import { Button, Menu, MenuItem } from "@mui/material";
import { UserAPI } from "api/user.api";
import ValidationPopup from "components/utils/ValidationPopup";
import { WebsocketContext } from "contexts/WebsocketContext";
import React, { useContext } from "react";
import { NavigateFunction, useNavigate } from "react-router-dom";
import { UserDto } from "../../../api/dto/user.dto";
import { SetUserContext } from "../../../App";

interface FriendButtonProps {
  friend: UserDto;
  children: any;
}

export const FriendButton = ({ friend, children }: FriendButtonProps) => {
  const setUser: Function = React.useContext(SetUserContext);
  const navigate: NavigateFunction = useNavigate();

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [openValidation, setOpenValidation] = React.useState<boolean>(false);
  const [validation, setValidation] = React.useState<boolean>(false);

  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const removeFriend = () => {
    handleClose();
    setOpenValidation(true);
  };

  const visitProfile = () => {
    handleClose();
    navigate(`/profile/${friend.id}`, { replace: true });
  };

  const socket = useContext(WebsocketContext);

  const inviteGame = () => {
    handleClose();
    socket.emit("inviteGame", friend.id);
  };

  React.useEffect(() => {
    const removeFriend = async () => {
      const resp: UserDto | null = await UserAPI.removeFriend(friend.id);
      setUser(resp);
    };
    if (validation === true) {
      removeFriend();
    }
  }, [validation, friend.id, setUser]);

  return (
    <>
      <Button
        id="basic-button"
        aria-controls={open ? "basic-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
      >
        {children}
      </Button>

      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
      >
        <MenuItem onClick={visitProfile}>See profile</MenuItem>
        <MenuItem onClick={inviteGame}>Invite game</MenuItem>
        <MenuItem onClick={removeFriend}>Remove friend</MenuItem>
      </Menu>

      <ValidationPopup
        open={openValidation}
        setOpen={setOpenValidation}
        setValidation={setValidation}
        title="Remove friend ?"
        message={`${friend.name} will be removed from your friendlist.`}
      />
    </>
  );
};
