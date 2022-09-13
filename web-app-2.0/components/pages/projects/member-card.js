import { Box, Button, CircularProgress, Paper, Stack, Typography } from '@mui/material';
import React from 'react';
import ProfileLink from '../../common/profile-link';
import { ProjectsContext } from '../../../contexts/projects-context';
import { LoadingButton } from '@mui/lab';
import { useSnackbar } from 'notistack';

export default function MemberCard(props) {
    const { projectId, member, reload } = props;
    const projectsContext = React.useContext(ProjectsContext);

    const [memberData, setMemberData] = React.useState(null);
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();

    const [loading, setLoading] = React.useState(true);
    const load = async () => {
        setLoading(true);
        try {
            const result = await projectsContext.getProjectMember(projectId, member);
            setMemberData(result);
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    };

    React.useEffect(() => {
        if (projectId && member) {
            load();
        }
    }, [projectId, member]);

    const [removing, setRemoving] = React.useState(false);
    const removeMember = async () => {
        setRemoving(true);
        try {
            const tx = await projectsContext.removeProjectMember(projectId, member);

            const shortTxHash = tx.hash.substr(0, 6) + '...' + tx.hash.substr(tx.hash.length - 4, 4);
            const key = enqueueSnackbar(`Remove member transaction submitted (${shortTxHash})`, {
                variant: 'info',
                action: (key) => (
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => {
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
                enqueueSnackbar('Remove transaction confirmed', {
                    variant: 'success',
                });
                setRemoving(false);
                if (reload) reload();
            });
        } catch (err) {
            console.log(err);
            setRemoving(false);
        }
    };

    const [settingAsAchieved, setSettingAsAchieved] = React.useState(false);
    const setGoalAsAchieved = async () => {
        setSettingAsAchieved(true);
        try {
            const tx = await projectsContext.setMemberGoalAsAchieved(projectId, member);

            const shortTxHash = tx.hash.substr(0, 6) + '...' + tx.hash.substr(tx.hash.length - 4, 4);
            const key = enqueueSnackbar(`Set as achieved transaction submitted (${shortTxHash})`, {
                variant: 'info',
                action: (key) => (
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => {
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
                enqueueSnackbar('Set as achieved transaction confirmed', {
                    variant: 'success',
                });
                setSettingAsAchieved(false);
                if (reload) reload();
            });
        } catch (err) {
            console.log(err);
            setSettingAsAchieved(false);
        }
    };

    return (
        <Paper sx={{ p: 3 }}>
            {loading && (
                <Box sx={{ p: '20px', textAlign: 'center' }}>
                    <CircularProgress />
                </Box>
            )}

            {!loading && (
                <Stack direction="column" spacing={1}>
                    <ProfileLink address={member} textSx={{ fontWeight: 'bold', fontSize: 'larger' }} />
                    <Typography variant="body1">
                        Role: <b>{memberData.role}</b>
                    </Typography>
                    <Typography variant="body1">
                        Goal: <b>{memberData.goal}</b>
                    </Typography>
                    <Stack direction={{ xs: 'column', md: 'row' }} spacing={1}>
                        <LoadingButton
                            variant="contained"
                            color="primary"
                            loading={settingAsAchieved}
                            loadingIndicator={<CircularProgress size={14} />}
                            onClick={setGoalAsAchieved}
                        >
                            Set Goal As Achieved
                        </LoadingButton>
                        <LoadingButton
                            variant="contained"
                            color="secondary"
                            loading={removing}
                            loadingIndicator={<CircularProgress size={14} />}
                            onClick={removeMember}
                        >
                            Remove
                        </LoadingButton>
                    </Stack>
                </Stack>
            )}
        </Paper>
    );
}
