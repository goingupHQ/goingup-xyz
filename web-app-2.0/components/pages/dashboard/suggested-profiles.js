import { AppContext } from '../../../contexts/app-context';
import { WalletContext } from '../../../contexts/wallet-context';
import { Box, Button, CircularProgress, Fade, Grid, Modal, Stack, TextField, Typography } from '@mui/material';
import React, { useContext, useEffect, useState } from 'react';
import debounce from 'lodash.debounce';
import LoadingIllustration from '../../common/loading-illustration';
import Profile from '../../common/profile';

export default function SuggestedProfiles(props) {
    const app = useContext(AppContext);
    const wallet = useContext(WalletContext);
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);

    useEffect(() => {
        //
        findRandomProfiles();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [wallet.address]);

    const findRandomProfiles = () => {
        setLoading(true);

        let url = `/api/get-potential-collaborators?count=12`;
        if (wallet.address) url += `&address=${wallet.address}`;

        fetch(url)
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
    };

    const [search, setSearch] = useState('');
    const searchProfile = React.useMemo(
        () =>
            debounce(async (value) => {
                if (!value) {
                    findRandomProfiles();
                    return
                };

                setLoading(true);
                try {
                    const response = await fetch(`/api/accounts/search-profile-by-name?query=${value}`);
                    const results = await response.json();

                    setData(results);
                } catch (err) {
                    console.log(err);
                } finally {
                    setLoading(false);
                }
            }, 1000),
            // eslint-disable-next-line react-hooks/exhaustive-deps
        []
    );

    return (
        <>
            <Fade in={true} timeout={1000}>
                <Box>
                    <Stack
                        direction={{ xs: 'column', md: 'row' }}
                        alignItems="center"
                        justifyContent={{ xs: 'initial', md: 'space-between' }}
                        sx={{ mb: 2 }}
                        spacing={3}
                    >
                        <Typography variant="h1">Suggested Profiles</Typography>
                        <TextField
                            variant="outlined"
                            label="Search Profiles"
                            placeholder="Stephania Silva"
                            sx={{ width: { xs: '100%', md: '300px' } }}
                            disabled={loading}
                            InputProps={{
                                endAdornment: (<>{loading && <CircularProgress size={14} /> }</>),
                            }}
                            value={search}
                            onChange={(e) => {
                                setSearch(e.target.value);
                                searchProfile(e.target.value);
                            }}
                        />
                    </Stack>

                    {loading ? (
                        <Box sx={{ mt: '100px' }}>
                            <LoadingIllustration />
                        </Box>
                    ) : (
                        <Grid container spacing={4}>
                            {data.map((account, index) => (
                                <Grid item xs={12} md={6} lg={4} key={account.address}>
                                    <Profile address={account.address} />
                                </Grid>
                            ))}
                        </Grid>
                    )}
                </Box>
            </Fade>
        </>
    );
}
