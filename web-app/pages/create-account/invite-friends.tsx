import { useContext } from 'react';
import {
    Box,
    TextField
    // Select,
    // InputLabel,
    // FormControl,
    // MenuItem,
} from '@mui/material';
import { AppContext } from '@/contexts/AppContext';

const fieldStyle = {
    m: 1
};

function InviteFriends(props) {
    const appContext = useContext(AppContext);
    const { availability, occupations } = appContext;

    const {
        email1,
        setEmail1,
        email2,
        setEmail2,
        email3,
        setEmail3,
        email4,
        setEmail4
    } = props.state;

    return (
        <>
            <Box>
                <h3>Invite up to four friends by typing the email addresses below</h3>
            </Box>
            <Box
                sx={{
                    display: 'grid',
                    gridTemplateColumns: { xs: 'autofill', md: 'repeat(2, 1fr)' }
                }}
            >
                <TextField
                    label="Email Address 1"
                    variant="outlined"
                    sx={fieldStyle}
                    value={email1}
                    onChange={(e) => {
                        setEmail1(e.target.value);
                    }}
                />
                <TextField
                    label="Email Address 2"
                    variant="outlined"
                    sx={fieldStyle}
                    value={email2}
                    onChange={(e) => {
                        setEmail2(e.target.value);
                    }}
                />
                <TextField
                    label="Email Address 3"
                    variant="outlined"
                    sx={fieldStyle}
                    value={email3}
                    onChange={(e) => {
                        setEmail3(e.target.value);
                    }}
                />
                <TextField
                    label="Email Address 4"
                    variant="outlined"
                    sx={fieldStyle}
                    value={email4}
                    onChange={(e) => {
                        setEmail4(e.target.value);
                    }}
                />
            </Box>
        </>
    );
}

export default InviteFriends;
