import { Button } from "@mui/material";
import React from "react";
import { UserDto } from "../../../api/dto/user.dto";
import { UserAPI } from "../../../api/user.api";
import { SetUserContext, UserContext } from "../../../App";
import ValidationPopup from "../../utils/ValidationPopup";

interface AddFriendButtonProps {
    visited: UserDto | null
}

export const AddFriendButton = ({visited}: AddFriendButtonProps) => {

    const setUser: Function = React.useContext(SetUserContext);
    const user: UserDto | null = React.useContext(UserContext);

    const [openValidation, setOpenValidation] = React.useState<boolean>(false);
    const [validation, setValidation] = React.useState<boolean>(false);
    const [isFriend, setIsFriend] = React.useState<boolean>(false);
    const [message, setMessage] = React.useState<{title:string, message:string}>({title: "", message: ""});
    const [button, setButton] = React.useState<string>("");

    const handleOpenValidation = () => {
        setOpenValidation(true);
        if (visited?.id === user?.id) {
            setMessage({
                title: `You want to add yourself to your friendlist ?`,
                message: 'You cannot do that, look for other friends.'
            })
        }
        else if (!isFriend) {
            setMessage({
                title: `Add ${visited?.name} to friend ?`,
                message: 'This action will add the user to your friendlist.'
            })
        }
        else {
            setMessage({
                title: `Remove ${visited?.name} from friend ?`,
                message: 'This action will remove the user from your friendlist.'
            })
        }
    }

    React.useEffect(() => {
        const addToFriend = async () => {
            if (visited) {

                let resp: UserDto | null;
                if (!isFriend) {
                    resp = await UserAPI.addFriend(visited.id);
                }
                else {
                    resp = await UserAPI.removeFriend(visited.id);
                }
                setValidation(false);
                setUser(resp);
            }
        }

        if (validation === true) {
            addToFriend();
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [validation]);

    React.useEffect(() => {
        const initIsFriend = async () => {
            let friend = false;

            if (user && user.friends && visited) {
            
                if (user && user.friends && visited) {
                    if (user.friends.find(({id}) => id === visited.id )) {
                        friend = true;
                    }
                }
            }
            setButton(friend? 'Remove friend': 'Add friend');
            setIsFriend(friend);
        }
    
        initIsFriend();

        // eslint-disable-next-line react-hooks/exhaustive-deps
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