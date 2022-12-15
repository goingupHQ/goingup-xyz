import { LoadingButton } from '@mui/lab';
import { Box, CircularProgress, Paper, Stack, Typography, Button } from '@mui/material';
import { useSnackbar } from 'notistack';
import React from 'react';
import { ProjectsContext } from '../../../contexts/projects-context';

export default function PendingInviteCard(props) {
    const { memberRecordId, reload } = props;
    const [loading, setLoading] = React.useState(false);
    const [invite, setInvite] = React.useState(null);

    const { enqueueSnackbar, closeSnackbar } = useSnackbar();

    const projectsContext = React.useContext(ProjectsContext);

    const load = async () => {
        setLoading(true);

        try {
            const memberData = await projectsContext.getProjectMember(memberRecordId);
            const project = await projectsContext.getProject(memberData.projectId);

            setInvite({
                projectId: memberData.projectId,
                project,
                memberData
            });
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    React.useEffect(() => {
        //
        if (memberRecordId) {
            load();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [memberRecordId]);

    const [accepting, setAccepting] = React.useState(false);
    const acceptProjectInvite = async () => {
        setAccepting(true);
        try {
            const tx = await projectsContext.acceptProjectInvite(memberRecordId);
            const shortTxHash = tx.hash.substr(0, 6) + '...' + tx.hash.substr(tx.hash.length - 4, 4);
            const key = enqueueSnackbar(`Accept project invitation tx submitted (${shortTxHash})`, {
                variant: 'info',
                action: (key) => (
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => {
                            console.log('hello' + key);
                            window.open(`${projectsContext.networkParams.blockExplorerUrls[0]}tx/${tx.hash}`, '_blank');
                        }}
                    >
                        Open in Block Explorer
                    </Button>
                ),
                persist: true,
            });

            tx.wait().then((receipt) => {
                closeSnackbar(key);
                enqueueSnackbar('Accept project invitation tx confirmed', {
                    variant: 'success',
                });
                setAccepting(false);
                if (reload) reload();
            });
        } catch (e) {
            console.error(e);
            setAccepting(false);
        }
    };

    return (
        <>
            <Paper>
                {loading &&
                    <Box sx={{ minHeight: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <CircularProgress />
                    </Box>
                }

                {!loading && invite &&
                    <Stack direction="column" spacing={0} sx={{ p: 2 }}>
                        <Typography variant="body1">
                            Project: <b>{invite?.project?.name}</b>
                        </Typography>
                        <Typography variant="body1">
                            Role: <b>{invite?.memberData?.role}</b>
                        </Typography>
                        <Typography variant="body1">
                            Goal: <b>{invite?.memberData?.goal}</b>
                        </Typography>
                        <Box sx={{ mt: 2 }}>
                            <LoadingButton
                                variant="contained"
                                sx={{ mr: 1 }}
                                loading={accepting}
                                loadingIndicator={<CircularProgress size={14} />}
                                onClick={() => acceptProjectInvite(invite?.memberData?.id)}
                            >
                                Accept
                            </LoadingButton>

                            {/* <Button variant="contained" color="secondary" onClick={() => projectsContext.rejectInvite(invite.id)}>
                                        Reject
                                    </Button> */}
                        </Box>
                    </Stack>
                }
            </Paper>
        </>
    );
}
