import { createTheme, ThemeProvider, Typography, Box, Toolbar, IconButton, Divider } from '@mui/material';
import { useContext, useEffect, useMemo } from 'react';
import { AppContext } from '../contexts/app-context';
import AppBar from '@mui/material/AppBar';
import DragHandleOutlinedIcon from '@mui/icons-material/DragHandleOutlined';
import MarkEmailUnreadOutlinedIcon from '@mui/icons-material/MarkEmailUnreadOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import LanguageOutlinedIcon from '@mui/icons-material/LanguageOutlined';
import PetsOutlinedIcon from '@mui/icons-material/PetsOutlined';


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
                        paper: "transparent",
                        dark: "#0F151C",
                        light: "#FFFFFF",
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
                        main: '#F4CE00',
                    },
                    formBorder: {
                        main: '#FF8199',
                    },
                    icon: {
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
                                padding: '10px 40px'
                            }
                        }
                    },
                    MuiAppBar: {
                        defaultProps: {
                            sx: {
                                backgroundColor: app.mode === 'dark' ? '#0F151C' : '#FFFFFF',
                                height: 80,
                                maxWidth: 1440,
                            },
                            elevation: 0
                        }
                    },
                    MuiCard: {
                        defaultProps: {
                                elevation: 0
                        }
                    },
                    MuiDivider: {
                        defaultProps: {
                            color: app.mode === 'dark' ? '#25303C' : '#E7E7E7',
                            width: 1440,
                        }
                    }
                },
                spacing: [0, 10, 15, 20, 30, 60, 80],
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
                <Toolbar>
                    <Typography variant="h1" sx={{ flexGrow: 3 }}>
                        GoingUP
                    </Typography>
                    <Typography variant="sh1" sx={{ flexGrow: 3, display: { xs: 'none', md: 'block' }}}>
                        Search...
                    </Typography>
                    <IconButton
                        size="large"
                        color="icon"
                        aria-label="email"
                        sx={{ display: { xs: 'none', md: 'block' }}}
                    >
                        <MarkEmailUnreadOutlinedIcon />
                    </IconButton>
                    <IconButton
                        size="large"
                        color="icon"
                        aria-label="settings"
                        sx={{ display: { xs: 'none', md: 'block' }}}
                    >
                        <SettingsOutlinedIcon />
                    </IconButton>
                    <IconButton
                        size="large"
                        color="icon"
                        aria-label="language"
                        sx={{ display: { xs: 'none', md: 'block' }}}
                    >
                        <LanguageOutlinedIcon />
                    </IconButton>
                    <IconButton
                        size="small"
                        color="inherit"
                        aria-label="wallet"
                    >
                        <PetsOutlinedIcon sx={{ display: { xs: 'none', md: 'block' }}} />Connect Wallet
                    </IconButton>
                    <IconButton
                        size="large"
                        color="inherit"
                        aria-label="menu"
                        sx={{ display: { md: 'none', xs: 'block' } }}
                    >
                        <DragHandleOutlinedIcon />
                    </IconButton>
                </Toolbar>
                <Divider />
                </AppBar>
                </Box>
                {children}
            </ThemeProvider>;
        </>
    );
}