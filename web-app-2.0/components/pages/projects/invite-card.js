import React from 'react';
import { Button, CircularProgress, Paper, Stack, Typography } from '@mui/material';
import ProfileLink from '../../common/profile-link';
import { ProjectsContext } from '../../../contexts/projects-context';
import { LoadingButton } from '@mui/lab';
import { useSnackbar } from 'notistack';

export default function InviteCard(props) {
    const { projectId, memberRecordId, reload } = props;
    const projectCtx = React.useContext(ProjectsContext);
    const { enqueueSnackbar } = useSnackbar();

    const [loading, setLoading] = React.useState(true);
    const [member, setMember] = React.useState(null);

    const load = async () => {
        setLoading(true);
        try {
            const memberData = await projectCtx.getProjectMember(memberRecordId);
            setMember(memberData);
        } catch (err) {
            console.log(err);
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

    const [disinviting, setDisinviting] = React.useState(false);
    const disinvite = async () => {
        setDisinviting(true);
        try {
            const tx = await projectCtx.disinviteProjectMember(projectId, memberRecordId);
            enqueueSnackbar('Disinvite transaction submitted', { variant: 'info' });
            await tx.wait();
            enqueueSnackbar('Member disinvited', { variant: 'success' });
            if (reload) reload();
        } catch (err) {
            console.log(err);
            enqueueSnackbar('Error disinviting member', { variant: 'error' });
        } finally {
            setDisinviting(false);
        }
    };

    return (
        <>
            <Paper variant="outlined" sx={{ padding: 3, height: '100%', alignItems: 'stretch' }}>
                <Stack direction="column" spacing={2} alignItems="flex-start">
                    <ProfileLink address={member?.address} />

                    {loading && <CircularProgress size={12} />}

                    {!loading &&
                    <>
                        <Typography variant="body1">
                            {member?.role}
                        </Typography>

                        <LoadingButton variant="contained" color="primary" size="small" loading={disinviting} loadingIndicator={<CircularProgress size={14} />} onClick={disinvite}>
                            Disinvite
                        </LoadingButton>
                    </>
                    }
                </Stack>
            </Paper>
        </>
    );
}
