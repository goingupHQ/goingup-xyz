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
import { useRouter } from 'next/router';
import { useContext } from 'react';
import { AppContext } from '../../../contexts/app-context';
import { OrganizationsContext } from '../../../contexts/organizations-context';

export default function OrganizationsSection() {
    const app = useContext(AppContext);
    const org = useContext(OrganizationsContext);
    const router = useRouter();

    return (
        <>
            <Grid container spacing={2}>
                {org.organizations.map((organization) => (
                    <Grid
                        item
                        spacing={1}
                        xs={12}
                        md={6}
                        lg={4}
                        xl={3}
                        key={organization.id}>
                        <Card sx={{ p: 3 }}>
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
                                                    marginTop: {xs: '70px', md: '80px'},
                                                    marginLeft: {xs: '160px', md: '180px'},
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
                                            src={organization.logo}
                                            alt={organization.name}
                                            style={{
                                                width: '100',
                                                height: '100',
                                            }}
                                        />
                                        <Typography variant='h5'>
                                            {organization.name}
                                        </Typography>
                                    </Stack>
                                }
                            />
                            <CardContent>
                                <Typography variant='h3'>
                                    {organization.description}
                                </Typography>
                                <Stack
                                    direction='row'
                                    alignItems='center'
                                    marginTop={4}
                                    spacing={2}>
                                    <Button
                                        variant='contained'
                                        color='secondary'
                                        onClick={() => {
                                            router.push(
                                                `/organizations/${organization.address}`
                                            );
                                        }}>
                                        Protocol
                                    </Button>
                                    <Button
                                        variant='contained'
                                        color='secondary'>
                                        Identity
                                    </Button>
                                </Stack>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </>
    );
}
