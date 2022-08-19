import { useTheme, Button, Stack, Typography } from '@mui/material';
import DashboardIcon from '../icons/DashboardIcon';
import ProjectsIcon from '../icons/ProjectsIcon';
import ProfileIcon from '../icons/ProfileIcon';
import CollaboratorsIcon from '../icons/CollaboratorsIcon';
import SearchBox from '../SearchBox';
import MessageIcon from '../icons/MessageIcon';
import GlobeIcon from '../icons/GlobeIcon';
import SettingsIcon from '../icons/SettingsIcon';
import { AppContext } from '../../contexts/app-context';
import { useContext } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import SunIcon from '../icons/SunIcon';
import MoonIcon from '../icons/MoonIcon';

export default function MobileNav(props) {
    const { closeNav } = props;
    const app = useContext(AppContext);
    const theme = useTheme();

    const activeColor = app.mode === 'dark' ? theme.palette.primary.main : theme.palette.secondary.main;
    const activeButtonStyle = { color: activeColor };

    const inactiveColor = app.mode === 'dark' ? '#FFFFFF' : '#4D5F72';
    const inactiveButtonStyle = { color: inactiveColor };

    const router = useRouter();

    return (
        <Stack
            spacing={3}
            alignItems="flex-start"
            sx={{
                display: { md: 'none' },
                paddingTop: '18px'
            }}
        >
            {/* <Box width="100%" marginBottom={1}>
                <SearchBox />
            </Box> */}

            <Link href="/">
                <Button
                    onClick={closeNav}
                    sx={router.pathname === '/' ? activeButtonStyle : inactiveButtonStyle}
                    startIcon={<DashboardIcon color={ router.pathname === '/' ? activeColor: inactiveColor } />}
                >
                    Dashboard
                </Button>
            </Link>

            <Link href="/projects">
                <Button
                    onClick={closeNav}
                    sx={router.pathname === '/projects' ? activeButtonStyle : inactiveButtonStyle}
                    startIcon={<ProjectsIcon color={ router.pathname === '/projects' ? activeColor: inactiveColor } />}
                >
                    Projects
                </Button>
            </Link>

            <Link href="/profile">
                <Button
                    onClick={closeNav}
                    sx={router.pathname === '/profile' ? activeButtonStyle : inactiveButtonStyle}
                    startIcon={<ProfileIcon color={ router.pathname === '/profile' ? activeColor: inactiveColor } />}
                >
                    Profile
                </Button>
            </Link>

            <Link href="/collaborators">
                <Button
                    onClick={closeNav}
                    sx={router.pathname === '/collaborators' ? activeButtonStyle : inactiveButtonStyle}
                    startIcon={<CollaboratorsIcon color={ router.pathname === '/collaborators' ? activeColor: inactiveColor } />}
                >
                    Collaborators
                </Button>
            </Link>

            <Button
                sx={router.pathname === '/messages' ? activeButtonStyle : inactiveButtonStyle}
                startIcon={<MessageIcon color={ router.pathname === '/messages' ? activeColor: inactiveColor } />}
            >
                Messages
            </Button>

            <Button
                sx={router.pathname === '/settings' ? activeButtonStyle : inactiveButtonStyle}
                startIcon={<SettingsIcon color={ router.pathname === '/settings' ? activeColor: inactiveColor } />}
            >
                Settings
            </Button>
            <Button
                sx={inactiveButtonStyle}
                startIcon={
                    <>
                        {app.mode === 'light' && <SunIcon color={inactiveColor} />}
                        {app.mode === 'dark' && <MoonIcon color={inactiveColor} />}
                    </>
                }
                onClick={() => {
                    if (app.mode === 'light') {
                        app.setDarkMode();
                    } else {
                        app.setLightMode();
                    }

                    if (closeNav) {
                        closeNav();
                    }
                }}
            >
                {app.mode === 'light' && 'Switch to Dark Mode'}
                {app.mode === 'dark' && 'Switch to Light Mode'}
            </Button>
        </Stack>
    );
}
