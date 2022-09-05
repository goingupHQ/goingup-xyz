import { Button, Grid, Paper, Stack, Typography } from '@mui/material';
import NextLink from 'next/link';
import React from 'react';
import { ProjectsContext } from '../../../contexts/projects-context';
import SectionHeader from '../../common/section-header';

export default function ProjectMembers(props) {
    const { id } = props;
    const projectsContext = React.useContext(ProjectsContext);

    const [loading, setLoading] = React.useState(false);
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
                        <NextLink href={`/projects/edit/${id}`} passHref>
                            <Button variant="contained" color="primary" size="large">
                                Invite Members
                            </Button>
                        </NextLink>
                    </SectionHeader>
                </Grid>


            </Grid>
        </Paper>
    );
}
