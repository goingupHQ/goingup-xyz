import { Button, Chip, Grid, Link, Paper, Stack, Typography } from '@mui/material';
import moment from 'moment';
import NextLink from 'next/link';
import React from 'react';

export default function ProjectInformation(props) {
    const { id, project } = props;
    return (
        <Paper sx={{ padding: 3 }}>
            <Grid container rowSpacing={3}>
                <Grid item xs={12}>
                    <Grid container>
                        <Grid item xs={12} md={6}>
                            <Typography variant="h2">Project Information</Typography>
                        </Grid>
                        <Grid item xs={12} md={6} sx={{ textAlign: { xs: 'initial', md: 'right' } }}>
                            <NextLink href={`/projects/edit/${id}`} passHref>
                                <Button variant="contained" color="primary" size="large">
                                    Edit this Project
                                </Button>
                            </NextLink>
                        </Grid>
                    </Grid>
                </Grid>

                <Grid item xs={12}>
                    <Typography variant="body1" color="GrayText">
                        Description
                    </Typography>
                    <Typography variant="body1">{project?.description}</Typography>
                </Grid>

                <Grid item xs={12}>
                    <Typography variant="body1" color="GrayText">
                        Project URL
                    </Typography>
                    <Link href={project?.primaryUrl} target="_blank">
                        <Typography variant="body1" sx={{ textDecoration: 'underline' }}>
                            {project?.primaryUrl}
                        </Typography>
                    </Link>
                </Grid>

                <Grid item xs={12} md={6} lg={4}>
                    <Typography variant="body1" color="GrayText">
                        Started
                    </Typography>
                    <Typography variant="body1">
                        {project?.started?.toNumber()
                            ? moment(project?.started.toNumber() * 1000).format('LL')
                            : 'None'}
                    </Typography>
                </Grid>

                <Grid item xs={12} md={6} lg={4}>
                    <Typography variant="body1" color="GrayText">
                        Ended
                    </Typography>
                    <Typography variant="body1">
                        {project?.ended?.toNumber() ? moment(project?.ended.toNumber() * 1000).format('LL') : 'None'}
                    </Typography>
                </Grid>

                <Grid item xs={12}>
                    <Typography variant="body1" color="GrayText">
                        Tags
                    </Typography>
                    <Stack direction="row" spacing={1}>
                        {project?.tags?.split(',').map((tag) => (
                            <Chip label={tag.trim()} />
                        ))}
                    </Stack>
                </Grid>
            </Grid>
        </Paper>
    );
}
