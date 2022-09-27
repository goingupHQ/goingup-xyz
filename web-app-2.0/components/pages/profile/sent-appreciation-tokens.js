import { Box, Button, Fade, Stack, Typography } from '@mui/material';
import { ethers } from 'ethers';
import React, { useContext, useEffect, useState } from 'react';
import { WalletContext } from '../../../contexts/wallet-context';
import artifact from '../../../../artifacts/GoingUpUtilityToken.json';
import Router, { useRouter } from 'next/router';
import truncateEthAddress from 'truncate-eth-address';

export default function SentAppreciationTokenCard(props) {
    const account = props;
    const { tier, balance } = props;
    const wallet = useContext(WalletContext);
    const [messages, setMessages] = useState([]);
    const [sentToAddress, setSentToAddress] = useState('');
    const [sentToName, setSentToName] = useState('');
    const router = useRouter();

    useEffect(() => {
        getMessages();
        getSenderAccountName();
    }, []);
    

    const contractAddress = wallet.utilityToken.address;
    const provider = wallet.utilityToken.provider;
    const contract = new ethers.Contract(contractAddress, artifact.abi, provider);

    const getMessages = async (tokenID, address) => {
        const _interface = new ethers.utils.Interface(artifact.abi);
        const filter = contract.filters.WriteMintData(tokenID, address);
        filter.fromBlock = 0;
        filter.toBlock = 'latest';
        const writeMintLogs = await await contract.provider.getLogs(filter);
        const messagesResult = writeMintLogs.map((log) => {
            const parsedLog = _interface.parseLog(log);
            const message = { ...parsedLog.args };
            const sender = message[2];
            const senderMessage = message[3];
            const senderAddress = sender === router.query.address;
            const sentTo = message.to;
            setSentToAddress(sentTo);
            const messageTo = <Typography>{senderMessage} - {truncateEthAddress(sentTo)}</Typography>
            if (senderAddress){
                return messageTo;
            }
            const names = getSenderAccountName(sentTo);
            console.log('names', names);
            if (names){
             sentTo === account.address;
             console.log('sentToName', names);
            }
        });
        setMessages(messagesResult);

    };

    const getSenderAccountName = async (address) => {
        if (address) {
            const response = await fetch(`/api/get-account-name?address=${address}`);
            if (response.status === 200) {
                const data = await response.text();
                console.log('data', data);
                return data;
            } else {
                return null;
            }
        }
    };

    


    return (
        <>
            <Box>
                {messages.map((message) => (
                    <Typography>{message}</Typography>
                ))}
            </Box>
        </>
    );
}
