import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import {  Stack } from '@mui/material';
import TfaInput from '../../auth/TfaInput';
import { UserAPI } from '../../../api/user.api';
import { SetUserContext } from '../../../App';
import { AuthCodeRef } from 'react-auth-code-input';
import { UserDto } from '../../../api/dto/user.dto';
import ConfirmationPopup from 'components/utils/ConfirmationPopup';

interface TfaEnableProps {
  open: boolean
  setOpen: any
  qrCode: string
}

export default function TfaEnable({
  open,
  setOpen,
  qrCode,
} : TfaEnableProps) {

  const setUser: Function = React.useContext(SetUserContext);
  
  // Tfa Input
  const [result, setResult] = React.useState<string>("");
  const [error, setError] = React.useState<boolean>(false);
  const [confirmation, setConfirmation] = React.useState(false);

  const AuthInputRef = React.useRef<AuthCodeRef>(null);
  
  React.useEffect(() => {
    const enableTfa = async () => {
      const resp: {valid: boolean} = await UserAPI.validateTfa(result);
      if (resp.valid === true) {
        handleClose();
        const user: UserDto | null = await UserAPI.getUserProfile();
        setUser(user);
        setConfirmation(true);
      }
      else {
        setError(true);
      }
      AuthInputRef.current?.clear()
    }
    if (result.length === 6) {
      enableTfa();
    }
    // eslint-disable-next-line
  }, [result])

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <Dialog
        open={open}
        maxWidth={false}
      >
        <DialogTitle>
          {"Two factor authentification setup"}
        </DialogTitle>

        <DialogContent>

          <DialogContentText>
            Please scan the qr code with the google authenticator app and enter the received code.
          </DialogContentText>

          <Stack direction="row">

          <img
              src={qrCode}
              alt='qrCode'
              loading="lazy"
            />


          <TfaInput
            setResult={setResult}
            error={error}
            AuthInputRef={AuthInputRef}
          />

        </Stack>

        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
        </DialogActions>

      </Dialog>
      
      <ConfirmationPopup open={confirmation} setOpen={setConfirmation} message="Two factor authentification is now activated."/>

    </>
  )
}