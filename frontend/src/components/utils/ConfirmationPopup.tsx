import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';

interface ConfirmationPopupProps {
  open: boolean
  setOpen: Function
  message: string
}

export default function ConfirmationPopup({open, setOpen, message}: ConfirmationPopupProps) {

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {message}
        </DialogTitle>
        <DialogActions>
          <Button onClick={handleClose} autoFocus>
              ok 
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}