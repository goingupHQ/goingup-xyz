import { Button, Card, CardActions, CardContent, CardHeader, Link, Typography } from '@mui/material';
import { useRouter } from 'next/router';
import React from 'react';

export default function ProjectCard(props) {
    const { project } = props;
    const router = useRouter();

    return (
        <>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <CardHeader title={project.name} />
                <CardContent>
                    <Typography variant="body1">{project.description}</Typography>
                    <Link href={project.primaryUrl} target="_blank">
                        <Typography variant="body1" sx={{ textDecoration: 'underline' }}>
                            {project.primaryUrl}
                        </Typography>
                    </Link>
                </CardContent>

                <CardActions sx={{ padding: 2 }}>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => router.push(`/projects/page/${project?.id.toNumber()}`)}
                    >
                        Go to Project Page
                    </Button>
                    <Button
                        variant="contained"
                        color="secondary"
                        onClick={() => router.push(`/projects/edit/${project?.id.toNumber()}`)}
                    >
                        Edit
                    </Button>
                </CardActions>
            </Card>
        </>
    );
}
