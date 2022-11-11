import React, { useContext } from 'react'
import { Button, Grid, Paper, TextField, Typography } from '@mui/material';
import { ProjectsContext } from '../../contexts/projects-context';

export default function Projects(props) {
    const [projectId, setProjectId] = React.useState('');
    const [memberAddress, setMemberAddress] = React.useState('');
    const [role, setRole] = React.useState('');
    const [goal, setGoal] = React.useState('');
    const [rewardJson, setRewardJson] = React.useState('');

    const projectsContext = useContext(ProjectsContext);

    const addMemberToProject = async () => {
        const tx = await projectsContext.manuallyAddMember(projectId, memberAddress, role, goal, rewardJson);
    }

    return (
        <>
            <Typography variant="h1">Projects Admin Page</Typography>

            <Paper sx={{ p: 2, my: 3, maxWidth: { xs: 'initial', md: '600px' } }}>
                <Typography variant="h3">Add Member To Project</Typography>

                <Grid container sx={{ mt: 2 }} spacing={2}>
                    <Grid item xs={12}>
                        <TextField fullWidth label="Project ID" value={projectId} onChange={(e) => setProjectId(e.target.value)} />
                    </Grid>

                    <Grid item xs={12}>
                        <TextField fullWidth label="Member Address" value={memberAddress} onChange={(e) => setMemberAddress(e.target.value)} />
                    </Grid>

                    <Grid item xs={12}>
                        <TextField fullWidth label="Role" value={role} onChange={(e) => setRole(e.target.value)} />
                    </Grid>

                    <Grid item xs={12}>
                        <TextField fullWidth label="Goal" value={goal} onChange={(e) => setGoal(e.target.value)} />
                    </Grid>

                    <Grid item xs={12}>
                        <TextField fullWidth multiline rows="10" label="Reward JSON" value={rewardJson} onChange={(e) => setRewardJson(e.target.value)} />
                    </Grid>

                    <Grid item xs={12}>
                        <Button variant="contained" onClick={addMemberToProject}>Add Member</Button>
                    </Grid>
                </Grid>
            </Paper>
        </>
    )
}
