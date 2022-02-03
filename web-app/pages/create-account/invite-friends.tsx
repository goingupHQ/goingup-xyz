import { useContext } from 'react';
import { Box, TextField, Select, InputLabel, FormControl, MenuItem } from '@mui/material';
import { AppContext } from '@/contexts/AppContext';

const fieldStyle = {
    m: 1
}

function InviteFriends() {
    const appContext = useContext(AppContext);
    const { availability, occupations } = appContext;
    return (
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: 'autofill', md: 'repeat(2, 1fr)'} }}>
            <TextField label="ENS Name, Email or Wallet Address" variant="outlined" sx={fieldStyle} />
            <TextField label="ENS Name, Email or Wallet Address" variant="outlined" sx={fieldStyle} />
            <TextField label="ENS Name, Email or Wallet Address" variant="outlined" sx={fieldStyle} />
            <TextField label="ENS Name, Email or Wallet Address" variant="outlined" sx={fieldStyle} />
            <TextField label="ENS Name, Email or Wallet Address" variant="outlined" sx={fieldStyle} />
            <TextField label="ENS Name, Email or Wallet Address" variant="outlined" sx={fieldStyle} />
            <TextField label="ENS Name, Email or Wallet Address" variant="outlined" sx={fieldStyle} />
            <TextField label="ENS Name, Email or Wallet Address" variant="outlined" sx={fieldStyle} />
        </Box>
    )
}

export default InviteFriends;
