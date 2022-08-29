import { Button, Card, CardActions, CardContent, CardHeader, Typography } from '@mui/material'
import { useRouter } from 'next/router';
import React from 'react'

export default function ProjectCard(props) {
    const { project } = props;
    const router = useRouter();

    return (
        <>
            <Card>
                <CardHeader title={project.name} />
                <CardContent>
                    <Typography variant="body1">
                        {project.description}
                    </Typography>
                </CardContent>

                <CardActions>
                    <Button variant="contained" color="primary" onClick={() => router.push(`/projects/edit/${project?.id.toNumber()}`)}>
                        Edit
                    </Button>
                </CardActions>
            </Card>
        </>
    )
}
