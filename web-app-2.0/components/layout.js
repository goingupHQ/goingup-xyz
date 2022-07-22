import { createTheme, ThemeProvider, Box, Toolbar, Divider, AppBar, Button, Grid, Typography } from '@mui/material';
import { useContext, useEffect, useMemo } from 'react';
import { AppContext } from '../contexts/app-context';
import SettingsIcon from './icons/SettingsIcon';
import MessageIcon from './icons/MessageIcon';
import GlobeIcon from './icons/GlobeIcon';
import MenuIcon from './icons/MenuIcon';
import WalletIcon from './icons/WalletIcon';
import SearchBox from './SearchBox';
import DashboardIcon from './icons/DashboardIcon';
import ProjectsIcon from './icons/ProjectsIcon';
import ProfileIcon from './icons/ProfileIcon';
import CollaboratorsIcon from './icons/CollaboratorsIcon';
import { display } from '@mui/system';

export default function Layout({ children }) {
    const app = useContext(AppContext);

    const theme = useMemo(
        () =>
            createTheme({
                palette: {
                    mode: app.mode,
                    primary: {
                        main: '#F4CE00',
                    },
                    background: {
                        paper: 'transparent',
                        dark: '#0F151C',
                        light: '#FFFFFF',
                        searchBar: app.mode === 'dark' ? '#19222C' : '#F5F5F5',
                    },
                    hoverPrimary: {
                        main: '#FFE555',
                    },
                    activePrimary: {
                        main: '#FFF4B8',
                    },
                    secondary: {
                        main: '#7A55FF',
                    },
                    error: {
                        main: '#FF8199',
                    },
                    text1: {
                        main: '#FFFFFF',
                    },
                    text1: {
                        main: '#4D5F72',
                    },
                    background1: {
                        main: '#0F151C',
                    },
                    background2: {
                        main: '#19222C',
                    },
                    backgroundLight: {
                        main: '#FFFFFF',
                    },
                    hoverFollow: {
                        main: '#5537C3',
                        text: '#F4CE00',
                    },
                    activeFollow: {
                        main: '#3AB795',
                        text: '#FFFFFF',
                    },
                    hoverViewAllProjects: {
                        main: '#F4CE00',
                    },
                    activeViewAllProjects: {
                        main: '#D2B200',
                    },
                    hoverTabDark: {
                        main: '#151E26',
                    },
                    hoverTabLight: {
                        main: '#F5F5F5',
                    },
                    hoverListDark: {
                        main: '#F4CE00',
                    },
                    hoverListLight: {
                        main: '#378CDB',
                    },
                    formBorder: {
                        main: '#FF8199',
                    },
                    icon: {
                        main: app.mode === 'dark' ? '#4D5F72' : '#010101',
                    },
                    hoverTab: {
                        main: '#4D5F72',                    }
                },
                typography: {
                    fontFamily: 'Questrial',
                    h1: {
                        fontSize: '32px',
                        fontWeight: 'bold',
                    },
                    h2: {
                        fontSize: '24px',
                        fontWeight: 'bold',
                    },
                    h3: {
                        fontSize: '18px',
                        fontWeight: 'bold',
                    },
                    sh1: {
                        fontSize: '16px',
                        fontWeight: '500',
                        color: '#4D5F72',
                    },
                    sh2: {
                        fontSize: '14px',
                        fontWeight: '500',
                        color: '#4D5F72',
                    },
                    sh3: {
                        fontSize: '12px',
                        fontWeight: '500',
                        color: '#4D5F72',
                    },
                    p: {
                        fontSize: '16px',
                        fontWeight: 'medium',
                    },
                    button: {
                        textTransform: 'capitalize',
                        fontWeight: 'bold',
                    },
                },
                shape: {
                    borderRadius: '8px',
                },
                components: {
                    MuiButtonBase: {
                        defaultProps: {
                            style: {
                                // // padding: '10px 40px',
                                // width: 155,
                                // height: 44
                            },
                        },
                    },
                    MuiAppBar: {
                        defaultProps: {
                            sx: {
                                backgroundColor: app.mode === 'dark' ? '#0F151C' : '#FFFFFF',
                                // height: '80px',
                            },
                            elevation: 0,
                        },
                    },
                    MuiCard: {
                        defaultProps: {
                            elevation: 0,
                        },
                    },
                    MuiDivider: {
                        defaultProps: {
                            color: app.mode === 'dark' ? '#25303C' : '#E7E7E7',
                        },
                    },
                },
                spacing: [0, 10, 15, 20, 30, 60, 80],
                icons: {
                    sizes: {
                        small: 16,
                        medium: 24,
                        large: 32,
                    },
                },
            }),
        [app.mode]
    );

    useEffect(() => {
        document.body.style.backgroundColor =
            app.mode === 'dark' ? theme.palette.background.dark : theme.palette.background.light;
    }, [app.mode]);

    return (
        <>
            <ThemeProvider theme={theme}>
                <Grid container>
                    <AppBar>
                        <Toolbar
                            // sx={{
                            //     marginX: {
                            //         md: '15px',
                            //         lg: '72px',
                            //     },
                            // }}
                        >
                            <img
                                src={
                                    app.mode === 'dark'
                                        ? '/images/goingup-logo-dark.svg'
                                        : '/images/goingup-logo-light.svg'
                                }
                                alt="logo"
                            />
                            <Grid container sm={4} sx={{ display: { xs: 'none', sm: 'block' } }}>
                                <SearchBox />
                            </Grid>
                            <Grid sm={4} container direction="row-reverse">
                                <Grid sm={1} sx={{ display: { xs: 'none', sm: 'block' } }}>
                                    <MessageIcon size="medium" />
                                </Grid>
                                <Grid sm={3} sx={{ display: { xs: 'none', sm: 'block' } }}>
                                    <SettingsIcon size="medium" />
                                </Grid>
                                <Grid sm={3} sx={{ display: { xs: 'none', sm: 'block' } }}>
                                    <GlobeIcon />
                                </Grid>
                            </Grid>
                            <Grid container direction={{ xs: 'row', sm: 'row-reverse'}} xs={12} sm={2}>
                                <WalletIcon />
                            </Grid>
                            <Grid container direction='row-reverse' xs={1} sx={{ display: { sm: 'none', xs: 'block' } }}>
                                <MenuIcon />
                            </Grid>
                        </Toolbar>
                        <Divider 
                            sx={{
                                display: { xs: 'none', sm: 'block' }
                            }}
                        />
                        <Box 
                            sx={{
                                marginX: {
                                    xs: '25px',
                                    // lg: '105px',
                                },
                                marginY: '30px',
                                display: { xs: 'none', sm: 'block' }
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
                            <DashboardIcon size="small" /> Dashboard
                            </Button>
                            <Button
                                sx={{
                                    color: '#4D5F72',
                                    ':hover': {
                                    color: 'hoverTab.main',
                                    },
                                }}
                            >
                                <ProjectsIcon />Projects
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
                               <ProfileIcon />Profile
                            </Button>
                            <Button
                                sx={{
                                    color: '#4D5F72',
                                    ':hover': {
                                    color: 'hoverTab.main',
                                    },
                                }}
                            >
                                <CollaboratorsIcon />Collaborators
                            </Button>
                        </Box>
                        <Typography 
                                variant='h2'
                                sx={{
                                    display: { sm: 'none' },
                                    marginY: '30px',
                                    marginX: 'auto'
                                }}
                            >
                                Dashboard
                            </Typography>
                    </AppBar>
                </Grid>
                {children}
            </ThemeProvider>
            ;
        </>
    );
}
