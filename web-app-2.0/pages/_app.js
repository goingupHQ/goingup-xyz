import {
    createTheme,
    ThemeProvider,
    useMediaQuery,
    useTheme,
} from '@mui/material';
import { SnackbarProvider } from 'notistack';
import { useContext } from 'react';
import Layout from '../components/layout';
import { AppContext, AppProvider } from '../contexts/app-context';
import { ProjectsProvider } from '../contexts/projects-context';
import { WalletProvider } from '../contexts/wallet-context';
import { UtilityTokensProvider } from '../contexts/utility-tokens-context';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import '../styles/globals.css';
import { OrganizationsProvider } from '../contexts/organizations-context';
import AppTheme from '../app-theme';

function App({ Component, pageProps }) {
    return (
        <LocalizationProvider dateAdapter={AdapterMoment}>
            <SnackbarProvider maxSnack={20} preventDuplicate>
                <AppProvider>
                    <AppTheme>
                        <WalletProvider>
                            <OrganizationsProvider>
                                <UtilityTokensProvider>
                                    <ProjectsProvider>
                                        <Layout>
                                            <Component {...pageProps} />
                                        </Layout>
                                    </ProjectsProvider>
                                </UtilityTokensProvider>
                            </OrganizationsProvider>
                        </WalletProvider>
                    </AppTheme>
                </AppProvider>
            </SnackbarProvider>
        </LocalizationProvider>
    );
}

export default App;
