import { useContext } from 'react';
import {
    Box,
    Grid,
    TextareaAutosize,
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
        setEmail4,
        inviteMessage,
        setInviteMessage
    } = props.state;

    return (
        <>
            <Box>
                <h3>
                    Invite up to four friends by typing the email addresses
                    below
                </h3>
            </Box>
            <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                    <TextField
                        fullWidth
                        label="Email Address 1"
                        variant="outlined"
                        value={email1}
                        onChange={(e) => {
                            setEmail1(e.target.value);
                        }}
                    />
                </Grid>
                <Grid item xs={12} md={6}>
                    <TextField
                        fullWidth
                        label="Email Address 2"
                        variant="outlined"
                        value={email2}
                        onChange={(e) => {
                            setEmail2(e.target.value);
                        }}
                    />
                </Grid>
                <Grid item xs={12} md={6}>
                    <TextField
                        fullWidth
                        label="Email Address 3"
                        variant="outlined"
                        value={email3}
                        onChange={(e) => {
                            setEmail3(e.target.value);
                        }}
                    />
                </Grid>
                <Grid item xs={12} md={6}>
                    <TextField
                        fullWidth
                        label="Email Address 4"
                        variant="outlined"
                        value={email4}
                        onChange={(e) => {
                            setEmail4(e.target.value);
                        }}
                    />
                </Grid>

                <Grid item xs={12}>
                    <TextField
                        multiline
                        fullWidth
                        minRows={3}
                        label="Optional personal message"
                        value={inviteMessage}
                        onChange={(e) => {
                            setInviteMessage(e.target.value);
                        }}
                    />
                </Grid>
            </Grid>
        </>
    );
}

export default InviteFriends;
