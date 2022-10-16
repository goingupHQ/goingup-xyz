import { Box, Button, CircularProgress, Divider, Grid, Paper, Stack, Typography } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import Head from 'next/head';
import React from 'react';
import { ProjectsContext } from '../../contexts/projects-context';
import LoadingIllustration from '../../components/common/loading-illustration';
import { WalletContext } from '../../contexts/wallet-context';
import { useSnackbar } from 'notistack';
import WrongNetwork from '../../components/pages/projects/wrong-network';
import { useRouter } from 'next/router';
import PendingInviteCard from '../../components/pages/projects/pending-invite-card';

export default function PendingInvites(props) {
    const wallet = React.useContext(WalletContext);
    const projectsContext = React.useContext(ProjectsContext);
    const [pendingInvites, setPendingInvites] = React.useState([]);
    const [isLoading, setIsLoading] = React.useState(true);

    const router = useRouter();

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
        //
        if (wallet.address && projectsContext.isCorrectNetwork) load();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [wallet.address, projectsContext.isCorrectNetwork]);

    return (
        <>
            <Head>
                <title>Pending Project Invites</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>

            {!projectsContext.isCorrectNetwork && <WrongNetwork />}

            {projectsContext.isCorrectNetwork && (
                <>
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
                            <Grid container spacing={2}>
                                {pendingInvites.map((invite) => (
                                    <Grid item xs={12} md={4} key={invite}>
                                        <PendingInviteCard memberRecordId={invite} reload={load} />
                                    </Grid>
                                ))}
                            </Grid>
                        )}
                    </Box>
                </>
            )}
        </>
    );
}
