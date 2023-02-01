import Head from 'next/head';
import { Button, Card, Grid, Stack, Typography } from '@mui/material';
import { useState, useEffect } from 'react';
import { Box } from '@mui/system';
import { useRouter } from 'next/router';
import { v4 as uuid } from 'uuid';

//Near imports
import {
    signIn,
    signOut,
    wallet,
    viewFunction,
    callFunction,
    initNear,
} from '../../contexts/near-context';

export default function Home() {
    const [isLoading, setIsLoading] = useState(true);
    const [user, setUser] = useState(null);
    const [tokens, setTokens] = useState(null);
    const router = useRouter();
    const id = uuid();

    useEffect(() => {
        initNear();
        setIsLoading(false);
        if (wallet.getAccountId()) {
            setUser(wallet.getAccountId());
            console.log('Wallet ID', user);
            console.log('Contract ID', wallet._near.config.owner_id);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [wallet]);

    useEffect(() => {
        if (user) {
            viewFunction('nft_tokens_for_owner', {
                account_id: user,
            }).then((result) => {
                console.log('Tokens', result);
                setTokens(result);
            });
        }
    }, [user]);

    const mintToken = async () => {
        await callFunction(
            'nft_mint',
            {
                token_id: id,
                metadata: {
                    title: 'GoingUp Appreciation Token',
                    description: 'Thank you',
                    media: 'https://app.goingup.xyz/images/appreciation-token-t1-display.jpg',
                },
                receiver_id: user,
            },
            '1', // attached GAS (optional)
            '7730000000000000000000' // attached GAS (optional)
        );
    };

    const mintToken2 = async () => {
        await callFunction(
            'nft_mint',
            {
                token_id: id,
                metadata: {
                    title: 'GoingUp Appreciation Token',
                    description: 'Thank you',
                    media: 'https://app.goingup.xyz/images/appreciation-token-t2-display.jpg',
                },
                receiver_id: user,
            },
            '1', // attached GAS (optional)
            '7730000000000000000000' // attached GAS (optional)
        );
    };

    const mintToken3 = async () => {
        await callFunction(
            'nft_mint',
            {
                token_id: id,
                metadata: {
                    title: 'GoingUp Appreciation Token',
                    description: 'Thank you',
                    media: 'https://app.goingup.xyz/images/appreciation-token-t3-display.jpg',
                },
                receiver_id: user,
            },
            '1', // attached GAS (optional)
            '7730000000000000000000' // attached GAS (optional)
        );
    };

    const mintToken4 = async () => {
        await callFunction(
            'nft_mint',
            {
                token_id: id,
                metadata: {
                    title: 'GoingUp Appreciation Token',
                    description: 'Thank you',
                    media: 'https://app.goingup.xyz/images/appreciation-token-t4-display.jpg',
                },
                receiver_id: user,
            },
            '1', // attached GAS (optional)
            '7730000000000000000000' // attached GAS (optional)
        );
    };

    const sendToken = async () => {
        await callFunction(
            'nft_mint',
            {
                token_id: id,
                metadata: {
                    title: 'GoingUp Appreciation Token',
                    description: 'Thank you!',
                    media: 'https://app.goingup.xyz/images/appreciation-token-t1-display.jpg',
                },
                receiver_id: prompt('Enter the receiver ID'),
            },
            '1', // attached GAS (optional)
            '7730000000000000000000' // attached GAS (optional)
        );
    };

    const sendToken2 = async () => {
        await callFunction(
            'nft_mint',
            {
                token_id: id,
                metadata: {
                    title: 'GoingUp Appreciation Token',
                    description: 'Thank you!',
                    media: 'https://app.goingup.xyz/images/appreciation-token-t2-display.jpg',
                },
                receiver_id: prompt('Enter the receiver ID'),
            },
            '1', // attached GAS (optional)
            '7730000000000000000000' // attached GAS (optional)
        );
    };

    const sendToken3 = async () => {
        await callFunction(
            'nft_mint',
            {
                token_id: id,
                metadata: {
                    title: 'GoingUp Appreciation Token',
                    description: 'Thank you!',
                    media: 'https://app.goingup.xyz/images/appreciation-token-t3-display.jpg',
                },
                receiver_id: prompt('Enter the receiver ID'),
            },
            '1', // attached GAS (optional)
            '7730000000000000000000' // attached GAS (optional)
        );
    };

    const sendToken4 = async () => {
        await callFunction(
            'nft_mint',
            {
                token_id: id,
                metadata: {
                    title: 'GoingUp Appreciation Token',
                    description: 'Thank you!',
                    media: 'https://app.goingup.xyz/images/appreciation-token-t4-display.jpg',
                },
                receiver_id: prompt('Enter the receiver ID'),
            },
            '1', // attached GAS (optional)
            '7730000000000000000000' // attached GAS (optional)
        );
    };

    const handleTransfer = async (token) => {
        await callFunction(
            'nft_transfer',
            {
                receiver_id: prompt('Enter the receiver ID'),
                token_id: token,
            },
            '0.000000000000000000000001', // attached GAS (optional)
            '0.000000000000000000000001' // attached GAS (optional)
        );
    };

    return isLoading ? (
        <Box className='center-Box'>
            <Typography>loading</Typography>
        </Box>
    ) : (
        <Box>
            <Head>
                <title>GoingUP: Profile(Near)</title>
                <link rel='icon' href='/favicon.ico' />
            </Head>

            <Box className='m-6 border-t-4'>
                {!user ? (
                    <Box sx={{ mt: 4, textAlign: 'center' }}>
                        <Typography variant='h2'>
                            You need a connected wallet with a GoingUP account
                            to access your Profile
                        </Typography>
                        <img
                            src='/images/illustrations/connection-lost.svg'
                            alt='connection-lost'
                            style={{
                                width: '100%',
                                maxWidth: '500px',
                                marginTop: '20px',
                            }}
                        />
                        <Box marginY={2}>
                            <Button
                                variant='contained'
                                onClick={() => {
                                    signIn();
                                }}>
                                Connect Wallet
                            </Button>
                        </Box>
                    </Box>
                ) : (
                    <>
                        <Box marginY={2}>
                            <Typography variant='h2' marginY={2}>
                                Welcome, {user}{' '}
                                <Button
                                    marginLeft={2}
                                    variant='contained'
                                    onClick={() => {
                                        signOut();
                                        setUser(null);
                                    }}>
                                    Sign out
                                </Button>
                            </Typography>
                            <Stack direction='row' spacing={2} marginY={2}>
                                {/* <Button
                                    variant='outlined'
                                    onClick={() => {
                                        router.push(`/near/${user}`);
                                    }}>
                                    Create Account
                                </Button> */}
                                <Button
                                    variant='contained'
                                    onClick={() => {
                                        mintToken();
                                    }}>
                                    Mint Token 1
                                </Button>
                                <Button
                                    variant='contained'
                                    onClick={() => {
                                        mintToken2();
                                    }}>
                                    Mint Token 2
                                </Button>
                                <Button
                                    variant='contained'
                                    onClick={() => {
                                        mintToken3();
                                    }}>
                                    Mint Token 3
                                </Button>
                                <Button
                                    variant='contained'
                                    onClick={() => {
                                        mintToken4();
                                    }}>
                                    Mint Token 4
                                </Button>
                            </Stack>

                            <Stack direction='row' spacing={2} marginY={2}>
                                <Button
                                    variant='contained'
                                    color='secondary'
                                    onClick={() => {
                                        sendToken();
                                    }}>
                                    Send Token 1
                                </Button>

                                <Button
                                    variant='contained'
                                    color='secondary'
                                    onClick={() => {
                                        sendToken2();
                                    }}>
                                    Send Token 2
                                </Button>

                                <Button
                                    variant='contained'
                                    color='secondary'
                                    onClick={() => {
                                        sendToken3();
                                    }}>
                                    Send Token 3
                                </Button>

                                <Button
                                    variant='contained'
                                    color='secondary'
                                    onClick={() => {
                                        sendToken4();
                                    }}>
                                    Send Token 4
                                </Button>
                            </Stack>
                            {tokens && (
                                <>
                                    <Typography variant='h1'>
                                        Your Tokens
                                    </Typography>
                                    <Box marginY={2}>
                                        <Grid container spacing={2}>
                                            {tokens.map((token) => (
                                                <Grid item key={token.token_id}>
                                                    <Card
                                                        sx={{
                                                            p: 2,
                                                        }}>
                                                        <Typography
                                                            variant='h3'
                                                            textAlign={
                                                                'center'
                                                            }>
                                                            {
                                                                token.metadata
                                                                    .title
                                                            }
                                                        </Typography>
                                                        <Box
                                                            marginY={2}
                                                            display='flex'
                                                            justifyContent='center'>
                                                            <img
                                                                src={
                                                                    token
                                                                        .metadata
                                                                        .media
                                                                }
                                                                alt={
                                                                    token
                                                                        .metadata
                                                                        .title
                                                                }
                                                                width='200'
                                                                height='200'
                                                            />
                                                        </Box>
                                                        <Typography
                                                            variant='h3'
                                                            textAlign={
                                                                'center'
                                                            }>
                                                            {
                                                                token.metadata
                                                                    .description
                                                            }
                                                        </Typography>
                                                        <Stack
                                                            marginTop={2}
                                                            direction='row'
                                                            spacing={2}>
                                                            <Button
                                                                onClick={() => {
                                                                    router.push(
                                                                        `https://testnet.mynearwallet.com/nft-detail/app.goingup.testnet/${token.token_id}`
                                                                    );
                                                                }}
                                                                variant='contained'
                                                                color='primary'
                                                                type='Button'>
                                                                View Token
                                                            </Button>
                                                            <Button
                                                                onClick={() => {
                                                                    handleTransfer(
                                                                        token.token_id
                                                                    );
                                                                }}
                                                                variant='contained'
                                                                color='secondary'
                                                                type='Button'>
                                                                Transfer Token
                                                            </Button>
                                                        </Stack>
                                                    </Card>
                                                </Grid>
                                            ))}
                                        </Grid>
                                    </Box>
                                </>
                            )}
                        </Box>
                    </>
                )}
            </Box>
        </Box>
    );
}
