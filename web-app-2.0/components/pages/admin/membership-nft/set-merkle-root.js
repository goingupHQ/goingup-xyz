import { Button, Stack, TextField, Typography } from '@mui/material';
import { useSnackbar } from 'notistack';
import React, { useContext, useState } from 'react';
import { WalletContext } from '../../../../contexts/wallet-context';
import getMembershipNFTContract from '../../../contracts/membership-nft';

export default function SetMerkleRoot(props) {
    const { enqueueSnackbar } = useSnackbar();
    const wallet = useContext(WalletContext);

    const setMerkleRoot = async () => {
        const response = await fetch('/api/admin/membership-nft/get-merkle-root');
        const root = await response.text();

        const { address } = wallet;
        const contract = getMembershipNFTContract(wallet.ethersSigner);

        await contract.setWhitelistRoot(root);

        enqueueSnackbar('Setting merkle root transaction submitted', { variant: 'success' });
    };

    return (
        <>
            <Stack direction="column" alignItems="flex-start" spacing={2}>
                <Button variant="contained" sx={{ mt: 3 }} onClick={setMerkleRoot}>
                    Set Whitelist Merkle Root
                </Button>
            </Stack>
        </>
    );
}
