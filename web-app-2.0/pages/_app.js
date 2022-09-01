import { createTheme, ThemeProvider, useMediaQuery, useTheme } from '@mui/material';
import { SnackbarProvider } from 'notistack';
import { useContext } from 'react';
import Layout from '../components/layout';
import { AppContext, AppProvider } from '../contexts/app-context';
import { ProjectsProvider } from '../contexts/projects-context';
import { WalletProvider } from '../contexts/wallet-context';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import '../styles/globals.css';

function App({ Component, pageProps }) {
    return (
        <LocalizationProvider dateAdapter={AdapterMoment}>
            <SnackbarProvider maxSnack={7} preventDuplicate>
                <AppProvider>
                    <WalletProvider>
                        <ProjectsProvider>
                            <Layout>
                                <Component {...pageProps} />
                            </Layout>
                        </ProjectsProvider>
                    </WalletProvider>
                </AppProvider>
            </SnackbarProvider>
        </LocalizationProvider>
    );
}

export default App;
