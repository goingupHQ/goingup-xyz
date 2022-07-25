import { AppBar, Box, Button, Divider, Drawer, Fade, Grid, IconButton, Slide, Stack, Toolbar, Typography } from '@mui/material';
import React, { useState } from 'react';
import { useContext } from 'react';
import { AppContext } from '../../contexts/app-context';
import CloseIcon from '../icons/CloseIcon';
import CollaboratorsIcon from '../icons/CollaboratorsIcon';
import DashboardIcon from '../icons/DashboardIcon';
import GlobeIcon from '../icons/GlobeIcon';
import MenuIcon from '../icons/MenuIcon';
import MessageIcon from '../icons/MessageIcon';
import ProfileIcon from '../icons/ProfileIcon';
import ProjectsIcon from '../icons/ProjectsIcon';
import SettingsIcon from '../icons/SettingsIcon';
import MobileNav from '../MobileNav';
import UserBox from '../user-box';

export default function Header(props) {
    const app = useContext(AppContext);
    const [drawerOpen, setDrawerOpen] = useState(false);

    return (
        <>
            <AppBar>
                <Toolbar sx={{ zIndex: 101 }}>
                    <Grid container spacing={1} alignItems="center" justifyContent="space-between" marginY={1}>
                        <Grid item xs={6}>
                            <Box
                                component="img"
                                src={
                                    app.mode === 'dark'
                                        ? '/images/goingup-logo-dark.svg'
                                        : '/images/goingup-logo-light.svg'
                                }
                                alt="logo"
                                sx={{
                                    width: { xs: '110px', md: 'auto' },
                                }}
                            ></Box>
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
                                <Box sx={{ display: { xs: 'initial', md: 'none' }, marginLeft: '0px !important' }}>
                                    <IconButton onClick={() => setDrawerOpen(!drawerOpen)}>
                                        {drawerOpen ? <CloseIcon /> : <MenuIcon />}
                                    </IconButton>
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

                <Fade direction="down" in={drawerOpen} mountOnEnter unmountOnExit>
                    <Box sx={{ paddingBottom: '20px', paddingX: '32px', zIndex: 100 }}>
                        <MobileNav />
                    </Box>
                </Fade>

            </AppBar>
        </>
    );
}
