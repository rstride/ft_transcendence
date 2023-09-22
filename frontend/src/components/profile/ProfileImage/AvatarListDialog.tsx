import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import AvatarList from './AvatarList';
import { UserAPI } from '../../../api/user.api';
import { SetUserContext } from '../../../App';

interface AvatarListDialogProps {
    open: boolean
    setOpen: Function
}

export default function AvatarListDialog({open, setOpen}: AvatarListDialogProps) {

  const setUser: Function = React.useContext(SetUserContext);

  // Selected avatar
  const [selectedId, setSelectedId] = React.useState<number | null>(null);

  // Close the the photo PopupAvatars with the AvatarList when click on cancel
  const handleClose = () => {
    setOpen(false);
    setSelectedId(null);
  };

  // Update the user when clicked on the 'Set as profile image' button if one has been selected.
  const updateCurrentAvatar = () => {
    const updateAvatar = async () => {
      if (selectedId) {
        await UserAPI.updateAvatar(selectedId);
        const data = await UserAPI.getUserProfile();
        setUser(data);
      }
    }
    updateAvatar();
    setOpen(false);
    setSelectedId(null);
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      scroll={'paper'}
      aria-labelledby="scroll-dialog-title"
    >
    
    <DialogTitle id="scroll-dialog-title">Photo gallery</DialogTitle>
    <DialogContent dividers={true}>

    <AvatarList
      selectedId={selectedId}
      setSelectedId={setSelectedId}
    />

    </DialogContent>

    <DialogActions>
      <Button onClick={handleClose}>Cancel</Button>
      <div style={{flex: '0.9 0 0'}} />
      <Button onClick={updateCurrentAvatar}>Set as profile image</Button>
    </DialogActions>

    </Dialog>
  );
}