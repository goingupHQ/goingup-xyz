import { Stack, Typography } from '@mui/material';
import { Box } from '@mui/system';
import React from 'react';

export default function InvitesList(props) {
    const { pendingInvites } = props;

    return (
        <>
            {pendingInvites.length === 0 && (
                <Stack direction="column" spacing={4} alignItems="center">
                    <Typography variant="h2">No pending invitations</Typography>
                    <Box component="img" src="/images/illustrations/invites.svg" sx={{ width: '100%', maxWidth: { xs: 500 }}} />
                    <Typography variant="body1">Invite members to your project</Typography>
                </Stack>
            )}

            {pendingInvites.length > 0 &&
                <Typography variant="h6">{pendingInvites.length} Pending Invitation{pendingInvites.length != 1 ? 's' : ''}</Typography>
}
        </>
    );
}
