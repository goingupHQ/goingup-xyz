import React, { useContext, useEffect } from 'react';
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
import { AppContext } from '@/contexts/AppContext';
import Collaborators from './collaborators';

function CreateAccount() {
    const wallet = useContext(WalletContext);
    const app = useContext(AppContext);

    useEffect(() => {
        console.log(app);
    },[]);

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
                <Grid item xs={12}>
                    <PotentialCollaborators />
                </Grid>
                {app?.availability.map(item => {return (
                    <Grid key={item.id} item xs={12} md={6}>
                        <Collaborators availabilityId={item.id} />
                    </Grid>
                )})}
            </Grid>
        </>
    );
}

CreateAccount.getLayout = (page) => (
    <TopNavigationLayout>{page}</TopNavigationLayout>
);

export default CreateAccount;
