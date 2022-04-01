import React, { useContext, useEffect, useState, useRef } from 'react';
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
    Backdrop,
    Alert,
    Fade,
    CircularProgress,
    Button
} from '@mui/material';
import ProjectForm from './project-form';
import ProjectsList from '../../src/components/common/ProjectsList';

const CardContentWrapper = styled(CardContent)(
    () => `
        position: relative;
  `
);

function Projects() {
    const wallet = useContext(WalletContext);
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);

    const formRef = useRef(null);
    const loadProjects = async () => {
        setLoading(true);
        try {
            const response = await fetch(
                `/api/get-account?address=${wallet.address}`
            );
            const result = await response.json();
            if (result.projects) setProjects(result.projects);
            else setProjects([]);
            console.log(result.proejcts);
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadProjects();
    }, [wallet.address]);

    return (
        <>
            <Head>
                <title>Project</title>
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
                    <Fade in={true} timeout={1000}>
                        <Card
                            sx={{
                                height: '100%',
                                display: 'flex',
                                flexDirection: 'column',
                                marginTop: { xs: '2rem', md: '3rem' }
                            }}
                        >
                            <CardHeader
                                sx={{
                                    px: 3,
                                    pt: 3,
                                    alignItems: 'flex-start'
                                }}
                                title={
                                    <>
                                        <Typography variant="h1">
                                            Projects
                                        </Typography>
                                    </>
                                }
                            />
                            <CardContentWrapper
                                sx={{
                                    px: 3,
                                    pt: 0
                                }}
                            >
                                {!wallet.address && (
                                    <Alert severity="error">
                                        You need to connect your wallet first
                                    </Alert>
                                )}

                                {projects?.length === 0 && (
                                    <>
                                        <Alert severity="warning">
                                            You have no projects yet
                                        </Alert>
                                        <Button
                                            variant="contained"
                                            sx={{ marginTop: 2 }}
                                            onClick={() =>
                                                formRef.current.show('create')
                                            }
                                        >
                                            Add your first project
                                        </Button>
                                    </>
                                )}

                                {projects?.length > 0 && (
                                    <>
                                        <Button
                                            variant="contained"
                                            sx={{ marginTop: 2, marginBottom: 2 }}
                                            onClick={() =>
                                                formRef.current.show('create')
                                            }
                                        >
                                            Add Project
                                        </Button>
                                        <ProjectsList projects={projects} formRef={formRef} />
                                    </>
                                )}
                            </CardContentWrapper>
                        </Card>
                    </Fade>
                </Grid>
            </Grid>

            <ProjectForm ref={formRef} loadProjects={loadProjects} />

            <Backdrop open={loading}>
                <CircularProgress />
            </Backdrop>
        </>
    );
}

Projects.getLayout = (page) => (
    <TopNavigationLayout>{page}</TopNavigationLayout>
);

export default Projects;
