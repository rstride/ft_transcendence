import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import { useTheme } from "@mui/material/styles";
import { UserAPI } from "../../api/user.api";
import defaultAvatar from "../../default_avatar/-1.png";
import { SetUserContext, UserContext } from "../../App";
import { Link } from "react-router-dom";
import { UserDto } from "../../api/dto/user.dto";
import { WebsocketContext } from "contexts/WebsocketContext";
import Notif from "./Notif";

interface ResponsiveAppBarProps {
  handleToggle: React.ButtonHTMLAttributes<HTMLButtonElement>["onClick"];
  setLoggedIn: Function;
}

const ResponsiveAppBar = ({ handleToggle, setLoggedIn }: ResponsiveAppBarProps) => {
  const user: UserDto | null = React.useContext(UserContext);
  const setUser: Function = React.useContext(SetUserContext);

  const theme = useTheme();

  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const ProfileButton = () => {
    return (
      <MenuItem key="Profile" onClick={handleCloseUserMenu} component={Link} to="profile">
        <Typography textAlign="center">Profile</Typography>
      </MenuItem>
    );
  };

  const HomepageButton = () => {
    return (
      <MenuItem key="Homepage" onClick={handleCloseUserMenu} component={Link} to="">
        <Typography textAlign="center">Home</Typography>
      </MenuItem>
    );
  };

  const socket = React.useContext(WebsocketContext);


  const LoginButton = () => {
    return (
      <MenuItem
        key="Login"
        href={`http://${process.env.REACT_APP_BACKEND_HOST}:${process.env.REACT_APP_BACKEND_PORT}/auth/login`}
        component="a"
      >
        <Typography textAlign="center">Login</Typography>
      </MenuItem>
    );
  };

  async function Logout() {
    handleCloseUserMenu();
    await UserAPI.logout();
    setUser(null);
    setLoggedIn(false);
    socket.emit('userLogout');
  }

  function LogoutButton() {
    return (
      <MenuItem key="Logout" onClick={Logout} component={Link} to="">
        <Typography textAlign="center">Logout</Typography>
      </MenuItem>
    );
  }

  function LoginControl(props: any) {
    const settings = user != null ? loggedInSettings : loggedOutSettings;

    return <div>{settings.map((setting) => setting.button)}</div>;
  }

  const pages = [
    {
      name: "Home",
      link: "/"
    },
    {
      name: "Chat",
      link: "/chat"
    }
  ];
  const loggedInSettings = [
    {
      name: "Logout",
      button: LogoutButton(),
    },
    {
      name: "Profile",
      button: ProfileButton(),
    },
    {
      name: "Homepage",
      button: HomepageButton(),
    },
  ];

  const loggedOutSettings = [
    {
      name: "Login",
      button: LoginButton(),
    },
    {
      name: "Homepage",
      button: HomepageButton(),
    },
  ];

  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Box sx={{ flexGrow: 1, display: {  md: "flex" } }}>
            {pages.map((page) => (
              <Button
                key={page.name}
                sx={{ my: 2, color: "white", display: "block" }}
                component={Link}
                to={page.link}
              >
                {page.name}
              </Button>
            ))}
          </Box>

          <Notif />
          
          <Box textAlign="center">
            <IconButton sx={{ mr: 3 }} onClick={handleToggle} color="inherit">
              {theme.palette.mode === "dark" ? <Brightness7Icon /> : <Brightness4Icon />}
            </IconButton>
          </Box>
          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Update settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar
                  alt="Remy Sharp"
                  src={
                    user?.currentAvatar
                      ? `data:image/png;base64,${user.currentAvatar.data}`
                      : defaultAvatar
                  }
                />
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: "45px" }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              <LoginControl />
            </Menu>
          </Box>
        </Toolbar>
      </Container>

    </AppBar>
  );
};

export default ResponsiveAppBar;
