import ProfileLink from '@/components/common/ProfileLink';
import { WalletContext } from '@/contexts/WalletContext';
import { Backdrop, Card, CardContent, CardHeader, CircularProgress, Grid, Skeleton, styled, Typography } from '@mui/material'
import React, { useContext, useEffect, useState } from 'react'

const CardContentWrapper = styled(CardContent)(
    () => `
        position: relative;
  `
);

export default function PotentialCollaborators() {
    const wallet = useContext(WalletContext);
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!wallet.address) return;

        setLoading(true);
        fetch(`/api/get-potential-collaborators?address=${wallet.address}`)
            .then(async response => {
                const result = await response.json();
                console.log(result);
                setData(result);
            })
            .catch(err => {
                console.log(err);
            })
            .finally(() => {
                setLoading(false);
            });
    }, [wallet.address]);

    return (
        <>
            <Card
                sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    marginTop: { xs: '2rem', md: '3rem' }
                }}
            >
                <CardHeader
                    sx={{
                        px: 3,
                        pt: 3,
                        alignItems: 'flex-start'
                    }}
                    title={
                        <>
                            <Typography variant="h3">
                                Potential Collaborators
                            </Typography>
                            <Typography variant="subtitle1">
                                Based on your interest you could
                                collaborate with them
                            </Typography>
                        </>
                    }
                />
                <CardContentWrapper
                    sx={{
                        px: 3,
                        pt: 3,
                        textAlign: 'center'
                    }}
                >
                    {loading ? <CircularProgress /> : (
                    <Grid container spacing={3}>
                        {data.map(item => { return (
                            <Grid key={item.address} item xs={6} md={3} lg={2} sx={{ textAlign: 'center' }}>
                                <ProfileLink profile={item} />
                            </Grid>
                        )})}
                    </Grid>
                    )}
                </CardContentWrapper>
            </Card>
        </>
    )
}
