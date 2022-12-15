import Head from 'next/head';
import { Grid, Stack, Typography } from '@mui/material';
import { AppContext } from '../../contexts/app-context';
import { useContext } from 'react';
import GuestCollaborators from '../../components/pages/collaborators/GuestCollaborators';
import ProjectCollaborators from '../../components/pages/collaborators/ProjectCollaborators';

export default function Collaborators() {
    const app = useContext(AppContext);

    return (
        <>
            <Head>
                <title>GoingUP: Collaborators</title>
            </Head>

            {/* <Typography variant='h1'>Collaborators</Typography> */}
            <Grid container marginTop={3}>
                <Grid item xs={12} md={6}>
                    <ProjectCollaborators />
                </Grid>
                <Grid item xs={12} md={6}>
                    <GuestCollaborators />
                </Grid>
            </Grid>
        </>
    );
}
