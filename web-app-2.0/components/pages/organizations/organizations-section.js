import {
    Box,
    Button,
    Card,
    CardContent,
    CardHeader,
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
                    <Grid item spacing={1} xs={12} md={6} lg={4} xl={3} key={organization.id}>
                        <Card sx={{ p: 3 }}>
                            <CardHeader
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
