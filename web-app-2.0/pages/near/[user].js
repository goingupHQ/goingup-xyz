import {
    Box,
    Button,
    FormControl,
    InputLabel,
    Select,
    TextField,
    Typography,
} from '@mui/material';
import { useRouter } from 'next/router';
import { useState } from 'react';

const fieldStyle = {
    m: 1,
};

export default function User() {
    const [name, setName] = useState('');
    const router = useRouter();
    console.log(router.query.user);
    const address = router.query.user;

    const createAccount = async () => {
        const response = await fetch('/api/create-account', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name,
                address,
            }),
        });
        const data = await response.json();
        console.log(data);
    };
    return (
        <Box>
            <Typography>Create your Account</Typography>
            <Box
                sx={{
                    display: 'grid',
                    gridTemplateColumns: {
                        xs: 'autofill',
                        md: 'repeat(2, 1fr)',
                    },
                }}>
                <TextField
                    label='Your Name'
                    placeholder='You can give a nickname, prefered name or alias'
                    variant='outlined'
                    required
                    sx={fieldStyle}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
            </Box>
            <Button
                variant='contained'
                sx={fieldStyle}
                onClick={() => createAccount()}>
                Create Account
            </Button>
        </Box>
    );
}
