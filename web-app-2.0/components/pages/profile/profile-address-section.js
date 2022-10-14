import {
    Box,
    Button,
    CircularProgress,
    Stack,
    Typography,
} from '@mui/material';
import { useContext, useEffect, useRef, useState } from 'react';
import { AppContext } from '../../../contexts/app-context';
import ContactsAndIntegrations from './contacts-and-integrations';
import truncateEthAddress from 'truncate-eth-address';
import { WalletContext } from '../../../contexts/wallet-context';
import EditProfile from './edit-profile';
import SendAppreciationToken from '../../common/SendAppreciationToken';
import { useSnackbar } from 'notistack';

const ProfileAddressSection = (props) => {
    const { account } = props;
    const wallet = useContext(WalletContext);
    const app = useContext(AppContext);
    const myAccount = wallet.address === account.address;
    const { enqueueSnackbar } = useSnackbar();

    const editProfileRef = useRef(null);
    const sendAppreciationRef = useRef(null);
    const [following, setFollowing] = useState(false);
    const [checkingRel, setCheckingRel] = useState(true);

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
        }
    }, [wallet.address, account.address]);

    const follow = async () => {
        if (!wallet.address) {
            enqueueSnackbar(`Connect your wallet to follow ${account.name}`, {
                variant: 'info',
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
                variant: 'success',
            });
            setFollowing(true);
        } else {
            enqueueSnackbar(`Could not follow ${account.name}`, {
                variant: 'error',
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
                variant: 'success',
            });
            setFollowing(false);
        } else {
            enqueueSnackbar(`Could not unfollow ${account.name}`, {
                variant: 'error',
            });
        }
    };

    return (
        <>
            <Stack
                direction='row'
                alignItems='center'
                justifyContent={{
                    xs: 'none',
                    md: 'flex-end',
                }}
                marginLeft={'-8px'}>
                <ContactsAndIntegrations
                    account={account}
                    refresh={props.refresh}
                />
            </Stack>

            <Stack
                sx={{
                    border: 3,
                    borderColor: app.mode === 'dark' ? '#253340' : '#CFCFCF',
                    borderRadius: '8px',

                    backgroundColor:
                        app.mode === 'dark' ? '#253340' : '#CFCFCF',
                }}
                direction='row'
                alignItems='center'
                justifyContent={{
                    xs: 'center',
                    md: 'space-evenly',
                }}
                marginBottom={'10px'}>
                <Box
                    sx={{
                        backgroundColor:
                            app.mode === 'dark' ? '#111921' : '#F5F5F5',
                        borderRadius: '4px',

                        paddingY: { md: '5px' },
                        paddingBottom: '3px',
                    }}>
                    <Typography
                        variant='sh2'
                        sx={{
                            marginX: '42px',
                        }}>
                        {account.name.toLowerCase().replace(/\s/g, '') + '.eth'}
                    </Typography>
                </Box>
                <Typography
                    variant='sh2'
                    sx={{
                        marginX: { xs: '27px', md: '42px' },
                    }}>
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
                            xs: 'initial',
                            md: 'flex-end',
                        }}>
                        <Button
                            color='profileButton'
                            variant='outlined'
                            sx={{
                                color:
                                    app.mode === 'dark' ? '#FFFFFF' : '#22272F',
                            }}
                            onClick={() => {
                                editProfileRef.current.showModal();
                            }}>
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
                                    xs: 'none',
                                    md: 'flex-end',
                                }}
                                sx={{
                                    borderRadius: '4px',
                                    paddingBottom: '3px',
                                }}>
                                {!following && (
                                    <Button
                                        variant='outlined'
                                        color='profileButton'
                                        sx={{
                                            color:
                                                app.mode === 'dark'
                                                    ? '#FFFFFF'
                                                    : '#22272F',
                                        }}
                                        onClick={follow}>
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
                                                app.mode === 'dark'
                                                    ? '#FFFFFF'
                                                    : '#22272F',
                                        }}
                                        onClick={unfollow}>
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
                                            app.mode === 'dark'
                                                ? '#FFFFFF'
                                                : '#22272F',
                                    }}>
                                    <Typography variant='sh3'>
                                        Send Appreciation Token
                                    </Typography>
                                </Button>
                            </Stack>
                        </>
                    )}
                </>
            )}
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
        </>
    );
};

export default ProfileAddressSection;
