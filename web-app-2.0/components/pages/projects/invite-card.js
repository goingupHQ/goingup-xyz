import React from 'react';
import { Button, CircularProgress, Paper, Stack, Typography } from '@mui/material';
import ProfileLink from '../../common/profile-link';
import { ProjectsContext } from '../../../contexts/projects-context';

export default function InviteCard(props) {
    const { address, projectId } = props;
    const projectCtx = React.useContext(ProjectsContext);

    const [loading, setLoading] = React.useState(true);
    const [member, setMember] = React.useState(null);

    const load = async () => {
        setLoading(true);
        try {
            const memberData = await projectCtx.getProjectMember(projectId, address);
            setMember(memberData);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    React.useEffect(() => {
        if (address) {
            load();
        }
    }, [address]);

    return (
        <>
            <Paper variant="outlined" sx={{ padding: 3, height: '100%', alignItems: 'stretch' }}>
                <Stack direction="column" spacing={2} alignItems="flex-start">
                    <ProfileLink address={address} />

                    {loading && <CircularProgress size={12} />}

                    {!loading &&
                    <>
                        <Typography variant="body1">
                            {member?.role}
                        </Typography>

                        <Button variant="contained" color="primary" size="small" onClick={() => {}}>
                            Disinvite
                        </Button>
                    </>
                    }
                </Stack>
            </Paper>
        </>
    );
}
