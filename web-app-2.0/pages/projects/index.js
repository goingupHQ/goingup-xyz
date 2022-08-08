import Head from 'next/head';
import { Box, Stack, Typography } from '@mui/material';
import { AppContext } from '../../contexts/app-context';
import { useContext } from 'react';
import { WalletContext } from '../../contexts/wallet-context';

export default function Projects() {
    const app = useContext(AppContext);
    const wallet = useContext(WalletContext);

    return (
        <>
            <Head>
                <title>GoingUP: Projects</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <Box sx={{ paddingTop: '20px' }}>
                {wallet.address === null && (
                    <Stack fullWidth justifyContent="center" alignItems="center" direction="column" spacing={4}>
                        <Typography variant="h2">You need a connected wallet with a GoingUP account to access Projects</Typography>
                        <img src="/images/illustrations/connection-lost.svg" alt='connection-lost' style={{ width: '100%', maxWidth: '500px'}} />
                    </Stack>
                )}
            </Box>
        </>
    );
}
