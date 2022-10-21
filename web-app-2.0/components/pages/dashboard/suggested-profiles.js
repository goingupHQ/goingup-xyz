import { AppContext } from '../../../contexts/app-context';
import { WalletContext } from '../../../contexts/wallet-context';
import { Box, Button, Fade, Grid, Stack, Typography } from '@mui/material';
import React, { useContext, useEffect, useState } from 'react';
import ChevronRightIcon from '../../icons/ChevronRightIcon';
import Profile from '../../common/profile';
import LoadingIllustration from '../../common/loading-illustration';

export default function SuggestedProfiles(props) {
    const app = useContext(AppContext);
    const wallet = useContext(WalletContext);
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);

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

    return (
        <>
            <Fade in={true} timeout={1000}>
                <Box>
                    <Stack direction="row" justifyContent="space-between" paddingTop={'14px'} sx={{ mb: 2 }}>
                        <Typography variant="h2">Suggested Profiles</Typography>
                        <Button
                            color={app.mode === 'dark' ? 'primary' : 'secondary'}
                            endIcon={<ChevronRightIcon color={app.mode === 'dark' ? 'primary' : 'secondary'} />}
                        >
                            View All Profiles
                        </Button>
                    </Stack>

                    {loading ? (
                        <Box sx={{ mt: '100px'}}>
                            <LoadingIllustration />
                        </Box>
                    ) : (
                        <Grid container spacing={3}>
                            {data.map((account, index) => (
                                <Grid item xs={12} md={6} lg={4} key={account.address}>
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
