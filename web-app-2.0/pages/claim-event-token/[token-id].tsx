import { Backdrop, Box, Button, CircularProgress, Stack, Typography } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { useRouter } from 'next/router';
import { useAccount, useSigner } from 'wagmi';
import { useModal } from 'connectkit';
import { useSnackbar } from 'notistack';
import { trpc } from '../../utils/trpc';
import Head from 'next/head';
import { useEffect } from 'react';

const ClaimEventToken: React.FC = () => {
  const router = useRouter();
  const tokenIdParam = router.query['token-id'];

  const tokenId = Number(tokenIdParam);

  const { data, isLoading } = trpc.eventTokens.get.useQuery({ tokenId: tokenId });
  const { tokenSettings, metadata } = data || { tokenSettings: [], metadata: {} };

  const { isConnected, address } = useAccount();
  const { open, setOpen } = useModal();
  const { data: signer } = useSigner();

  const mutation = trpc.eventTokens.claimToken.useMutation();

  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  useEffect(() => {
    if (!isConnected) {
      setOpen(true);
      return;
    }
  }, []);

  if (isNaN(tokenId)) {
    return <Box></Box>;
  }

  const claimWithWeb3Wallet = async () => {
    if (!isConnected) {
      setOpen(true);
      return;
    }

    if (signer) {
      // sign message
      const message = `I am claiming the ${tokenSettings[0]} token for my wallet address ${address}.`;

      const signature = await signer.signMessage(message);

      const mintTx = await mutation.mutateAsync({ tokenId, message, address: address || '', signature });

      if (mintTx) {
        enqueueSnackbar('Token claimed successfully!', { variant: 'success', autoHideDuration: 15000, action: (key) => {
          return (
            <Button
              variant="contained"
              color="primary"
              onClick={() => {
                closeSnackbar(key);
                // open transaction in polygonscan
                window.open(`https://polygonscan.com/tx/${mintTx.hash}`, '_blank');
              }}
            >
              View transaction
            </Button>
          );
        } });
      }
    }
  };

  return (
    <>
      <Head>
        <title>{tokenSettings ? `Claim your ${tokenSettings[0]}` : `Loading...`}</title>
      </Head>
      {tokenSettings && !isLoading && (
        <>
          <Typography variant="h1">Claim your {tokenSettings[0]}</Typography>
          <Stack
            direction="column"
            spacing={3}
          >
            <Box
              component="img"
              src={metadata?.image}
              sx={{
                width: { xs: '90%', md: '400px' },
                borderRadius: '20px',
                mt: '20px',
              }}
            />

            <LoadingButton
              loading={mutation.isLoading}
              disabled={mutation.isSuccess}
              variant="contained"
              sx={{ alignSelf: 'flex-start' }}
              onClick={claimWithWeb3Wallet}
            >
              Claim this token
            </LoadingButton>
          </Stack>
        </>
      )}
      <Backdrop
        open={isLoading}
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </>
  );
};

export default ClaimEventToken;
