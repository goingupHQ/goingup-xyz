import {
    Button,
    Card,
    CardActions,
    CardContent,
    CardHeader,
    Stack,
    Typography,
} from '@mui/material';
import { useRouter } from 'next/router';
import React from 'react';
import { AppContext } from '../../contexts/app-context';
import { WalletContext } from '../../contexts/wallet-context';
import ProjectLogo from '../pages/projects/project-logo';

export default function ProjectSectionCard(props) {
    const { project } = props;
    const projectId = project.id?._hex ? parseInt(project.id._hex, 16) : project.id;
    const router = useRouter();
    const wallet = React.useContext(WalletContext);
    const app = React.useContext(AppContext);
    const tags = project.tags.toString().split(',').slice(0, 3);
    const newTags = tags.map((tag) => {
        return (
            <Typography
                key={tag}
                color='#6E8094'
                variant="outlined"
                size="small"
                sx={{ marginRight: '0.5rem' }}
            >
                {tag || 'Tags'}
            </Typography>
        );
    });

    return (
        <>
            <Card
                sx={{
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    backgroundColor: {
                        xs: app.mode === 'dark' ? '#111921' : '#F5F5F5',
                        md: app.mode === 'dark' ? '#19222C' : '#FFFFFF',
                    },
                }}>
                <CardHeader
                    title={
                        <Stack direction='row' spacing={3}>
                            <ProjectLogo
                                projectId={project.id}
                                height={98}
                                width={98}
                            />
                            <Stack
                                direction='column'
                                alignItems='stretch'
                                justifyContent='flex-start'>
                                <Typography variant='body1' color='#6E8094'>
                                    {newTags}
                                </Typography>
                                <Typography variant='h5'>
                                    {project.name || 'Project Name'}
                                </Typography>
                                <CardActions sx={{ marginLeft: '-10px' }}>
                                    <Button
                                        variant='contained'
                                        color='primary'
                                        size='small'
                                        onClick={() =>
                                            router.push(
                                                `/projects/page/${projectId}`
                                            )
                                        }>
                                        Go to Project Page
                                    </Button>

                                    {project.owner === wallet.address && (
                                        <Button
                                            variant='contained'
                                            color='secondary'
                                            size='small'
                                            onClick={() =>
                                                router.push(
                                                    `/projects/edit/${projectId}`
                                                )
                                            }>
                                            Edit
                                        </Button>
                                    )}
                                </CardActions>
                            </Stack>
                        </Stack>
                    }
                    sx={{ cursor: 'pointer' }}
                />
            </Card>
        </>
    );
}