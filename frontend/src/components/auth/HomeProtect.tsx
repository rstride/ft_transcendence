import React from "react";
import { UserDto } from "../../api/dto/user.dto";
import { UserContext } from "../../App";
import TwoFactAuth from "./TwoFactAuth";
import UsernameTaken from "./UsernameTaken";

interface HomeProtectProps {
    loggedIn: boolean
    setLoggedIn: Function
    children: JSX.Element
}

const HomeProtect = ({
    loggedIn,
    setLoggedIn,
    children
 }: HomeProtectProps) => {

    const user: UserDto | null = React.useContext(UserContext);

    return (
        <>
        {children}

        {
            user && !user.name?

            <UsernameTaken
                setLoggedIn={setLoggedIn}
            />

            : loggedIn && !user?

            <TwoFactAuth setLoggedIn={setLoggedIn}/>

            : ''
        }
      </>
    )
};

export default HomeProtect;