import { Button, CircularProgress, Grid, Paper, Stack, Tabs, Tab, Typography } from '@mui/material';
import React from 'react';
import { ProjectsContext } from '../../../contexts/projects-context';
import SectionHeader from '../../common/section-header';
import InviteMemberModal from './invite-member-modal';
import InvitesList from './invites-list';
import MembersList from './members-list';

export default function ProjectMembers(props) {
    const { id, project } = props;
    const projectsContext = React.useContext(ProjectsContext);

    const [loading, setLoading] = React.useState(true);
    const [members, setMembers] = React.useState([]);
    const [pendingInvites, setPendingInvites] = React.useState([]);

    const inviteMemberModalRef = React.useRef(null);

    const [tab, setTab] = React.useState(0);

    const load = async () => {
        setLoading(true);
        try {
            const result = await projectsContext.getMembersAndInvites(id);
            setMembers(result.members);
            setPendingInvites(result.pendingInvites);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    React.useEffect(() => {
        //
        load();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    return (
        <Paper variant="outlined" sx={{ padding: 3 }}>
            <Grid container rowSpacing={3}>
                <Grid item xs={12}>
                    <SectionHeader title="Project Membership">
                        <Button
                            variant="contained"
                            color="primary"
                            size="large"
                            onClick={() => inviteMemberModalRef.current.showModal()}
                        >
                            Invite A Member
                        </Button>
                    </SectionHeader>
                </Grid>

                <Tabs variant="standard" value={tab} onChange={(e, v) => setTab(v)}>
                    <Tab label="Members" sx={{ fontSize: '14pt' }} />
                    <Tab label="Pending Invites" sx={{ fontSize: '14pt' }} />
                </Tabs>

                {loading && (
                    <Grid item xs={12} sx={{ textAlign: 'center' }}>
                        <Stack direction="column" spacing={2} alignItems="center">
                            <CircularProgress />
                            <img src="/images/illustrations/processing.svg" alt="Processing" width="320px" />
                        </Stack>
                    </Grid>
                )}

                {!loading && tab === 0 && (
                    <>
                        <Grid item xs={12}>
                            <MembersList members={members} />
                        </Grid>
                    </>
                )}

                {!loading && tab === 1 && (
                    <>
                        <Grid item xs={12}>
                            <InvitesList pendingInvites={pendingInvites} />
                        </Grid>
                    </>
                )}
            </Grid>

            <InviteMemberModal id={id} project={project} reload={load} ref={inviteMemberModalRef} />
        </Paper>
    );
}
