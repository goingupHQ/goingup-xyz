import { Button, Card, CardActions, CardContent, CardHeader, Link, Typography } from '@mui/material';
import { useRouter } from 'next/router';
import React from 'react';
import { AppContext } from '../../../contexts/app-context';
import { WalletContext } from '../../../contexts/wallet-context';

export default function ProjectSectionCard(props) {
    const { project } = props;
    console.log('project', project);
    const router = useRouter();
    const wallet = React.useContext(WalletContext);
    const app = React.useContext(AppContext);

    return (
        <>
            <Card
                sx={{
                    height: '100%',
                    border: 'none',
                    padding: { xs: 'initial', md: 3 },
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    backgroundColor: {
                        xs: app.mode === 'dark' ? '#111921' : '#F5F5F5',
                        md: app.mode === 'dark' ? '#19222C' : '#FFFFFF',
                    },
                }}
            >
                <CardHeader
                    title={project.name}
                    sx={{ cursor: 'pointer' }}
                    onClick={() => router.push(`/projects/page/${project.id}`)}
                />
                <CardContent>
                    <Typography variant="body1">{project.description}</Typography>
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
