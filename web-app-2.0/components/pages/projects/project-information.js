import { LoadingButton } from '@mui/lab';
import { Button, Chip, Grid, Link, Paper, Stack, Typography } from '@mui/material';
import moment from 'moment';
import NextLink from 'next/link';
import React from 'react';
import { WalletContext } from '../../../contexts/wallet-context';
import SectionHeader from '../../common/section-header';
import SetProjectLogo from './set-project-logo';
import { ProjectsContext } from '../../../contexts/projects-context';

export default function ProjectInformation(props) {
    const { id, project, projectId } = props;
    const projectsContext = React.useContext(ProjectsContext);

    const wallet = React.useContext(WalletContext);

    const [loading, setLoading] = React.useState(true);
    const [members, setMembers] = React.useState([]);
    const load = async () => {
        setLoading(true);
        try {
            const result = await projectsContext.getProjectMembers(projectId);
            setMembers(result);
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    };

    React.useEffect(() => {
        //
        if (projectId) {
            load();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [projectId]);

    return (
        <Paper sx={{ padding: 3 }}>
            <Grid container rowSpacing={3}>
                <Grid item xs={12}>
                    <SectionHeader title="Project Information">
                        {project?.owner === wallet.address && (
                            <>
                                <NextLink href={`/projects/edit/${id}`} passHref>
                                    <Button variant="contained" color="primary" size="large">
                                        Edit this Project
                                    </Button>
                                </NextLink>

                                <NextLink href={`/projects/transfer-ownership/${id}`} passHref>
                                    <Button variant="contained" color="secondary" size="large">
                                        Transfer Ownership
                                    </Button>
                                </NextLink>
                            </>
                        )}
                    </SectionHeader>
                </Grid>

                <Grid item xs={12}>
                    <Typography variant="body1" color="GrayText">
                        Description
                    </Typography>
                    <Typography variant="body1">{project?.description}</Typography>
                </Grid>

                <Grid item xs={12} md={5}>
                    <Typography variant="body1" color="GrayText">
                        Project URL
                    </Typography>
                    <Link href={project?.primaryUrl} target="_blank">
                        <Typography variant="body1" sx={{ textDecoration: 'underline' }}>
                            {project?.primaryUrl}
                        </Typography>
                    </Link>
                </Grid>

                <Grid item xs={12} md={7}>
                    <Typography variant="body1" color="GrayText">
                        Tags
                    </Typography>
                    <Stack direction="row" spacing={1}>
                        {project?.tags?.split(',').map((tag, index) => (
                            <Chip key={index} label={tag.trim()} />
                        ))}
                    </Stack>
                </Grid>

                <Grid item xs={12} md={5}>
                    <Typography variant="body1" color="GrayText">
                        Started
                    </Typography>
                    <Typography variant="body1">
                        {project?.started?.toNumber()
                            ? moment(project?.started.toNumber() * 1000).format('LL')
                            : 'None'}
                    </Typography>
                </Grid>

                <Grid item xs={12} md={6} lg={7}>
                    <Typography variant="body1" color="GrayText">
                        Ended
                    </Typography>
                    <Typography variant="body1">
                        {project?.ended?.toNumber() ? moment(project?.ended.toNumber() * 1000).format('LL') : 'None'}
                    </Typography>
                </Grid>
                {project?.owner === wallet.address && (
                    <Grid item xs={12}>
                        <SetProjectLogo projectId={id} />
                    </Grid>
                )}
            </Grid>
        </Paper>
    );
}
