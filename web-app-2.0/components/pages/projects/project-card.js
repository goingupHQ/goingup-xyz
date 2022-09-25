import { Button, Card, CardActions, CardContent, CardHeader, Link, Typography } from '@mui/material';
import { useRouter } from 'next/router';
import React from 'react';
import { WalletContext } from '../../../contexts/wallet-context';

export default function ProjectCard(props) {
    const { project } = props;
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
                    title={project.name}
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
                        {project.owner === wallet.address ? 'You are the owner of this project' : 'You are a member of this project'}
                    </Typography>
                </CardContent>

                <CardActions sx={{ padding: 2 }}>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => router.push(`/projects/page/${project?.id.toNumber()}`)}
                    >
                        Go to Project Page
                    </Button>

                    {project.owner === wallet.address &&
                    <Button
                        variant="contained"
                        color="secondary"
                        onClick={() => router.push(`/projects/edit/${project?.id.toNumber()}`)}
                    >
                        Edit
                    </Button>
                    }
                </CardActions>
            </Card>
        </>
    );
}
