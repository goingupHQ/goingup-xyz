import Head from 'next/head';
import { Typography } from '@mui/material';
import { AppContext } from '../../contexts/app-context';
import { useContext } from 'react';

export default function Collaborators() {
    const app = useContext(AppContext);

    return (
        <>
            <Head>
                <title>GoingUP: Collaborators</title>
            </Head>

            <Typography variant="h1">Collaborators</Typography>
        </>
    );
}
