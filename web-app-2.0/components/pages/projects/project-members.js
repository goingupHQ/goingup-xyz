import { Button, CircularProgress, Grid, Paper, Stack, Tabs, Tab, Typography } from '@mui/material';
import React from 'react';
import SectionHeader from '../../common/section-header';
import InvitesList from './invites-list';
import MembersList from './members-list';

export default function ProjectMembers(props) {
    const { id, project } = props;
    const membersListRef = React.useRef(null);

    const [tab, setTab] = React.useState(0);

    return (
        <Paper variant="outlined" sx={{ padding: 3 }}>
            <Grid container rowSpacing={3}>
                <Grid item xs={12}>
                    <SectionHeader title="Project Membership">
                        <Button
                            variant="contained"
                            color="primary"
                            size="large"
                            onClick={() => membersListRef.current.showInviteMemberModal()}
                        >
                            Invite A Member
                        </Button>
                    </SectionHeader>
                </Grid>

                <Tabs variant="standard" value={tab} onChange={(e, v) => setTab(v)}>
                    <Tab label="Members" sx={{ fontSize: '14pt' }} />
                    <Tab label="Pending Invites" sx={{ fontSize: '14pt' }} />
                </Tabs>

                {tab === 0 && (
                    <>
                        <Grid item xs={12}>
                            <MembersList ref={membersListRef} projectId={id} project={project} />
                        </Grid>
                    </>
                )}

                {tab === 1 && (
                    <>
                        <Grid item xs={12}>
                            <InvitesList projectId={id} />
                        </Grid>
                    </>
                )}
            </Grid>
        </Paper>
    );
}
