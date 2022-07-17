import { Button, Typography } from '@mui/material';
import {useState} from 'react';

export default function ViewProfileButton() {
  const [active, setActive] = useState(true)
  function handleClick() {
    setActive(!active)
  }
  return (
    <Button
      variant='contained'
      color={active ? "backgroundLight" : "activePrimary"}
      sx={{
        ':hover': {
          backgroundColor: 'hoverPrimary.main',
        },
      }}
      onClick={handleClick}
    >
      <Typography color={'#0F151C'}>View Profile</Typography>
    </Button>
  );
}
