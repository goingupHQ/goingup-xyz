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
    Box,
    Badge
} from '@mui/material';
import { ethers } from 'ethers';
import { useRouter } from 'next/router';
import artifact from './../../artifacts/GoingUpNFT.json'

const CardContentWrapper = styled(CardContent)(
    () => `
        position: relative;
  `
);

const AppreciationTokens = (props) => {
    const [loading, setLoading] = useState<boolean>(true);
    const [balances, setBalances] = useState<any>([0, 0, 0, 0]);

    const wallet = useContext(WalletContext);
    const app = useContext(AppContext);
    const router = useRouter();
    const { address } = props.account;
    const contractAddress = process.env.NEXT_PUBLIC_GOINGUP_UTILITY_TOKEN;
    const contract = new ethers.Contract(contractAddress, artifact.abi, wallet.ethersSigner);

    useEffect(() => {
        const load = async () => {
            setLoading(true);
            try {
                const addresses = [address, address, address, address];
                const tokenIDs = [1, 2, 3, 4];

                const result = await contract.balanceOfBatch(addresses, tokenIDs);
                setBalances([result[0].toNumber(), result[1].toNumber(), result[2].toNumber(), result[3].toNumber()])
            } catch (err) {
                console.log(err);
            } finally {
                setLoading(false);
            }
        }
        load();
    }, [])



    const { account } = props;
    const myAccount = wallet.address === account.address;

    const tokenGridStyle = {
        textAlign: 'center'
    }

    const tokenImageStyle = {
        width: '200px'
    }

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

                            <Grid container spacing={4} sx={{ marginTop: 1 }}>
                                {balances[0] &&
                                // @ts-ignore
                                <Grid item xs={12} md={6} lg={3} sx={tokenGridStyle}>
                                    <img src="/images/appreciation-token-t1-display.png" style={tokenImageStyle} />
                                    <Typography variant="h3">{balances[0]} T1 Token{balances[0] !== 1 ? 's' : '' }</Typography>
                                </Grid>
                                }

                                {balances[1] &&
                                // @ts-ignore
                                <Grid item xs={12} md={6} lg={3} sx={tokenGridStyle}>
                                    <img src="/images/appreciation-token-t2-display.png" style={tokenImageStyle} />
                                    <Typography variant="h3">{balances[1]} T2 Token{balances[0] !== 1 ? 's' : '' }</Typography>
                                </Grid>
                                }

                                {balances[2] &&
                                // @ts-ignore
                                <Grid item xs={12} md={6} lg={3} sx={tokenGridStyle}>
                                    <img src="/images/appreciation-token-t3-display.png" style={tokenImageStyle} />
                                    <Typography variant="h3">{balances[2]} T3 Token{balances[0] !== 1 ? 's' : '' }</Typography>
                                </Grid>
                                }

                                {balances[3] &&
                                // @ts-ignore
                                <Grid item xs={12} md={6} lg={3} sx={tokenGridStyle}>
                                    <img src="/images/appreciation-token-t4-display.png" style={tokenImageStyle} />
                                    <Typography variant="h3">{balances[3]} T4 Token{balances[0] !== 1 ? 's' : '' }</Typography>
                                </Grid>
                                }
                            </Grid>
                        </CardContentWrapper>
                    </Card>
                </Fade>
            </Grid>
        </>
    )
}

export default AppreciationTokens;