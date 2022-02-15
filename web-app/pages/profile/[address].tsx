import React, { useContext, useRef, useState } from 'react';
import Head from 'next/head';
import possessive from '@wardrakus/possessive';
import { v4 as uuid } from 'uuid';
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
    Chip,
    CardMedia,
    CardActions,
    Avatar,
    IconButton,
    Input
} from '@mui/material';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import { LoadingButton } from '@mui/lab';
import { useSnackbar } from 'notistack';
import { useRouter } from 'next/router';

const CardContentWrapper = styled(CardContent)(
    () => `
        position: relative;
  `
);

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
    const [uploadingCover, setUploadingCover] = useState<boolean>(false);
    const [uploadingProfile, setUploadingProfile] = useState<boolean>(false);

    const wallet = useContext(WalletContext);
    const app = useContext(AppContext);
    const { enqueueSnackbar } = useSnackbar();
    const router = useRouter();

    const { account } = props;
    console.log(account);

    const myAccount = wallet.address === account.address;

    const uploadCoverInputRef = useRef<any>(null);

    const uploadPhoto = async (e, photoType) => {
        setUploadingCover(true);

        try {
            const file = e.target.files[0];
            // const filename = encodeURIComponent(file.name);
            const filename = uuid();
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
                console.log(`Uploaded successfully to ${upload.url}${filename}`, photoType);

                const { address, ethersSigner } = wallet;
                const message = 'update-account';
                const signature = await ethersSigner.signMessage(message);

                let account: any = {};
                if (photoType === 'cover-photo') account.coverPhoto = `${upload.url}${filename}`;
                if (photoType === 'profile-photo') account.profilePhoto = `${upload.url}${filename}`;

                const response = await fetch('/api/update-account', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        address,
                        signature,
                        account
                    })
                })

                if (response.status === 200) {
                    router.replace(router.asPath);
                    enqueueSnackbar('Cover photo uploaded', { variant: 'success' });
                }
            } else {
                throw('Upload failed.');
            }
        } catch (err) {
            enqueueSnackbar('Could not upload your cover photo', { variant: 'error' });
            console.log(err);
        } finally {
            setUploadingCover(false);
        }
    };

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
                                    </>
                                }
                            />
                            <CardContentWrapper
                                sx={{
                                    px: 3,
                                    pt: 0
                                }}
                            >
                                <Card
                                    sx={{
                                        width: '100%',
                                        height: '280px',
                                        marginBottom: 12,
                                        position: 'relative'
                                    }}
                                >
                                    <CardMedia
                                        component="img"
                                        height="100%"
                                        image={
                                            account.coverPhoto ||
                                            '/static/images/placeholders/covers/7.jpg'
                                        }
                                    />
                                </Card>
                                <Avatar
                                    src={account.profilePhoto}
                                    sx={{
                                        width: 128,
                                        height: 128,
                                        position: 'absolute',
                                        top: 200,
                                        left: 60
                                    }}
                                    variant="rounded"
                                ></Avatar>
                                {myAccount && (
                                    <>
                                        <input
                                            ref={uploadCoverInputRef}
                                            accept="image/*"
                                            id="contained-button-file"
                                            type="file"
                                            style={{ display: 'none' }}
                                            onChange={e => { uploadPhoto(e, 'cover-photo') }}
                                        />
                                        <LoadingButton
                                            color="primary"
                                            variant="outlined"
                                            size="small"
                                            loading={uploadingCover}
                                            loadingIndicator="Uploading..."
                                            sx={{
                                                position: 'absolute',
                                                right: 36,
                                                top: 10
                                            }}
                                            onClick={() => {
                                                uploadCoverInputRef.current.click();
                                            }}
                                        >
                                            Change cover photo
                                        </LoadingButton>

                                        <IconButton
                                            color="primary"
                                            sx={{
                                                position: 'absolute',
                                                left: 150,
                                                top: 200
                                            }}
                                        >
                                            <FileUploadIcon />
                                        </IconButton>
                                    </>
                                )}
                                {/* <p>Upload a .png or .jpg image (max 1MB).</p>
                                <input
                                    onChange={uploadPhoto}
                                    type="file"
                                    accept="image/png, image/jpeg"
                                /> */}
                                <Stack
                                    direction={{ xs: 'column', md: 'row' }}
                                    spacing={1}
                                    alignItems="center"
                                    sx={{
                                        marginBottom: { xs: '24px', md: '8px' }
                                    }}
                                >
                                    <Typography variant="h4">
                                        Occupation
                                    </Typography>
                                    <Chip
                                        label={
                                            app.occupations.find(
                                                (o) =>
                                                    o.id == account.occupation
                                            )?.text
                                        }
                                        variant="outlined"
                                    />
                                </Stack>
                                <Stack
                                    direction={{ xs: 'column', md: 'row' }}
                                    spacing={1}
                                    alignItems="center"
                                    sx={{
                                        marginBottom: { xs: '24px', md: '8px' }
                                    }}
                                >
                                    <Typography variant="h4">
                                        Open To
                                    </Typography>
                                    {account.openTo.map((item) => (
                                        <Chip
                                            key={item}
                                            label={
                                                app.availability.find(
                                                    (a) => a.id == item
                                                )?.text
                                            }
                                            variant="outlined"
                                        />
                                    ))}
                                </Stack>
                                <Stack
                                    direction={{ xs: 'column', md: 'row' }}
                                    spacing={1}
                                    alignItems="center"
                                    sx={{
                                        marginBottom: { xs: '24px', md: '8px' }
                                    }}
                                >
                                    <Typography variant="h4">
                                        Project Goals
                                    </Typography>
                                    {account.projectGoals.map((item) => (
                                        <Chip
                                            key={item}
                                            label={
                                                app.userGoals.find(
                                                    (a) => a.id == item
                                                )?.text
                                            }
                                            variant="outlined"
                                        />
                                    ))}
                                </Stack>
                                <Stack
                                    direction={{ xs: 'column', md: 'row' }}
                                    spacing={1}
                                    alignItems="center"
                                    sx={{
                                        marginBottom: { xs: '24px', md: '8px' }
                                    }}
                                >
                                    <Typography variant="h4">
                                        Ideal Collaborators
                                    </Typography>
                                    {account.idealCollab.map((item) => (
                                        <Chip
                                            key={item}
                                            label={
                                                app.occupations.find(
                                                    (o) => o.id == item
                                                )?.text
                                            }
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
