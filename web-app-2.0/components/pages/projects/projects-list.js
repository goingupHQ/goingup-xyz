import React, { useContext, useEffect, useState } from 'react';
import { ProjectsContext } from '../../../contexts/projects-context';
import { Backdrop, Button, CircularProgress, Stack, Typography } from '@mui/material';
import { useRouter } from 'next/router';

export default function ProjectsList(props) {
    const router = useRouter();
    const projectsContext = useContext(ProjectsContext);
    const [loading, setLoading] = useState(true);
    const [projects, setProjects] = useState([]);

    const load = async () => {
        setLoading(true);
        try {
            setProjects(await projectsContext.getProjects());
        } catch (err) {
            enqueueSnackbar('There was an error loading your projects', { variant: 'error' });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        load();
    }, []);

    return (
        <>
            {!loading && (
                <>
                    {projects.length === 0 && (
                        <Stack justifyContent="center" alignItems="center" direction="column" spacing={4}>
                            <Typography variant="h2">
                                You have not created a project yet
                            </Typography>

                            <img
                                src="/images/illustrations/empty-box.svg"
                                alt="connection-lost"
                                style={{ width: '100%', maxWidth: '500px' }}
                            />

                            <Button
                                variant="contained"
                                color="primary"
                                size="large"
                                onClick={() => router.push('/projects/create')}
                            >
                                Create your first Project
                            </Button>
                        </Stack>
                    )}
                </>
            )}
            <Backdrop open={loading}>
                <CircularProgress />
            </Backdrop>
        </>
    );
}