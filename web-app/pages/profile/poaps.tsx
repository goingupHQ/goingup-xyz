import React, { useContext, useEffect, useState } from 'react';
import { WalletContext } from '../../src/contexts/WalletContext';
import { AppContext } from '../../src/contexts/AppContext';
import {
    Grid,
    Card,
    CardHeader,
    CardContent,
    Typography,
    styled,
    Fade,
    CircularProgress,
    Box
} from '@mui/material';
import { useRouter } from 'next/router';
import moment from 'moment';

const CardContentWrapper = styled(CardContent)(
    () => `
        position: relative;
  `
);

const Poaps = (props) => {
    const [loading, setLoading] = useState<boolean>(true);
    const [poaps, setPoaps] = useState<any>([]);

    const { address } = props.account;

    useEffect(() => {
        setLoading(true);
        const url = `https://frontend.poap.tech/actions/scan/${account.address}`
        fetch(url)
            .then(async response => {
                if (response.status === 200) {
                    const result = await response.json();
                    console.log('poaps', result);
                    setPoaps(result);
                }
            })
            .catch((err) => {
                console.log(err);
            })
            .finally(() => {
                setLoading(false);
            })
    }, [address])

    const wallet = useContext(WalletContext);
    const app = useContext(AppContext);
    const router = useRouter();

    const { account } = props;
    const myAccount = wallet.address === account.address;

    return (
        <>
            <Grid item xs={12}>
                <Fade in={true} timeout={1000}>
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
                                    <Typography variant="h1">
                                        POAPs
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
                            {loading &&
                                <Typography variant="h3">
                                    <CircularProgress size="2rem" />
                                </Typography>
                            }

                            <Grid container spacing={2} sx={{ marginTop: 1 }}>
                            {!loading && poaps.map(p => { return (
                                <Grid item xs={12} md={6} lg={3} key={p.event.id} sx={{ textAlign: 'center' }}>
                                    <a href={p.event.event_url} target="_blank" rel="noopener noreferrer">
                                        <img src={p.event.image_url} style={{ width: '200px' }} />
                                            <Typography variant="h3">{p.event.name}</Typography>
                                        <Typography variant="h4">{moment(p.event.start_date).format('LL')}</Typography>
                                    </a>
                                </Grid>
                            )})}
                            </Grid>
                        </CardContentWrapper>
                    </Card>
                </Fade>
            </Grid>
        </>
    )
}

export default Poaps;