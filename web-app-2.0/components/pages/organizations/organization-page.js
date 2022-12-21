import Head from 'next/head';
import {
    Typography,
    Box,
    Card,
    CardHeader,
    Badge,
    CircularProgress,
    CardContent,
    Button,
} from '@mui/material';
import { AppContext } from '../../../contexts/app-context';
import { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { OrganizationsContext } from '../../../contexts/organizations-context';
import CheckIcon from '@mui/icons-material/Check';
import { Stack } from '@mui/system';

export default function OrganizationPage() {
    const app = useContext(AppContext);
    const org = useContext(OrganizationsContext);
    const router = useRouter();
    const [account, setAccount] = useState(null);
    const { address } = router.query;

    useEffect(() => {
        // do some
        if (address) {
            setAccount(org.orgs.find((org) => org._id === address));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [address]);

    return (
        <>
            {account && (
                <>
                    <Head>
                        <title>GoingUP: Organizations</title>
                        <link rel='icon' href='/favicon.ico' />
                    </Head>
                    <Card sx={{ p: 3, mt: 3 }}>
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
                                                position: 'absolute',
                                                marginTop: {
                                                    xs: '70px',
                                                    md: '80px',
                                                },
                                                marginLeft: {
                                                    xs: '160px',
                                                    md: '180px',
                                                },
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
                                                        position: 'absolute',
                                                        marginTop: '8px',
                                                        marginLeft: '8px',
                                                    },
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
                                                    (120 /
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
                                                <Typography
                                                    color={'#3AB795'}
                                                    variant='rep'>
                                                    {' '}
                                                    {Math.round(
                                                        100 *
                                                            (120 /
                                                                app.maxReputationScore)
                                                    )}
                                                    %
                                                </Typography>
                                            </Box>
                                        </Box>
                                    }></Badge>
                            }
                            title={
                                <Stack
                                    direction='row'
                                    spacing={6}
                                    alignItems='center'>
                                    <img
                                        src={org.logo}
                                        alt={account?.name}
                                        style={{
                                            width: '100',
                                            height: '100',
                                        }}
                                    />
                                    <Stack direction={'column'}>
                                        <Typography variant='h4'>
                                            {account?.name}
                                            <CheckIcon color='success' />
                                        </Typography>{' '}
                                        <Typography variant='h6'>
                                            {account?.shortDescription}
                                        </Typography>
                                    </Stack>
                                </Stack>
                            }
                        />
                        <CardContent>
                            <Typography variant='h3' marginTop={2}>
                                {account?.description}
                            </Typography>
                        </CardContent>
                    </Card>
                </>
            )}
        </>
    );
}
