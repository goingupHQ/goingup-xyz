import ConfirmDialog from '@/components/common/confirm-dialog';
import TokenSelect from '@/components/common/token-select';
import { TokenRecipient } from '@/types/email-mint';
import { trpc } from '@/utils/trpc';
import {
  Checkbox,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  TextField,
  Stack,
  Button,
  Box,
  Backdrop,
  CircularProgress,
} from '@mui/material';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import { useEffect, useState } from 'react';

const EmailMintConfirmPage = () => {
  const router = useRouter();
  const requestId = router.query['request-id'] as string;

  const {
    mutateAsync: accept,
    isLoading: accepting,
    isSuccess: acceptSuccess,
    isError: acceptFailed,
  } = trpc.emailMint.acceptReceivedToken.useMutation();

  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    if (!router.isReady) return;
    if (!requestId) return;
    accept({ requestId });
  }, [router.isReady, requestId]);

  return (
    <>
      <Head>
        <title>Token(s) Accepted</title>
      </Head>
      {/* <Typography
        variant="h4"
        sx={{ mb: 2 }}
      >
      </Typography> */}

      {acceptSuccess && (
        <Stack
          direction="column"
          spacing={2}
          alignItems="center"
          justifyContent="center"
          height={`calc(100vh - 256px)`}
        >
          <Typography
            variant="h5"
          >
            <strong>Token(s) Accepted!</strong>
          </Typography>

          <Box
            component="img"
            src="/images/illustrations/confirmed.svg"
            sx={{ width: '100%', maxWidth: 400 }}
          />

          <Typography
            variant="h6"
            >
              Your token(s) will be minted shortly
            </Typography>

          <Typography
            variant="body1"
            sx={{ mb: 2 }}
          >
            You can now close this window
          </Typography>
        </Stack>
      )}

      <Backdrop
        open={accepting}
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
      >
        <Stack
          direction="column"
          spacing={2}
          alignItems="center"
          justifyContent="center"
        >
          <CircularProgress color="inherit" />
          <Typography
            variant="h4"
            sx={{ mb: 2 }}
          >
            <strong>Accepting Token(s)</strong>
          </Typography>
        </Stack>
      </Backdrop>
    </>
  );
};

export default EmailMintConfirmPage;
