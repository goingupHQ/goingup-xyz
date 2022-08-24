import { Box, createTheme, ThemeProvider } from '@mui/material';
import { useContext, useEffect, useMemo } from 'react';
import { AppContext } from '../contexts/app-context';
import { WalletContext } from '../contexts/wallet-context';
import Header from './layout/header';
import { darkTheme, lightTheme, RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { Padding } from "@mui/icons-material";

export default function Layout({ children, chains }) {
    const app = useContext(AppContext);
    const wallet = useContext(WalletContext);

    const theme = useMemo(
        () =>
            createTheme({
                palette: {
                    mode: app.mode,
                    primary: {
                        main: "#F4CE00",
                    },
                    background: {
                        paper: app.mode === "dark" ? "#111921" : "#F5F5F5",
                        dark: "#0F151C",
                        light: "#FFFFFF",
                        default: app.mode === "dark" ? "#0F151C" : "#FFFFFF",
                        main: app.mode === "dark" ? "#0F151C" : "#FFFFFF",
                        searchBar: app.mode === "dark" ? "#19222C" : "#F5F5F5",
                        userBox: app.mode === "dark" ? "#19222C" : "#EDEFED",
                    },
                    hoverPrimary: {
                        main: "#FFE555",
                    },
                    activePrimary: {
                        main: "#FFF4B8",
                    },
                    secondary: {
                        main: "#7A55FF",
                    },
                    error: {
                        main: "#FF8199",
                    },
                    text1: {
                        main: "#FFFFFF",
                    },
                    text1: {
                        main: "#4D5F72",
                    },
                    background1: {
                        main: "#0F151C",
                    },
                    background2: {
                        main: "#19222C",
                    },
                    backgroundLight: {
                        main: "#FFFFFF",
                    },
                    hoverFollow: {
                        main: "#5537C3",
                        text: "#F4CE00",
                    },
                    activeFollow: {
                        main: "#3AB795",
                        text: "#FFFFFF",
                    },
                    hoverViewAllProjects: {
                        main: "#F4CE00",
                    },
                    activeViewAllProjects: {
                        main: "#D2B200",
                    },
                    hoverTabDark: {
                        main: "#151E26",
                    },
                    hoverTabLight: {
                        main: "#F5F5F5",
                    },
                    hoverListDark: {
                        main: "#F4CE00",
                    },
                    hoverListLight: {
                        main: "#378CDB",
                    },
                    formBorder: {
                        main: "#FF8199",
                    },
                    text: {
                        main: app.mode === "dark" ? "#FFFFFF" : "#010101",
                    },
                    icon: {
                        main: app.mode === "dark" ? "#4D5F72" : "#4D5F72",
                        contacts: app.mode === "dark" ? "#FFFFFF" : "#081724",
                        contactsBackground:
                            app.mode === "dark" ? "#253340" : "#CFCFCF",
                    },
                    hoverTab: {
                        main: "#4D5F72",
                    },
                    sidebar: {
                        main: '#394859',
                    },
                },
                typography: {
                    fontFamily: "Questrial",
                    h1: {
                        fontSize: "32px",
                        "@media (max-width:900px)": {
                            fontSize: "16px",
                        },
                        fontWeight: "bold",
                    },
                    h2: {
                        fontSize: "24px",
                        fontWeight: "bold",
                    },
                    h3: {
                        fontSize: "18px",
                        fontWeight: "bold",
                    },
                    sh1: {
                        fontSize: "16px",
                        "@media (max-width:900px)": {
                            fontSize: "12px",
                        },
                        fontWeight: "500",
                    },
                    sh2: {
                        fontSize: "14px",
                        "@media (max-width:900px)": {
                            fontSize: "10px",
                        },
                        fontWeight: "500",
                    },
                    sh3: {
                        fontSize: "12px",
                        fontWeight: "500",
                    },
                    p: {
                        fontSize: "16px",
                        fontWeight: "medium",
                    },
                    button: {
                        textTransform: "capitalize",
                        fontWeight: "bold",
                    },
                    allVariants: {
                        color: app.mode === 'dark' ? '#FFFFFF' : '#010101',
                    },
                    rep: {
                        fontSize: "15px",
                        "@media (max-width:900px)": {
                            fontSize: "7px",
                        },
                        fontWeight: "500",
                    },
                    walletText: {
                        fontSize: "12px",
                        "@media (max-width:900px)": {
                            fontSize: "10px",
                        },
                        fontWeight: "500",
                    }
                },
                shape: {
                    borderRadius: "8px",
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
                                backgroundColor:
                                    app.mode === "dark" ? "#0F151C" : "#FFFFFF",
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
                            color: app.mode === "dark" ? "#25303C" : "#E7E7E7",
                        },
                    },
                    MuiChip: {
                        defaultProps: {
                            borderRadius: 0,
                        },
                    },
                    MuiToolbar: {
                        defaultProps: {
                            sx: {
                                paddingTop: { xs: "15px", md: "20px" },
                                paddingX: { xs: "15px", lg: "105px" },
                            },
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
        // update body background color on theme change
        document.body.style.backgroundColor =
            app.mode === "dark"
                ? theme.palette.background.dark
                : theme.palette.background.light;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [app.mode]);

    useEffect(() => {
        // connect wallet if cached
        if (localStorage.getItem("wallet-context-cache")) wallet.connect();
    }, []);

    return (
        <>
            <RainbowKitProvider
                theme={
                    app.mode === 'light'
                        ? lightTheme({
                            accentColor: '#F4CE00',
                            accentColorForeground: '#000000',
                            borderRadius: 'small',
                            fontStack: 'rounded',
                        })
                        : darkTheme({
                            accentColor: '#F4CE00',
                            accentColorForeground: '#000000',
                            borderRadius: 'small',
                            fontStack: 'rounded',
                        })
                }
                chains={chains}
            >
                <ThemeProvider theme={theme}>
                    <Header />
                    <Box sx={{ paddingTop: { xs: '42px', md: '120px' } }}>{children}</Box>
                </ThemeProvider>
            </RainbowKitProvider>
        </>
    );
}
