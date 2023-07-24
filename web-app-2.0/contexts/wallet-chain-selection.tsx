import { WalletContext } from './wallet-context';
import { Box, Dialog, DialogContent, Stack, Typography, useTheme } from '@mui/material';
import { forwardRef, createRef, useContext, useImperativeHandle, useState, useEffect, Ref } from 'react';
import { AppContext } from './app-context';
import ConnectUsingEmail from './connect-using-email';
import { useSnackbar } from 'notistack';
import { useModal } from 'connectkit';

type ConnectUsingEmailHandles = {
  showModal: () => void;
};

export type WalletChainSelectionHandles = {
  showModal: () => void;
};

const WalletChainSelection = (props: {}, ref: Ref<WalletChainSelectionHandles>) => {
  const [open, setOpen] = useState(false);
  const theme = useTheme();
  const { setOpen: setCkModalOpen } = useModal();
  const connectUsingEmailRef = createRef<ConnectUsingEmailHandles>();

  useImperativeHandle(ref, () => ({
    showModal() {
      setOpen(true);
    },
  }));

  const handleClose = () => {
    setOpen(false);
  };

  const fieldStyle = {
    m: 1,
  };

  const chainItemSx = {
    padding: { xs: 2, md: '1rem 2rem' },
    backgroundColor: theme.palette.primary.main,
    color: 'black',
    '&:hover': {
      backgroundColor: theme.palette.primary.light,
    },
    cursor: 'pointer',
    borderRadius: '5px',
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="md"
      >
        <DialogContent sx={{ paddingY: 4 }}>
          <Stack
            direction="column"
            spacing={3}
          >
            <Typography
              variant="h2"
              align="center"
            >
              Choose Wallet Type
            </Typography>

            <Stack
              direction="column"
              alignItems="center"
              justifyContent="center"
              sx={chainItemSx}
              onClick={() => {
                handleClose();
                connectUsingEmailRef.current?.showModal();
                // enqueueSnackbar('Not yet available but it is coming soon!', { variant: 'info' });
              }}
            >
              <h2
                style={{
                  whiteSpace: 'nowrap',
                  textOverflow: 'ellipsis',
                  overflowX: 'hidden',
                  margin: '0px',
                }}
              >
                GoingUP Wallet
              </h2>
              <sub style={{ textAlign: 'center' }}>Your own wallet, managed by us.</sub>
            </Stack>

            <Stack
              direction="column"
              alignItems="center"
              justifyContent="center"
              sx={chainItemSx}
              onClick={() => {
                handleClose();
                setCkModalOpen(true);
              }}
            >
              <Box
                component="h2"
                sx={{
                  margin: '0px',
                  textAlign: 'center',
                }}
              >
                Ethereum or EVM-compatible Wallet
              </Box>
              <sub style={{ textAlign: 'center' }}>Metamask, Coinbase Wallet, WalletConnect, etc.</sub>
            </Stack>
          </Stack>
        </DialogContent>
      </Dialog>
      <ConnectUsingEmail ref={connectUsingEmailRef} />
    </>
  );
};

export default forwardRef(WalletChainSelection);
