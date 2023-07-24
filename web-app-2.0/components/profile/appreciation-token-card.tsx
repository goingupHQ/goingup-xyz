import { Box, Button, Fade, Stack, Typography } from '@mui/material';
import { ethers } from 'ethers';
import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from '../../contexts/app-context';
import { WalletContext } from '../../contexts/wallet-context';
import sleep from 'sleep-promise';
import artifact from '../../../artifacts/GoingUpUtilityToken.json';
import truncateEthAddress from 'truncate-eth-address';
import { useRouter } from 'next/router';
import ProfileLink from '../common/profile-link';
import { GoingUpUtilityTokens__factory } from '@/typechain';

type ShownMessage = {
  from: string;
  fromName: string;
  to: string;
  toName: string;
  message: string;
  data: string;
};

type AppreciationTokenCardProps = {
  tier: number;
  balance: number;
};

export default function AppreciationTokenCard({ tier, balance }: AppreciationTokenCardProps) {
  const app = useContext(AppContext);
  const wallet = useContext(WalletContext);

  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState<any>([]);
  const [showMessage, setShowMessage] = useState(true);
  const [shownMessage, setShownMessage] = useState<ShownMessage | null>(null);
  const router = useRouter();

  useEffect(() => {
    const load = async () => {
      if (router.isReady) {
        setLoading(true);
        try {
          const result = await getMessages(tier, router.query.address as string);
          setMessages(result);
        } catch (err) {
          console.log(err);
        } finally {
          setLoading(false);
        }
      }
    };

    load();
  }, [router]);

  let intervalId: NodeJS.Timeout;
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
  const contract = GoingUpUtilityTokens__factory.connect(contractAddress, provider);

  const getMessages = async (tokenID: number, address: string) => {
    const _interface = new ethers.utils.Interface(artifact.abi);
    const filter = {
      address: contractAddress,
      fromBlock: 0,
      toBlock: 'latest',
      topics: [
        _interface.getEventTopic('WriteMintData'),
        ethers.utils.hexZeroPad(ethers.utils.hexlify(tokenID), 32),
        ethers.utils.hexZeroPad(address, 32),
      ],
    };

    const writeMintLogs = await contract.provider.getLogs(filter);
    const messagesResult = writeMintLogs.map((log) => {
      const parsedLog = _interface.parseLog(log);
      const message = { ...parsedLog.args };
      return message;
    });

    for (const m of messagesResult) {
      const fromName = await getSenderAccountName(m.from);
      if (fromName) {
        m.fromName = fromName;
      }
    }

    return messagesResult;
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
          sx={{ width: '120px', height: '120px', borderRadius: '8px' }}
          alt={`appreciation-token-t${tier}`}
        />

        <Stack
          direction="column"
          justifyContent="center"
          alignItems="flex-start"
          spacing={1}
          sx={{ paddingX: '15px' }}
        >
          <Typography
            variant="body1"
            color="textPrimary"
          >
            <strong>
              {/* {balance}  */}T{tier} Token{balance !== 1 ? 's' : ''}
            </strong>
          </Typography>
          {!loading && (
            <>
              <Fade in={showMessage}>
                <Box>
                  {shownMessage?.fromName && <ProfileLink address={shownMessage?.to} />}
                  {!shownMessage?.fromName && <>{truncateEthAddress(shownMessage?.from || '')}</>}
                  <Typography variant="body1">{shownMessage?.data}</Typography>
                  {shownMessage?.fromName && <ProfileLink address={shownMessage?.from || ''} />}
                  {!shownMessage?.fromName && '- '}
                </Box>
              </Fade>

              {/* <Button
                                size="medium"
                                sx={{
                                    color: app.mode === 'dark' ? '#FFFFFF' : '#22272F',
                                    width: 'auto',
                                    height: '24px',
                                    backgroundColor: app.mode === 'dark' ? '#253340' : '#CFCFCF',
                                }}
                            >
                                See all messages
                            </Button> */}
            </>
          )}

          {loading && (
            <>
              <Typography
                variant="h6"
                color="textPrimary"
              >
                <strong>Loading messages...</strong>
              </Typography>
            </>
          )}
        </Stack>
      </Stack>
    </>
  );
}
