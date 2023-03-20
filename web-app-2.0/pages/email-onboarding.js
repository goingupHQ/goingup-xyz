import React, { useContext, useRef } from 'react';
import Head from 'next/head';
import { WalletContext } from '../contexts/wallet-context';
import Image from 'next/image';
import { Box, Typography, Button, Fade, Stack } from '@mui/material';
import CreateAccountForm from '../components/pages/create-account/human-council-form';
import WalletChainSelection from '../contexts/wallet-chain-selection';

function HumanCouncil() {
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
                <title>Create a GoingUP account with your email</title>
            </Head>

            <Fade in={true} timeout={1000}>
                <Box fullWidth>
                    <Typography variant="h1">Create a GoingUP account with your email</Typography>
                    <Typography variant="subtitle1" sx={{ marginBottom: 4 }}>
                        We will create and manage your Web3 wallet for you
                    </Typography>

                    <CreateAccountForm />
                </Box>
            </Fade>
            <WalletChainSelection ref={chainSelectionRef} />
        </>
    );
}

export default HumanCouncil;
