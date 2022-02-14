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

const uploadPhoto = async (e) => {
    const file = e.target.files[0];
    const filename = encodeURIComponent(file.name);
    const res = await fetch(`/api/upload-to-gcp?file=${filename}`);
    const { url, fields } = await res.json();
    const formData = new FormData();

    Object.entries({ ...fields, file }).forEach(([key, value]) => {
        // @ts-ignore
        formData.append(key, value);
    });

    const upload = await fetch(url, {
        method: 'POST',
        body: formData
    });

    if (upload.ok) {
        console.log('Uploaded successfully!');
    } else {
        console.error('Upload failed.');
    }
};

function CreateAccount() {
    const wallet = useContext(WalletContext);

    return (
        <>
            <Head>
                <title>Create an account with GoingUP</title>
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
                                            Profile
                                        </Typography>
                                        {wallet.address !== null && (
                                            <Typography variant="subtitle1">
                                                Fill in the fields below to sign
                                                up for an account
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
                                <p>Upload a .png or .jpg image (max 1MB).</p>
                                <input
                                    onChange={uploadPhoto}
                                    type="file"
                                    accept="image/png, image/jpeg"
                                />
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
