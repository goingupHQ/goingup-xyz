import { Box, Button, CircularProgress, Paper, Stack, Typography } from '@mui/material';
import React from 'react';
import ProfileLink from '../../common/profile-link';
import { ProjectsContext } from '../../../contexts/projects-context';
import { LoadingButton } from '@mui/lab';
import { useSnackbar } from 'notistack';
import { WalletContext } from '../../../contexts/wallet-context';
import SendAppreciationToken from '../../common/SendAppreciationToken';

export default function MemberCard(props) {
    const { projectId, project, memberRecordId, reload } = props;
    const projectsContext = React.useContext(ProjectsContext);

    const [memberData, setMemberData] = React.useState(null);
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();

    const wallet = React.useContext(WalletContext);

    const satRef = React.useRef(null);

    const [loading, setLoading] = React.useState(true);
    const load = async () => {
        setLoading(true);
        try {
            const result = await projectsContext.getProjectMember(memberRecordId);

            // const rewardsResponse = await fetch(
            //     `/api/projects/rewards/get-by-member?projectId=${projectId}&member=${member}`
            // );

            // if (rewardsResponse.ok) {
            //     const rewards = await rewardsResponse.json();
            //     result.rewards = rewards;

            //     setSendingReward(result.rewards?.unverified?.length > 0 && result.rewards?.verified?.length === 0);

            //     setTimeout(() => {
            //         load();
            //     }, 6 * 1000 * 60);

            //     setRewardVerified(result.rewards?.verified?.length > 0);
            // }
            setMemberData(result);

        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    };

    React.useEffect(() => {
        //
        if (projectId && memberRecordId) {
            load();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [projectId, memberRecordId]);

    const [removing, setRemoving] = React.useState(false);
    const removeMember = async () => {
        setRemoving(true);
        try {
            const tx = await projectsContext.removeProjectMember(projectId, memberData.id);

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
            const tx = await projectsContext.setMemberGoalAsAchieved(projectId, memberData.id);

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
                load();
            });
        } catch (err) {
            console.log(err);
            setSettingAsAchieved(false);
        }
    };

    const [sendingReward, setSendingReward] = React.useState(false);
    const [rewardVerified, setRewardVerified] = React.useState(false);
    const sendReward = async () => {
        const rewardType = memberData.reward.type;

        if (rewardType === 'pro-bono') {
            enqueueSnackbar('This member has a reward type of pro-bono', { variant: 'info' });
            return;
        }

        if (rewardType === 'goingup-utility') {
            satRef.current.openFromProjectMember(projectId, memberData, () => { load() });
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
                    <ProfileLink address={memberData?.address} textSx={{ fontWeight: 'bold', fontSize: 'larger' }} />
                    <Typography variant="body1">
                        Role: <b>{memberData?.role}</b>
                    </Typography>
                    <Typography variant="body1">
                        Goal: <b>{memberData?.goal}</b>
                    </Typography>
                    <Typography variant="body1">
                        Achieved: <b>{memberData?.goalAchieved ? 'Yes' : 'No'}</b>
                    </Typography>

                    {project?.owner === wallet.address && (
                        <Stack direction={{ xs: 'column', md: 'row' }} spacing={1}>
                            {!memberData?.goalAchieved && (
                                <LoadingButton
                                    variant="contained"
                                    color="primary"
                                    loading={settingAsAchieved}
                                    loadingIndicator={<CircularProgress size={14} />}
                                    onClick={setGoalAsAchieved}
                                >
                                    Set Goal As Achieved
                                </LoadingButton>
                            )}

                            {memberData?.goalAchieved && (
                                <LoadingButton
                                    variant="contained"
                                    color="primary"
                                    loading={sendingReward}
                                    loadingIndicator={<CircularProgress size={14} />}
                                    onClick={sendReward}
                                    disabled={rewardVerified}
                                >
                                    {rewardVerified ? 'Reward Verified' : 'Send Reward'}
                                </LoadingButton>
                            )}

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
                    )}
                </Stack>
            )}

            <SendAppreciationToken ref={satRef} sendToAddress={memberData?.address} onSent={load} />
        </Paper>
    );
}
