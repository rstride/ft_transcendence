import * as React from 'react';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import { UserAPI } from '../../../api/user.api';
import { Button, ImageListItemBar } from '@mui/material';
import CancelIcon from '@mui/icons-material/Cancel';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import { AvatarDto } from '../../../api/dto/avatar.dto';
import { SetUserContext, UserContext } from '../../../App';
import ValidationPopup from '../../utils/ValidationPopup';
import { UserDto } from '../../../api/dto/user.dto';

interface AvatarListProps {
  selectedId: number | null
  setSelectedId: Function
}

export default function AvatarList({
  selectedId,
  setSelectedId

}: AvatarListProps) {

  const user: UserDto | null = React.useContext(UserContext);
  const setUser: Function = React.useContext(SetUserContext);
  
  // Change the selected id when an image is clicked
  const handleSelected = (id: number) => {
    setSelectedId(id===selectedId? null : id);
  };

  // Change selected id and open validation when delete icon is clicked
  const handleClickOpen = (id: number) => {
      setSelectedId(id)
      setOpen(true);
  };

  // Props given to the validation popup to see if deletion is validated or not
  const [validation, setValidation] = React.useState<boolean>(false);

  // Open validation popup
  const [open, setOpen] = React.useState<boolean>(false);


  // If validation is true ; remove avatar and update user with the selected id.
  // Validation can only change when clicking on delete icon
  React.useEffect(() => {
      const removeAvatar = async () => {
        if (selectedId) {
          await UserAPI.removeAvatar(selectedId);

          const data: UserDto | null = await UserAPI.getUserProfile();
          setUser(data);
          setValidation(false);
          setSelectedId(null);
        }
      }
      if (validation === true) {
          removeAvatar();
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [validation]);

  return (
  <ImageList sx={{ width: 500, height: 450 }} cols={3} rowHeight={164}>
    {user?.avatars && user?.avatars.length > 0 ? user?.avatars.map((item: AvatarDto) => {
      return (

        <Button key={item.id}>
          <ImageListItem>

            <img
              src={`data:image/png;base64,${item.data}`}
              alt='avatar'
              loading="lazy"
              onClick={() => handleSelected(item.id)} 
            />

          <ImageListItemBar
            sx={{
                background:
                'linear-gradient(to bottom, rgba(0,0,0,0) 0%, ' +
                'rgba(0,0,0,0) 70%, rgba(0,0,0,0) 100%)',
            }}
            position="top"
            onClick={() => handleClickOpen(item.id)}
            actionIcon={
              <CancelIcon style={{ color:"black" }}/>
            }
            actionPosition="left"
          />
          <ValidationPopup 
            open={open} 
            setOpen={setOpen} 
            setValidation={setValidation} 
            title="Delete ?"
            message="Your photo will be deleted from our database."
          />

          <ImageListItemBar
            sx={{
                background:
                'linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, ' +
                'rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)',
            }}
            position="bottom"
            actionIcon={
              selectedId === item.id? 
              <CheckBoxIcon style={{ color: 'white' }}/>
              :
              <CheckBoxOutlineBlankIcon style={{ color: 'white' }}/>
            }
            actionPosition="left"
            onClick={() => handleSelected(item.id)}
          />

          </ImageListItem>
        </Button>

       );
    }) : <h1>No Photos</h1>}

  </ImageList>
  );
}