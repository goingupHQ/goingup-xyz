import React, { useContext, useEffect, useRef, useState } from 'react';
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
    Box,
    LinearProgress
} from '@mui/material';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import { LoadingButton } from '@mui/lab';
import { useSnackbar } from 'notistack';
import EditProfile from './edit-profile';
import ContactsAndIntegrations from './contacts-and-integrations';
import SendAppreciationToken from '@/components/common/SendAppreciationToken';
import FollowersList from './followers-list';
import FollowingList from './following-list';

const CardContentWrapper = styled(CardContent)(
    () => `
        position: relative;
  `
);

const TopSection = (props) => {
    const [uploadingCover, setUploadingCover] = useState<boolean>(false);
    const [uploadingProfile, setUploadingProfile] = useState<boolean>(false);
    const [following, setFollowing] = useState<boolean>(false);
    const [checkingRel, setCheckingRel] = useState<boolean>(true);
    const [gettingFollowStats, setGettingFollowStats] = useState<boolean>(true);
    const [followersCount, setFollowersCount] = useState(0);
    const [followingCount, setFollowingCount] = useState(0);

    const wallet = useContext(WalletContext);
    const app = useContext(AppContext);
    const { enqueueSnackbar } = useSnackbar();

    const { account } = props;
    const myAccount = wallet.address === account.address;

    const uploadCoverInputRef = useRef<any>(null);
    const uploadProfileInputRef = useRef<any>(null);
    const editProfileRef = useRef<any>(null);
    const sendAppreciationRef = useRef<any>(null);
    const followersListRef = useRef<any>(null);
    const followingListRef = useRef<any>(null);

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
            const signature = await wallet.signMessage(message);

            const upload = await fetch(url, {
                method: 'POST',
                body: formData
            });

            if (upload.ok) {
                console.log(
                    `Uploaded successfully to ${upload.url}${filename}`,
                    photoType
                );

                let account: any = {};
                if (photoType === 'cover-photo')
                    account.coverPhoto = `${upload.url}${filename}`;
                if (photoType === 'profile-photo')
                    account.profilePhoto = `${upload.url}${filename}`;

                const response = await fetch('/api/update-account', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        address,
                        signature,
                        account
                    })
                });

                if (response.status === 200) {
                    props.refresh();
                    const msg =
                        photoType === 'cover-photo'
                            ? 'Cover photo uploaded'
                            : 'Profile photo uploaded';
                    enqueueSnackbar(msg, { variant: 'success' });
                }
            } else {
                throw 'Upload failed.';
            }
        } catch (err) {
            const msg = `Could not upload your ${
                photoType === 'cover-photo' ? 'cover' : 'profile'
            } photo`;
            enqueueSnackbar('Could not upload your cover photo', {
                variant: 'error'
            });
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

    useEffect(() => {
        if (wallet.address) {
            setCheckingRel(true);
            fetch(
                `/api/get-rel?address=${wallet.address}&target=${account.address}`
            ).then(async (response) => {
                const result = await response.json();
                setFollowing(result.following);
            })
            .finally(() => setCheckingRel(false));

            setGettingFollowStats(true);
            fetch(`/api/get-follow-stats?address=${account.address}`)
                .then(async response => {
                    const result = await response.json();
                    setFollowersCount(result.followers);
                    setFollowingCount(result.following);
                }).finally(() => setGettingFollowStats(false));
        }
    }, [wallet.address, account.address]);

    const follow = async () => {
        if (!wallet.address) {
            enqueueSnackbar(`Connect your wallet to follow ${account.name}`, {
                variant: 'info'
            });
            return;
        }

        const { address } = wallet;
        const signature = await wallet.signMessage('follow');

        const response = await fetch(
            `/api/follow?address=${address}&follows=${account.address}&signature=${signature}`
        );

        if (response.status === 200) {
            enqueueSnackbar(`You are now following ${account.name}`, {
                variant: 'success'
            });
            setFollowing(true);
        } else {
            enqueueSnackbar(`Could not follow ${account.name}`, {
                variant: 'error'
            });
        }
    };

    const unfollow = async () => {
        const { address, ethersSigner } = wallet;
        const message = 'unfollow';
        const signature = await wallet.signMessage(message);

        const response = await fetch(
            `/api/unfollow?address=${address}&follows=${account.address}&signature=${signature}`
        );

        if (response.status === 200) {
            enqueueSnackbar(`You have unfollowed ${account.name}`, {
                variant: 'success'
            });
            setFollowing(false);
        } else {
            enqueueSnackbar(`Could not unfollow ${account.name}`, {
                variant: 'error'
            });
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
                                    <Typography variant="h1" className="truncate-text">
                                        {possessive(account.name)} Profile
                                    </Typography>
                                    <Typography variant="subtitle1" className="truncate-text">
                                        {account.address}
                                    </Typography>

                                    <Typography
                                        className="truncate-text"
                                        variant="h4"
                                        sx={{ marginTop: 2 }}
                                    >
                                        Reputation Score:{' '}
                                        {Math.round(
                                            100 *
                                                (account.reputationScore /
                                                    app.maxReputationScore)
                                        )}
                                        % ({account.reputationScore}
                                        {' / '}
                                        {app.maxReputationScore})
                                    </Typography>
                                    <LinearProgress
                                        variant="determinate"
                                        color="success"
                                        value={
                                            100 *
                                            (account.reputationScore /
                                                app.maxReputationScore)
                                        }

                                        sx={{ height: 20 }}
                                    />
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
                                    left: { xs: 40, md: 60 }
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
                                        onChange={(e) => {
                                            uploadPhoto(e, 'cover-photo');
                                        }}
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
                                        onChange={(e) => {
                                            uploadPhoto(e, 'profile-photo');
                                        }}
                                    />
                                    <IconButton
                                        disabled={uploadingProfile}
                                        color="primary"
                                        sx={{
                                            position: 'absolute',
                                            left: { xs: 130, md: 150 },
                                            top: 200
                                        }}
                                        onClick={() => {
                                            uploadProfileInputRef.current.click();
                                        }}
                                    >
                                        {uploadingProfile && (
                                            <CircularProgress size="20px" />
                                        )}
                                        {!uploadingProfile && (
                                            <FileUploadIcon />
                                        )}
                                    </IconButton>
                                    <Box
                                        display="flex"
                                        sx={{ marginBottom: 2 }}
                                        justifyContent={{
                                            xs: 'center',
                                            md: 'initial'
                                        }}
                                    >
                                        <Button
                                            color="primary"
                                            variant="contained"
                                            onClick={() => {
                                                editProfileRef.current.showModal();
                                            }}
                                        >
                                            Edit My GoingUP Profile
                                        </Button>
                                    </Box>
                                </>
                            )}

                            {!myAccount && (
                                <>
                                    {checkingRel && <CircularProgress />}

                                    {!checkingRel && (
                                        <>
                                            <Box
                                                display="flex"
                                                sx={{ marginBottom: 2, flexDirection: { xs: 'column', md: 'row' } }}
                                                justifyContent={{
                                                    xs: 'center',
                                                    md: 'initial'
                                                }}
                                            >
                                                {!following && (
                                                    <Button
                                                        variant="contained"
                                                        color="secondary"
                                                        onClick={follow}
                                                    >
                                                        Follow
                                                    </Button>
                                                )}

                                                {following && (
                                                    <Button
                                                        variant="outlined"
                                                        color="secondary"
                                                        onClick={unfollow}
                                                    >
                                                        Unfollow
                                                    </Button>
                                                )}

                                                <Button
                                                    variant="contained"
                                                    color="primary"
                                                    onClick={() => {
                                                        sendAppreciationRef.current.showModal();
                                                    }}
                                                    sx={{ marginX: { xs: 0, md: 1 }, marginY: { xs: 1, md: 0 } }}
                                                >
                                                    Send Appreciation Token
                                                </Button>
                                            </Box>
                                        </>
                                    )}
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
                                {gettingFollowStats &&
                                <Typography variant="h4">
                                    Getting follow stats <CircularProgress size="14px" />
                                </Typography>
                                }

                                {!gettingFollowStats &&
                                <>
                                    <Typography variant="h4">
                                        <span style={{ cursor: 'pointer' }} onClick={() => followersListRef.current.showModal()}>
                                            {followersCount} Follower{followersCount > 1 ? 's' : ''}
                                        </span>
                                        {' | '}
                                        <span style={{ cursor: 'pointer' }} onClick={() => followingListRef.current.showModal()}>
                                            {followingCount} Following
                                        </span>
                                    </Typography>
                                </>
                                }
                            </Stack>

                            <Stack
                                direction={{ xs: 'column', md: 'row' }}
                                spacing={1}
                                alignItems="center"
                                sx={{
                                    marginBottom: { xs: '24px', md: '8px' }
                                }}
                            >
                                <Typography variant="h4">Occupation</Typography>
                                <Chip
                                    label={
                                        app.occupations.find(
                                            (o) => o.id == account.occupation
                                        )?.text || 'None'
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
                                <Typography variant="h4">Open To</Typography>
                                {account.openTo && (
                                    <>
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
                                    </>
                                )}
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
                                {account.projectGoals && (
                                    <>
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
                                    </>
                                )}
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
                                {account.idealCollab && (
                                    <>
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
                                    </>
                                )}
                            </Stack>
                            <ContactsAndIntegrations
                                account={account}
                                refresh={props.refresh}
                            />
                        </CardContentWrapper>
                    </Card>
                </Fade>
            </Grid>

            <EditProfile
                ref={editProfileRef}
                account={account}
                refresh={props.refresh}
            />

            <SendAppreciationToken
                ref={sendAppreciationRef}
                sendToName={account.name}
                sendToAddress={account.address}
            />

            <FollowersList ref={followersListRef} account={account} />
            <FollowingList ref={followingListRef} account={account} />
        </>
    );
};

export default TopSection;
