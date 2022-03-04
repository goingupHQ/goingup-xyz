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
    Button,
    Fade
} from '@mui/material';

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
                <title>Events</title>
            </Head>
            <Grid
                sx={{ px: { xs: 2, md: 4} }}
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
                                marginTop: { xs: '2rem', md:'3rem'}
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
                                            Events
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
