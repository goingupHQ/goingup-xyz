import React, { useContext, useRef } from 'react';
import Head from 'next/head';
import { WalletContext } from '../contexts/wallet-context';

import { Box, Typography, Button, Fade, Stack } from '@mui/material';
import CreateAccountForm from '../components/pages/create-account/create-account-form';
import WalletChainSelection from '../contexts/wallet-chain-selection';

function CreateAccount() {
    const wallet = useContext(WalletContext);
    const chainSelectionRef = useRef(null);
    const connect = () => {
        if (wallet.address === null) {
            let cache;

            try {
                cache = JSON.parse(localStorage.getItem('wallet-context-cache'));
            } catch (err) {}

            if (cache) {
                if (!wallet.address) {
                    if (cache.blockchain === 'ethereum') {
                        wallet.connectEthereum();
                    } else if (cache.blockchain === 'cardano') {
                        wallet.connectCardano();
                    }
                }
            } else {
                if (!wallet.address) chainSelectionRef.current.showModal();
            }
        } else {
            setOpen(true);
        }
    };

    return (
        <>
            <Head>
                <title>Create an account with GoingUP</title>
            </Head>

            <Fade in={true} timeout={1000}>
                <Box fullWidth>
                    <Typography variant="h1">Create Account</Typography>
                    <Typography variant="subtitle1" sx={{ marginBottom: 4 }}>
                        {wallet.address !== null && `Fill in the fields below to sign up for an account`}
                        {wallet.address == null && `Connect your wallet first`}
                    </Typography>

                    {wallet.address !== null && <CreateAccountForm />}

                    {wallet.address === null && (
                        <Stack fullWidth justifyContent="center" alignItems="center" direction="column">
                            <Typography variant="h3">A wallet address is required to create an account</Typography>
                            <img src="/images/illustrations/connection-lost.svg" style={{ width: '100%', maxWidth: '500px'}} />
                            <Button variant="contained" sx={{ mt: 3 }} onClick={connect}>
                                Click here to connect a wallet
                            </Button>
                        </Stack>
                    )}
                </Box>
            </Fade>
            <WalletChainSelection ref={chainSelectionRef} />
        </>
    );
}

export default CreateAccount;
