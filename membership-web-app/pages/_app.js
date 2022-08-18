import '../styles/globals.css';
import Layout from '../components/layout';
import { createTheme, ThemeProvider } from '@mui/material';

function WebApp({ Component, pageProps }) {
    const theme = createTheme({
        palette: {
            mode: 'dark',
            primary: {
                main: '#F4CE00',
            }
        },
        typography: {
            fontFamily: 'Syne',
            allVariants: {
                color: '#fff'
            }
        },
        components: {
            MuiButton: {
                styleOverrides: {
                    root: {
                        textTransform: 'capitalize'
                    }
                }
            }
        }
    });

    return (
        <ThemeProvider theme={theme}>
            <Layout>
                <Component {...pageProps} />
            </Layout>
        </ThemeProvider>
    );
}

export default WebApp;
