import { useContext } from 'react';
import { Box, TextField, Select, InputLabel, FormControl, MenuItem, Checkbox, ListItemText } from '@mui/material';
import { AppContext } from '../../../contexts/app-context';

const fieldStyle = {
    m: 0
}

function ProjectGoals(props) {
    const appContext = useContext(AppContext);
    const { userGoals, occupations } = appContext;

    const {
        projectGoals, setProjectGoals,
        idealCollab, setIdealCollab
    } = props.state;

    return (
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: 'autofill', md: 'repeat(2, 1fr)'}, gap: 2 }}>
            <FormControl sx={fieldStyle} required>
                <InputLabel id="project-goals-label">What is your primary goal?</InputLabel>
                <Select
                    labelId="project-goals-label"
                    value={projectGoals}
                    label="What is your primary goal?"
                    multiple
                    onChange={event => {
                        const {
                            target: { value },
                        } = event;

                        setProjectGoals(typeof value === 'string' ? value.split(',') : value);
                    }}
                    renderValue={(selected) => selected.map(i => userGoals.find(ug => ug.id === i).text).join(', ')}
                    MenuProps={{ style: {marginTop: 80}} }
                >
                    {userGoals.map(ug => {return (
                        <MenuItem key={ug.id} value={ug.id}>
                            <Checkbox checked={projectGoals.indexOf(ug.id) > -1} />
                            <ListItemText primary={ug.text} />
                        </MenuItem>
                    )})}
                </Select>
            </FormControl>

            <FormControl sx={fieldStyle} required>
                <InputLabel id="ideal-collaborator-label">Ideal collaborator/s</InputLabel>
                <Select
                    labelId="ideal-collaborator-label"
                    value={idealCollab}
                    label="Ideal collaborator/s"
                    multiple
                    onChange={event => {
                        const {
                            target: { value },
                        } = event;

                        setIdealCollab(typeof value === 'string' ? value.split(',') : value);
                    }}
                    renderValue={(selected) => selected.map(i => occupations.find(ug => ug.id === i).text).join(', ')}
                    MenuProps={{ style: {marginTop: 80}} }
                >
                    {occupations.map(o => {return (
                        <MenuItem key={o.id} value={o.id}>
                            <Checkbox checked={idealCollab.indexOf(o.id) > -1} />
                            <ListItemText primary={o.text} />
                        </MenuItem>
                    )})}
                </Select>
            </FormControl>
        </Box>
    )
}

export default ProjectGoals;
