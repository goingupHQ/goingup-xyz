import Head from 'next/head';
import { Typography, Box } from '@mui/material';
import SuggestedProfiles from '../../components/pages/dashboard/suggested-profiles';

export default function Dashboard() {

    return (
        <>
            <Head>
                <title>GoingUP: Profile</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <Typography variant="h1"></Typography>

            <Box>
                <SuggestedProfiles />
            </Box>
        </>
    );
}
