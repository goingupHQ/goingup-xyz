import { LoadingButton } from '@mui/lab';
import { Button, CircularProgress, Grid, Paper, Stack, Tabs, Tab, Typography } from '@mui/material';
import { useRouter } from 'next/router';
import React from 'react';
import { ProjectsContext } from '../../../contexts/projects-context';
import { WalletContext } from '../../../contexts/wallet-context';
import SectionHeader from '../../common/section-header';
import InvitesList from './invites-list';
import LeaveProjectModal from './leave-project-modal';
import MembersList from './members-list';

export default function ProjectMembers(props) {
    const { id, project } = props;
    const router = useRouter();
    const membersListRef = React.useRef(null);

    const projectsContext = React.useContext(ProjectsContext);
    const wallet = React.useContext(WalletContext);

    const [tab, setTab] = React.useState(0);

    const leaveProjectModalRef = React.useRef(null);

    return (
        <Paper variant="outlined" sx={{ padding: 3 }}>
            <Grid container rowSpacing={3}>
                <Grid item xs={12}>
                    <SectionHeader title="Project Membership">
                        {project?.owner === wallet.address && (
                            <Button
                                variant="contained"
                                color="primary"
                                size="large"
                                onClick={() => membersListRef.current.showInviteMemberModal()}
                            >
                                Invite A Member
                            </Button>
                        )}

                        {project?.owner !== wallet.address && (
                            <LoadingButton
                                variant="contained"
                                color="primary"
                                size="large"

                                onClick={() => leaveProjectModalRef.current.showModal()}
                            >
                                Leave Project
                            </LoadingButton>
                        )}
                    </SectionHeader>
                </Grid>

                <Grid item xs={12}>
                    <Tabs variant="standard" value={tab} onChange={(e, v) => setTab(v)}>
                        <Tab label="Members" sx={{ fontSize: '14pt' }} />
                        <Tab label="Pending Invites" sx={{ fontSize: '14pt' }} />
                    </Tabs>
                </Grid>

                <Grid item xs={12} sx={{ display: tab === 0 ? 'initial' : 'none' }}>
                    <MembersList ref={membersListRef} projectId={id} project={project} />
                </Grid>

                <Grid item xs={12} sx={{ display: tab === 1 ? 'initial' : 'none' }}>
                    <InvitesList projectId={id} />
                </Grid>
            </Grid>

            <LeaveProjectModal ref={leaveProjectModalRef} project={project} />
        </Paper>
    );
}
