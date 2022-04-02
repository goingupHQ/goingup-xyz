import ProfileLink from '@/components/common/ProfileLink';
import { AppContext } from '@/contexts/AppContext';
import { WalletContext } from '@/contexts/WalletContext';
import { Card, CardContent, CardHeader, Grid, styled, Typography, CircularProgress } from '@mui/material'
import React, { useContext, useEffect, useState } from 'react'

const CardContentWrapper = styled(CardContent)(
    () => `
        position: relative;
  `
);

export default function Collaborators(props) {
    const { availabilityId } = props;
    const wallet = useContext(WalletContext);
    const app = useContext(AppContext);
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const availability = app.availability.find(a => a.id === availabilityId);

    useEffect(() => {
        if (!wallet.address) return;

        setLoading(true);
        fetch(`/api/collaborators?open_to=${availabilityId}&count=6`)
            .then(async response => {
                const result = await response.json();
                console.log(result);
                setData(result);
            })
            .catch(err => console.log(err))
            .finally(() => setLoading(false));
    }, [wallet.address, availabilityId]);

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
                            <Typography variant="h6">
                                Collaborators interested in {availability.text}
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
                            <Grid key={item.address} item xs={6} md={4} lg={4} sx={{ textAlign: 'center' }}>
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
