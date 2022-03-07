import React, { useContext } from 'react';
import Head from 'next/head';
import { WalletContext } from 'src/contexts/WalletContext';
import TopNavigationLayout from 'src/layouts/TopNavigationLayout';
import {
    Grid,
    Card,
    CardHeader,
    CardContent,
    Typography,
    styled,
    Button,
    Fade
} from '@mui/material';
import PotentialCollaborators from './potential-collaborators';

function CreateAccount() {
    const wallet = useContext(WalletContext);

    return (
        <>
            <Head>
                <title>Dashboard</title>
            </Head>
            <Grid
                sx={{ px: { xs: 2, md: 4 } }}
                container
                direction="row"
                justifyContent="center"
                alignItems="stretch"
                spacing={3}
            >
                <Fade in={true} timeout={1000}>
                    <Grid item xs={12}>
                        <PotentialCollaborators />
                    </Grid>
                    {/* <Grid item xs={12} md={6}>
                    </Grid>
                    <Grid item xs={12} md={6}>
                    </Grid> */}
                </Fade>
            </Grid>
        </>
    );
}

CreateAccount.getLayout = (page) => (
    <TopNavigationLayout>{page}</TopNavigationLayout>
);

export default CreateAccount;
