import { FormControlLabel, Switch, Typography } from '@mui/material';
import * as React from 'react';
import { UserDto } from '../../../api/dto/user.dto';
import { UserAPI } from '../../../api/user.api';
import { SetUserContext, UserContext } from '../../../App';
import ValidationPopup from '../../utils/ValidationPopup';
import TfaEnable from './TfaEnable';

export default function TfaToggle() {

    const user: UserDto | null = React.useContext(UserContext);
    const setUser: Function = React.useContext(SetUserContext);

    const [openValidaton, setOpenValidation] = React.useState<boolean>(false);
    const [openTfaEnable, setOpenTfaEnable] = React.useState<boolean>(false);
    const [validation, setValidation] = React.useState<boolean>(false);
    const [message, setMessage] = React.useState<{title:string, message:string}>({title: "", message: ""});
    const [qrCode, setQrCode] = React.useState<string>("");

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setOpenValidation(true);
        if (event.target.checked === false) {
            setMessage({
                title: "Disable two factor authentification ?",
                message: "Your qr code will be invalidated and your data will be vulnerable."
            })
        }
        else {
            setMessage({
                title: "Enable two factor authentification ?",
                message: `We will provide you a qr code to scan with the google authenticator application. 
                The two factor authentification will be enable after validating the application's code.
                When enabled, this website will ask you for the code when authenticating.`
            })
        }
    };

    React.useEffect(() => {
        const disableTfa = async () => {
            const user = await UserAPI.disableTfa();
            setUser(user);
            setValidation(false);
        }
        const enableTfa = async () => {
            setValidation(false);
            setOpenTfaEnable(true);
            const resp: Blob | null = await UserAPI.generateQrCode();
            if (resp) {
                const urlObject = URL.createObjectURL(resp);
                setQrCode(urlObject);
            }
        }

        if (validation === false) {
            return ;
        }
        
        if (user?.twoFactAuth === true) {
            disableTfa();
        }
        else if (user?.twoFactAuth === false) {
            enableTfa();
        }

        // eslint-disable-next-line
    }, [validation]);



    return (
        <>
        <Typography variant="h6" display="flex" >
            Two factor authentification
        </Typography>
        <FormControlLabel 
            control={<Switch 
                checked={user?.twoFactAuth? true: false}
                onChange={handleChange}
            />}
            sx={{ ml: 3, mt: 2 }}
            label={user?.twoFactAuth? "enabled" : "disabled"}
        />

        <ValidationPopup 
            open={openValidaton} 
            setOpen={setOpenValidation} 
            setValidation={setValidation} 
            title={message.title}
            message={message.message}
        />

        <TfaEnable 
            open={openTfaEnable}
            setOpen={setOpenTfaEnable}
            qrCode={qrCode}
        />
          
        </>
    );
}