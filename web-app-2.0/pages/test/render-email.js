import React from 'react';
// import { render } from 'mjml-react';
// import * as InviteFriend from '../../templates/email/invite-friend.js';
import { Button, TextField } from '@mui/material';

export default function RenderEmail(props) {
    const [html, setHtml] = React.useState('');

    return (
        <>
            <Button onClick={() => {
                // const emailProps = {
                //     username: 'test',
                //     subject: 'test',
                //     confirmationUrl: 'test',
                //     personalMessage: 'test'
                // };

                // const emailHtml = render(<InviteFriend {...emailProps} />);
                // setHtml(emailHtml);
            }}>Test</Button>

            <TextField multiline={true} rows={10} value={html} />
        </>
    );
}
