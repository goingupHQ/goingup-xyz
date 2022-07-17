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
      color={active ? "primary" : "activePrimary"}
      sx={{
        ':hover': {
          backgroundColor: 'hoverPrimary.main',
        },
      }}
      onClick={handleClick}
    >
      <Typography color={'#0F151C'}>Award Token</Typography>
    </Button>
  );
}
