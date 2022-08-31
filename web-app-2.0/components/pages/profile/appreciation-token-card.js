import { Box, Button, Stack, Typography } from '@mui/material';
import { ethers } from 'ethers';
import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from '../../../contexts/app-context';
import { WalletContext } from '../../../contexts/wallet-context';
import artifact from '../../../../artifacts/GoingUpUtilityToken.json';

export default function AppreciationTokenCard(props) {
    const { tier, balance } = props;
    const app = useContext(AppContext);
    const wallet = useContext(WalletContext);

    const [loading, setLoading] = useState(true);
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        const load = async () => {
            setLoading(true);
            try {
                const result = await getMessages(tier, wallet.address); console.log(result);
                setMessages(result);
            } catch (err) {
                console.log(err);
            } finally {
                setLoading(false);
            }
        };

        load();
    }, []);

    const getMessages = async (tokenID, address) => {
        const _interface = new ethers.utils.Interface(artifact.abi);
        const filter = contract.filters.WriteMintData(tokenID, address);
        filter.fromBlock = 0;
        filter.toBlock = 'latest';
        const writeMintLogs = await await contract.provider.getLogs(filter);
        const messages = writeMintLogs.map((log) => {
            const parsedLog = _interface.parseLog(log);
            const message = { ...parsedLog, ...log };
            return message;
        });

        for (const m of messages) m.block = await contract.provider.getBlock(m.blockNumber);

        return messages;
    };

    const getAccountFromSender = async () => {
        if (address) {
            const response = await fetch(`/api/get-account?address=0x36b1936738E0D1Ed044Ac8e4EF34bb3bF668F143`);
            setAccountFromSender(await response.json());
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
                    src={`/images/appreciation-token-t${tier}-display.png`}
                    sx={{ width: '80px' }}
                    alt={`appreciation-token-t${tier}`}
                />

                <Stack
                    direction="column"
                    justifyContent="center"
                    alignItems="flex-start"
                    spacing={0.5}
                    sx={{ paddingX: '15px' }}
                >
                    <Typography color={'#6E8094'} variant="sh3">
                        from
                    </Typography>
                    <Typography
                        variant="mobileh2"
                        sx={{
                            paddingBottom: '20px',
                            paddingTop: '5px',
                        }}
                    >
                        From
                    </Typography>

                    <Button
                        size="small"
                        sx={{
                            color: app.mode === 'dark' ? '#FFFFFF' : '#22272F',
                            width: '63px',
                            height: '24px',
                            backgroundColor: app.mode === 'dark' ? '#253340' : '#CFCFCF',
                        }}
                    >
                        See all
                    </Button>
                </Stack>
            </Stack>
        </>
    );
}
