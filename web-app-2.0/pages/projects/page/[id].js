import { Backdrop, Button, Chip, CircularProgress, Fade, Grid, Link, Paper, Stack, Typography } from '@mui/material';
import React from 'react';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { ProjectsContext } from '../../../contexts/projects-context';
import { Box } from '@mui/system';
import Head from 'next/head';
import moment from 'moment';
import ProjectInformation from '../../../components/pages/projects/project-information';
import { WalletContext } from '../../../contexts/wallet-context';

export default function ProjectPage(props) {
    const router = useRouter();
    const { id } = router.query;
    const projectsContext = React.useContext(ProjectsContext);

    const [loading, setLoading] = React.useState(true);
    const [project, setProject] = React.useState(null);

    const wallet = React.useContext(WalletContext);

    React.useEffect(() => {
        if (router.isReady && wallet.address) {
            setLoading(true);
            projectsContext
                .getProject(id)
                .then((project) => {
                    console.log(project);
                    setProject(project);
                })
                .catch((err) => {
                    console.error(err);
                })
                .finally(() => {
                    setLoading(false);
                });
        }
    }, [id, wallet.address]);

    return (
        <>
            <Head>
                <title>{project === null ? 'GoingUP Project' : `${project?.name} `}</title>
            </Head>
            <Grid container sx={{ mb: 3 }} rowSpacing={2}>
                <Grid item xs={12} md={6}>
                    <Typography variant="h1">{project === null ? 'Loading Project...' : project.name}</Typography>
                </Grid>
                <Grid item xs={12} md={6} sx={{ textAlign: { xs: 'initial', md: 'right' } }}></Grid>
            </Grid>

            <Fade in={!loading}>
                <Box>
                    <ProjectInformation id={id} project={project} />
                </Box>
            </Fade>

            <Backdrop open={loading} sx={{ zIndex: 1200 }}>
                <CircularProgress />
            </Backdrop>
        </>
    );
}
