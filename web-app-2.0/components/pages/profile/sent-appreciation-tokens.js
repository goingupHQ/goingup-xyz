import { Box, Button, Fade, Grid, Stack, Typography } from "@mui/material";
import { ethers } from "ethers";
import React, { useContext, useEffect, useState } from "react";
import { WalletContext } from "../../../contexts/wallet-context";
import artifact from "../../../../artifacts/GoingUpUtilityToken.json";
import { useRouter } from "next/router";
import truncateEthAddress from "truncate-eth-address";
import AccountNameAddress from "../../common/account-name-address";

export default function SentAppreciationTokenCard(props) {
    const wallet = useContext(WalletContext);
    const [messages, setMessages] = useState([]);
    const router = useRouter();

    useEffect(() => {
        getMessages();
    }, []);

    const contractAddress = wallet.utilityToken.address;
    const provider = wallet.utilityToken.provider;
    const contract = new ethers.Contract(
        contractAddress,
        artifact.abi,
        provider
    );

    const getMessages = async (tokenID, address) => {
        const _interface = new ethers.utils.Interface(artifact.abi);
        const filter = contract.filters.WriteMintData(tokenID, address);
        filter.fromBlock = 0;
        filter.toBlock = "latest";
        const writeMintLogs = await await contract.provider.getLogs(filter);
        const messagesResult = writeMintLogs.map((log) => {
            const parsedLog = _interface.parseLog(log);
            const message = { ...parsedLog.args };
            console.log('message', message);
            const sender = message[2];
            const senderMessage = message[3];
            const senderAddress = sender === router.query.address;
            const sentTo = message.to;
            const messageTo = (
                <Typography>
                    {senderMessage} to - 
                     <AccountNameAddress address={sentTo} /> {truncateEthAddress(sentTo)}

                </Typography>
            );
            if (senderAddress) {
                return messageTo;
            }
        });
        setMessages(messagesResult);
    };

    return (
        <>
            <Box>
                {messages.map((message, key) => (
                    <Grid item xs={12} key={key}>
                        <Typography>{message}</Typography>
                    </Grid>
                ))}
            </Box>
        </>
    );
}
