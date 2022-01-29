import React, { useContext } from 'react';
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
    Button
} from '@mui/material';
import CreateAccountForm from './create-account-form';
import { error } from 'console';

const CardContentWrapper = styled(CardContent)(
    () => `
        position: relative;
  `
);

function CreateAccount() {
    const wallet = useContext(WalletContext);

    return (
        <>
            <Head>
                <title>Create an account with GoingUP</title>
            </Head>
            <Grid
                sx={{ px: 4 }}
                container
                direction="row"
                justifyContent="center"
                alignItems="stretch"
                spacing={3}
            >
                <Grid item xs={12}>
                    <Card
                        sx={{
                            height: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                            marginTop: '4rem'
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
                                        Create Account
                                    </Typography>
                                    {wallet.address !== null && (
                                        <Typography variant="subtitle1">
                                            Fill in the fields below to sign up for an account
                                        </Typography>
                                    )}

                                    {wallet.address == null && (
                                        <Typography variant="subtitle1">
                                            Connect your wallet first
                                        </Typography>
                                    )}
                                </>
                            }
                        />
                        <CardContentWrapper
                            sx={{
                                px: 3,
                                pt: 0
                            }}
                        >
                            {wallet.address !== null && <CreateAccountForm />}

                            {wallet.address === null &&
                            <>
                                <Typography variant="h3">
                                    A wallet address is required to create an account
                                </Typography>
                                <Button variant="contained" sx={{ mt: 3 }} onClick={wallet.connect}>
                                    Click here to connect a wallet
                                </Button>
                            </>
                            }
                        </CardContentWrapper>
                    </Card>
                </Grid>
            </Grid>
        </>
    );
}

CreateAccount.getLayout = (page) => (
    <TopNavigationLayout>{page}</TopNavigationLayout>
);

export default CreateAccount;
