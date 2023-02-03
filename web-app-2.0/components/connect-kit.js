import React from 'react';
import { WagmiConfig, createClient } from 'wagmi';
import { ConnectKitProvider, ConnectKitButton, getDefaultClient } from 'connectkit';
import { useTheme } from '@mui/material';

const infuraId = process.env.NEXT_PUBLIC_INFURA_KEY;
const client = createClient(
    getDefaultClient({
        appName: 'GoingUP',
        infuraId,
    })
);

export default function ConnectKit(props) {
    const theme = useTheme();
    return (
        <WagmiConfig client={client}>
            <ConnectKitProvider theme="default" mode={theme.palette.mode}>
                {props.children}
            </ConnectKitProvider>
        </WagmiConfig>
    );
}
