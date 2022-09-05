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
<<<<<<< HEAD
        if (router.isReady && wallet.address) {
=======
        //
        if (router.isReady) {
>>>>>>> a6cb1454fc8deedfe73b07d9a5a692c362f4b457
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
<<<<<<< HEAD
    }, [id, wallet.address]);
=======
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);
>>>>>>> a6cb1454fc8deedfe73b07d9a5a692c362f4b457

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
<<<<<<< HEAD
                <Box>
                    <ProjectInformation id={id} project={project} />
                </Box>
=======
                <Paper sx={{ padding: 3 }}>
                    <Grid container rowSpacing={3}>
                        <Grid item xs={12}>
                            <Grid container>
                                <Grid item xs={12} md={6}>
                                    <Typography variant="h2">Project Information</Typography>
                                </Grid>
                                <Grid item xs={12} md={6} sx={{ textAlign: { xs: 'initial', md: 'right' } }}>
                                    <NextLink href={`/projects/edit/${id}`} passHref>
                                        <Button variant="contained" color="primary" size="large">
                                            Edit this Project
                                        </Button>
                                    </NextLink>
                                </Grid>
                            </Grid>
                        </Grid>

                        <Grid item xs={12}>
                            <Typography variant="body1" color="GrayText">
                                Description
                            </Typography>
                            <Typography variant="body1">{project?.description}</Typography>
                        </Grid>

                        <Grid item xs={12}>
                            <Typography variant="body1" color="GrayText">
                                Project URL
                            </Typography>
                            <Link href={project?.primaryUrl} target="_blank">
                                <Typography variant="body1" sx={{ textDecoration: 'underline' }}>
                                    {project?.primaryUrl}
                                </Typography>
                            </Link>
                        </Grid>

                        <Grid item xs={12} md={6} lg={4}>
                            <Typography variant="body1" color="GrayText">
                                Started
                            </Typography>
                            <Typography variant="body1">
                                {project?.started?.toNumber() ? moment(project?.started.toNumber() * 1000).format('LL') : 'None'}
                            </Typography>
                        </Grid>

                        <Grid item xs={12} md={6} lg={4}>
                            <Typography variant="body1" color="GrayText">
                                Ended
                            </Typography>
                            <Typography variant="body1">
                                {project?.ended?.toNumber() ? moment(project?.ended.toNumber() * 1000).format('LL') : 'None'}
                            </Typography>
                        </Grid>

                        <Grid item xs={12}>
                            <Typography variant="body1" color="GrayText">
                                Tags
                            </Typography>
                            <Stack direction="row" spacing={1}>
                                {project?.tags?.split(',').map((tag) => (
                                    <Chip key={p.id} label={tag.trim()} />
                                ))}
                            </Stack>
                        </Grid>
                    </Grid>
                </Paper>
>>>>>>> a6cb1454fc8deedfe73b07d9a5a692c362f4b457
            </Fade>

            <Backdrop open={loading} sx={{ zIndex: 1200 }}>
                <CircularProgress />
            </Backdrop>
        </>
    );
}
