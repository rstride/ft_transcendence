import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';
import { DialogContent, DialogContentText } from '@mui/material';

interface PopUpProps {
    open: boolean
    setOpen: Function
    setValidation: Function
	  setAnswered: Function
    title: string 
    message: string
}

export default function PwMPopUp({open, setOpen, setValidation, setAnswered, title, message}: PopUpProps) {

  const handleConfirmation = (click: boolean) => {
    setOpen(false);
    setValidation(click);
	setAnswered(true);
  };

  return (
    <div>
      <Dialog
        open={open}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {title}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            {message}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
            <Button onClick={() => handleConfirmation(true)} autoFocus>
                ok 
            </Button>
            <Button onClick={() => handleConfirmation(false)} autoFocus>
                cancel 
            </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}