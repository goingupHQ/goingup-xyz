import { Button, Stack, TextField, Typography } from '@mui/material';
import { ethers } from 'ethers';
import { useSnackbar } from 'notistack';
import React, { useContext, useState } from 'react';
import { WalletContext } from '../../../../contexts/wallet-context';
import isAdmin from '../../../../pages/api/admin/_isAdmin';

export default function AddWalletToWhitelist(props) {
    const [walletAddress, setWalletAddress] = useState('');

    const { enqueueSnackbar } = useSnackbar();
    const wallet = useContext(WalletContext);

    const addWalletToWhitelist = async () => {
        if (!walletAddress) {
            enqueueSnackbar('Please enter a wallet address', { variant: 'error' });
            return;
        }

        if (!ethers.utils.isAddress(walletAddress)) {
            enqueueSnackbar('Please enter a valid wallet address', { variant: 'error' });
            return;
        }

        const { address: adminAddress } = wallet;
        const signature = await wallet.signMessage(`Adding ${walletAddress} to whitelist`);

        const response = await fetch('/api/admin/membership-nft/add-wallet-to-whitelist', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                adminAddress,
                signature,
                walletAddress
            })
        });

        if (response.status === 200) {
            enqueueSnackbar('Wallet added to whitelist', { variant: 'success' });
        } else {
            enqueueSnackbar('Error adding wallet to whitelist', { variant: 'error' });
        }
    };

    return (
        <>
            <Stack direction="column" alignItems="flex-start" spacing={2}>
                <Typography variant="body1">Add wallet address to whitelist</Typography>
                <TextField label="Wallet Address" value={walletAddress} onChange={e => setWalletAddress(e.target.value)} sx={{ width: { xs: '100%', md: '500px' } }} />
                <Button variant="contained" sx={{ mt: 3 }} onClick={addWalletToWhitelist}>
                    Add To Whitelist
                </Button>
            </Stack>
        </>
    );
}
