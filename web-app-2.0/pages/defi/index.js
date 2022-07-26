import Head from 'next/head';
import { Typography } from '@mui/material';
import { AppContext } from '../../contexts/app-context';
import { useContext } from 'react';

export default function Defi() {
    const app = useContext(AppContext);

    return (
        <>
            <Head>
                <title>GoingUP: DeFi</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <Typography variant="h1">DeFi</Typography>
        </>
    );
}
