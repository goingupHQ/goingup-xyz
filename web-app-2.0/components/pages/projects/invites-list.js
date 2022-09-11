import { Grid, Paper, Stack, Typography, Box } from '@mui/material';
import ProfileLink from '../../common/profile-link';
import React from 'react';

export default function InvitesList(props) {
    const { pendingInvites } = props;

    return (
        <>
            {pendingInvites.length === 0 && (
                <Stack direction="column" spacing={4} alignItems="center">
                    <Typography variant="h2">No pending invitations</Typography>
                    <Box
                        component="img"
                        src="/images/illustrations/invites.svg"
                        sx={{ width: '100%', maxWidth: { xs: 500 } }}
                    />
                    <Typography variant="body1">Invite members to your project</Typography>
                </Stack>
            )}

            {pendingInvites.length > 0 && (
                <>
                    <Typography variant="h6" sx={{ mb: 3 }}>
                        {pendingInvites.length} Pending Invitation{pendingInvites.length != 1 ? 's' : ''}
                    </Typography>

                    <Grid container spacing={3}>
                        {pendingInvites.map((invite) => (
                            <Grid item xs={12} md={6} lg={4} key={invite}>
                                <Paper variant="outlined" sx={{ padding: 3, height: '100%', alignItems: 'stretch' }}>
                                    <ProfileLink address={invite} />
                                </Paper>
                            </Grid>
                        ))}
                    </Grid>
                </>
            )}
        </>
    );
}
