import Head from 'next/head';
import { Typography } from '@mui/material';
import { AppContext } from '../../contexts/app-context';
import { useContext, useEffect } from 'react';
import { Box } from '@mui/system';
import { useRouter } from 'next/router';
import { OrganizationsContext } from '../../contexts/organizations-context';
import OrganizationsSection from '../../components/pages/organizations/organizations-section';

export default function Organizations() {
    const app = useContext(AppContext);
    const org = useContext(OrganizationsContext);
    const router = useRouter();

    return (
        <>
            <Head>
                <title>GoingUP: Organizations</title>
                <link rel='icon' href='/favicon.ico' />
            </Head>

            <Typography variant='h1' marginY={3}>
                Organizations
            </Typography>

            {org.organizations === null && (
                <Box sx={{ mt: 4, textAlign: 'center' }}>
                    <Typography variant='h2'>
                        You need a connected wallet with a GoingUP account to
                        access your Organization
                    </Typography>
                    <img
                        src='/images/illustrations/connection-lost.svg'
                        alt='connection-lost'
                        style={{ width: '100%', maxWidth: '500px' }}
                    />
                </Box>
            )}

            {org.organizations !== null && <OrganizationsSection />}
        </>
    );
}
