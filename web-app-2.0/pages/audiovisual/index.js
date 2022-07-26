import Head from 'next/head';
import { Typography } from '@mui/material';
import { AppContext } from '../../contexts/app-context';
import { useContext } from 'react';

export default function AudioVisual() {
    const app = useContext(AppContext);

    return (
        <>
            <Head>
                <title>GoingUP: Audio Visual</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <Typography variant="h1">Audio Visual</Typography>
        </>
    );
}
