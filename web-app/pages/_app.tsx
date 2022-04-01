import type { ReactElement, ReactNode } from 'react';
import type { NextPage } from 'next';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import Router from 'next/router';
import nProgress from 'nprogress';
import 'nprogress/nprogress.css';
import ThemeProvider from 'src/theme/ThemeProvider';
import CssBaseline from '@mui/material/CssBaseline';
import { CacheProvider, EmotionCache } from '@emotion/react';
import createEmotionCache from 'src/createEmotionCache';
import { appWithTranslation } from 'next-i18next';
import { SidebarProvider } from 'src/contexts/SidebarContext';
import { WalletProvider, WalletContext } from 'src/contexts/WalletContext';
import 'src/utils/chart';
// import { Provider as ReduxProvider } from 'react-redux';
// import { store } from 'src/store';
import Loader from 'src/components/Loader';
// import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DateAdapter from '@mui/lab/AdapterMoment';
import useScrollTop from 'src/hooks/useScrollTop';
import { SnackbarProvider } from 'notistack';
import { AuthConsumer, AuthProvider } from 'src/contexts/JWTAuthContext';
import { AppProvider } from '@/contexts/AppContext';

import './_app.css';

const clientSideEmotionCache = createEmotionCache();

type NextPageWithLayout = NextPage & {
    getLayout?: (page: ReactElement) => ReactNode;
};

interface MyAppProps extends AppProps {
    emotionCache?: EmotionCache;
    Component: NextPageWithLayout;
}

function MyApp(props: MyAppProps) {
    const {
        Component,
        emotionCache = clientSideEmotionCache,
        pageProps
    } = props;
    const getLayout = Component.getLayout ?? ((page) => page);
    useScrollTop();

    Router.events.on('routeChangeStart', nProgress.start);
    Router.events.on('routeChangeError', nProgress.done);
    Router.events.on('routeChangeComplete', nProgress.done);

    return (
        <CacheProvider value={emotionCache}>
            <Head>
                <title>Going Up</title>
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1, shrink-to-fit=no"
                />
            </Head>
            <LocalizationProvider dateAdapter={DateAdapter}>
                <SidebarProvider>
                    <ThemeProvider>
                        <SnackbarProvider
                            maxSnack={6}
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'right'
                            }}
                            preventDuplicate
                        >
                            <AppProvider>
                                <WalletProvider>
                                    <AuthProvider>
                                        <CssBaseline />
                                        <AuthConsumer>
                                            {(auth) =>
                                                !auth.isInitialized ? (
                                                    <Loader />
                                                ) : (
                                                    getLayout(
                                                        <Component {...pageProps} />
                                                    )
                                                )
                                            }
                                        </AuthConsumer>
                                    </AuthProvider>
                                </WalletProvider>
                            </AppProvider>
                        </SnackbarProvider>
                    </ThemeProvider>
                </SidebarProvider>
            </LocalizationProvider>
        </CacheProvider>
    );
}

export default appWithTranslation(MyApp);
