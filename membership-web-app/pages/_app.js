import '../styles/globals.css';
import Layout from '../components/layout';
import { createTheme, ThemeProvider } from '@mui/material';
import { SnackbarProvider } from 'notistack';

function WebApp({ Component, pageProps }) {
    const theme = createTheme({
        palette: {
            mode: 'dark',
            primary: {
                main: '#F4CE00',
            },
        },
        typography: {
            fontFamily: 'Syne',
            allVariants: {
                color: '#fff',
            },
        },
        components: {
            MuiButton: {
                styleOverrides: {
                    root: {
                        textTransform: 'capitalize',
                    },
                },
            },
            MuiLink: {
                styleOverrides: {
                    root: {
                        color: '#fff',
                        textDecoration: 'none',
                    },
                },
            },
        },
    });

    return (
        <ThemeProvider theme={theme}>
            <SnackbarProvider preventDuplicate>
                <Layout>
                    <Component {...pageProps} />
                </Layout>
            </SnackbarProvider>
        </ThemeProvider>
    );
}

export default WebApp;
