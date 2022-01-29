import { useContext } from 'react';
import { Box, TextField, Select, InputLabel, FormControl, MenuItem } from '@mui/material';
import { AppContext } from '@/contexts/AppContext';

const fieldStyle = {
    m: 1
}

function PersonalInfo() {
    const appContext = useContext(AppContext);
    const { availability, occupations } = appContext;
    return (
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)' }}>
            <TextField label="First Name" variant="outlined" required sx={fieldStyle} />
            <TextField label="Last Name" variant="outlined" required sx={fieldStyle} />
            <TextField label="Email Address" variant="outlined" required sx={fieldStyle} />
            <TextField label="Discord" variant="outlined" sx={fieldStyle} />

            <FormControl sx={fieldStyle} required>
                <InputLabel id="occupation-select-label">Occupation</InputLabel>
                <Select
                    labelId="occupation-select-label"
                    // value={age}
                    label="Occupation"
                    // onChange={handleChange}
                >
                    {occupations.map(o => {return (
                        <MenuItem key={o.id} value={o.id}>{o.text}</MenuItem>
                    )})}
                </Select>
            </FormControl>

            <FormControl sx={fieldStyle} required>
                <InputLabel id="availability-select-label">Availability</InputLabel>
                <Select
                    labelId="availability-select-label"
                    // value={age}
                    label="Availability"
                    // onChange={handleChange}
                >
                    {availability.map(a => {return (
                        <MenuItem key={a.id} value={a.id}>{a.text}</MenuItem>
                    )})}
                </Select>
            </FormControl>
        </Box>
    )
}

export default PersonalInfo;
