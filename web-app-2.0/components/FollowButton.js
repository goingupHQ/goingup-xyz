import { Button } from '@mui/material';
import {useState} from 'react';

export default function FollowButton() {
  const [buttonText, setButtonText] = useState('Follow');
  const [active, setActive] = useState(true)
  function handleClick() {
    setButtonText('Following')
    setActive(!active)
  }
  return (
    <Button
      variant='contained'
      color={active ? "secondary" : "activeFollow"}
      sx={{
        ':hover': {
          backgroundColor: 'hoverFollow.main',
          color: 'hoverFollow.text',
        },
        '&:active': {
          backgroundColor: 'activeFollow.main',
          color: 'activeFollow.text',
        },
      }}
      onClick={handleClick}
    >
      {buttonText}
    </Button>
  );
}
