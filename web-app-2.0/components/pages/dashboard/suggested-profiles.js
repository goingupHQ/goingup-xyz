import { AppContext } from '../../../contexts/app-context';
import { WalletContext } from '../../../contexts/wallet-context';
import {
    Box,
    Button,
    Fade,
    Grid,
    Modal,
    Stack,
    Typography,
} from '@mui/material';
import React, { useContext, useEffect, useState } from 'react';
import ChevronRightIcon from '../../icons/ChevronRightIcon';
import LoadingIllustration from '../../common/loading-illustration';
import Profile from '../../common/profile';

export default function SuggestedProfiles(props) {
    const app = useContext(AppContext);
    const wallet = useContext(WalletContext);
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const [allData, setAllData] = useState([]);

    useEffect(() => {
        if (!wallet.address) return;

        setLoading(true);
        fetch(`/api/get-potential-collaborators?address=${wallet.address}`)
            .then(async (response) => {
                const result = await response.json();
                setData(result);
            })
            .catch((err) => {
                console.log(err);
            })
            .finally(() => {
                setLoading(false);
            });
    }, [wallet.address]);

    useEffect(() => {
        if (!wallet.address) return;

        setLoading(true);
        fetch(`/api/get-all-profiles?address=${wallet.address}`)
            .then(async (response) => {
                const result = await response.json();
                setAllData(result);
            })
            .catch((err) => {
                console.log(err);
            })
            .finally(() => {
                setLoading(false);
            });
    }, [wallet.address]);

    return (
        <>
            <Fade in={true} timeout={1000}>
                <Box>
                    <Stack
                        direction='row'
                        justifyContent='space-between'
                        paddingTop={'14px'}
                        sx={{ mb: 2 }}>
                        <Typography variant='h2'>Suggested Profiles</Typography>
                        <Button
                            onClick={() => setOpen(true)}
                            color={
                                app.mode === 'dark' ? 'primary' : 'secondary'
                            }
                            endIcon={
                                <ChevronRightIcon
                                    color={
                                        app.mode === 'dark'
                                            ? 'primary'
                                            : 'secondary'
                                    }
                                />
                            }>
                            View All Profiles
                        </Button>
                    </Stack>
                    <Modal open={open} onClose={() => setOpen(false)}>
                        <Box
                            sx={{
                                height: '100%',
                                display: 'flex',
                                flexDirection: 'column',
                                margin: '25px',
                                padding: '30px',
                                overflow: 'hidden',
                                overflowY: 'scroll',
                                backgroundColor: {
                                    xs:
                                        app.mode === 'dark'
                                            ? '#0F151C'
                                            : '#FFFFFF',
                                    md:
                                        app.mode === 'dark'
                                            ? '#111921'
                                            : '#F5F5F5',
                                },
                            }}>
                            <Typography
                                marginBottom={3}
                                align='center'
                                variant='h1'>
                                All Profiles
                            </Typography>
                            {loading ? (
                                <Box sx={{ mt: '100px' }}>
                                    <LoadingIllustration />
                                </Box>
                            ) : (
                                <Grid container spacing={3}>
                                    {allData.map((account, index) => (
                                        <Grid
                                            item
                                            xs={12}
                                            md={6}
                                            lg={4}
                                            key={account.address}>
                                            <Profile account={account} />
                                        </Grid>
                                    ))}
                                </Grid>
                            )}
                        </Box>
                    </Modal>

                    {loading ? (
                        <Box sx={{ mt: '100px' }}>
                            <LoadingIllustration />
                        </Box>
                    ) : (
                        <Grid container spacing={3}>
                            {data.map((account, index) => (
                                <Grid
                                    item
                                    xs={12}
                                    md={6}
                                    lg={4}
                                    key={account.address}>
                                    <Profile account={account} />
                                </Grid>
                            ))}
                        </Grid>
                    )}
                </Box>
            </Fade>
        </>
    );
}
