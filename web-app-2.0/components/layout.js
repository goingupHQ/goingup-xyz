import {
    createTheme,
    ThemeProvider,
    Box,
    Toolbar,
    Divider,
    AppBar,
    Button,
    Grid,
    Typography,
    Stack,
} from '@mui/material';
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
import UserBox from './user-box';
import MobileDashboard from './MobileDashboard';

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
                        // paper: app.mode === 'dark' ? '#19222C' : '#E6DDD3',
                        dark: '#0F151C',
                        light: '#FFFFFF',
                        default: app.mode === 'dark' ? '#0F151C' : '#FFFFFF',
                        main: app.mode === 'dark' ? '#0F151C' : '#FFFFFF',
                        searchBar: app.mode === 'dark' ? '#19222C' : '#F5F5F5',
                        userBox: app.mode === 'dark' ? '#19222C' : '#EDEFED',
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
                    text: {
                        main: app.mode === 'dark' ? '#FFFFFF' : '#010101',
                    },
                    icon: {
                        main: app.mode === 'dark' ? '#4D5F72' : '#4D5F72',
                    },
                    hoverTab: {
                        main: '#4D5F72',
                    },
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
                <AppBar>
                    <Toolbar>
                        <Grid container spacing={1} alignItems="center" justifyContent="space-between">
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
                                <Stack direction="row" spacing={1} alignItems="center" justifyContent="flex-end">
                                    <MessageIcon size="medium" />
                                    <SettingsIcon size="medium" />
                                    <GlobeIcon />
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
                            variant='h2'
                            sx={{
                                display: { sm: 'none' },
                                marginY: '30px',
                                marginX: 'auto'
                            }}
                        >
                            Dashboard
                        </Typography>
                        <MobileDashboard />
                </AppBar>
                {children}
            </ThemeProvider>
            ;
        </>
    );
}
