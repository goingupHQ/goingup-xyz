import Head from 'next/head';
import { Button, Stack, Typography } from '@mui/material';
import { AppContext } from '../../contexts/app-context';
import { useContext, useEffect } from 'react';
import { WalletContext } from '../../contexts/wallet-context';
import { Box } from '@mui/system';
import { useRouter } from 'next/router';
import { OrganizationsContext } from '../../contexts/organizations-context';

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

            {org.organizations !== null && (
                <>
                    {org.organizations.map((organization) => (
                        <Box
                            key={organization.address}
                            sx={{
                                display: 'inline-block',
                                width: {xs: '100%', md: '300px'},
                                height: '300px',
                                borderRadius: '10px',
                                margin: {xs: '10px 0', md: '10px 10px'},
                                backgroundColor:
                                    app.mode === 'dark' ? '#111921' : '#F5F5F5',
                                borderRadius: '8px',
                                padding: '15px',
                            }}>
                            <img
                                src={organization.logo}
                                alt={organization.name}
                                style={{ width: '200px', height: '140px' }}
                            />

                            <Typography variant='h3'>
                                {organization.description}
                            </Typography>
                            <Stack
                                direction='row'
                                alignItems='center'
                                marginTop={4}
                                spacing={2}>
                                <Button
                                    variant='contained'
                                    color='secondary'
                                    onClick={() => {
                                        router.push(
                                            `/organizations/${organization.address}`
                                        );
                                    }}>
                                    Protocol
                                </Button>
                                <Button variant='contained' color='secondary'>
                                    Identity
                                </Button>
                            </Stack>
                        </Box>
                    ))}
                </>
            )}
        </>
    );
}
