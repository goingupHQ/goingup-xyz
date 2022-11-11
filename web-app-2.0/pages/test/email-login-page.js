import React from 'react';
import { Button } from '@mui/material';

export default function EmailLoginPage(props) {
    const send = async () => {

        alert('sent');
    };

    return (
        <>
            <img src="/images/goingup-glyph.png" alt="GoingUp" />
            <Button variant="contained" color="primary" onClick={send}>
                Send Test Email
            </Button>
        </>
    )
}
