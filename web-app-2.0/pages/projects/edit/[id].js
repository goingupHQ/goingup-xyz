import Head from 'next/head';
import React, { useState, useContext, useEffect } from 'react';
import { ProjectsContext } from '../../../contexts/projects-context';
import ProjectForm from '../../../components/pages/projects/project-form';
import { useRouter } from 'next/router';
import { Backdrop, CircularProgress } from '@mui/material';
import { useSnackbar } from 'notistack';
import WrongNetwork from '../../../components/pages/projects/wrong-network';
import { WalletContext } from '../../../contexts/wallet-context';

export default function EditProject() {
    const projectsContext = useContext(ProjectsContext);
    const [data, setData] = useState(null);
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const { enqueueSnackbar } = useSnackbar();
    const wallet = useContext(WalletContext);

    const getProject = async () => {
        setLoading(true);
        try {
            setData(await projectsContext.getProject(router.query.id));
        } catch (err) {
            enqueueSnackbar('There was an error loading your project', { variant: 'error' });
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (router.isReady && wallet.address) {
            getProject();
        }
    }, [router.isReady, wallet.address]);

    return (
        <>
            <Head>
                <title>Going UP - Edit A Project</title>
            </Head>

            {!projectsContext.isCorrectNetwork && <WrongNetwork />}

            {projectsContext.isCorrectNetwork && (
                <>
                    <ProjectForm projectData={data} />

                    <Backdrop open={loading} sx={{ zIndex: 1200 }}>
                        <CircularProgress />
                    </Backdrop>
                </>
            )}
        </>
    );
}
