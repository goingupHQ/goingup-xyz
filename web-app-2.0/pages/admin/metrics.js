import React, { useContext, useEffect, useState } from 'react'
import { Backdrop, CircularProgress, Grid, Paper, Typography } from '@mui/material';
import Head from 'next/head';
import { ethers } from 'ethers';
import { useSnackbar } from 'notistack';
import { ProjectsContext } from '../../contexts/projects-context';

export default function Metrics(props) {
    // const polygonProvider = new ethers.providers.JsonRpcProvider(`https://polygon-rpc.com`);
    // const mumbaiProvider = new ethers.providers.JsonRpcProvider(`https://matic-mumbai.chainstacklabs.com`);
    const { enqueueSnackbar } = useSnackbar();

    const { getProjectsCount } = useContext(ProjectsContext);

    const [userCount, setUserCount] = useState(0);
    const [projectsCount, setProjectsCount] = useState(0);
    const [utilityTokens, setUtilityTokens] = useState([]);

    const [loading, setLoading] = useState(false);
    const loadMetrics = async () => {
        setLoading(true);

        try {
            // get user count from api
            const userCountResponse = await fetch('/api/admin/user-count');
            const userCountData = await userCountResponse.json();
            setUserCount(userCountData.userCount);

            // get projects count from context
            const _projectsCount = await getProjectsCount();
            setProjectsCount(_projectsCount);

            // get tokens from token settings
            const tokensResponse = await fetch('/api/utility-tokens/all');
            const tokensData = await tokensResponse.json();
            setUtilityTokens(tokensData);
        } catch (error) {
            console.error(error);
            enqueueSnackbar('Error loading metrics', { variant: 'error' });
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadMetrics();
    }, []);

    return (
        <>
            <Head>
                <title>Metrics</title>
            </Head>

            <Typography variant="h1" sx={{ my: 2 }}>
                Metrics
            </Typography>

            <Grid container spacing={2}>
                <Grid item xs={6} md={3}>
                    <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                        <Typography variant="body1">
                            Users Count
                        </Typography>

                        <Typography variant="h1" sx={{ fontSize: '6rem'}}>
                            {userCount}
                        </Typography>
                    </Paper>
                </Grid>

                <Grid item xs={6} md={3}>
                    <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                        <Typography variant="body1">
                            Projects Count
                        </Typography>

                        <Typography variant="h1" sx={{ fontSize: '6rem'}}>
                            {projectsCount}
                        </Typography>
                    </Paper>
                </Grid>
            </Grid>

            <Typography variant="h1" sx={{ my: 2 }}>
                Utility Tokens Supply
            </Typography>
            <Grid container spacing={2}>
                {utilityTokens.map((token, index) => (
                    <Grid key={index} item xs={6} md={3}>
                        <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                            <Typography variant="body1">
                                {token.description}
                            </Typography>

                            <Paper component="img" src={token.metadata.image} alt={token.description} width="100" />

                            <Typography variant="h1">
                                {token.supply}
                            </Typography>
                        </Paper>
                    </Grid>
                ))}
            </Grid>

            <Backdrop open={loading} sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}>
                <CircularProgress color="inherit" />
            </Backdrop>
        </>
    )
}
