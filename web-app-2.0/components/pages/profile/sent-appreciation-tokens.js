import { Box, Button, Fade, Stack, Typography } from '@mui/material';
import { ethers } from 'ethers';
import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from '../../../contexts/app-context';
import { WalletContext } from '../../../contexts/wallet-context';
import sleep from 'sleep-promise';
import artifact from '../../../../artifacts/GoingUpUtilityToken.json';
import truncateEthAddress from 'truncate-eth-address';
import { useRouter } from 'next/router';

export default function AppreciationTokenCard(props) {
    const { tier, balance } = props;
    const app = useContext(AppContext);
    const wallet = useContext(WalletContext);

    const [loading, setLoading] = useState(true);
    const [messages, setMessages] = useState([]);
    const [showMessage, setShowMessage] = useState(true);
    const [shownMessage, setShownMessage] = useState({});
    const [sent, setSent] = useState('');
    const [sentTo, setSentTo] = useState('');
    const router = useRouter();

    useEffect(() => {
        //
        const load = async () => {
                setLoading(true);
                try {
                    const result = await getMessages(tier);
                    setMessages(result);
                } catch (err) {
                    console.log(err);
                } finally {
                    setLoading(false);
                }
            }
            if (router.isReady) {
        load();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [router.isReady]);

    let intervalId;
    useEffect(() => {
        //
        if (messages.length > 0) {
            showRandomMessage();
            // eslint-disable-next-line react-hooks/exhaustive-deps
            intervalId = setInterval(showRandomMessage, 7000);
        }

        return () => clearInterval(intervalId);
    }, [messages]);

    const contractAddress = wallet.utilityToken.address;
    const provider = wallet.utilityToken.provider;
    const contract = new ethers.Contract(contractAddress, artifact.abi, provider);

    const getMessages = async (tokenID, to) => {
        const _interface = new ethers.utils.Interface(artifact.abi);
        const filter = contract.filters.WriteMintData(tokenID, to);
        filter.fromBlock = 0;
        filter.toBlock = 'latest';
        const writeMintLogs = await await contract.provider.getLogs(filter);
        const messagesResult = writeMintLogs.map((log) => {
            const parsedLog = _interface.parseLog(log);
            const message = { ...parsedLog.args };
            const sender = message[2];
            const senderMessage = message[3];
            setSent(senderMessage);
            const senderAddress = sender === router.query.address;
            setSentTo(senderAddress);
            if(senderAddress) {
            return message;
            }
        });

        // for (const m of messages) m.block = await contract.provider.getBlock(m.blockNumber);
        const filterMessageResult = messagesResult.filter((m) => Boolean(m));
        for (const m of filterMessageResult) {
            const fromName = await getSenderAccountName(m.to);
            if (fromName) {
                m.fromName = fromName;
            }
        }

        return filterMessageResult;
    };

    const getSenderAccountName = async (address) => {
        if (address) {
            const response = await fetch(`/api/get-account-name?address=${address}`);
            if (response.status === 200) {
                const data = await response.text();
                return data;
            } else {
                return null;
            }
        }
    };

    const showRandomMessage = async () => {
        if (messages.length === 1) {
            setShownMessage(messages[0]);
            setShowMessage(true);
        }

        if (messages.length > 1) {
            setShowMessage(false);
            await sleep(500);
            const randomIndex = Math.floor(Math.random() * messages.length);
            setShownMessage(messages[randomIndex]);
            setShowMessage(true);
        }
    };

    return (
        <>
            <Stack
                direction="row"
                sx={{
                    backgroundColor: {
                        xs: app.mode === 'dark' ? '#111921' : '#F5F5F5',
                        md: app.mode === 'dark' ? '#19222C' : '#FFFFFF',
                    },
                    borderRadius: '8px',
                    padding: '15px',
                }}
            >
                <Box
                    component="img"
                    src={`/images/appreciation-token-t${tier}-display.jpg`}
                    sx={{ width: '120px', height: '120px' }}
                    alt={`appreciation-token-t${tier}`}
                />

                <Stack
                    direction="column"
                    justifyContent="center"
                    alignItems="flex-start"
                    spacing={1}
                    sx={{ paddingX: '15px' }}
                >
                    <Typography variant="body1" color="textPrimary">
                        <strong> T{tier} Token{balance !== 1 ? 's' : ''}
                        </strong>
                    </Typography>
                    {!loading && (
                        <>
                            <Fade in={showMessage}>
                                <Box>
                                    <Typography variant="body1">{shownMessage.data}</Typography>
                                    <Typography variant="body1">
                                        {`- `}
                                        {shownMessage.fromName && (
                                            <>{`${shownMessage.fromName} (${truncateEthAddress(shownMessage.to)})`}</>
                                        )}
                                        {!shownMessage.fromName && <>{truncateEthAddress(shownMessage?.to || '')}</>}
                                    </Typography>
                                </Box>
                            </Fade>

                            <Button
                                size="medium"
                                sx={{
                                    color: app.mode === 'dark' ? '#FFFFFF' : '#22272F',
                                    width: 'auto',
                                    height: '24px',
                                    backgroundColor: app.mode === 'dark' ? '#253340' : '#CFCFCF',
                                }}
                            >
                                See all messages
                            </Button>
                        </>
                    )}

                    {loading && (
                        <>
                            <Typography variant="h6" color="textPrimary">
                                <strong>Loading messages...</strong>
                            </Typography>
                        </>
                    )}
                </Stack>
            </Stack>
        </>
    );
}
