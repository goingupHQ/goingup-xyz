import { Box, Button, CircularProgress, Divider, Grid, Paper, Stack, Typography } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import Head from 'next/head';
import React from 'react';
import { ProjectsContext } from '../../contexts/projects-context';
import LoadingIllustration from '../../components/common/loading-illustration';
import { WalletContext } from '../../contexts/wallet-context';
import { useSnackbar } from 'notistack';

export default function PendingInvites(props) {
    const wallet = React.useContext(WalletContext);
    const projectsContext = React.useContext(ProjectsContext);
    const [pendingInvites, setPendingInvites] = React.useState([]);
    const [isLoading, setIsLoading] = React.useState(true);

    const { enqueueSnackbar, closeSnackbar } = useSnackbar();

    const load = async () => {
        setIsLoading(true);
        try {
            const invites = await projectsContext.getPendingInvitesByAddress(wallet.address);
            setPendingInvites(invites);
        } catch (e) {
            console.error(e);
        } finally {
            setIsLoading(false);
        }
    };

    React.useEffect(() => {
        if (wallet.address) load();
    }, [wallet.address]);

    const [accepting, setAccepting] = React.useState(false);
    const acceptProjectInvite = async (projectId) => {
        setAccepting(true);
        try {
            const tx = await projectsContext.acceptProjectInvite(projectId);
            const shortTxHash = tx.hash.substr(0, 6) + '...' + tx.hash.substr(tx.hash.length - 4, 4);
            const key = enqueueSnackbar(`Accept project invitation tx submitted (${shortTxHash})`, {
                variant: 'info',
                action: (key) => (
                    <Button variant="contained" color="primary" onClick={() => {
                        console.log('hello' + key);
                        window.open(`${projectsCtx.networkParams.blockExplorerUrls[0]}tx/${tx.hash}`, '_blank');
                    }}>Open in Block Explorer</Button>
                ),
                persist: true,
            });

            tx.wait().then((receipt) => {
                closeSnackbar(key);
                enqueueSnackbar('Accept project invitation tx confirmed', {
                    variant: 'success',
                });
                load();
                setAccepting(false);
            });
        } catch (e) {
            console.error(e);
            setAccepting(false);
        }
    };

    return (
        <>
            <Head>
                <title>Pending Project Invites</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <Box>
                <Grid container sx={{ mb: 3 }} rowSpacing={2}>
                    <Grid item xs={12} md={6}>
                        <Typography variant="h1">Pending Project Invites</Typography>
                    </Grid>
                </Grid>

                {isLoading && (
                    <Box sx={{ textAlign: 'center', pt: 5 }}>
                        <LoadingIllustration />
                    </Box>
                )}

                {!isLoading && pendingInvites.length === 0 && (
                    <Box sx={{ textAlign: 'center', pt: 5 }}>
                        <Box
                            component="img"
                            src="/images/illustrations/joined.svg"
                            alt="connection-lost"
                            sx={{ width: '100%', maxWidth: '500px', mb: 3 }}
                        />
                        <Typography variant="h2">No pending invites</Typography>
                    </Box>
                )}

                {!isLoading && pendingInvites.length > 0 && (
                    <Paper>
                        {pendingInvites.map((invite, index) => (
                            <Stack key={index} direction="column" spacing={0} sx={{ p: 2 }}>
                                <Typography variant="body1">
                                    Project: <b>{invite?.project?.name}</b>
                                </Typography>
                                <Typography variant="body1">
                                    Role: <b>{invite?.memberData?.role}</b>
                                </Typography>
                                <Typography variant="body1">
                                    Goal: <b>{invite?.memberData?.goal}</b>
                                </Typography>
                                <Box sx={{ mt: 2 }}>
                                    <LoadingButton
                                        variant="contained"
                                        sx={{ mr: 1 }}
                                        loading={accepting}
                                        loadingIndicator={<CircularProgress size={14} />}
                                        onClick={() => acceptProjectInvite(invite.projectId)}
                                    >
                                        Accept
                                    </LoadingButton>

                                    {/* <Button variant="contained" color="secondary" onClick={() => projectsContext.rejectInvite(invite.id)}>
                                    Reject
                                </Button> */}
                                </Box>

                                <Divider sx={{ my: 2 }} />
                            </Stack>
                        ))}
                    </Paper>
                )}
            </Box>
        </>
    );
}
