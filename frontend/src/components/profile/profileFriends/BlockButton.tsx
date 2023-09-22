import { Button } from "@mui/material";
import React from "react";
import { UserDto } from "../../../api/dto/user.dto";
import { UserAPI } from "../../../api/user.api";
import { SetUserContext, UserContext } from "../../../App";
import ValidationPopup from "../../utils/ValidationPopup";

interface BlockButtonProps {
    visited: UserDto | null
}

export const BlockButton = ({visited}: BlockButtonProps) => {

    const setUser: Function = React.useContext(SetUserContext);
    const user: UserDto | null = React.useContext(UserContext);

    const [openValidation, setOpenValidation] = React.useState<boolean>(false);
    const [validation, setValidation] = React.useState<boolean>(false);
    const [isBlocked, setIsBlocked] = React.useState<boolean>(false);
    const [message, setMessage] = React.useState<{title:string, message:string}>({title: "", message: ""});
    const [button, setButton] = React.useState<string>("");

    const handleOpenValidation = () => {
        setOpenValidation(true);
        if (visited?.id === user?.id) {
            setMessage({
                title: `Are you ok ?`,
                message: 'You cannot do that, please reach for some help.'
            })
        }
        else if (!isBlocked) {
            setMessage({
                title: `Add ${visited?.name} to blocked list ?`,
                message: "You won't be able to see the user's message."
            })
        }
        else {
            setMessage({
                title: `Remove ${visited?.name} from blocked list ?`,
                message: "You will see the user's message again."
            })
        }
    }

    React.useEffect(() => {
        const addToBlock = async () => {
            if (visited) {

                let resp: UserDto | null;
                if (!isBlocked) {
                    resp = await UserAPI.addBlock(visited.id);
                }
                else {
                    resp = await UserAPI.removeBlock(visited.id);
                }
                setValidation(false);
                setUser(resp);
            }
        }

        if (validation === true) {
            addToBlock();
        }
    // eslint-disable-next-line
    }, [validation, setUser, visited, isBlocked]);

    React.useEffect(() => {
        const initIsBlocked = async () => {
            let blocked = false;

            if (user && user.blocked && visited) {
                if (user.blocked.find(({id}) => id === visited.id )) {
                    blocked = true;
                }
            }
            setButton(blocked? 'Unblock': 'Block');
            setIsBlocked(blocked);
        }
        initIsBlocked();
    }, [user, visited]);
    
    return (
        <>
        <Button onClick={handleOpenValidation}>
            {button}
        </Button>

        <ValidationPopup 
            open={openValidation}
            setOpen={setOpenValidation}
            setValidation={setValidation}
            title={message.title}
            message={message.message}
        />

        </>
    );
}