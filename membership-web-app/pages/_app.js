import '../styles/globals.css';
import Layout from '../components/layout';
import { createTheme, ThemeProvider } from '@mui/material';

function WebApp({ Component, pageProps }) {
    const theme = createTheme({
        palette: {
            mode: 'dark'
        },
        typography: {
            fontFamily: 'Syne',
            allVariants: {
                color: '#fff'
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
