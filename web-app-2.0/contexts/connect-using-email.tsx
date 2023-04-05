import { WalletContext } from './wallet-context';
import { Box, Button, Dialog, DialogContent, Fade, Stack, TextField, Typography } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { forwardRef, useContext, useImperativeHandle, useState, useEffect, Ref } from 'react';
import { useSnackbar } from 'notistack';
import sleep from '@react-corekit/sleep';
import isEmail from 'validator/lib/isEmail';
import { trpc } from '@/utils/trpc';

interface ConnectUsingEmailHandles {
  showModal: () => void;
}

const ConnectUsingEmail = (props, ref) => {
  const [open, setOpen] = useState(false);
  const wallet = useContext(WalletContext);

  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const [step, setStep] = useState(0);
  const [email, setEmail] = useState('');
  const [sendingEmail, setSendingEmail] = useState(false);

  // useEffect(() => {
  //     if (wallet.address) setOpen(false);
  // }, [wallet.address]);

  useImperativeHandle(ref, () => ({
    showModal() {
      setOpen(true);
    },
  }));

  const handleClose = (event, reason) => {
    if (reason && reason == 'backdropClick') return;
    setOpen(false);
  };

  const changeStep = async (step) => {
    setStep(-1);
    sleep(500).then(() => {
      setStep(step);
    });
  };

  const {
    mutateAsync: sendWalletLoginCode,
    isLoading: isSendingWalletLoginCode,
    isSuccess: walletLoginCodeSent,
    isError: walletLoginCodeError,
    error: walletLoginCodeErrorMessage,
  } = trpc.emails.sendWalletLoginCode.useMutation();

  const sendLoginCode = async () => {
    if (!email) {
      enqueueSnackbar('Please enter your email address', { variant: 'error' });
      return;
    }

    if (!isEmail(email)) {
      enqueueSnackbar('Please enter a valid email address', { variant: 'error' });
      return;
    }

    await sendWalletLoginCode({ email });
  };

  useEffect(() => {
    if (walletLoginCodeSent && !walletLoginCodeError) {
      changeStep(1);
      enqueueSnackbar('Login code sent to your email', { variant: 'success' });
    }


  }, [walletLoginCodeSent, walletLoginCodeError]);

  const [loggingIn, setLoggingIn] = useState(false);
  const [code, setCode] = useState('');

  // validate login code
  const login = async () => {
    closeSnackbar();

    try {
      if (!code) {
        throw 'Please enter the login code';
      }

      setLoggingIn(true);

      const response = await fetch('/api/accounts/email/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code }),
      });

      if (!response.ok) {
        const error = await response.json();
        if (error.message) throw error.message;
      }

      if (response.ok) {
        enqueueSnackbar('Login successful', { variant: 'success' });
        console.log(await response.json());
      }
    } catch (e) {
      console.error(e);
      if (typeof e === 'string') enqueueSnackbar(e, { variant: 'error' });
      else enqueueSnackbar('Error logging in', { variant: 'error' });
    } finally {
      setLoggingIn(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
    >
      <DialogContent sx={{ paddingY: 4, minHeight: 230 }}>
        <Stack
          direction="column"
          spacing={3}
        >
          <Typography
            variant="h2"
            align="center"
          >
            Connect to the app using your GoingUP Wallet
          </Typography>

          <Fade
            in={step === 0}
            mountOnEnter
            unmountOnExit
          >
            <Stack
              direction="column"
              spacing={2}
            >
              <Typography
                variant="body1"
                align="center"
              >
                To connect your wallet, you will need to login with your email address
              </Typography>

              <TextField
                label="Your email address"
                placeholder="mark@goingup.xyz"
                variant="outlined"
                fullWidth
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              <Stack
                direction={{ xs: 'column', md: 'row' }}
                spacing={3}
              >
                <LoadingButton
                  variant="contained"
                  color="primary"
                  fullWidth
                  onClick={sendLoginCode}
                  loading={isSendingWalletLoginCode}
                >
                  Send Login Code
                </LoadingButton>

                <Button
                  variant="outlined"
                  color="secondary"
                  fullWidth
                  onClick={() => setOpen(false)}
                >
                  Cancel
                </Button>
              </Stack>
            </Stack>
          </Fade>

          <Fade
            in={step === 1}
            mountOnEnter
            unmountOnExit
          >
            <Stack
              direction="column"
              spacing={3}
            >
              <Typography
                variant="body1"
                align="center"
              >
                We have sent a login code to your <b>{email}</b>
              </Typography>

              <Stack
                direction="column"
                spacing={0}
              >
                <TextField
                  label="Login Code"
                  variant="outlined"
                  fullWidth
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                />

                <Typography
                  variant="subtitle2"
                  color="gray"
                  align="center"
                >
                  No email? Please check your spam folder
                </Typography>
              </Stack>

              <Stack
                direction={{ xs: 'column', md: 'row' }}
                spacing={3}
              >
                <LoadingButton
                  variant="contained"
                  color="primary"
                  fullWidth
                  loading={loggingIn}
                  onClick={() => login()}
                >
                  Login and Connect
                </LoadingButton>

                <Button
                  variant="contained"
                  color="secondary"
                  fullWidth
                  onClick={() => changeStep(0)}
                >
                  Go back
                </Button>
              </Stack>
            </Stack>
          </Fade>
        </Stack>
      </DialogContent>
    </Dialog>
  );
};

export default forwardRef(ConnectUsingEmail);