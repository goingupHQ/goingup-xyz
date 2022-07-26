import Head from 'next/head';
import { Typography } from '@mui/material';
import { AppContext } from '../../contexts/app-context';
import { useContext } from 'react';

export default function Charities() {
    const app = useContext(AppContext);

    return (
        <>
            <Head>
                <title>GoingUP: Charities</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <Typography variant="h1">Charities</Typography>
        </>
    );
}
