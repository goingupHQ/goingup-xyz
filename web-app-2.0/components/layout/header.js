import { AppBar, Box, Button, Divider, Grid, Stack, Toolbar, Typography } from '@mui/material';
import React from 'react';
import { useContext } from 'react';
import { AppContext } from '../../contexts/app-context';
import CollaboratorsIcon from '../icons/CollaboratorsIcon';
import DashboardIcon from '../icons/DashboardIcon';
import GlobeIcon from '../icons/GlobeIcon';
import MenuIcon from '../icons/MenuIcon';
import MessageIcon from '../icons/MessageIcon';
import ProfileIcon from '../icons/ProfileIcon';
import ProjectsIcon from '../icons/ProjectsIcon';
import SettingsIcon from '../icons/SettingsIcon';
import MobileDashboard from '../MobileDashboard';
import UserBox from '../user-box';

export default function Header(props) {
    const app = useContext(AppContext);
    return (
        <>
            <AppBar>
                <Toolbar>
                    <Grid container spacing={1} alignItems="center" justifyContent="space-between" marginY={1}>
                        <Grid item xs={6}>
                            <img
                                src={
                                    app.mode === 'dark'
                                        ? '/images/goingup-logo-dark.svg'
                                        : '/images/goingup-logo-light.svg'
                                }
                                alt="logo"
                            />
                            {/* <SearchBox /> */}
                        </Grid>
                        <Grid item xs={6}>
                            <Stack direction="row" spacing={2} alignItems="center" justifyContent="flex-end">
                                <Stack spacing={2} direction="row" sx={{ display: { xs: 'none', md: 'initial' } }}>
                                    <MessageIcon />
                                    <SettingsIcon />
                                    <GlobeIcon />
                                </Stack>
                                <UserBox />
                                <Box sx={{ display: { xs: 'initial', md: 'none' } }}>
                                    <MenuIcon />
                                </Box>
                            </Stack>
                        </Grid>
                    </Grid>
                </Toolbar>
                <Divider
                    sx={{
                        display: { xs: 'none', sm: 'block' },
                    }}
                />
                <Box
                    sx={{
                        marginX: {
                            xs: '25px',
                            // lg: '105px',
                        },
                        marginY: '30px',
                        display: { xs: 'none', sm: 'block' },
                    }}
                >
                    <Button
                        variant="contained"
                        color="primary"
                        sx={{
                            ':hover': {
                                backgroundColor: 'hoverPrimary.main',
                            },
                        }}
                    >
                        <DashboardIcon size="small" />
                        <Typography marginLeft={1}>Dashboard</Typography>
                    </Button>
                    <Button
                        sx={{
                            color: '#4D5F72',
                            ':hover': {
                                color: 'hoverTab.main',
                            },
                        }}
                    >
                        <ProjectsIcon />
                        <Typography marginLeft={1}>Projects</Typography>
                    </Button>
                    <Button
                        disableElevation
                        disableRipple
                        sx={{
                            color: '#4D5F72',
                            ':hover': {
                                color: 'hoverTab.main',
                            },
                        }}
                    >
                        <ProfileIcon />
                        <Typography marginLeft={1}>Profile</Typography>
                    </Button>
                    <Button
                        sx={{
                            color: '#4D5F72',
                            ':hover': {
                                color: 'hoverTab.main',
                            },
                        }}
                    >
                        <CollaboratorsIcon />
                        <Typography marginLeft={1}> Collaborators</Typography>
                    </Button>
                </Box>
                <Typography
                    variant="h2"
                    sx={{
                        display: { sm: 'none' },
                        marginY: '10px',
                        marginX: 'auto',
                    }}
                >
                    Dashboard
                </Typography>
                <MobileDashboard />
            </AppBar>
        </>
    );
}
