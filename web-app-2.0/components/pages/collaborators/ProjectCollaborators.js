
import { AppContext } from '../../../contexts/app-context';
import { WalletContext } from '../../../contexts/wallet-context';
import { Box, Button, Fade, Grid, Stack, Typography } from '@mui/material';
import React, { useContext, useEffect, useState } from 'react';
import ChevronRightIcon from '../../icons/ChevronRightIcon';
import Profile from '../../common/profile';
import LoadingIllustration from '../../common/loading-illustration';

export default function ProjectCollaborators(props) {
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
                    <Typography marginBottom={3} variant='h2'>Project Collaborators</Typography>
                    {loading ? (
                        <Box sx={{ mt: '100px' }}>
                            <LoadingIllustration />
                        </Box>
                    ) : (
                        <Grid>
                            {data.map((account, index) => (
                                <Grid
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
