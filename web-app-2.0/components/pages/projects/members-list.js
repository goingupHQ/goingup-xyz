import { Grid, Stack, Typography } from '@mui/material';
import { Box } from '@mui/system';
import React from 'react';
import { ProjectsContext } from '../../../contexts/projects-context';
import LoadingIllustration from '../../common/loading-illustration';
import InviteMemberModal from './invite-member-modal';
import MemberCard from './member-card';

function MembersList(props, ref) {
    const { projectId, project } = props;
    const projectsContext = React.useContext(ProjectsContext);
    const inviteMemberModalRef = React.useRef(null);

    React.useImperativeHandle(ref, () => ({
        showInviteMemberModal() {
            inviteMemberModalRef.current.showModal();
        },
    }));

    const [loading, setLoading] = React.useState(true);
    const [members, setMembers] = React.useState([]);
    const load = async () => {
        setLoading(true);
        try {
            const result = await projectsContext.getProjectMembers(projectId); console.log('result', result);
            setMembers(result);
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    };

    React.useEffect(() => {
        if (projectId) {
            load();
        }
    }, [projectId]);

    return (
        <>
            {loading && (
                <LoadingIllustration />
            )}

            {!loading && (
                <>
                    {members.length === 0 && (
                        <Stack direction="column" spacing={4} alignItems="center">
                            <Typography variant="h2">No members yet</Typography>
                            <Box
                                component="img"
                                src="/images/illustrations/join.svg"
                                sx={{ width: '100%', maxWidth: { xs: 320 } }}
                            />
                            <Typography variant="body1">Invite members to your project</Typography>
                        </Stack>
                    )}

                    {members.length > 0 && (
                        <Grid container spacing={2}>
                            {members.map((member) => (
                                <Grid item xs={12} md={6} lg={4} key={member}>
                                    <MemberCard projectId={projectId} member={member} reload={load} />
                                </Grid>
                            ))}
                        </Grid>
                    )}
                </>
            )}

            <InviteMemberModal id={projectId} project={project} reload={load} ref={inviteMemberModalRef} />
        </>
    );
}

export default React.forwardRef(MembersList);
