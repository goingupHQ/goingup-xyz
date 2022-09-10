import { Stack, Typography } from '@mui/material';
import { Box } from '@mui/system';
import React from 'react';

export default function MembersList(props) {
    const { members } = props;

    return (
        <>
            {members.length === 0 && (
                <Stack direction="column" spacing={4} alignItems="center">
                    <Typography variant="h2">No members yet</Typography>
                    <Box component="img" src="/images/illustrations/join.svg" sx={{ width: '100%', maxWidth: { xs: 320 } }} />
                    <Typography variant="body1">Invite members to your project</Typography>
                </Stack>
            )}
        </>
    );
}
