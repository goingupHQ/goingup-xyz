import { createTheme, ThemeProvider, Box, Toolbar, Divider, AppBar } from '@mui/material';
import { useContext, useEffect, useMemo } from 'react';
import { AppContext } from '../contexts/app-context';
import SettingsIcon from './icons/SettingsIcon';
import MessageIcon from './icons/MessageIcon';
import GlobeIcon from './icons/GlobeIcon';
import MenuIcon from './icons/MenuIcon';
import UserIcon from './icons/UserIcon';
import SearchIcon from './icons/SearchIcon';
import SearchBox from './SearchBox';

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
                        main: app.mode === 'dark' ? '#EFEFEF' : '#010101',
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
                                padding: '10px 40px',
                            },
                        },
                    },
                    MuiAppBar: {
                        defaultProps: {
                            sx: {
                                backgroundColor: app.mode === 'dark' ? '#0F151C' : '#FFFFFF',
                                height: '80px',
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
                <Box>
                    <AppBar>
                        <Toolbar
                            sx={{
                                marginX: {
                                    md: '15px',
                                    lg: '105px',
                                },
                            }}
                        >
                            <img
                                src={
                                    app.mode === 'dark'
                                        ? '/images/goingup-logo-dark.svg'
                                        : '/images/goingup-logo-light.svg'
                                }
                                alt="logo"
                            />

                            <Box sx={{ display: { xs: 'none', md: 'block' } }}>
                                <SearchBox />
                            </Box>
                            <Box sx={{ display: { xs: 'none', md: 'block' } }}>
                                <MessageIcon size="medium" />
                            </Box>
                            <Box sx={{ px: '25px', display: { xs: 'none', md: 'block' } }}>
                                <SettingsIcon size="medium" />
                            </Box>
                            <Box sx={{ display: { xs: 'none', md: 'block' } }}>
                                <GlobeIcon />
                            </Box>
                            <Box sx={{ px: '25px' }}>
                                <UserIcon />
                            </Box>
                            <Box sx={{ display: { md: 'none', xs: 'block' } }}>
                                <MenuIcon />
                            </Box>
                        </Toolbar>
                        <Divider />
                    </AppBar>
                </Box>
                {children}
            </ThemeProvider>
            ;
        </>
    );
}
