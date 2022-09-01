import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from '../../../contexts/app-context';
import { WalletContext } from '../../../contexts/wallet-context';
import {
    Grid,
    Card,
    CardHeader,
    CardContent,
    Typography,
    styled,
    Fade,
    Stack,
    CircularProgress,
    Button,
    Box,
} from '@mui/material';
import { ethers } from 'ethers';
import artifact from '../../../../artifacts/GoingUpUtilityToken.json';
import ChevronRightIcon from '../../icons/ChevronRightIcon';
import AppreciationTokenCard from './appreciation-token-card';

const CardContentWrapper = styled(CardContent)( () => ``);

const TokensAndPoaps = (props) => {
    const [loading, setLoading] = useState(true);
    const [balances, setBalances] = useState([0, 0, 0, 0]);

    const wallet = useContext(WalletContext);
    const app = useContext(AppContext);
    const { address } = props.account;

    const contractAddress = wallet.utilityToken.address;
    const provider = wallet.utilityToken.provider;
    const contract = new ethers.Contract(contractAddress, artifact.abi, provider);

    useEffect(() => {
        const load = async () => {
            setLoading(true);
            try {
                const addresses = [address, address, address, address];
                const tokenIDs = [1, 2, 3, 4];

                const result = await contract.balanceOfBatch(addresses, tokenIDs);
                setBalances([result[0].toNumber(), result[1].toNumber(), result[2].toNumber(), result[3].toNumber()]);
            } catch (err) {
                console.log(err);
            } finally {
                setLoading(false);
            }
        };
        load();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [address]);


    const { account } = props;
    const myAccount = wallet.address === account.address;

    return (
        <>
            <Fade in={true} timeout={1000}>
                <Card
                    sx={{
                        marginX: { xs: '-16px', md: '0px' },
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        marginTop: '30px',
                        backgroundColor: {
                            xs: app.mode === 'dark' ? '#0F151C' : '#FFFFFF',
                            md: app.mode === 'dark' ? '#111921' : '#F5F5F5',
                        },
                    }}
                >
                    <CardHeader
                        sx={{
                            alignItems: 'flex-start',
                            paddingBottom: '4px',
                        }}
                        title={
                            <Stack direction="row" justifyContent="space-between" paddingTop={'14px'} paddingX={'14px'}>
                                <Typography variant="mobileh1">Appreciation Tokens</Typography>
                                <Button
                                    color={app.mode === 'dark' ? 'primary' : 'secondary'}
                                    endIcon={<ChevronRightIcon color={app.mode === 'dark' ? 'primary' : 'secondary'} />}
                                >
                                    View All{' '}
                                </Button>
                            </Stack>
                        }
                    />
                    <Box sx={{ padding: 4 }}>
                        {loading && (
                            <Typography variant="h4" sx={{ padding: 2 }}>
                                Retrieving <CircularProgress size="12pt" />
                            </Typography>
                        )}

                        {!loading && (
                            <Grid container columnSpacing={3} rowSpacing={3}>
                                {balances.map((balance, index) => {
                                    return (
                                        balance > 0 && (
                                            <Grid
                                                item
                                                xs={12}
                                                md={6}
                                                key={index}
                                            >
                                                {balances[index] > 0 && <AppreciationTokenCard tier={index + 1} balance={balance} />}
                                            </Grid>
                                        )
                                    );
                                })}
                            </Grid>
                        )}
                    </Box>
                </Card>
            </Fade>
        </>
    );
};

export default TokensAndPoaps;
