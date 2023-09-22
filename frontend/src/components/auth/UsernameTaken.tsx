import * as React from 'react';
import { UserAPI } from '../../api/user.api';
import { SetUserContext } from '../../App';
import { UpdateUserName } from '../profile/profileName/UpdateUserName';

export default function UsernameTaken({
    setLoggedIn
}: {setLoggedIn: Function }) {

    const setUser: Function = React.useContext(SetUserContext);

    const [open, setOpen] = React.useState(true);

    const handleClose = async () => {
        setOpen(false);
    };

    const handleCancel = async () => {
        await UserAPI.logout();
        setLoggedIn(false);
        setUser(null);
        setOpen(false);
    };

    return (
    <>
        <UpdateUserName
            open={open}
            handleClose={handleClose}
            handleCancel={handleCancel}
            message={`Oh no! Looks like a little filou has taken your intra username! 😱
                    Choose an other username to continue.`}
        />

    </>
    );
}