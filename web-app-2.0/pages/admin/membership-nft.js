import { Box, Button, Fade, Stack, TextField, Typography } from '@mui/material'
import Head from 'next/head'
import Image from 'next/image';
import React, { useContext, useState } from 'react'
import AddWalletToWhitelist from '../../components/pages/admin/membership-nft/add-wallet-to-whitelist';
import { WalletContext } from '../../contexts/wallet-context';

export default function MembershipNFT(props) {
    const wallet = useContext(WalletContext);
    const [walletAddress, setWalletAddress] = useState('');

    return (
        <>
            <Head>
                <title>GoingUP Membership NFT Admin Page</title>
            </Head>

            <Fade in={true} timeout={1000}>
                <Box fullWidth>
                    <Typography variant="h1" sx={{ marginBottom: 3 }}>Membership NFT Admin Page</Typography>

                    {wallet.address !== null &&
                        <>
                            <AddWalletToWhitelist />
                        </>
                    }

                    {wallet.address === null && (
                        <Stack fullWidth justifyContent="center" alignItems="center" direction="column">
                            <Image src="/images/illustrations/connection-lost.svg" alt='connection-lost' style={{ width: '100%', maxWidth: '500px'}} />
                            <Typography variant="h2" sx={{ marginTop: 5 }}>Please connect your wallet as it is required to access the admin page</Typography>
                        </Stack>
                    )}
                </Box>
            </Fade>
        </>
    )
}
