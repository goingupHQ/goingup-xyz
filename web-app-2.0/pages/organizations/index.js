import Head from 'next/head';
import { Button, Stack, Typography } from '@mui/material';
import { AppContext } from '../../contexts/app-context';
import { useContext, useEffect } from 'react';
import { WalletContext } from '../../contexts/wallet-context';
import { Box } from '@mui/system';
import { useRouter } from 'next/router';

const organizations = [
    {
        name: 'GoingUp',
        description: 'Web3 Protocol for reputation & identity description',
        address: '0x5f4eC3D',
        logo: 'http://localhost:3025/images/goingup-logo-dark.svg',
    },
    {
        name: 'GoingUp',
        description: 'Web3 Protocol for reputation & identity description',
        address: '0x5f4eC3D',
        logo: 'http://localhost:3025/images/goingup-logo-dark.svg',
    },
    {
        name: 'GoingUp',
        description: 'Web3 Protocol for reputation & identity description',
        address: '0x5f4eC3D',
        logo: 'http://localhost:3025/images/goingup-logo-dark.svg',
    },
    {
        name: 'GoingUp',
        description: 'Web3 Protocol for reputation & identity description',
        address: '0x5f4eC3D',
        logo: 'http://localhost:3025/images/goingup-logo-dark.svg',
    },
    {
        name: 'GoingUp',
        description: 'Web3 Protocol for reputation & identity description',
        address: '0x5f4eC3D',
        logo: 'http://localhost:3025/images/goingup-logo-dark.svg',
    },
    {
        name: 'GoingUp',
        description: 'Web3 Protocol for reputation & identity description',
        address: '0x5f4eC3D',
        logo: 'http://localhost:3025/images/goingup-logo-dark.svg',
    },
];

export default function Organizations() {
    const app = useContext(AppContext);
    const wallet = useContext(WalletContext);
    const router = useRouter();

    return (
        <>
            <Head>
                <title>GoingUP: Organizations</title>
                <link rel='icon' href='/favicon.ico' />
            </Head>

            <Typography variant='h1' marginY={2}>
                Organizations
            </Typography>

            {organizations === null && (
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

            {organizations !== null && (
                <>
                    {organizations.map((organization) => (
                        <Box
                            key={organization.address}
                            sx={{
                                display: 'inline-block',
                                width: 'full',
                                height: '300px',
                                borderRadius: '10px',
                                margin: '10px',
                                backgroundColor: {
                                    xs:
                                        app.mode === 'dark'
                                            ? '#111921'
                                            : '#F5F5F5',
                                    md:
                                        app.mode === 'dark'
                                            ? '#111921'
                                            : '#FFFFFF',
                                },
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
                                marginTop={5}
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
