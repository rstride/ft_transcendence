import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { AuthCodeRef } from 'react-auth-code-input';
import { SetUserContext } from '../../App';
import { UserAPI } from '../../api/user.api';
import TfaInput from './TfaInput';

interface TwoFactAuthProps {
  setLoggedIn: Function
}

export default function TwoFactAuth({
  setLoggedIn
} : TwoFactAuthProps) {

  const setUser: Function = React.useContext(SetUserContext);
  
  // Tfa Input
  const [result, setResult] = React.useState<string>("");
  const [error, setError] = React.useState<boolean>(false);
  const AuthInputRef = React.useRef<AuthCodeRef>(null);
  
  React.useEffect(() => {
    const checkTfa = async () => {
      const resp: {valid: boolean} = await UserAPI.validateTfa(result);
      if (resp.valid) {
        const user = await UserAPI.getUserProfile();
        setUser(user);
      }
      else {
        setError(true);
      }
      AuthInputRef.current?.clear()
    }
    if (result.length === 6) {
      checkTfa();
    }
    // eslint-disable-next-line
  }, [result])

  const handleClose = async () => {
    await UserAPI.logout();
    setLoggedIn(false);
  };

  return (
    <>
      <Dialog
        open={true}
        maxWidth={false}
      >
        <DialogTitle>
          {"Two factor authentification login"}
        </DialogTitle>

        <DialogContent>

          <DialogContentText>
            Enter google auth code to login
          </DialogContentText>

          <TfaInput
            setResult={setResult}
            error={error}
            AuthInputRef={AuthInputRef}
          />

        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
        </DialogActions>
      </Dialog>

    </>
  )
}