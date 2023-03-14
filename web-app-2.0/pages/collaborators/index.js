import Head from 'next/head';
import { Box, Grid, Typography } from '@mui/material';
import { useContext, useEffect } from 'react';
import GuestCollaborators from '../../components/pages/collaborators/GuestCollaborators';
import ProjectCollaborators from '../../components/pages/collaborators/ProjectCollaborators';
import { WalletContext } from '../../contexts/wallet-context';

export default function Collaborators() {
    const wallet = useContext(WalletContext);
    return (
        <>
            <Head>
                <title>GoingUP: Collaborators</title>
            </Head>
            {wallet.address === null && (
                <Box sx={{ mt: 4, textAlign: 'center' }}>
                    <Typography variant='h2'>
                        You need a connected wallet with a GoingUP account to
                        access the Collaborators page.
                    </Typography>
                    <img
                        src='/images/illustrations/connection-lost.svg'
                        alt='connection-lost'
                        style={{ width: '100%', maxWidth: '500px' }}
                    />
                </Box>
            )}
            {wallet.address !== null && (
                <Grid container marginTop={3}>
                    <Grid item xs={12} md={6}>
                        <ProjectCollaborators />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <GuestCollaborators />
                    </Grid>
                </Grid>
            )}
        </>
    );
}
