import React, { useContext } from 'react';
import Head from 'next/head';
import possessive from '@wardrakus/possessive';
import { WalletContext } from 'src/contexts/WalletContext';
import { AppContext } from '@/contexts/AppContext';
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
    Stack,
    Chip
} from '@mui/material';

const CardContentWrapper = styled(CardContent)(
    () => `
        position: relative;
  `
);

const uploadPhoto = async (e) => {
    const file = e.target.files[0];
    // const filename = encodeURIComponent(file.name);
    const filename = 'crappy-file-2';
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

    console.log(upload);

    if (upload.ok) {
        console.log(`Uploaded successfully to ${upload.url}${file.name}`);
    } else {
        console.error('Upload failed.');
    }
};

export async function getServerSideProps(context) {
    const { address } = context.params;
    const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/get-account?address=${address}`
    );

    if (response.status === 404) return { notFound: true };

    const account = await response.json();

    return {
        props: {
            account
        }
    };
}

function CreateAccount(props) {
    const wallet = useContext(WalletContext);
    const app = useContext(AppContext); console.log(app);

    const { account } = props;
    console.log(account);
    return (
        <>
            <Head>
                <title>{possessive(account.name)} GoingUP Profile</title>
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
                                            {possessive(account.name)} Profile
                                        </Typography>
                                        <Typography variant="subtitle1">
                                            {account.address}
                                        </Typography>

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
                                {/* <p>Upload a .png or .jpg image (max 1MB).</p>
                                <input
                                    onChange={uploadPhoto}
                                    type="file"
                                    accept="image/png, image/jpeg"
                                /> */}
                                <Stack direction="row" spacing={1} alignItems="center" sx={{ marginBottom: '8px' }}>
                                    <Typography variant="body1">Occupation</Typography>
                                    <Chip
                                        label={app.occupations.find(o => o.id == account.occupation)?.text}
                                        variant="outlined"
                                    />
                                </Stack>
                                <Stack direction="row" spacing={1} alignItems="center" sx={{ marginBottom: '8px' }}>
                                    <Typography variant="body1">Open To</Typography>
                                    {account.openTo.map(item => (
                                        <Chip
                                            label={app.availability.find(a => a.id == item)?.text}
                                            // label={item}
                                            variant="outlined"
                                        />
                                    ))}
                                </Stack>
                                <Stack direction="row" spacing={1} alignItems="center" sx={{ marginBottom: '8px' }}>
                                    <Typography variant="body1">Project Goals</Typography>
                                    {account.projectGoals.map(item => (
                                        <Chip
                                            label={app.userGoals.find(a => a.id == item)?.text}
                                            // label={item}
                                            variant="outlined"
                                        />
                                    ))}
                                </Stack>
                                <Stack direction="row" spacing={1} alignItems="center" sx={{ marginBottom: '8px' }}>
                                    <Typography variant="body1">Ideal Collaborators</Typography>
                                    {account.idealCollab.map(item => (
                                        <Chip
                                            label={app.occupations.find(o => o.id == item)?.text}
                                            // label={item}
                                            variant="outlined"
                                        />
                                    ))}
                                </Stack>
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
