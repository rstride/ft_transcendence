import * as React from 'react';
import CardActions from '@mui/material/CardActions';
import Button from '@mui/material/Button';
import { UserAPI } from '../../../api/user.api';
import { ButtonBase, IconButton } from '@mui/material';
import { PhotoCamera } from '@mui/icons-material';
import ConfirmationPopup from '../../utils/ConfirmationPopup';
import { SetUserContext } from '../../../App';
import AvatarListDialog from './AvatarListDialog';

interface UserProfileImageModificatorProps {
  children: JSX.Element
}

export default function UserProfileImageModificator({
  children,

}: UserProfileImageModificatorProps ) {

  const setUser: Function = React.useContext(SetUserContext);

  //  When a file has been choosen ; set the file with the file but does not download yet
  const [file, setFile] = React.useState<any | null>(null);

  const onUploadChange = (event: any) => {
    setFile(event.target.files[0]);
  }

  //  Confirmation popup that the file has been uploaded
  const [confirmation, setConfirmation] = React.useState(false);

  //  Open the avatar list when true ; when avatar is clicked
  const [openPhotos, setOpenPhotos] = React.useState(false);

  const handleOpenPhotos = () => {
    setOpenPhotos(true);
  };

  //  When the upload button is clicked ; upload the file and set the user
  const AddAvatar = async () => {

    const formData = new FormData();
    formData.append('image', file, file.name);

    await UserAPI.addAvatar(formData);
    const data = await UserAPI.getUserProfile();
    setUser(data);
  
    setFile(null);
    setConfirmation(true);
  };

  return (

    <>

      <ButtonBase onClick={handleOpenPhotos}>
        {children}
      </ButtonBase>

      <AvatarListDialog
        open={openPhotos}
        setOpen={setOpenPhotos}
      />

      <CardActions>
        <IconButton color="primary" aria-label="upload picture" component="label">
          <input hidden accept="image/*" type="file" onChange={onUploadChange}/>
          <PhotoCamera />
        </IconButton>

        {file? 
        <Button
          component="label"
          size="small"
          onClick={AddAvatar}
          >
            Upload {file.name}
        </Button>
        : "Select a file"
        }

        <ConfirmationPopup open={confirmation} setOpen={setConfirmation} message="Uploaded !"/>
      </CardActions>

    </>

  );
}