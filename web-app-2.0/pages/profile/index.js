import Head from 'next/head';
import { Typography } from '@mui/material';
import { AppContext } from '../../contexts/app-context';
import { useContext, useEffect } from 'react';
import { WalletContext } from '../../contexts/wallet-context';
import { Box } from '@mui/system';
import { useRouter } from 'next/router';

export default function Profile() {
    const app = useContext(AppContext);
    const wallet = useContext(WalletContext);
    const router = useRouter();

    useEffect(() => {
        if (wallet.address) {
            fetch(`/api/has-account?address=${wallet.address}`)
                .then(async (res) => {
                    const result = await res.json();
                    if (result.hasAccount) {
                        router.push(`/profile/${wallet.address}`);
                    } else {
                        router.push(`/create-account`);
                    }
                });
        }
    }, [wallet.address]);

    return (
        <>
            <Head>
                <title>GoingUP: Profile</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <Typography variant="h1">Profile</Typography>

            {wallet.address === null &&
                <Box sx={{ mt: 4, textAlign: 'center' }}>
                    <Typography variant="h2">You need a connected wallet with a GoingUP account to access your Profile</Typography>
                    <img src="/images/illustrations/connection-lost.svg" alt="connection-lost" style={{ width: '100%', maxWidth: '500px' }} />
                </Box>
            }

            {wallet.address !== null &&
                <Box sx={{ mt: 4, textAlign: 'center' }}>
                    <Typography variant="h2">Redirecting... </Typography>
                    <img src="/images/illustrations/connection-lost.svg" alt="connection-lost" style={{ width: '100%', maxWidth: '500px' }} />
                </Box>
            }
        </>
    );
}
