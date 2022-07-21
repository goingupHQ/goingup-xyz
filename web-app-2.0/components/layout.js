import { createTheme, ThemeProvider, Typography, Box, Toolbar, IconButton, Divider, TextField } from '@mui/material';
import { useContext, useEffect, useMemo } from 'react';
import { AppContext } from '../contexts/app-context';
import AppBar from '@mui/material/AppBar';
import DragHandleOutlinedIcon from '@mui/icons-material/DragHandleOutlined';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import InputAdornment from '@mui/material/InputAdornment';
import SettingsIcon from './icons/SettingsIcon';
import MessageIcon from './icons/MessageIcon';
import GlobeIcon from './icons/GlobeIcon';
import MenuIcon from './icons/MenuIcon';
import UserIcon from './icons/UserIcon';
import SearchIcon from './icons/SearchIcon';

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
                breakpoints: {
                    md: '600px',
                    xl: '1440px',
                },
                icons: {
                    sizes: {
                        small: 16,
                        medium: 24,
                        large: 32
                    }
                }
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
                            <img src={ app.mode === 'dark' ? '/images/goingup-logo-dark.svg' : '/images/goingup-logo-light.svg' } alt="logo" />
                            <SearchIcon size="small" />
                            <MessageIcon size="medium" />
                            <SettingsIcon size="large" />
                            <GlobeIcon />
                            <MenuIcon />
                            <UserIcon />
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
