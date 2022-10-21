import {
    Avatar,
    Badge,
    Box,
    Button,
    Card,
    CardHeader,
    CircularProgress,
    Fade,
    Grid,
    Stack,
    Typography,
} from '@mui/material';
import React, { useContext, useEffect, useState } from 'react';
import truncateEthAddress from 'truncate-eth-address';
import { useRouter } from 'next/router';
import { AppContext } from '../../contexts/app-context';
import { WalletContext } from '../../contexts/wallet-context';

const Profile = (props) => {
    const app = useContext(AppContext);
    const { account } = props;
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const [ensName, setEnsName] = useState('');

    // useEffect(() => {
    //     if (!wallet.address) return;

    //     setLoading(true);
    //     fetch(`/api/get-potential-collaborators?address=${wallet.address}`)
    //         .then(async (response) => {
    //             const result = await response.json(); console.log('result', result);
    //             setData(result);

    //         })
    //         .catch((err) => {
    //             console.log(err);
    //         })
    //         .finally(() => {
    //             setLoading(false);
    //         });
    // }, [wallet.address]);

    return (
        <Card
            key={account.address}
            sx={{
                marginRight: '10px',
                marginBottom: '10px',
                padding: '24px',
            }}
        >
            <CardHeader
                avatar={
                    <Badge
                        overlap="circular"
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
                                        md: app.mode === 'dark' ? '#121E28' : '#FFFFFF',
                                    },
                                    borderRadius: '50%',
                                    padding: '3px',
                                }}
                            >
                                <Box
                                    sx={{
                                        backgroundColor: app.mode === 'dark' ? '#121E28' : '#FFFFFF',
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
                                    variant="determinate"
                                    sx={{
                                        position: 'absolute',
                                        color: app.mode === 'dark' ? '#1D3042' : '#CFCFCF',
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
                                    variant="determinate"
                                    color="success"
                                    value={100 * (account.reputationScore / app.maxReputationScore)}
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
                                    }}
                                >
                                    <Typography color={'#3AB795'} variant="rep">
                                        {' '}
                                        {Math.round(100 * (account.reputationScore / app.maxReputationScore))}%
                                    </Typography>
                                </Box>
                            </Box>
                        }
                    >
                        <Avatar
                            src={account.profilePhoto}
                            sx={{
                                width: {
                                    xs: 60,
                                    md: 114,
                                },
                                height: {
                                    xs: 60,
                                    md: 114,
                                },
                            }}
                        />
                    </Badge>
                }
                title={
                    <>
                        <Typography variant="h3">{account.name}</Typography>
                        <Box>
                            <Typography variant="sh1" color="#6E8094">
                                {app.occupations.find((o) => o.id == account.occupation)?.text || 'None'}
                            </Typography>
                        </Box>
                    </>
                }
            />
            <Stack
                sx={{
                    border: 3,
                    borderColor: app.mode === 'dark' ? '#253340' : '#CFCFCF',
                    borderRadius: '8px',

                    backgroundColor: app.mode === 'dark' ? '#253340' : '#CFCFCF',
                }}
                direction="row"
                alignItems="center"
                justifyContent="space-between"
                marginBottom={'10px'}
            >
                {ensName && (
                    <Box
                        sx={{
                            backgroundColor: app.mode === 'dark' ? '#111921' : '#F5F5F5',
                            borderRadius: '4px',

                            paddingY: { md: '5px' },
                            paddingBottom: '3px',
                            mx: 'auto',
                            ml: 'none',
                            paddingX: {
                                xs: '50px',
                                md: '20',
                                lg: '10px',
                            },
                        }}
                    >
                        <Typography variant="sh2">{}</Typography>
                    </Box>
                )}
                <Typography
                    variant="sh2"
                    sx={{
                        mx: 'auto',
                        paddingX: '10px',
                    }}
                >
                    {account.chain === 'Ethereum' && <>{truncateEthAddress(account.address)}</>}
                    {account.chain != 'Ethereum' &&
                        `${account.address.substring(0, 6)}...${account.address.substring(
                            account.address.length - 4,
                            account.address.length
                        )}`}
                </Typography>
            </Stack>
            <Button
                variant="outlined"
                color="profileButton"
                sx={{
                    color: app.mode === 'dark' ? '#FFFFFF' : '#22272F',
                    width: '100%',
                }}
                onClick={() => {
                    router.push(`/profile/${account.address}`);
                }}
            >
                <Typography variant="sh3">View Profile</Typography>
            </Button>
        </Card>
    );
};

export default Profile;
