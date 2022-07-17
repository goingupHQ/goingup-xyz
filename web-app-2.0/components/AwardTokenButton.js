import { Button, Typography } from '@mui/material';
import {useState} from 'react';

export default function AwardTokenButton() {
  const [active, setActive] = useState(true)
  function handleClick() {
    setActive(!active)
  }
  return (
    <Button
      variant='contained'
      color={active ? "primary" : "activeAward"}
      sx={{
        ':hover': {
          backgroundColor: 'hoverAward.main',
        },
        '&:active': {
          color: '#0F151C',
        },
      }}
      onClick={handleClick}
    >
      <Typography color={'#0F151C'}>Award Token</Typography>
    </Button>
  );
}
