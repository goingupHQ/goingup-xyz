import { useContext, useState } from 'react';
import {
    Box,
    TextField,
    Select,
    InputLabel,
    FormControl,
    MenuItem
} from '@mui/material';
import { AppContext } from '@/contexts/AppContext';

const fieldStyle = {
    m: 1
};

function PersonalInfo(props) {
    const appContext = useContext(AppContext);
    const { availability, occupations } = appContext;

    const {
        firstName, setFirstName,
        lastName, setLastName,
        email, setEmail,
        discord, setDiscord,
        occupation, setOccupation,
        availabilityState, setAvailabilityState
    } = props.state;

    return (
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)' }}>
            <TextField
                label="First Name"
                variant="outlined"
                required
                sx={fieldStyle}
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
            />
            <TextField
                label="Last Name"
                variant="outlined"
                required
                sx={fieldStyle}
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
            />
            <TextField
                label="Email Address"
                variant="outlined"
                required
                sx={fieldStyle}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
                label="Discord"
                variant="outlined"
                sx={fieldStyle}
                value={discord}
                onChange={(e) => setDiscord(e.target.value)}
            />

            <FormControl sx={fieldStyle} required>
                <InputLabel id="occupation-select-label">Occupation</InputLabel>
                <Select
                    labelId="occupation-select-label"
                    label="Occupation"
                    value={occupation}
                    onChange={e => setOccupation(e.target.value)}
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
                    Availability
                </InputLabel>
                <Select
                    labelId="availability-select-label"
                    label="Availability"
                    value={availabilityState}
                    onChange={e => setAvailabilityState(e.target.value)}
                >
                    {availability.map((a) => {
                        return (
                            <MenuItem key={a.id} value={a.id}>
                                {a.text}
                            </MenuItem>
                        );
                    })}
                </Select>
            </FormControl>
        </Box>
    );
}

export default PersonalInfo;
