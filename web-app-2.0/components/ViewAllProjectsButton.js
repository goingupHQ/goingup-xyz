import { Button } from '@mui/material';
import {useState} from 'react';

export default function ViewAllProjectsButton() {
  const [active, setActive] = useState(true)
  function handleClick() {
    setActive(!active)
  }
  return (
    <Button
      color={active ? "secondary" : "activeViewAllProjects"}
      sx={{
        ':hover': {
          color: 'hoverViewAllProjects.main',
        },
      }}
      onClick={handleClick}
    >
      View all projects
    </Button>
  );
}
