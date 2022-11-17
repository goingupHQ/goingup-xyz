import { Button, Stack, Typography } from '@mui/material';
import { useSnackbar } from 'notistack';
import React from 'react';
import { ProjectsContext } from '../../../contexts/projects-context';

export default function WrongNetwork(props) {
    const projectsContext = React.useContext(ProjectsContext);
    const { enqueueSnackbar } = useSnackbar();
    return (
        <Stack justifyContent="center" alignItems="center" direction="column" spacing={4}>
            <Typography variant="h2">
                You need to switch to {projectsContext.networkParams.chainName} to access Projects
            </Typography>

            <img
                src="/images/illustrations/nakamoto.svg"
                alt="connection-lost"
                style={{ width: '100%', maxWidth: '500px' }}
            />

            <Button
                variant="contained"
                color="primary"
                size="large"
                onClick={() => {
                    try {
                        projectsContext.switchNetwork();
                    } catch (e) {
                        if (typeof e === 'string') {
                            enqueueSnackbar(e, { variant: 'error' });
                        } else {
                            console.error(e);
                        }
                    }
                }}
            >
                Switch to {projectsContext.networkParams.chainName}
            </Button>
        </Stack>
    );
}
