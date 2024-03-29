import { AppContext } from '../../../contexts/app-context';
import { WalletContext } from '../../../contexts/wallet-context';
import { Box, Fade, Grid, Typography } from '@mui/material';
import React, { useContext, useEffect, useState } from 'react';
import Profile from '../../common/profile';
import LoadingIllustration from '../../common/loading-illustration';

export default function GuestCollaborators(props) {
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
                <Box>
                    <Typography marginBottom={3} variant='h2'>
                        Guest Collaborators
                    </Typography>
                    {loading ? (
                        <Box sx={{ mt: '100px' }}>
                            <LoadingIllustration />
                        </Box>
                    ) : (
                        <Grid>
                            {data.slice(0, 6).map((account, index) => (
                                <Grid margin={2} key={account.address}>
                                    <Profile addressOrAccount={account} />
                                </Grid>
                            ))}
                        </Grid>
                    )}
                </Box>
            </Fade>
        </>
    );
}
