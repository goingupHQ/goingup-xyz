import { AppContext } from '../../../contexts/app-context';
import { WalletContext } from '../../../contexts/wallet-context';
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
import ChevronRightIcon from '../../icons/ChevronRightIcon';
import Router, { useRouter } from 'next/router';
import Profile from '../../common/profile';

export default function SuggestedProfiles(props) {
    const { account } = props;
    const app = useContext(AppContext);
    const wallet = useContext(WalletContext);
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

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
                    <Stack
                        direction='row'
                        justifyContent='space-between'
                        paddingTop={'14px'}>
                        <Typography variant='h2'>Suggested Profiles</Typography>
                        <Button
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
                    <Grid container>
                            <Profile account={account} />
                    </Grid>
                </Box>
            </Fade>
        </>
    );
}
