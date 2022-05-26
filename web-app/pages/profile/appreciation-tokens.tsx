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
    Button,
    Fade,
    Stack,
    Chip,
    CardMedia,
    Avatar,
    IconButton,
    CircularProgress,
    Box
} from '@mui/material';
import { useRouter } from 'next/router';

const CardContentWrapper = styled(CardContent)(
    () => `
        position: relative;
  `
);

const AppreciationTokens = (props) => {
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
    }, [])

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
                                        Tokens of Appreciation
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

                            <Grid container spacing={4}>
                            {poaps.map(p => { return (
                                <Grid item xs={4} sm={4} md={3} lg={2} key={p.event.id}>
                                    <img src={p.event.image_url} height={100} width={100} />
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

export default AppreciationTokens;