// @ts-nocheck
import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../../../contexts/app-context";
import { WalletContext } from "../../../contexts/wallet-context";
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
} from "@mui/material";
import { ethers } from "ethers";
import { useRouter } from "next/router";
import moment from "moment";
import artifact from "../../../../artifacts/GoingUpUtilityToken.json";
import ChevronRightIcon from "../../icons/ChevronRightIcon";

const CardContentWrapper = styled(CardContent)(
    () => `
        position: relative;
  `
);

const TokensAndPoaps = (props) => {
    const [loading, setLoading] = useState(true);
    const [balances, setBalances] = useState([0, 0, 0, 0]);
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
        // do some
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
                    result[3].toNumber(),
                ]);

                if (result[0].toNumber() > 0)
                    setTier1Messages(await getMessages(1, address));
                if (result[1].toNumber() > 0)
                    setTier2Messages(await getMessages(2, address));
                if (result[2].toNumber() > 0)
                    setTier3Messages(await getMessages(3, address));
                if (result[3].toNumber() > 0)
                    setTier4Messages(await getMessages(4, address));
            } catch (err) {
                console.log(err);
            } finally {
                setLoading(false);
            }
        };
        load();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [address]);

    const getMessages = async (tokenID, address) => {
        const _interface = new ethers.utils.Interface(artifact.abi);
        const filter = contract.filters.WriteMintData(tokenID, address);
        // @ts-ignore
        filter.fromBlock = 0;
        // @ts-ignore
        filter.toBlock = "latest";
        const writeMintLogs = await await contract.provider.getLogs(filter);
        const messages = writeMintLogs.map((log) => {
            const parsedLog = _interface.parseLog(log);
            const message = { ...parsedLog, ...log };
            return message;
        });

        // @ts-ignore
        for (const m of messages)
            m.block = await contract.provider.getBlock(m.blockNumber);

        return messages;
    };

    const { account } = props;
    const myAccount = wallet.address === account.address;

    const tokenImageStyle = {
        width: "80px",
    };

    const buttonStyle = {
        width: "63px",
        height: "24px",
        backgroundColor: app.mode === "dark" ? "#253340" : "#CFCFCF",
    };

    return (
        <>
            <Fade in={true} timeout={1000}>
                <Card
                    sx={{
                        marginX: { xs: "-16px", md: "0px" },
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                        marginTop: "30px",
                        backgroundColor: {
                            xs: app.mode === "dark" ? "#0F151C" : "#FFFFFF",
                            md: app.mode === "dark" ? "#111921" : "#F5F5F5",
                        },
                    }}
                >
                    <CardHeader
                        sx={{
                            alignItems: "flex-start",
                            paddingBottom: "4px",
                        }}
                        title={
                            <Stack
                                direction='row'
                                justifyContent='space-between'
                                paddingTop={"14px"}
                                paddingX={"14px"}
                            >
                                <Typography variant='mobileh1'>
                                    Tokens &amp; POAPS
                                </Typography>
                                <Button
                                    color={
                                        app.mode === "dark"
                                            ? "primary"
                                            : "secondary"
                                    }
                                    endIcon={
                                        <ChevronRightIcon
                                            color={
                                                app.mode === "dark"
                                                    ? "primary"
                                                    : "secondary"
                                            }
                                        />
                                    }
                                >
                                    View All{" "}
                                </Button>
                            </Stack>
                        }
                    />
                    <CardContentWrapper>
                        {loading && (
                            <Typography variant='h3'>
                                <CircularProgress size='2rem' />
                            </Typography>
                        )}

                        {!loading && (
                            <Grid
                                container
                                paddingX={{ xs: "0px", md: "14px" }}
                                wrap='nowrap'
                                direction={{ xs: "column", md: "row" }}
                            >
                                <Grid
                                    xs={12}
                                    md={4}
                                    sx={{
                                        backgroundColor: {
                                            xs:
                                                app.mode === "dark"
                                                    ? "#111921"
                                                    : "#F5F5F5",
                                            md:
                                                app.mode === "dark"
                                                    ? "#19222C"
                                                    : "#FFFFFF",
                                        },
                                        borderRadius: "8px",
                                        padding: "15px",
                                    }}
                                >
                                    {balances[0] > 0 && (
                                        <>
                                            <Stack
                                                direction='row'
                                                justifyContent='flex-start'
                                                alignItems='flex-start'
                                            >
                                                <img
                                                    src='/images/appreciation-token-t1-display.png'
                                                    style={tokenImageStyle}
                                                    alt='appreciation-token-t1'
                                                />

                                                <Stack
                                                    direction='column'
                                                    justifyContent='center'
                                                    alignItems='flex-start'
                                                    spacing={0.5}
                                                    sx={{ paddingX: "15px" }}
                                                >
                                                    <Typography
                                                        color={"#6E8094"}
                                                        variant='sh3'
                                                    >
                                                        from
                                                    </Typography>
                                                    <Typography
                                                        variant='mobileh2'
                                                        sx={{
                                                            paddingBottom:
                                                                "20px",
                                                            paddingTop: "5px",
                                                        }}
                                                    >
                                                        {account.name.replace(
                                                            /\s/g,
                                                            ""
                                                        ) + ".eth"}
                                                    </Typography>
                                                    <Button
                                                        sx={{
                                                            color:
                                                                app.mode ===
                                                                "dark"
                                                                    ? "#FFFFFF"
                                                                    : "#22272F",
                                                        }}
                                                        size='small'
                                                        style={buttonStyle}
                                                    >
                                                        Creative
                                                    </Button>
                                                </Stack>
                                            </Stack>
                                        </>
                                    )}
                                </Grid>
                                <Grid
                                    xs={12}
                                    md={4}
                                    sx={{
                                        backgroundColor: {
                                            xs:
                                                app.mode === "dark"
                                                    ? "#111921"
                                                    : "#F5F5F5",
                                            md:
                                                app.mode === "dark"
                                                    ? "#19222C"
                                                    : "#FFFFFF",
                                        },
                                        borderRadius: "8px",
                                        padding: "15px",
                                        marginX: { md: "20px" },
                                        marginY: { xs: "10px", md: "0px" },
                                    }}
                                >
                                    {balances[1] > 0 && (
                                        <>
                                            <Stack
                                                direction='row'
                                                justifyContent='flex-start'
                                                alignItems='flex-start'
                                            >
                                                <img
                                                    src='/images/appreciation-token-t2-display.png'
                                                    style={tokenImageStyle}
                                                    alt='appreciation-token-t2'
                                                />
                                                <Stack
                                                    direction='column'
                                                    justifyContent='center'
                                                    alignItems='flex-start'
                                                    sx={{ paddingX: "15px" }}
                                                >
                                                    <Typography
                                                        color={"#6E8094"}
                                                        variant='sh3'
                                                    >
                                                        from
                                                    </Typography>
                                                    <Typography
                                                        variant='mobileh2'
                                                        sx={{
                                                            paddingBottom:
                                                                "20px",
                                                            paddingTop: "5px",
                                                        }}
                                                    >
                                                        {account.name.replace(
                                                            /\s/g,
                                                            ""
                                                        ) + ".eth"}
                                                    </Typography>
                                                    <Button
                                                        sx={{
                                                            color:
                                                                app.mode ===
                                                                "dark"
                                                                    ? "#FFFFFF"
                                                                    : "#22272F",
                                                        }}
                                                        size='small'
                                                        style={buttonStyle}
                                                    >
                                                        Creative
                                                    </Button>
                                                </Stack>
                                            </Stack>
                                        </>
                                    )}
                                </Grid>
                                <Grid
                                    xs={12}
                                    md={4}
                                    sx={{
                                        backgroundColor: {
                                            xs:
                                                app.mode === "dark"
                                                    ? "#111921"
                                                    : "#F5F5F5",
                                            md:
                                                app.mode === "dark"
                                                    ? "#19222C"
                                                    : "#FFFFFF",
                                        },
                                        borderRadius: "8px",
                                        padding: "15px",
                                    }}
                                >
                                    {balances[2] > 0 && (
                                        <>
                                            <Stack
                                                direction='row'
                                                justifyContent='flex-start'
                                                alignItems='flex-start'
                                            >
                                                <img
                                                    src='/images/appreciation-token-t3-display.png'
                                                    style={tokenImageStyle}
                                                    alt='appreciation-token-t3'
                                                />
                                                <Stack
                                                    direction='column'
                                                    justifyContent='center'
                                                    alignItems='flex-start'
                                                    sx={{ paddingX: "15px" }}
                                                >
                                                    <Typography
                                                        color={"#6E8094"}
                                                        variant='sh3'
                                                    >
                                                        from
                                                    </Typography>
                                                    <Typography
                                                        variant='mobileh2'
                                                        sx={{
                                                            paddingBottom:
                                                                "20px",
                                                            paddingTop: "5px",
                                                        }}
                                                    >
                                                        {account.name.replace(
                                                            /\s/g,
                                                            ""
                                                        ) + ".eth"}
                                                    </Typography>
                                                    <Button
                                                        sx={{
                                                            color:
                                                                app.mode ===
                                                                "dark"
                                                                    ? "#FFFFFF"
                                                                    : "#22272F",
                                                        }}
                                                        size='small'
                                                        style={buttonStyle}
                                                    >
                                                        Creative
                                                    </Button>
                                                </Stack>
                                            </Stack>
                                        </>
                                    )}
                                </Grid>
                            </Grid>
                        )}
                    </CardContentWrapper>
                </Card>
            </Fade>
        </>
    );
};

export default TokensAndPoaps;
