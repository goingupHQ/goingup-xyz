import Head from 'next/head';
import { Box, Button, Stack, Typography } from '@mui/material';
import { AppContext } from '../../contexts/app-context';
import { useContext } from 'react';
import { WalletContext } from '../../contexts/wallet-context';
import { ProjectsContext } from '../../contexts/projects-context';
import ProjectsList from '../../components/pages/projects/projects-list';

export default function Projects() {
    const app = useContext(AppContext);
    const wallet = useContext(WalletContext);
    const projectsContext = useContext(ProjectsContext);

    return (
        <>
            <Head>
                <title>GoingUP: Projects</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <Box sx={{ paddingTop: '20px' }}>
                {wallet.address === null && (
                    <Stack justifyContent="center" alignItems="center" direction="column" spacing={4}>
                        <Typography variant="h2">
                            You need a connected wallet with a GoingUP account to access Projects
                        </Typography>
                        <img
                            src="/images/illustrations/connection-lost.svg"
                            alt="connection-lost"
                            style={{ width: '100%', maxWidth: '500px' }}
                        />
                    </Stack>
                )}

                {wallet.address !== null && (
                    <>
                        {!projectsContext.isCorrectNetwork && (
                            <Stack justifyContent="center" alignItems="center" direction="column" spacing={4}>
                                <Typography variant="h2">
                                    You need to switch to {projectsContext.networkParams.chainName} to access Projects
                                </Typography>

                                <img
                                    src="/images/illustrations/page-lost.svg"
                                    alt="connection-lost"
                                    style={{ width: '100%', maxWidth: '500px' }}
                                />

                                <Button variant="contained" color="primary" size="large" onClick={projectsContext.switchToCorrectNetwork}>
                                    Switch to {projectsContext.networkParams.chainName}
                                </Button>
                            </Stack>
                        )}

                        {projectsContext.isCorrectNetwork && (
                            <>
                                <ProjectsList />
                            </>
                        )}
                    </>
                )}
            </Box>
        </>
    );
}
