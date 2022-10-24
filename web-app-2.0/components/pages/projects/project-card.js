import { Button, Card, CardActions, CardContent, CardHeader, Link, Stack, Typography } from '@mui/material';
import { useRouter } from 'next/router';
import React from 'react';
import { WalletContext } from '../../../contexts/wallet-context';
import ProjectLogo from './project-logo';

export default function ProjectCard(props) {
    const { project } = props;
    const projectId = project.id?._hex ? parseInt(project.id._hex, 16) : project.id;
    const router = useRouter();
    const wallet = React.useContext(WalletContext);

    return (
        <>
            <Card
                sx={{
                    height: '100%',
                    padding: { xs: 'initial', md: 3 },
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                }}
            >
                <CardHeader
                    title={
                        <Stack direction="row" spacing={3} alignItems="center">
                            <ProjectLogo projectId={project.id} height={98} width={98} />
                            <Typography variant="h5">{project.name}</Typography>
                        </Stack>
                    }
                    sx={{ cursor: 'pointer' }}
                    onClick={() => router.push(`/projects/page/${project.id}`)}
                />
                <CardContent>
                    <Typography variant="body1">{project.description}</Typography>

                    {project.primaryUrl && (
                        <>
                            <br />
                            <Link href={project.primaryUrl} target="_blank">
                                <Typography
                                    variant="body1"
                                    sx={{ textDecoration: 'underline', overflowX: 'hidden', textOverflow: 'ellipsis' }}
                                >
                                    {project.primaryUrl}
                                </Typography>
                            </Link>
                        </>
                    )}

                    <br />
                    <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                        {project.owner === wallet.address
                            ? 'You are the owner of this project'
                            : 'You are a member of this project'}
                    </Typography>
                </CardContent>

                <CardActions sx={{ padding: 2 }}>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => router.push(`/projects/page/${projectId}`)}
                    >
                        Go to Project Page
                    </Button>

                    {project.owner === wallet.address && (
                        <Button
                            variant="contained"
                            color="secondary"
                            onClick={() => router.push(`/projects/edit/${projectId}`)}
                        >
                            Edit
                        </Button>
                    )}
                </CardActions>
            </Card>
        </>
    );
}
