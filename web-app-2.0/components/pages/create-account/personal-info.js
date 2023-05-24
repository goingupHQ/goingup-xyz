import { useContext, useState } from 'react';
import {
    Box,
    TextField,
    Select,
    InputLabel,
    FormControl,
    MenuItem,
    Checkbox,
    ListItemText
} from '@mui/material';
import { AppContext } from '../../../contexts/app-context';

const fieldStyle = {
    m: 0
};

function PersonalInfo(props) {
    const appContext = useContext(AppContext);
    const { availability, occupations } = appContext;

    const {
        name, setName,
        occupation, setOccupation,
        openTo, setOpenTo,
        about, setAbout
    } = props.state;

    return (
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: 'autofill', md: 'repeat(2, 1fr)'}, gap: 2 }}>
            <TextField
                label="Your Name"
                placeholder="You can give a nickname, prefered name or alias"
                variant="outlined"
                required
                sx={fieldStyle}
                value={name}
                onChange={(e) => setName(e.target.value)}
            />

            <FormControl sx={fieldStyle} required>
                <InputLabel id="occupation-select-label">Occupation</InputLabel>
                <Select
                    labelId="occupation-select-label"
                    label="Occupation"
                    value={occupation}
                    onChange={e => setOccupation(e.target.value)}
                    MenuProps={{ style: {marginTop: 80}} }
                >
                    {occupations.map((o) => {
                        return (
                            <MenuItem key={o.id} value={o.id}>
                                {o.text}
                            </MenuItem>
                        );
                    })}
                </Select>
            </FormControl>

            <FormControl sx={fieldStyle} required>
                <InputLabel id="availability-select-label">
                    Open To
                </InputLabel>
                <Select
                    labelId="availability-select-label"
                    label="Open To"
                    multiple
                    value={openTo}
                    onChange={event => {
                        const {
                            target: { value },
                        } = event;

                        setOpenTo(typeof value === 'string' ? value.split(',') : value);
                    }}
                    renderValue={(selected) => selected.map(i => availability.find(a => a.id === i).text).join(', ')}
                    MenuProps={{ style: {marginTop: 80}} }
                >
                    {availability.map((a) => {
                        return (
                            <MenuItem key={a.id} value={a.id}>
                                <Checkbox checked={openTo.indexOf(a.id) > -1} />
                                <ListItemText primary={a.text} />
                            </MenuItem>
                        );
                    })}
                </Select>
            </FormControl>

            <TextField
                label="About you"
                placeholder="Introduce yourself to the community"
                variant="outlined"
                sx={fieldStyle}
                value={about}
                onChange={(e) => setAbout(e.target.value)}
                multiline
            />
        </Box>
    );
}

export default PersonalInfo;
