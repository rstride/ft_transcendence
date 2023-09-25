import * as React from 'react';
import Badge from '@mui/material/Badge';
import MailIcon from '@mui/icons-material/Mail';
import { IconButton, Menu, MenuItem, Typography } from '@mui/material';
import { WebsocketContext } from 'contexts/WebsocketContext';
import ConfirmationPopup from 'components/utils/ConfirmationPopup';

export default function Notif() {

    const [nbNotif, setNbNotif] = React.useState<number>(0);
    const [notifs, setNotifs] = React.useState<string[]>([]);
    const [open, setOpen] = React.useState<boolean>(false);
    const [idx, setIdx] = React.useState<number>(0);
    const socket = React.useContext(WebsocketContext);
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

    React.useEffect(() => {
        socket.on('notif', ({notif}) => {
            setNotifs((notifs) => [...notifs, notif]);
            setNbNotif(nbNotif => nbNotif + 1);
        });
        return () => {
          socket.off('notif');
        };
    }, [socket]);

    React.useEffect(() => {
        socket.on('closeNotif', () => {
            setNotifs([]);
            setNbNotif(0);
        });
        return () => {
          socket.off('closeNotif');
        };
    }, [socket]);

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
        setNotifs([]);
        setNbNotif(0);
        socket.emit('notifClosed');
    };

    const onNotifClick = (index: number) => {
        setIdx(index);
        setOpen(true);
    }

    return (
        <>
        <IconButton sx={{ mr:3 }} onClick={handleClick}>
            <Badge badgeContent={nbNotif} color="primary" >
                <MailIcon color="action" />
            </Badge>
        </IconButton>

        <Menu
        id="notif"
        anchorEl={anchorEl}
        anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
        }}
        keepMounted
        transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
        }}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        PaperProps={{
            style: {
              maxHeight: 48 * 4.5,
              width: '30ch',
            },
        }}
      >
        <div>
            {notifs.map((notif, index) =>
                <MenuItem key={index} onClick={() => onNotifClick(index)}>
                    <Typography variant="inherit" noWrap>
                    {notif}
                    </Typography>
                </MenuItem>
            )}
        </div>

      </Menu>

      <ConfirmationPopup
        open={open}
        setOpen={setOpen}
        message={notifs[idx]}
      />
      </>
    );
}