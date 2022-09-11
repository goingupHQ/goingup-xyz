import React from 'react';
import { Grid, Stack, Typography, Box, CircularProgress } from '@mui/material';
import InviteCard from './invite-card';
import { ProjectsContext } from '../../../contexts/projects-context';

export default function InvitesList(props) {
    const { projectId } = props;

    const projectCtx = React.useContext(ProjectsContext);
    const [loading, setLoading] = React.useState(true);
    const [pendingInvites, setPendingInvites] = React.useState([]);

    const load = async () => {
        setLoading(true);
        try {
            setPendingInvites(await projectCtx.getPendingInvites(projectId));
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    };

    React.useEffect(() => {
        if (projectId) {
            load();
        }
    }, [projectId]);

    return (
        <>
            {loading && <CircularProgress size={18} />}

            {!loading && (
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
                                        <InviteCard address={invite} projectId={projectId} reload={load} />
                                    </Grid>
                                ))}
                            </Grid>
                        </>
                    )}
                </>
            )}
        </>
    );
}
