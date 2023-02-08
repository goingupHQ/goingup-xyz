import { SnackbarProvider } from 'notistack';
import Layout from '../components/layout';
import { AppProvider } from '../contexts/app-context';
import { ProjectsProvider } from '../contexts/projects-context';
import { WalletProvider } from '../contexts/wallet-context';
import { UtilityTokensProvider } from '../contexts/utility-tokens-context';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import '../styles/globals.css';
import { OrganizationsProvider } from '../contexts/organizations-context';
import AppTheme from '../components/app-theme';
import ConnectKit from '../components/connect-kit';

function App({ Component, pageProps }) {
    return (
        <LocalizationProvider dateAdapter={AdapterMoment}>
            <SnackbarProvider maxSnack={20} preventDuplicate>
                <AppProvider>
                    <AppTheme>
                        <ConnectKit>
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
                        </ConnectKit>
                    </AppTheme>
                </AppProvider>
            </SnackbarProvider>
        </LocalizationProvider>
    );
}

export default App;
