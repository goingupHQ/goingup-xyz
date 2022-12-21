import Head from 'next/head';
import { Typography, Box } from '@mui/material';
import { AppContext } from '../../contexts/app-context';
import { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { OrganizationsContext } from '../../contexts/organizations-context';
import OrganizationsList from '../../components/pages/organizations/organizations-list';

export default function Organizations() {
    const app = useContext(AppContext);
    const org = useContext(OrganizationsContext);
    const router = useRouter();
    const [count, setCount] = useState(0);

    useEffect(() => {
        fetch('/api/get-orgs-count')
            .then((res) => res.json())
            .then((data) => {
                setCount(data.orgsCount);
            });
    }, []);

    return (
        <>
            <Head>
                <title>GoingUP: Organizations</title>
                <link rel='icon' href='/favicon.ico' />
            </Head>

            <Typography variant='h1' marginY={3}>
                Organizations: showing {count} results
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

            {org.organizations !== null && <OrganizationsList />}
        </>
    );
}
