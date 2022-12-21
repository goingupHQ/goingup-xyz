import Head from 'next/head';
import { Typography, Box } from '@mui/material';
import { AppContext } from '../../contexts/app-context';
import { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { OrganizationsContext } from '../../contexts/organizations-context';
import OrganizationsList from '../../components/pages/organizations/organizations-list';
import LoadingIllustration from '../../components/common/loading-illustration';

export default function Organizations() {
    const app = useContext(AppContext);
    const org = useContext(OrganizationsContext);
    const router = useRouter();
    const [count, setCount] = useState(0);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true);
        fetch('/api/get-orgs-count')
            .then((res) => res.json())
            .then((data) => {
                setCount(data.orgsCount);
            });
            setLoading(false);
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
            {loading ? (
                <Box sx={{ mt: '100px' }}>
                    <LoadingIllustration />
                </Box>
            ) : (
                <OrganizationsList />
            )}
        </>
    );
}
