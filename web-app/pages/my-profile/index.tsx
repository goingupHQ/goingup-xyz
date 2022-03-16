import React, { useContext, useEffect, useState } from 'react';
import Head from 'next/head';
import { WalletContext } from 'src/contexts/WalletContext';
import TopNavigationLayout from 'src/layouts/TopNavigationLayout';
import {
    Grid,
    Card,
    CardHeader,
    CardContent,
    Typography,
    styled,
    Button,
    Fade,
    CircularProgress,
    Alert,
    Link
} from '@mui/material';
import { useRouter } from 'next/router';

const CardContentWrapper = styled(CardContent)(
    () => `
        position: relative;
  `
);

function CreateAccount() {
    const wallet = useContext(WalletContext);
    const walletConnected = Boolean(wallet.address);
    const [checking, setChecking] = useState<Boolean>(true);
    const [error, setError] = useState<String>('');
    const [hasAccount, setHasAccount] = useState<Boolean>(false);
    const router = useRouter();

    useEffect(() => {
        if (walletConnected) {
            setChecking(true);
            setError('');
            fetch(`/api/has-account?address=${wallet.address}`)
                .then(async (response) => {
                    if (response.status === 200) {
                        const result = await response.json();
                        setHasAccount(result.hasAccount);
                        if (result.hasAccount) {
                            router.push(`/profile/${wallet.address}`);
                        }
                    } else {
                        throw `http-error-${response.status}`;
                    }
                })
                .catch((err) => {
                    console.log(err);
                    setError(
                        'Sorry there was an error getting your GoingUP account'
                    );
                })
                .finally(() => {
                    setChecking(false);
                });
        }
    }, [wallet.address, walletConnected]);

    return (
        <>
            <Head>
                <title>My Profile</title>
            </Head>
            <Grid
                sx={{ px: { xs: 2, md: 4 } }}
                container
                direction="row"
                justifyContent="center"
                alignItems="stretch"
                spacing={3}
            >
                <Grid item xs={12}>
                    <Fade in={true} timeout={1000}>
                        <Card
                            sx={{
                                height: '100%',
                                display: 'flex',
                                flexDirection: 'column',
                                marginTop: { xs: '2rem', md: '3rem' }
                            }}
                        >
                            <CardHeader
                                sx={{
                                    px: 3,
                                    pt: 3,
                                    alignItems: 'flex-start'
                                }}
                                title={
                                    <>
                                        <Typography variant="h1">
                                            My Profile
                                        </Typography>
                                    </>
                                }
                            />
                            <CardContentWrapper
                                sx={{
                                    px: 3,
                                    pt: 0
                                }}
                            >
                                {checking && <CircularProgress />}

                                {!checking && (
                                    <>
                                        {error && (
                                            <Alert severity="error">
                                                {error}
                                            </Alert>
                                        )}

                                        {!hasAccount && (
                                            <Alert severity="info">
                                                You do not have a GoingUP account yet.
                                                {' '}
                                                <Link href="/create-account">
                                                    Click here to create one.
                                                </Link>
                                            </Alert>
                                        )}

                                        {hasAccount &&
                                        <Alert severity="success">Redirecting...</Alert>
                                        }
                                    </>
                                )}
                            </CardContentWrapper>
                        </Card>
                    </Fade>
                </Grid>
            </Grid>
        </>
    );
}

CreateAccount.getLayout = (page) => (
    <TopNavigationLayout>{page}</TopNavigationLayout>
);

export default CreateAccount;
