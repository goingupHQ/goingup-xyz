import { useContext } from 'react';
import { Box, TextField, Select, InputLabel, FormControl, MenuItem } from '@mui/material';
import { AppContext } from '@/contexts/AppContext';

const fieldStyle = {
    m: 1
}

function ProjectGoals() {
    const appContext = useContext(AppContext);
    const { userGoals, occupations } = appContext;
    return (
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)' }}>
            <FormControl sx={fieldStyle} required>
                <InputLabel id="project-goals-label">What are your goals?</InputLabel>
                <Select
                    labelId="project-goals-label"
                    // value={age}
                    label="What are your goals?"
                    // onChange={handleChange}
                >
                    {userGoals.map(ug => {return (
                        <MenuItem value={ug.id}>{ug.text}</MenuItem>
                    )})}
                </Select>
            </FormControl>

            <FormControl sx={fieldStyle} required>
                <InputLabel id="occupation-select-label">Occupation</InputLabel>
                <Select
                    labelId="occupation-select-label"
                    // value={age}
                    label="Occupation"
                    // onChange={handleChange}
                >
                    {occupations.map(o => {return (
                        <MenuItem value={o.id}>{o.text}</MenuItem>
                    )})}
                </Select>
            </FormControl>
        </Box>
    )
}

export default ProjectGoals;
