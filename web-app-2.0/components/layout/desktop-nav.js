import { Button, Stack, Typography } from '@mui/material';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';
import CollaboratorsIcon from '../icons/CollaboratorsIcon';
import DashboardIcon from '../icons/DashboardIcon';
import ProfileIcon from '../icons/ProfileIcon';
import ProjectsIcon from '../icons/ProjectsIcon';

export default function DesktopNav(props) {
    const commonButtonStyle = {
        padding: '10px 25px'
    }

    const activeButtonStyle = {
        ...commonButtonStyle,
        backgroundColor: 'primary.main',
        color: 'primary.contrastText',
        ':hover': {
            backgroundColor: 'hoverPrimary.main',
        }
    }

    const inactiveButtonStyle = {
        ...commonButtonStyle,
        color: '#4D5F72',
        ':hover': {
            color: 'hoverTab.main',
        },
    }

    const router = useRouter();
    const { pathname } = router;

    return (
        <>
            <Stack direction="row" spacing={3} sx={{ display: { xs: 'none', md: 'initial' }, margin: '30px' }}>
                <Link href="/">
                    <Button
                        sx={pathname === '/' ? activeButtonStyle : inactiveButtonStyle}
                        startIcon={<DashboardIcon />}
                    >
                        <Typography>Dashboard</Typography>
                    </Button>
                </Link>

                <Link href="/projects">
                    <Button
                        sx={pathname === '/projects' ? activeButtonStyle : inactiveButtonStyle}
                        startIcon={<ProjectsIcon />}
                    >
                        <Typography>Projects</Typography>
                    </Button>
                </Link>

                <Link href="/profile">
                    <Button
                        sx={pathname === '/profile' ? activeButtonStyle : inactiveButtonStyle}
                        startIcon={<ProfileIcon />}
                    >
                        <Typography>Profile</Typography>
                    </Button>
                </Link>

                <Link href="/collaborators">
                    <Button
                        sx={pathname === '/collaborators' ? activeButtonStyle : inactiveButtonStyle}
                        startIcon={<CollaboratorsIcon />}
                    >
                        <Typography> Collaborators</Typography>
                    </Button>
                </Link>
            </Stack>
        </>
    );
}
