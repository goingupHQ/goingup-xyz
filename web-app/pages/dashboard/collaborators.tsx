import Identicon from '@/components/common/Identicon';
import { AppContext } from '@/contexts/AppContext';
import { WalletContext } from '@/contexts/WalletContext';
import { Avatar, Card, CardContent, CardHeader, Grid, Stack, styled, Typography } from '@mui/material'
import Link from 'next/link';
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
    const availability = app.availability.find(a => a.id === availabilityId);

    useEffect(() => {
        if (!wallet.address) return;


        fetch(`/api/collaborators?open_to=${availabilityId}&count=8`)
            .then(async response => {
                const result = await response.json();
                console.log(result);
                setData(result);
            });
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
                        pt: 0
                    }}
                >
                    <Grid container spacing={3}>
                        {data.map(item => { return (
                            <Grid key={item.address} item xs={6} md={4} lg={3} sx={{ textAlign: 'center' }}>
                                <Link href={`/profile/${item.address}`}>
                                    <a>
                                        {item.profilePhoto &&
                                            <Avatar src={item.profilePhoto} variant="rounded" sx={{ height: 64, width: 64, margin: 'auto' }} />
                                        }
                                        {!item.profilePhoto &&
                                            <Identicon address={item.address} size={64}  />
                                        }
                                        <Typography variant="h5">{item.name}</Typography>
                                        <Typography variant="body1">{app.occupations.find(o => o.id == item.occupation)?.text}</Typography>
                                    </a>
                                </Link>
                            </Grid>
                        )})}
                    </Grid>
                </CardContentWrapper>
            </Card>
        </>
    )
}
