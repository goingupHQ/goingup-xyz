import Head from 'next/head';
import { Typography } from '@mui/material';
import { AppContext } from '../../contexts/app-context';
import { useContext, useEffect } from 'react';
import { WalletContext } from '../../contexts/wallet-context';
import { Box } from '@mui/system';
import { useRouter } from 'next/router';
import SuggestedProfilesPage from './suggested-profiles-page';

export default function Dashboard() {

    return (
        <>
            <Head>
                <title>GoingUP: Profile</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <Typography variant="h1">Dashboard</Typography>

            <Box>
                <SuggestedProfilesPage />
            </Box>
        </>
    );
}
