import * as React from 'react';
import CardMedia from '@mui/material/CardMedia';
import defaultAvatar from '../../../default_avatar/-1.png';
import { AvatarDto } from '../../../api/dto/avatar.dto';
import { CardContent } from '@mui/material';

interface ProfileImageProps {
  profileImage: AvatarDto | undefined
}

export default function ProfileImage({
  profileImage,

}: ProfileImageProps) {

  return (
    <CardContent>
      <CardMedia
        component="img"
        src={profileImage? `data:image/png;base64,${profileImage.data}` : defaultAvatar}
        alt="green iguana"
        sx={{ height: 180, objectFit: "contain" }}
      />
      </CardContent>
  );
}