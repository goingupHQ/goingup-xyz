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
} from '@mui/material';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import { useEffect, useState } from 'react';
import { set } from 'zod';

const EmailMintConfirmPage = () => {
  const router = useRouter();
  const confirmationId = router.query['confirmation-id'] as string;

  const { data: requests } = trpc.emailMint.getMintRequests.useQuery(
    { confirmationId },
    { enabled: router.isReady && Boolean(confirmationId) }
  );

  const senderName = requests?.[0]?.mintFrom.name;
  const senderEmail = requests?.[0]?.mintFrom.address;

  const [recipients, setRecipients] = useState<TokenRecipient[]>();

  useEffect(() => {
    if (!requests) return;
    const recipientsList: TokenRecipient[] = requests.map((request) => {
      return {
        doSend: true,
        mintToAddress: request.walletAddress,
        mintToName: request.mintTo.name,
        mintToEmail: request.mintTo.address,
        mintQuantity: 1,
        mintTokenId: 1,
        requestId: request._id,
      };
    });
    setRecipients(recipientsList);
    setMintMessage(requests[0].content.text);
  }, [requests]);

  console.log(recipients);

  const [discardDialogOpen, setDiscardDialogOpen] = useState<boolean>(false);

  const { mutateAsync: discardMintRequest, isLoading: isDiscardingMintRequest } =
    trpc.emailMint.discardMintRequest.useMutation();

  const [confirmDialogOpen, setConfirmDialogOpen] = useState<boolean>(false);
  const [mintMessage, setMintMessage] = useState<string>();

  const [confirmed, setConfirmed] = useState<boolean>(false);

  const {
    mutateAsync: confirmMintRequest,
    isLoading: isConfirmingMintRequest,
    isSuccess: isMintRequestConfirmed,
    isError: isMintRequestConfirmFailed,
  } = trpc.emailMint.confirmMintRequests.useMutation();

  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    if (isMintRequestConfirmFailed) {
      enqueueSnackbar('Failed to confirm mint request.', { variant: 'error' });
    }

    if (isMintRequestConfirmed) {
      enqueueSnackbar('Mint request confirmed.', { variant: 'success' });
      setConfirmDialogOpen(false);
      setConfirmed(true);
    }
  }, [isMintRequestConfirmed, isMintRequestConfirmFailed]);

  const confirmMintRequestsHandler = async () => {
    const confirmedRecipients = recipients?.filter((r) => r.doSend);
    if (!confirmedRecipients) return;

    const confirmedRequests = confirmedRecipients.map((r) => {
      return {
        id: r.requestId,
        qtyToMint: r.mintQuantity,
        tokenIdToMint: r.mintTokenId,
        finalMintMessage: mintMessage || '',
      };
    });

    await confirmMintRequest({ mintRequests: confirmedRequests });
  };

  return (
    <>
      <Head>
        <title>Confirm Mint Request | Minting</title>
      </Head>
      <Typography
        variant="h4"
        sx={{ mb: 2 }}
      >
        Confirm Tokens To Send
      </Typography>

      {confirmed ? (
        <Stack
          direction="column"
          spacing={2}
          sx={{ mb: 2 }}
        >
          <Box
            component="img"
            src="/images/illustrations/confirmed.svg"
            sx={{ my: 0, mx: 'auto', width: { xs: '90%', md: '30%' } }}
          />

          <Typography
            variant="h4"
            textAlign="center"
          >
            Your mint request has been confirmed
          </Typography>
        </Stack>
      ) : (
        <Stack
          direction="column"
          spacing={2}
          sx={{ mb: 2 }}
        >
          <Typography variant="body1">Confirmation ID: {confirmationId}</Typography>

          <Typography variant="body1">
            Sender: &nbsp;
            <strong>
              {senderName} ({senderEmail})
            </strong>
          </Typography>
          <Typography variant="body1">Recipients</Typography>

          <TableContainer component={Paper}>
            <Table
              sx={{ minWidth: 650 }}
              aria-label="simple table"
            >
              <TableHead>
                <TableRow>
                  <TableCell>Send?</TableCell>
                  <TableCell>Address</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Quantity</TableCell>
                  <TableCell>Token</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {recipients?.map((row) => (
                  <TableRow
                    key={row.mintToAddress}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <TableCell>
                      <Checkbox
                        checked={row.doSend}
                        onChange={() => {
                          const newRecipients = [...recipients];
                          const recipientIndex = recipients.findIndex((r) => r.mintToAddress === row.mintToAddress);
                          newRecipients[recipientIndex].doSend = !newRecipients[recipientIndex].doSend;
                          setRecipients(newRecipients);
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      {row.mintToAddress.slice(0, 6)}...{row.mintToAddress.slice(-4)}
                    </TableCell>
                    <TableCell>{row.mintToName}</TableCell>
                    <TableCell>{row.mintToEmail}</TableCell>
                    <TableCell>
                      <TextField
                        type="number"
                        InputProps={{
                          inputProps: {
                            min: 1,
                            max: 200,
                            style: { textAlign: 'right' },
                          },
                        }}
                        value={row.mintQuantity}
                        onChange={(e) => {
                          const newRecipients = [...recipients];
                          const recipientIndex = recipients.findIndex((r) => r.mintToAddress === row.mintToAddress);
                          newRecipients[recipientIndex].mintQuantity = Number(e.target.value);
                          setRecipients(newRecipients);
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <TokenSelect
                        tier={row.mintTokenId}
                        setTier={(tier) => {
                          const newRecipients = [...recipients];
                          const recipientIndex = recipients.findIndex((r) => r.mintToAddress === row.mintToAddress);
                          newRecipients[recipientIndex].mintTokenId = tier;
                          setRecipients(newRecipients);
                        }}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <Typography variant="body1">Message</Typography>

          <TextField
            multiline
            rows={7}
            variant="outlined"
            fullWidth
            placeholder="Enter a message to be included with the minted tokens."
            value={mintMessage}
            onChange={(e) => {
              setMintMessage(e.target.value);
            }}
          />
        </Stack>
      )}

      {!confirmed && (
        <Stack
          direction="row"
          spacing={2}
          sx={{ mt: 4 }}
        >
          <Button
            variant="contained"
            onClick={() => {
              setConfirmDialogOpen(true);
            }}
          >
            Confirm
          </Button>

          <Button
            variant="outlined"
            onClick={() => {
              setDiscardDialogOpen(true);
            }}
          >
            Discard
          </Button>
        </Stack>
      )}

      <ConfirmDialog
        open={discardDialogOpen}
        setOpen={setDiscardDialogOpen}
        title="Discard Mint Request"
        message="Are you sure you want to discard this mint request? You will not be able to recover it."
        onConfirm={async () => {
          await discardMintRequest({ confirmationId });
          router.push('/');
        }}
        confirmLoading={isDiscardingMintRequest}
      />

      <ConfirmDialog
        open={confirmDialogOpen}
        setOpen={setConfirmDialogOpen}
        title="Confirm Mint Request"
        message="Are you sure you want to confirm this mint request? This will send the tokens to the recipients."
        onConfirm={confirmMintRequestsHandler}
        confirmLoading={isConfirmingMintRequest}
      />
    </>
  );
};

export default EmailMintConfirmPage;
