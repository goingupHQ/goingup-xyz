import { LoadingButton } from '@mui/lab';
import { Box, Stack, TextField, Typography, capitalize } from '@mui/material';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import { useState } from 'react';


export default function Holidays2023Page() {
  const router = useRouter();
  const { from } = router.query;

  const { enqueueSnackbar } = useSnackbar();

  function isValidEmail(email: string): boolean {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return emailRegex.test(email);
  }

  function isValidEVMWalletAddress(address: string): boolean {
    const walletRegex = /^0x[a-fA-F0-9]{40}$/;
    return walletRegex.test(address);
  }

  function isEmailOrEVMWallet(input: string): boolean {
    if (isValidEmail(input)) {
      return true;
    } else if (isValidEVMWalletAddress(input)) {
      return true;
    } else {
      return false;
    }
  }


  const fromName = capitalize((from as string) || '');
  const [destination, setDestination] = useState<string>('');
  const [isMinting, setIsMinting] = useState<boolean>(false);

  const mint = async () => {
    if (!from) {
      enqueueSnackbar('Missing minter', { variant: 'error' });
      return;
    }

    if (!['steph', 'mark'].includes((from as string).toLowerCase())) {
      enqueueSnackbar('Invalid minter', { variant: 'error' });
      return;
    }

    if (!destination) {
      enqueueSnackbar('Please provide an email address or an EVM wallet address', { variant: 'error' });
      return;
    }

    if (!isEmailOrEVMWallet(destination)) {
      enqueueSnackbar('Invalid email address or EVM wallet address', { variant: 'error' });
      return;
    }

    const confirmMessage = isValidEmail(destination) ?
      `We will mint and send your token to a GoingUP custodial wallet associated with your email address.` :
      `We will mint and send your token to your wallet address via Polygon (Matic) network.`;

    if (!confirm(`Are you sure?\n\n${confirmMessage}`)) {
      return;
    }


  };

  return (
    <Stack
      direction="column"
      spacing={2}
      justifyContent="flex-start"
    >
      <Typography variant="h1">Happy Holidays from GoingUP!</Typography>

      <Typography variant="body1">{fromName} has sent you a holiday token of appreciation</Typography>

      <Box
        component="img"
        src="/images/holidays-2023-appreciation-from-goingup.jpg"
        alt="Appreciation from GoingUP"
        sx={{
          width: { xs: '100%', sm: '500px' },
        }}
      />

      <Typography variant="body1">
        Please provide your email address or your EVM wallet address to receive your holiday NFT
      </Typography>

      <TextField
        label="Email or EVM wallet address"
        variant="outlined"
        sx={{
          width: { xs: '100%', sm: '500px' },
        }}
        value={destination}
        onChange={(e) => setDestination(e.target.value)}
      />

      <LoadingButton
        variant="contained"
        size="large"
        sx={{
          width: { xs: '100%', sm: '500px' },
        }}
        loading={isMinting}
        onClick={mint}
      >
        Mint and claim your NFT
      </LoadingButton>

      <Stack
        direction="column"
        spacing={0}
        justifyContent="flex-start"
      >
        <Typography
          variant="body2"
          fontSize="16px"
        >
          1. If you provide your email address, we will mint and sent your token to a GoingUP custodial wallet
          associated with your email address.
        </Typography>

        <Typography
          variant="body2"
          fontSize="16px"
        >
          2. If you provide your EVM wallet address, we will mint and sent your token to your wallet address via Polygon
          (Matic) network.
        </Typography>
      </Stack>
    </Stack>
  );
}