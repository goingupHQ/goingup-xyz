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
import MobileNav from './mobile-nav';
import UserBox from '../user-box';
import DesktopNav from './desktop-nav';
import MoonIcon from '../icons/MoonIcon';
import SunIcon from '../icons/SunIcon';
import Sidebar from './Sidebar';
import CreateAccount from '../../pages/create-account';

export default function Header(props) {
    const app = useContext(AppContext);
    const [drawerOpen, setDrawerOpen] = useState(false); // testing

    return (
        <>
            <AppBar>
                <Toolbar sx={{ paddingTop: { xs: '12px' } }}>
                    <Grid container spacing={1} alignItems="center" justifyContent="space-between">
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
                                    paddingTop: { xs: '6px', md: 'initial' }
                                }}
                            ></Box>
                            {/* <SearchBox /> */}
                        </Grid>
                        <Grid item xs={6}>
                            <Stack direction="row" spacing={2} alignItems="center" justifyContent="flex-end">
                                <Stack spacing={2} direction="row" sx={{ display: { xs: 'none', md: 'initial' } }}>
                                    <IconButton>
                                        <MessageIcon />
                                    </IconButton>
                                    <IconButton>
                                        <SettingsIcon />
                                    </IconButton>
                                    <IconButton onClick={() => {
                                        if (app.mode === 'dark') {
                                            app.setLightMode();
                                        } else {
                                            app.setDarkMode();
                                        }
                                    }}>
                                        {app.mode === 'light' && <SunIcon />}
                                        {app.mode === 'dark' && <MoonIcon />}
                                    </IconButton>
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
                        display: { xs: 'none', sm: 'none', md: 'block' },
                        marginTop: '12px'
                    }}
                />
                <DesktopNav />
                <Fade direction="down" in={drawerOpen} mountOnEnter unmountOnExit>
                    <Box sx={{ paddingBottom: '20px', paddingX: '32px', zIndex: 100 }}>
                        <MobileNav closeNav={() => { setDrawerOpen(false) }} />
                    </Box>
                </Fade>
            </AppBar>
        </>
    );
}
