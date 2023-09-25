import ConfirmationPopup from "components/utils/ConfirmationPopup";
import PwMPopUp from "components/utils/PwMPopUp";
import { WebsocketContext } from "contexts/WebsocketContext";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function PlayWithMe() {
  const socket = useContext(WebsocketContext);

  const [inviterName, setInviterName] = useState<string>("");
  const [inviterId, setInviterId] = useState<number>(0);
  const [socketId, setSocketId] = useState<string>('');
  const [openInvitation, setOpenInvitation] = useState<boolean>(false);
  const [validation, setValidation] = useState<boolean>(false);
  const [answered, setAnswered] = useState<boolean>(false);

  useEffect(() => {
    socket.on(
      "wantToPlay",
      ({
        name,
        userId,
        inviterSocketId,
      }: {
        name: string;
        userId: number;
        inviterSocketId: string;
      }) => {
        setInviterName(name);
        setInviterId(userId);
        setSocketId(inviterSocketId);
        setOpenInvitation(true);
      }
    );
    return () => {
      socket.off("wantToPlay");
    };
  }, [socket]);

  useEffect(() => {
    socket.on("closeInvite", () => {
      setOpenInvitation(false);
    });
    return () => {
      socket.off("closeInvite");
    };
  }, [socket]);

  useEffect(() => {
    if (answered === true) {
      socket.emit("answerToInvite", {
        answer: validation,
        inviterId: inviterId,
        inviterSocketId: socketId,
      });
      setValidation(false);
      setAnswered(false);
    }
  }, [validation, inviterId, socket, answered, socketId]);

  const [openNotif, setOpenNotif] = useState<boolean>(false);
  const [notifMessage, setNotifMessage] = useState<string>("");

  useEffect(() => {
    socket.on("inviteSuccessfullySent", () => {
      setNotifMessage(`Invitation successfully sent!`);
      setOpenNotif(true);
    });

    socket.on("errorGameInvite", ({ errorMsg }) => {
      setNotifMessage(`${errorMsg}`);
      setOpenNotif(true);
    });

    socket.on("inviteRefused", ({ userName }) => {
      setNotifMessage(`${userName} declined your invitation to play a game!`);
      setOpenNotif(true);
    });

    return () => {
      socket.off("inviteRefused");
      socket.off("errorGameInvite");
      socket.off("inviteSuccessfullySent");
    };
  }, [socket]);

  const navigate = useNavigate();
  useEffect(() => {
    socket.on("gameReady", () => {
      navigate("/game");
    });
    return () => {
      socket.off("gameReady");
    };
  });

  return (
    <div>
      <PwMPopUp
        open={openInvitation}
        setOpen={setOpenInvitation}
        setValidation={setValidation}
        setAnswered={setAnswered}
        title={"Wanna play with me?"}
        message={`${inviterName} wants to play a little game with you, up for the challenge?`}
      />
      <ConfirmationPopup open={openNotif} setOpen={setOpenNotif} message={notifMessage} />
    </div>
  );
}

export default PlayWithMe;
