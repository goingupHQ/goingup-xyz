import React, { useContext, useEffect, useRef, useState } from "react";
import { AppContext } from "../../../contexts/app-context";
import { WalletContext } from "../../../contexts/wallet-context";
import { v4 as uuid } from 'uuid';
import {
    Grid,
    Card,
    CardHeader,
    Typography,
    Fade,
    Avatar,
    Stack,
    Box,
    CircularProgress,
    Badge,
    Button,
    IconButton,
} from "@mui/material";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import ContactsAndIntegrations from "./contacts-and-integrations";
import truncateEthAddress from "truncate-eth-address";
import { useSnackbar } from "notistack";
import { useTheme } from "@mui/material";
import SendAppreciationToken from "../../common/SendAppreciationToken";
import FollowersList from "./followers-list";
import FollowingList from "./following-list";
import EditProfile from './edit-profile';

const ProfileSection = (props) => {
    const wallet = useContext(WalletContext);
    const app = useContext(AppContext);
    const { account } = props;
    const { enqueueSnackbar } = useSnackbar();
    const myAccount = wallet.address === account.address;
    const theme = useTheme();

    const [uploadingProfile, setUploadingProfile] = useState(false);
    const editProfileRef = useRef(null);
    const uploadProfileInputRef = useRef(null);
    const sendAppreciationRef = useRef(null);
    const followersListRef = useRef(null);
    const followingListRef = useRef(null);
    const [following, setFollowing] = useState(false);
    const [checkingRel, setCheckingRel] = useState(true);
    const [gettingFollowStats, setGettingFollowStats] = useState(true);
    const [followersCount, setFollowersCount] = useState(0);
    const [followingCount, setFollowingCount] = useState(0);
    const [isHolder, setIsHolder] = useState(null);
    const [checkHolder, setCheckHolder] = useState(true);

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

                let account = {};
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
            )
                .then(async (response) => {
                    const result = await response.json();
                    setFollowing(result.following);
                })
                .finally(() => setCheckingRel(false));

            setGettingFollowStats(true);
            fetch(`/api/get-follow-stats?address=${account.address}`)
                .then(async (response) => {
                    const result = await response.json();
                    setFollowersCount(result.followers);
                    setFollowingCount(result.following);
                })
                .finally(() => setGettingFollowStats(false));
        }
    }, [wallet.address, account.address]);

    useEffect(() => {
        if (account.address) {
            setCheckHolder(true);
            fetch(`/api/accounts/${account.address}/is-membership-nft-holder`)
            .then(async (response) => {
                const result = await response.json();
                console.log("isHolder", result);
                if (result.isHolder === true) {
                    setIsHolder(true);
                } else {
                    setIsHolder(false);
                }
            })
            .finally(() => setCheckHolder(false));
        }
    }, [account.address]); 

    const follow = async () => {
        if (!wallet.address) {
            enqueueSnackbar(`Connect your wallet to follow ${account.name}`, {
                variant: "info",
            });
            return;
        }

        const { address } = wallet;
        const signature = await wallet.signMessage("follow");

        const response = await fetch(
            `/api/follow?address=${address}&follows=${account.address}&signature=${signature}`
        );

        if (response.status === 200) {
            enqueueSnackbar(`You are now following ${account.name}`, {
                variant: "success",
            });
            setFollowing(true);
        } else {
            enqueueSnackbar(`Could not follow ${account.name}`, {
                variant: "error",
            });
        }
    };

    const unfollow = async () => {
        const { address, ethersSigner } = wallet;
        const message = "unfollow";
        const signature = await wallet.signMessage(message);

        const response = await fetch(
            `/api/unfollow?address=${address}&follows=${account.address}&signature=${signature}`
        );

        if (response.status === 200) {
            enqueueSnackbar(`You have unfollowed ${account.name}`, {
                variant: "success",
            });
            setFollowing(false);
        } else {
            enqueueSnackbar(`Could not unfollow ${account.name}`, {
                variant: "error",
            });
        }
    };

    return (
        <>
            <Fade in={true} timeout={1000}>
                <Card>
                    <Grid
                        padding={0}
                        container
                        direction={{
                            xs: "column",
                            md: "row",
                        }}
                        justifyContent='space-between'
                        alignItems={{
                            xs: "flex-start",
                            md: "center",
                        }}
                        marginTop={"15px"}
                        sx={{
                            paddingX: { xs: "15px", md: "30px" },
                            marginTop: { xs: "15px", md: "30px" },
                            marginBottom: "30px",
                        }}
                    >
                        <Grid item>
                            <CardHeader
                                avatar={
                                    <Badge
                                        overlap='circular'
                                        anchorOrigin={{
                                            vertical: "bottom",
                                            horizontal: "right",
                                        }}
                                        badgeContent={
                                            <Box
                                                sx={{
                                                    position: "relative",
                                                    display: "inline-flex",
                                                    backgroundColor: {
                                                        xs: "none",
                                                        md:
                                                            app.mode === "dark"
                                                                ? "#121E28"
                                                                : "#FFFFFF",
                                                    },
                                                    borderRadius: "50%",
                                                    padding: "3px",
                                                }}
                                            >
                                                <Box
                                                    sx={{
                                                        backgroundColor:
                                                            app.mode === "dark"
                                                                ? "#121E28"
                                                                : "#FFFFFF",
                                                        borderRadius: "50%",
                                                        padding: {
                                                            xs: "17px",
                                                            md: "none",
                                                        },
                                                        position: "absolute",
                                                        marginTop: "8px",
                                                        marginLeft: "8px",
                                                    }}
                                                />
                                                <CircularProgress
                                                    size={50}
                                                    variant='determinate'
                                                    sx={{
                                                        position: "absolute",
                                                        color:
                                                            app.mode === "dark"
                                                                ? "#1D3042"
                                                                : "#CFCFCF",
                                                        padding: {
                                                            xs: 1,
                                                            sm: 1,
                                                            md: 0,
                                                        },
                                                    }}
                                                    thickness={7}
                                                    value={100}
                                                />
                                                <CircularProgress
                                                    size={50}
                                                    thickness={7}
                                                    variant='determinate'
                                                    color='success'
                                                    value={
                                                        100 *
                                                        (account.reputationScore /
                                                            app.maxReputationScore)
                                                    }
                                                    sx={{
                                                        color: "#3AB795",
                                                        position: "relative",
                                                        display: "inline-flex",
                                                        padding: {
                                                            xs: 1,
                                                            sm: 1,
                                                            md: 0,
                                                        },
                                                    }}
                                                />
                                                <Box
                                                    sx={{
                                                        top: 0,
                                                        left: 0,
                                                        bottom: 0,
                                                        right: 0,
                                                        position: "absolute",
                                                        display: "flex",
                                                        alignItems: "center",
                                                        justifyContent:
                                                            "center",
                                                    }}
                                                >
                                                    <Typography
                                                        color={"#3AB795"}
                                                        variant='rep'
                                                    >
                                                        {" "}
                                                        {Math.round(
                                                            100 *
                                                                (account.reputationScore /
                                                                    app.maxReputationScore)
                                                        )}
                                                        %
                                                    </Typography>
                                                </Box>
                                            </Box>
                                        }
                                    >
                                        <Avatar
                                            src={account.profilePhoto}
                                            sx={{
                                                marginLeft: "-15px",
                                                marginTop: "-15px",
                                                width: { xs: 60, md: 114 },
                                                height: { xs: 60, md: 114 },
                                            }}
                                        />
                                    </Badge>
                                }
                                title={
                                    <>
                                        {checkHolder && (<CircularProgress size={'14px'} />)}
                                        {!checkHolder && isHolder && (
                                            <Typography variant="sh3" sx={{
                                                backgroundColor:
                                                    app.mode === "dark"
                                                        ? "#192530"
                                                        : "#CFCFCF",
                                                borderRadius: "8px",
                                                width: "fit-content",
                                                padding: "6px 12px",
                                            }}>
                                                💎 Premium
                                            </Typography>
                                        )}
                                        <Typography marginTop={'10px'} variant='h1'>
                                            {account.name}
                                        </Typography>
                                        <Box>
                                            <Typography variant='sh1'>
                                                {app.occupations.find(
                                                    (o) =>
                                                        o.id ==
                                                        account.occupation
                                                )?.text || "None"}
                                            </Typography>
                                        </Box>
                                        <Box>
                                            <Typography
                                                variant='sh1'
                                                color='#6E8094'
                                            >
                                                Looking for:{" "}
                                                {account.idealCollab && (
                                                    <>
                                                        {account.idealCollab.map(
                                                            (item) => (
                                                                <Typography
                                                                    marginLeft={
                                                                        1
                                                                    }
                                                                    variant='sh1'
                                                                    color={
                                                                        app.mode ===
                                                                        "dark"
                                                                            ? "#FFFFFF"
                                                                            : "#22272F"
                                                                    }
                                                                    key={item}
                                                                >
                                                                    {
                                                                        app.occupations.find(
                                                                            (
                                                                                o
                                                                            ) =>
                                                                                o.id ==
                                                                                item
                                                                        )?.text
                                                                    }
                                                                </Typography>
                                                            )
                                                        )}
                                                    </>
                                                )}
                                            </Typography>
                                            <Stack
                                                sx={{
                                                    borderRadius: "4px",
                                                }}
                                            >
                                                {gettingFollowStats && (
                                                    <Typography variant='sh3'>
                                                        Getting follow stats{" "}
                                                        <CircularProgress size='14px' />
                                                    </Typography>
                                                )}
                                                {!gettingFollowStats && (
                                                    <>
                                                        <Typography variant='sh1'>
                                                            <span
                                                                style={{
                                                                    cursor: "pointer",
                                                                }}
                                                                onClick={() =>
                                                                    followersListRef.current.showModal()
                                                                }
                                                            >
                                                                {followersCount}{" "}
                                                                Follower
                                                                {followersCount >
                                                                1
                                                                    ? "s"
                                                                    : ""}
                                                            </span>
                                                            {" | "}
                                                            <span
                                                                style={{
                                                                    cursor: "pointer",
                                                                }}
                                                                onClick={() =>
                                                                    followingListRef.current.showModal()
                                                                }
                                                            >
                                                                {followingCount}{" "}
                                                                Following
                                                            </span>
                                                        </Typography>
                                                    </>
                                                )}
                                            </Stack>
                                        </Box>
                                    </>
                                }
                            />
                            {myAccount && (
                                <>
                                    <input
                                        ref={uploadProfileInputRef}
                                        accept='image/*'
                                        id='contained-button-file'
                                        type='file'
                                        style={{ display: "none" }}
                                        onChange={(e) => {
                                            uploadPhoto(e, "profile-photo");
                                        }}
                                    />
                                    <IconButton
                                        disabled={uploadingProfile}
                                        color='success'
                                        sx={{
                                            position: "absolute",
                                            left: { xs: 70, md: 130, lg: 220 },
                                            top: { xs: 165, md: 205, lg: 205 },
                                        }}
                                        onClick={() => {
                                            uploadProfileInputRef.current.click();
                                        }}
                                    >
                                        {uploadingProfile && (
                                            <CircularProgress size='20px' />
                                        )}
                                        {!uploadingProfile && (
                                            <FileUploadIcon />
                                        )}
                                    </IconButton>
                                </>
                            )}
                        </Grid>
                        <Grid item>
                            <Stack
                                direction='row'
                                alignItems='center'
                                justifyContent={{
                                    xs: "none",
                                    md: "flex-end",
                                }}
                                marginLeft={"-8px"}
                            >
                                <ContactsAndIntegrations
                                    account={account}
                                    refresh={props.refresh}
                                />
                            </Stack>

                            <Stack
                                sx={{
                                    border: 3,
                                    borderColor:
                                        app.mode === "dark"
                                            ? "#253340"
                                            : "#CFCFCF",
                                    borderRadius: "8px",

                                    backgroundColor:
                                        app.mode === "dark"
                                            ? "#253340"
                                            : "#CFCFCF",
                                }}
                                direction='row'
                                alignItems='center'
                                justifyContent={{
                                    xs: "center",
                                    md: "space-evenly",
                                }}
                                marginBottom={"10px"}
                            >
                                <Box
                                    sx={{
                                        backgroundColor:
                                            app.mode === "dark"
                                                ? "#111921"
                                                : "#F5F5F5",
                                        borderRadius: "4px",

                                        paddingY: { md: "5px" },
                                        paddingBottom: "3px",
                                    }}
                                >
                                    <Typography
                                        variant='sh2'
                                        sx={{
                                            marginX: "42px",
                                        }}
                                    >
                                        {account.name
                                            .toLowerCase()
                                            .replace(/\s/g, "") + ".eth"}
                                    </Typography>
                                </Box>
                                <Typography
                                    variant='sh2'
                                    sx={{ marginX: { xs: "27px", md: "42px" } }}
                                >
                                    {account.chain === 'Ethereum' &&
                                        truncateEthAddress(account.address)}
                                    {account.chain != 'Ethereum' && `Wallet Address`}
                                </Typography>
                            </Stack>
                            {myAccount && (
                                <>
                                    <Box
                                        display='flex'
                                        sx={{ marginBottom: 2 }}
                                        justifyContent={{
                                            xs: "initial",
                                            md: "flex-end",
                                        }}
                                    >
                                        <Button
                                            color='profileButton'
                                            variant='outlined'
                                            sx={{
                                                color:
                                                    app.mode ===
                                                    "dark"
                                                        ? "#FFFFFF"
                                                        : "#22272F",
                                            }}
                                            onClick={() => {
                                                editProfileRef.current.showModal();
                                            }}
                                        >
                                            <Typography variant='sh3'>
                                                Edit My GoingUP Profile
                                            </Typography>
                                        </Button>
                                    </Box>
                                </>
                            )}
                            {!myAccount && (
                                <>
                                    {checkingRel && <CircularProgress />}

                                    {!checkingRel && (
                                        <>
                                            <Stack
                                                spacing={1}
                                                direction='row'
                                                alignItems='center'
                                                justifyContent={{
                                                    xs: "none",
                                                    md: "flex-end",
                                                }}
                                                sx={{
                                                    borderRadius: "4px",
                                                    paddingBottom: "3px",
                                                }}
                                            >
                                                {!following && (
                                                    <Button
                                                        variant='outlined'
                                                        color='profileButton'
                                                        sx={{
                                                            color:
                                                                app.mode ===
                                                                "dark"
                                                                    ? "#FFFFFF"
                                                                    : "#22272F",
                                                        }}
                                                        onClick={follow}
                                                    >
                                                        <Typography variant='sh3'>
                                                            Follow
                                                        </Typography>
                                                    </Button>
                                                )}
                                                {following && (
                                                    <Button
                                                        variant='outlined'
                                                        color='profileButton'
                                                        sx={{
                                                            color:
                                                                app.mode ===
                                                                "dark"
                                                                    ? "#FFFFFF"
                                                                    : "#22272F",
                                                        }}
                                                        onClick={unfollow}
                                                    >
                                                        <Typography variant='sh3'>
                                                            Unfollow
                                                        </Typography>
                                                    </Button>
                                                )}
                                                <Button
                                                    variant='outlined'
                                                    color='profileButton'
                                                    onClick={() => {
                                                        sendAppreciationRef.current.showModal();
                                                    }}
                                                    sx={{
                                                        color:
                                                            app.mode === "dark"
                                                                ? "#FFFFFF"
                                                                : "#22272F",
                                                    }}
                                                >
                                                    <Typography variant='sh3'>
                                                        Send Appreciation Token
                                                    </Typography>
                                                </Button>
                                            </Stack>
                                        </>
                                    )}
                                </>
                            )}
                        </Grid>
                        <Typography
                            variant='sh1'
                            sx={{ margin: { md: "30px" } }}
                        >
                            Lorem ipsum dolor sit amet, consectetur adipiscing
                            elit, sed do eiusmod tempor incididunt ut labore et
                            dolore magna aliqua. Ut enim ad minim veniam, quis
                            nostrud exercitation ullamco laboris nisi ut aliquip
                            ex ea commodo consequat. Duis aute irure dolor in
                            reprehenderit in voluptate velit esse cillum dolore
                            eu fugiat nulla pariatur. Excepteur sint occaecat
                            cupidatat non proident, sunt in culpa qui officia
                            deserunt mollit anim id est laborum.
                        </Typography>
                    </Grid>
                </Card>
            </Fade>
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

export default ProfileSection;
