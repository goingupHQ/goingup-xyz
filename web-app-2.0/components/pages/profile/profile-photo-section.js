import {
    Avatar,
    Badge,
    Box,
    CardHeader,
    CircularProgress,
    Stack,
    Typography,
} from '@mui/material';
import { useContext, useEffect, useRef, useState } from 'react';
import { AppContext } from '../../../contexts/app-context';
import { WalletContext } from '../../../contexts/wallet-context';
import FollowersList from './followers-list';
import FollowingList from './following-list';
import UploadProfilePhoto from './upload-profile-photo';

const ProfilePhotoSection = (props) => {
    const { account } = props;
    const app = useContext(AppContext);
    const [gettingFollowStats, setGettingFollowStats] = useState(true);
    const [followersCount, setFollowersCount] = useState(0);
    const [followingCount, setFollowingCount] = useState(0);
    const [isHolder, setIsHolder] = useState(null);
    const [checkHolder, setCheckHolder] = useState(true);
    const followersListRef = useRef(null);
    const followingListRef = useRef(null);

    useEffect(() => {
        if (account.address) {
            setCheckHolder(true);
            fetch(`/api/accounts/${account.address}/is-membership-nft-holder`)
                .then(async (response) => {
                    const result = await response.json();
                    if (result.isHolder === true) {
                        setIsHolder(true);
                    } else {
                        setIsHolder(false);
                    }
                })
                .finally(() => setCheckHolder(false));
        }
        setGettingFollowStats(true);
        fetch(`/api/get-follow-stats?address=${account.address}`)
            .then(async (response) => {
                const result = await response.json();
                setFollowersCount(result.followers);
                setFollowingCount(result.following);
            })
            .finally(() => setGettingFollowStats(false));
    }, [account.address]);

    return (
        <>
            <CardHeader
                avatar={
                    <Badge
                        overlap='circular'
                        anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'right',
                        }}
                        badgeContent={
                            <Box
                                sx={{
                                    position: 'relative',
                                    display: 'inline-flex',
                                    backgroundColor: {
                                        xs: 'none',
                                        md:
                                            app.mode === 'dark'
                                                ? '#121E28'
                                                : '#FFFFFF',
                                    },
                                    borderRadius: '50%',
                                    padding: '3px',
                                }}>
                                <Box
                                    sx={{
                                        backgroundColor:
                                            app.mode === 'dark'
                                                ? '#121E28'
                                                : '#FFFFFF',
                                        borderRadius: '50%',
                                        padding: {
                                            xs: '17px',
                                            md: 'none',
                                        },
                                        position: 'absolute',
                                        marginTop: '8px',
                                        marginLeft: '8px',
                                    }}
                                />
                                <CircularProgress
                                    size={50}
                                    variant='determinate'
                                    sx={{
                                        position: 'absolute',
                                        color:
                                            app.mode === 'dark'
                                                ? '#1D3042'
                                                : '#CFCFCF',
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
                                        color: '#3AB795',
                                        position: 'relative',
                                        display: 'inline-flex',
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
                                        position: 'absolute',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    }}>
                                    <Typography color={'#3AB795'} variant='rep'>
                                        {' '}
                                        {Math.round(
                                            100 *
                                                (account.reputationScore /
                                                    app.maxReputationScore)
                                        )}
                                        %
                                    </Typography>
                                </Box>
                            </Box>
                        }>
                        <Avatar
                            src={account.profilePhoto}
                            sx={{
                                marginLeft: '-15px',
                                marginTop: '-15px',
                                width: { xs: 60, md: 114 },
                                height: { xs: 60, md: 114 },
                            }}
                        />
                    </Badge>
                }
                title={
                    <>
                        {checkHolder && <CircularProgress size={'14px'} />}
                        {!checkHolder && isHolder && (
                            <Typography
                                variant='sh3'
                                sx={{
                                    backgroundColor:
                                        app.mode === 'dark'
                                            ? '#192530'
                                            : '#CFCFCF',
                                    borderRadius: '8px',
                                    width: 'fit-content',
                                    padding: '6px 12px',
                                }}>
                                💎 OG Member
                            </Typography>
                        )}
                        <Typography marginTop={'10px'} variant='h1'>
                            {account.name}
                        </Typography>
                        <Box>
                            <Typography variant='sh1'>
                                {app.occupations.find(
                                    (o) => o.id == account.occupation
                                )?.text || 'None'}
                            </Typography>
                        </Box>
                        <Box>
                            <Typography variant='sh1' color='#6E8094'>
                                Looking for:{' '}
                                {account.idealCollab && (
                                    <>
                                        {account.idealCollab.map((item) => (
                                            <Typography
                                                marginLeft={1}
                                                variant='sh1'
                                                color={
                                                    app.mode === 'dark'
                                                        ? '#FFFFFF'
                                                        : '#22272F'
                                                }
                                                key={item}>
                                                {
                                                    app.occupations.find(
                                                        (o) => o.id == item
                                                    )?.text
                                                }
                                            </Typography>
                                        ))}
                                    </>
                                )}
                            </Typography>
                            <Stack
                                sx={{
                                    borderRadius: '4px',
                                }}>
                                {gettingFollowStats && (
                                    <Typography variant='sh3'>
                                        Getting follow stats{' '}
                                        <CircularProgress size='14px' />
                                    </Typography>
                                )}
                                {!gettingFollowStats && (
                                    <>
                                        <Typography variant='sh1'>
                                            <span
                                                style={{
                                                    cursor: 'pointer',
                                                }}
                                                onClick={() =>
                                                    followersListRef.current.showModal()
                                                }>
                                                {followersCount} Follower
                                                {followersCount > 1 ? 's' : ''}
                                            </span>
                                            {' | '}
                                            <span
                                                style={{
                                                    cursor: 'pointer',
                                                }}
                                                onClick={() =>
                                                    followingListRef.current.showModal()
                                                }>
                                                {followingCount} Following
                                            </span>
                                        </Typography>
                                        <UploadProfilePhoto account={account} refresh={props.refresh}/>
                                    </>
                                )}
                            </Stack>
                        </Box>
                        <FollowersList
                            ref={followersListRef}
                            account={account}
                        />
                        <FollowingList
                            ref={followingListRef}
                            account={account}
                        />
                    </>
                }
            />
        </>
    );
};

export default ProfilePhotoSection;
