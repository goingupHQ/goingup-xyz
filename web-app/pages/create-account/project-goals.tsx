import { useContext } from 'react';
import { Box, TextField, Select, InputLabel, FormControl, MenuItem } from '@mui/material';
import { AppContext } from '@/contexts/AppContext';

const fieldStyle = {
    m: 1
}

function ProjectGoals(props) {
    const appContext = useContext(AppContext);
    const { userGoals, occupations } = appContext;

    const {
        primaryGoal, setPrimaryGoal,
        idealCollab, setIdealCollab
    } = props.state;

    return (
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: 'autofill', md: 'repeat(2, 1fr)' } }}>
            <FormControl sx={fieldStyle} required>
                <InputLabel id="project-goals-label">What is your primary goal?</InputLabel>
                <Select
                    labelId="project-goals-label"
                    value={primaryGoal}
                    label="What is your primary goal?"
                    onChange={e => { setPrimaryGoal(e.target.value) }}
                >
                    {userGoals.map(ug => {return (
                        <MenuItem key={ug.id} value={ug.id}>{ug.text}</MenuItem>
                    )})}
                </Select>
            </FormControl>

            <FormControl sx={fieldStyle} required>
                <InputLabel id="ideal-collaborator-label">Your ideal collaborator is</InputLabel>
                <Select
                    labelId="ideal-collaborator-label"
                    value={idealCollab}
                    label="Your ideal collaborator is"
                    onChange={e => { setIdealCollab(e.target.value) }}
                >
                    {occupations.map(o => {return (
                        <MenuItem key={o.id} value={o.id}>{o.text}</MenuItem>
                    )})}
                </Select>
            </FormControl>
        </Box>
    )
}

export default ProjectGoals;
