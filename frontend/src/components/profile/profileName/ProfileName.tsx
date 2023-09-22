import { Button } from '@mui/material';
import * as React from 'react';
import { UpdateUserName } from './UpdateUserName';

export default function ProfileName() {

  const [open, setOpen] = React.useState<boolean>(false);

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  return (
    <>
      <Button onClick={handleOpen}>
        Update username
      </Button>

      <UpdateUserName
        open={open}
        handleClose={handleClose}
        message={"Choose a new username"}
      />

    </>
  );
}