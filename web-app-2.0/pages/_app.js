import { createTheme, ThemeProvider, useMediaQuery, useTheme } from '@mui/material';
import { useContext } from 'react';
import Layout from '../components/layout';
import { AppContext, AppProvider } from '../contexts/app-context';
import '../styles/globals.css';

function App({ Component, pageProps }) {
    return (
        <AppProvider>
            <Layout>
                <Component {...pageProps} />
            </Layout>
        </AppProvider>
    );
}

export default App;
