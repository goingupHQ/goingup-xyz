import React, { useContext, useRef, useState } from 'react';
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
    Avatar,
    IconButton,
    CircularProgress,
    Box
} from '@mui/material';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import { LoadingButton } from '@mui/lab';
import { useSnackbar } from 'notistack';
import { useRouter } from 'next/router';
import EditProfile from './edit-profile';

const CardContentWrapper = styled(CardContent)(
    () => `
        position: relative;
  `
);

const TopSection = (props) => {
    const [uploadingCover, setUploadingCover] = useState<boolean>(false);
    const [uploadingProfile, setUploadingProfile] = useState<boolean>(false);

    const wallet = useContext(WalletContext);
    const app = useContext(AppContext);
    const { enqueueSnackbar } = useSnackbar();
    const router = useRouter();

    const { account } = props;
    const myAccount = wallet.address === account.address;

    const uploadCoverInputRef = useRef<any>(null);
    const uploadProfileInputRef = useRef<any>(null);
    const editProfileRef = useRef<any>(null);

    const uploadPhoto = async (e, photoType) => {
        if (photoType === 'cover-photo') setUploadingCover(true);
        if (photoType === 'profile-photo') setUploadingProfile(true);

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

            const { address, ethersSigner } = wallet;
            const message = 'update-account';
            const signature = await ethersSigner.signMessage(message);

            const upload = await fetch(url, {
                method: 'POST',
                body: formData
            });

            if (upload.ok) {
                console.log(`Uploaded successfully to ${upload.url}${filename}`, photoType);

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
                    const msg = photoType === 'cover-photo' ? 'Cover photo uploaded' : 'Profile photo uploaded';
                    enqueueSnackbar(msg, { variant: 'success' });
                }
            } else {
                throw('Upload failed.');
            }
        } catch (err) {
            const msg = `Could not upload your ${photoType === 'cover-photo' ? 'cover' : 'profile'} photo`;
            enqueueSnackbar('Could not upload your cover photo', { variant: 'error' });
            console.log(err);
        } finally {
            if (photoType === 'cover-photo') {
                setUploadingCover(false);
                uploadCoverInputRef.current.value = '';
            }

            if (photoType === 'profile-photo') {
                setUploadingProfile(false);
                uploadProfileInputRef.current.value = '';
            }
        }
    };

    return (
        <>
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

                                    <input
                                        ref={uploadProfileInputRef}
                                        accept="image/*"
                                        id="contained-button-file"
                                        type="file"
                                        style={{ display: 'none' }}
                                        onChange={e => { uploadPhoto(e, 'profile-photo') }}
                                    />
                                    <IconButton
                                        disabled={uploadingProfile}
                                        color="primary"
                                        sx={{
                                            position: 'absolute',
                                            left: 150,
                                            top: 200
                                        }}
                                        onClick={() => {
                                            uploadProfileInputRef.current.click();
                                        }}
                                    >
                                        {uploadingProfile &&
                                        <CircularProgress size="20px" />
                                        }
                                        {!uploadingProfile &&
                                        <FileUploadIcon />
                                        }
                                    </IconButton>
                                    <Box display="flex" sx={{ marginBottom: 2 }} justifyContent={{ xs: 'center', md:'initial' }}>
                                        <Button color="primary" variant="contained" onClick={() => { editProfileRef.current.showModal() }}>
                                            Edit My GoingUP Profile
                                        </Button>
                                    </Box>
                                </>
                            )}
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

            <EditProfile ref={editProfileRef} account={account} />
        </>
    )
}

export default TopSection;