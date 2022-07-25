// @ts-nocheck
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
    Stack,
    CircularProgress,
} from '@mui/material';
import { ethers } from 'ethers';
import { useRouter } from 'next/router';
import moment from 'moment';
import artifact from './../../artifacts/GoingUpUtilityToken.json';

const CardContentWrapper = styled(CardContent)(
    () => `
        position: relative;
  `
);

const AppreciationTokens = (props) => {
    const [loading, setLoading] = useState<boolean>(true);
    const [balances, setBalances] = useState<any>([0, 0, 0, 0]);
    const [tier1Messages, setTier1Messages] = useState([]);
    const [tier2Messages, setTier2Messages] = useState([]);
    const [tier3Messages, setTier3Messages] = useState([]);
    const [tier4Messages, setTier4Messages] = useState([]);

    const wallet = useContext(WalletContext);
    const app = useContext(AppContext);
    const router = useRouter();
    const { address } = props.account;

    const contractAddress = wallet.utilityToken.address;
    const provider = wallet.utilityToken.provider;
    const contract = new ethers.Contract(
        contractAddress,
        artifact.abi,
        provider
    );

    useEffect(() => {
        const load = async () => {
            setLoading(true);
            try {
                const addresses = [address, address, address, address];
                const tokenIDs = [1, 2, 3, 4];

                const result = await contract.balanceOfBatch(
                    addresses,
                    tokenIDs
                );
                setBalances([
                    result[0].toNumber(),
                    result[1].toNumber(),
                    result[2].toNumber(),
                    result[3].toNumber()
                ]);


                if (result[0].toNumber() > 0) setTier1Messages(await getMessages(1, address));
                if (result[1].toNumber() > 0) setTier2Messages(await getMessages(2, address));
                if (result[2].toNumber() > 0) setTier3Messages(await getMessages(3, address));
                if (result[3].toNumber() > 0) setTier4Messages(await getMessages(4, address));
            } catch (err) {
                console.log(err);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [address]);

    const getMessages = async (tokenID, address) => {
        const _interface = new ethers.utils.Interface(artifact.abi);
        const filter = contract.filters.WriteMintData(tokenID, address);
        // @ts-ignore
        filter.fromBlock = 0;
        // @ts-ignore
        filter.toBlock = 'latest';
        const writeMintLogs = await await contract.provider.getLogs(filter);
        const messages = writeMintLogs.map(
            (log) => {
                const parsedLog = _interface.parseLog(log);
                const message = {...parsedLog, ...log };
                return message;
            }
        );

        // @ts-ignore
        for (const m of messages) m.block = await contract.provider.getBlock(m.blockNumber);

        return messages;
    };

    const { account } = props;
    const myAccount = wallet.address === account.address;

    const tokenGridStyle = {
        textAlign: 'center'
    };

    const tokenImageStyle = {
        width: '200px'
    };

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
                            {loading && (
                                <Typography variant="h3">
                                    <CircularProgress size="2rem" />
                                </Typography>
                            )}

                            {!loading && (
                                <Grid
                                    container
                                    rowSpacing={5}
                                    columnSpacing={1}
                                    sx={{ marginTop: 1 }}
                                >
                                    {balances[0] > 0 && (
                                    <>
                                        <Grid
                                            item
                                            xs={12}
                                            md={4}
                                            lg={3}
                                            // @ts-ignore
                                            sx={tokenGridStyle}
                                        >
                                            <img
                                                src="/images/appreciation-token-t1-display.png"
                                                style={tokenImageStyle}
                                            />
                                            <Typography variant="h3">
                                                {balances[0]} Token
                                                {balances[0] !== 1 ? 's' : ''}
                                            </Typography>
                                            <Typography variant="h4">
                                                Tier 1 Appreciation
                                            </Typography>
                                        </Grid>

                                        <Grid
                                            item
                                            xs={12}
                                            md={8}
                                            lg={9}
                                            // @ts-ignore
                                            sx={tokenGridStyle}
                                        >
                                            <Typography variant="h3">Messages in your Tier 1 Tokens</Typography>
                                            <Stack direction="column">
                                                {tier1Messages.map((m) => (
                                                <div key={m.number} style={{ display: 'block', marginTop: '15px' }}>
                                                    <Typography variant="h4">
                                                        &quot;{m.args.data}&quot;
                                                    </Typography>
                                                    <Typography variant="body1">
                                                        {`Sent ${moment(m.block?.timestamp * 1000).fromNow()} by ${m.args.from}`}
                                                    </Typography>
                                                </div>
                                                ))}
                                            </Stack>
                                        </Grid>
                                    </>
                                    )}

                                    {balances[1] > 0 && (
                                    <>
                                        <Grid
                                            item
                                            xs={12}
                                            md={4}
                                            lg={3}
                                            // @ts-ignore
                                            sx={tokenGridStyle}
                                        >
                                            <img
                                                src="/images/appreciation-token-t2-display.png"
                                                style={tokenImageStyle}
                                            />
                                            <Typography variant="h3">
                                                {balances[1]} Token
                                                {balances[1] !== 1 ? 's' : ''}
                                            </Typography>
                                            <Typography variant="h4">
                                                Tier 2 Appreciation
                                            </Typography>
                                        </Grid>

                                        <Grid
                                            item
                                            xs={12}
                                            md={8}
                                            lg={9}
                                            // @ts-ignore
                                            sx={tokenGridStyle}
                                        >
                                            <Typography variant="h3">Messages in your Tier 2 Tokens</Typography>
                                            <Stack direction="column">
                                                {tier2Messages.map((m) => (
                                                <div key={m.number} style={{ display: 'block', marginTop: '15px' }}>
                                                    <Typography variant="h4">
                                                        &quot;{m.args.data}&quot;
                                                    </Typography>
                                                    <Typography variant="body1">
                                                        {`Sent ${moment(m.block?.timestamp * 1000).fromNow()} by ${m.args.from}`}
                                                    </Typography>
                                                </div>
                                                ))}
                                            </Stack>
                                        </Grid>
                                    </>
                                    )}

                                    {balances[2] > 0 && (
                                    <>
                                        <Grid
                                            item
                                            xs={12}
                                            md={4}
                                            lg={3}
                                            // @ts-ignore
                                            sx={tokenGridStyle}
                                        >
                                            <img
                                                src="/images/appreciation-token-t3-display.png"
                                                style={tokenImageStyle}
                                            />
                                            <Typography variant="h3">
                                                {balances[2]} Token
                                                {balances[2] !== 1 ? 's' : ''}
                                            </Typography>
                                            <Typography variant="h4">
                                                Tier 3 Appreciation
                                            </Typography>
                                        </Grid>

                                        <Grid
                                            item
                                            xs={12}
                                            md={8}
                                            lg={9}
                                            // @ts-ignore
                                            sx={tokenGridStyle}
                                        >
                                            <Typography variant="h3">Messages in your Tier 3 Tokens</Typography>
                                            <Stack direction="column">
                                                {tier3Messages.map((m) => (
                                                <div key={m.number} style={{ display: 'block', marginTop: '15px' }}>
                                                    <Typography variant="h4">
                                                        &quot;{m.args.data}&quot;
                                                    </Typography>
                                                    <Typography variant="body1">
                                                        {`Sent ${moment(m.block?.timestamp * 1000).fromNow()} by ${m.args.from}`}
                                                    </Typography>
                                                </div>
                                                ))}
                                            </Stack>
                                        </Grid>
                                    </>
                                    )}

                                    {balances[3] > 0 && (
                                    <>
                                        <Grid
                                            item
                                            xs={12}
                                            md={4}
                                            lg={3}
                                            // @ts-ignore
                                            sx={tokenGridStyle}
                                        >
                                            <img
                                                src="/images/appreciation-token-t4-display.png"
                                                style={tokenImageStyle}
                                            />
                                            <Typography variant="h3">
                                                {balances[3]} Token
                                                {balances[4] !== 1 ? 's' : ''}
                                            </Typography>
                                            <Typography variant="h4">
                                                Tier 4 Appreciation
                                            </Typography>
                                        </Grid>

                                        <Grid
                                            item
                                            xs={12}
                                            md={8}
                                            lg={9}
                                            // @ts-ignore
                                            sx={tokenGridStyle}
                                        >
                                            <Typography variant="h3">Messages in your Tier 3 Tokens</Typography>
                                            <Stack direction="column">
                                                {tier4Messages.map((m) => (
                                                <div key={m.number} style={{ display: 'block', marginTop: '15px' }}>
                                                    <Typography variant="h4">
                                                        &quot;{m.args.data}&quot;
                                                    </Typography>
                                                    <Typography variant="body1">
                                                        {`Sent ${moment(m.block?.timestamp * 1000).fromNow()} by ${m.args.from}`}
                                                    </Typography>
                                                </div>
                                                ))}
                                            </Stack>
                                        </Grid>
                                    </>
                                    )}
                                </Grid>
                            )}
                        </CardContentWrapper>
                    </Card>
                </Fade>
            </Grid>
        </>
    );
};

export default AppreciationTokens;
