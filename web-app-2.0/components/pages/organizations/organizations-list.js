import {
    Badge,
    Box,
    Button,
    Card,
    CardContent,
    CardHeader,
    CircularProgress,
    Grid,
    Stack,
    Typography,
} from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import { useRouter } from 'next/router';
import { useContext, useEffect, useState } from 'react';
import { AppContext } from '../../../contexts/app-context';
import { OrganizationsContext } from '../../../contexts/organizations-context';
import LoadingIllustration from '../../common/loading-illustration';

export default function OrganizationsList() {
    const app = useContext(AppContext);
    const org = useContext(OrganizationsContext);
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [isClaimed, setIsClaimed] = useState(true);

    useEffect(() => {
        setLoading(true);
        org.getOrgs();
        setLoading(false);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <>
            {loading ? (
                <Box sx={{ mt: '100px' }}>
                    <LoadingIllustration />
                </Box>
            ) : (
                <Grid container spacing={2}>
                    {org.orgs.map((organization) => (
                        <Grid
                            item
                            spacing={1}
                            xs={12}
                            md={6}
                            lg={4}
                            xl={3}
                            key={organization.id}>
                            <Card sx={{ p: 1, height: '100%' }}>
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
                                                                app.mode ===
                                                                'dark'
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
                                                                app.mode ===
                                                                'dark'
                                                                    ? '#121E28'
                                                                    : '#FFFFFF',
                                                            borderRadius: '50%',
                                                            padding: {
                                                                xs: '17px',
                                                                md: 'none',
                                                                position:
                                                                    'absolute',
                                                                marginTop:
                                                                    '8px',
                                                                marginLeft:
                                                                    '8px',
                                                            },
                                                        }}
                                                    />
                                                    <CircularProgress
                                                        size={50}
                                                        variant='determinate'
                                                        sx={{
                                                            position:
                                                                'absolute',
                                                            color:
                                                                app.mode ===
                                                                'dark'
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
                                                            position:
                                                                'relative',
                                                            display:
                                                                'inline-flex',
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
                                                            position:
                                                                'absolute',
                                                            display: 'flex',
                                                            alignItems:
                                                                'center',
                                                            justifyContent:
                                                                'center',
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
                                                src={
                                                    organization.logo ||
                                                    org.logo
                                                }
                                                alt={organization.name}
                                                width={80}
                                                height={80}
                                            />
                                            <Typography variant='h5'>
                                                {organization.name}
                                                {isClaimed ? (
                                                    <CheckIcon
                                                        color='success'
                                                        onClick={() =>
                                                            setIsClaimed(false)
                                                        }
                                                    />
                                                ) : (
                                                    <>
                                                        <Button
                                                            onClick={() => {
                                                                setIsClaimed(
                                                                    () =>
                                                                        !isClaimed
                                                                );
                                                            }}>
                                                            Claim This Org
                                                        </Button>
                                                    </>
                                                )}
                                            </Typography>{' '}
                                        </Stack>
                                    }
                                />
                                <CardContent>
                                    <Typography variant='h3'>
                                        {organization.shortDescription}
                                    </Typography>
                                </CardContent>
                                <CardContent>
                                    <Stack
                                        direction='row'
                                        alignItems={'flex-end'}
                                        spacing={1}>
                                        <Button
                                            variant='contained'
                                            color='primary'
                                            onClick={() => {
                                                router.push(
                                                    `/organizations/${organization._id}`
                                                );
                                            }}>
                                            Organization Page
                                        </Button>
                                        <Button
                                            variant='contained'
                                            color='secondary'>
                                            <a
                                                href={organization.website}
                                                target='_blank'
                                                rel='noopener noreferrer'>
                                                Organization Website
                                            </a>
                                        </Button>
                                    </Stack>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            )}
        </>
    );
}
