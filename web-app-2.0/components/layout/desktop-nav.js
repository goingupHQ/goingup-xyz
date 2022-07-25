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
        fontSize: '1rem',
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
            <Stack direction="row" spacing={3} sx={{ display: { xs: 'none', md: 'initial' }, margin: '25px' }}>
                <Link href="/">
                    <Button
                        sx={pathname === '/' ? activeButtonStyle : inactiveButtonStyle}
                        startIcon={<DashboardIcon />}
                    >
                        Dashboard
                    </Button>
                </Link>

                <Link href="/projects">
                    <Button
                        sx={pathname === '/projects' ? activeButtonStyle : inactiveButtonStyle}
                        startIcon={<ProjectsIcon />}
                    >
                        Projects
                    </Button>
                </Link>

                <Link href="/profile">
                    <Button
                        sx={pathname === '/profile' ? activeButtonStyle : inactiveButtonStyle}
                        startIcon={<ProfileIcon />}
                    >
                        Profile
                    </Button>
                </Link>

                <Link href="/collaborators">
                    <Button
                        sx={pathname === '/collaborators' ? activeButtonStyle : inactiveButtonStyle}
                        startIcon={<CollaboratorsIcon />}
                    >
                        Collaborators
                    </Button>
                </Link>
            </Stack>
        </>
    );
}
