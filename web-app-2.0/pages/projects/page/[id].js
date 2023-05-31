import { Grid, Stack, Typography } from '@mui/material';
import React from 'react';
import { useRouter } from 'next/router';
import { ProjectsContext } from '../../../contexts/projects-context';
import { Box } from '@mui/system';
import Head from 'next/head';
import NoSSR from 'react-no-ssr';
import ProjectInformation from '../../../components/pages/projects/project-information';
import { WalletContext } from '../../../contexts/wallet-context';
import ProjectMembers from '../../../components/pages/projects/project-members';
import LoadingIllustration from '../../../components/common/loading-illustration';
import WrongNetwork from '../../../components/pages/projects/wrong-network';

export default function ProjectPage(props) {
    const router = useRouter();
    const { id } = router.query;
    const projectsContext = React.useContext(ProjectsContext);

    const [loading, setLoading] = React.useState(true);
    const [project, setProject] = React.useState(null);

    const wallet = React.useContext(WalletContext);

    const load = async () => {
        setLoading(true);
        try {
            let project;
            while (!project) {
                project = await projectsContext.getProject(id);
                if (!project) {
                    await new Promise(resolve => setTimeout(resolve, 1000));
                } else {
                    setProject(project);
                }
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    React.useEffect(() => {
        if (router.isReady && wallet.address) {
            load();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id, wallet.address]);

    return (
        <>
            <Head>
                <title>{project === null ? 'GoingUP Project' : `${project?.name} `}</title>
            </Head>

            {projectsContext.isCorrectNetwork && wallet.address &&
            <NoSSR>
                <Grid container sx={{ mb: 3 }} rowSpacing={2}>
                    <Grid item xs={12} md={6}>
                        <Typography variant="h1">{project === null ? 'Loading Project...' : project.name}</Typography>
                    </Grid>
                </Grid>


                {!loading && router.isReady &&
                    <Stack direction="column" spacing={3}>
                        <ProjectInformation id={id} project={project} />

                        <ProjectMembers id={id} project={project} />
                    </Stack>
                }

                {loading &&
                    <Box sx={{ py: '60px', textAlign: 'center' }}>
                        <LoadingIllustration />
                    </Box>
                }
            </NoSSR>
            }

            {!projectsContext.isCorrectNetwork && <WrongNetwork />}


        </>
    );
}
