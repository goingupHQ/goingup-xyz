import { Button, CircularProgress, Grid, Paper, Stack, Typography } from '@mui/material';
import NextLink from 'next/link';
import React from 'react';
import { ProjectsContext } from '../../../contexts/projects-context';
import AddressInput from '../../common/address-input';
import SectionHeader from '../../common/section-header';

export default function ProjectMembers(props) {
    const { id } = props;
    const projectsContext = React.useContext(ProjectsContext);

    const [loading, setLoading] = React.useState(true);
    const [members, setMembers] = React.useState([]);

    const load = async () => {
        setLoading(true);
        try {
            const members = await projectsContext.getProjectMembers(id);
            setMembers(members);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    React.useEffect(() => {
        load();
    }, [id]);

    return (
        <Paper sx={{ padding: 3 }}>
            <Grid container rowSpacing={3}>
                <Grid item xs={12}>
                    <SectionHeader title="Project Members">
                        <AddressInput size="small" sx={{ width: '280px' }} />
                        <Button variant="contained" color="primary" size="medium">
                            Invite
                        </Button>
                    </SectionHeader>
                </Grid>

                {loading && (
                    <Grid item xs={12} sx={{ textAlign: 'center' }}>
                        <Stack direction="column" spacing={2} alignItems="center">
                            <CircularProgress />
                            <img src="/images/illustrations/processing.svg" alt="Processing" width="320px" />
                        </Stack>
                    </Grid>
                )}

                {!loading && members.length === 0 &&
                    <Grid item xs={12} sx={{ textAlign: 'center' }}>
                        <Stack direction="column" spacing={4} alignItems="center">
                            <Typography variant="h2">No members yet</Typography>
                            <img src="/images/illustrations/see-you-later.svg" alt="Processing" width="320px" />
                            <Typography variant="body1">Invite members to your project</Typography>
                        </Stack>
                    </Grid>
                }
            </Grid>
        </Paper>
    );
}
