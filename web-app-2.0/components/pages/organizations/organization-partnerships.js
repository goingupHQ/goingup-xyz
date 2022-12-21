import { AppContext } from '../../../contexts/app-context';
import { WalletContext } from '../../../contexts/wallet-context';
import { Box, Card, Fade, Grid, Stack, Typography } from '@mui/material';
import React, { useContext, useEffect, useState } from 'react';
import Profile from '../../common/profile';
import LoadingIllustration from '../../common/loading-illustration';

export default function OrganizationPartnerships(props) {
    const app = useContext(AppContext);
    const wallet = useContext(WalletContext);
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!wallet.address) return;

        setLoading(true);
        fetch(`/api/get-all-profiles?address=${wallet.address}`)
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

    return (
        <>
            <Fade in={true} timeout={1000}>
                <Card
                    sx={{
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        marginTop: '30px',
                    }}>
                    <Box>
                        <Typography margin={3} variant='h2'>
                            Partnerships
                        </Typography>
                        <Stack
                            spacing={4}
                            paddingBottom={'30px'}
                            paddingX={'30px'}>
                            {loading ? (
                                <Box sx={{ mt: '100px' }}>
                                    <LoadingIllustration />
                                </Box>
                            ) : (
                                <Grid>
                                    {data.slice(0, 3).map((account, index) => (
                                        <Grid key={account.address} my={1}>
                                            <Profile account={account} />
                                        </Grid>
                                    ))}
                                </Grid>
                            )}
                        </Stack>
                    </Box>
                </Card>
            </Fade>
        </>
    );
}
