import { useContext } from 'react';
import { Box, TextField, Select, InputLabel, FormControl, MenuItem } from '@mui/material';
import { AppContext } from '@/contexts/AppContext';

const fieldStyle = {
    m: 1
}

function PersonalInfo() {
    const appContext = useContext(AppContext);
    const { availability } = appContext;
    return (
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)' }}>
            <TextField label="First Name" variant="outlined" required sx={fieldStyle} />
            <TextField label="Last Name" variant="outlined" required sx={fieldStyle} />
            <TextField label="Email Name" variant="outlined" required sx={fieldStyle} />
            <TextField label="Discord" variant="outlined" sx={fieldStyle} />

            <FormControl sx={fieldStyle}>
                <InputLabel id="occupation-select-label">Occupation</InputLabel>
                <Select
                    labelId="occupation-select-label"
                    // value={age}
                    label="Occupation"
                    // onChange={handleChange}
                >
                    <MenuItem value="Artist">Artist</MenuItem>
                    <MenuItem value="Developer">Developer</MenuItem>
                    <MenuItem value="Athlete">Athlete</MenuItem>
                    <MenuItem value="Marketing & Community">Marketing &amp; Community</MenuItem>
                    <MenuItem value="Investor">Investor</MenuItem>
                    <MenuItem value="Accountant">Accountant</MenuItem>
                    <MenuItem value="Engineer">Engineer</MenuItem>
                    <MenuItem value="Actor">Actor</MenuItem>
                    <MenuItem value="Video Producer">Video Producer</MenuItem>
                    <MenuItem value="Writer">Writer</MenuItem>
                    <MenuItem value="Other">Other</MenuItem>

                </Select>
            </FormControl>

            <FormControl sx={fieldStyle}>
                <InputLabel id="availability-select-label">Availability</InputLabel>
                <Select
                    labelId="availability-select-label"
                    // value={age}
                    label="Availability"
                    // onChange={handleChange}
                >
                    {availability.map(a => {return (
                        <MenuItem value={a.id}>{a.text}</MenuItem>
                    )})}
                </Select>
            </FormControl>
        </Box>
    )
}

export default PersonalInfo;
