import { useState } from 'react';
import { Box, Button, Stack, Typography } from '@mui/material';
import DashboardIcon from './icons/DashboardIcon';
import ProjectsIcon from './icons/ProjectsIcon';
import ProfileIcon from './icons/ProfileIcon';
import CollaboratorsIcon from './icons/CollaboratorsIcon';
import SearchBox from './SearchBox';
import MessageIcon from './icons/MessageIcon';
import GlobeIcon from './icons/GlobeIcon';
import SettingsIcon from './icons/SettingsIcon';
import MenuIcon from './icons/MenuIcon';

export default function MobileNav() {
    return (
        <Stack
            spacing={3}
            alignItems="flex-start"
            sx={{
                display: { sm: 'none' },
            }}
        >
            {/* <Box width="100%" marginBottom={1}>
                <SearchBox />
            </Box> */}
            <Button
                sx={{
                    color: '#F4CE00',
                }}
            >
                <DashboardIcon color={'#F4CE00'} />
                <Typography marginLeft={1}>Dashboard</Typography>
            </Button>
            <Button
                sx={{
                    color: '#FFFFFF',
                }}
            >
                <ProjectsIcon color={'#FFFFFF'} />
                <Typography marginLeft={1}>Projects</Typography>
            </Button>
            <Button
                sx={{
                    color: '#FFFFFF',
                }}
            >
                <ProfileIcon color={'#FFFFFF'} />
                <Typography marginLeft={1}>Profile</Typography>
            </Button>
            <Button
                sx={{
                    color: '#FFFFFF',
                }}
            >
                <CollaboratorsIcon color={'#FFFFFF'} />
                <Typography marginLeft={1}> Collaborators</Typography>
            </Button>
            <Button
                sx={{
                    color: '#FFFFFF',
                }}
            >
                <MessageIcon color={'#FFFFFF'} />
                <Typography marginLeft={1}> Messages</Typography>
            </Button>
            <Button
                sx={{
                    color: '#FFFFFF',
                }}
            >
                <SettingsIcon color={'#FFFFFF'} />
                <Typography marginLeft={1}> Settings</Typography>
            </Button>
            <Button
                sx={{
                    color: '#FFFFFF',
                }}
            >
                <GlobeIcon color={'#FFFFFF'} />
                <Typography marginLeft={1}> Language</Typography>
            </Button>
        </Stack>
    );
}
