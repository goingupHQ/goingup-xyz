import { WalletContext } from '@/contexts/wallet-context';
import { Account } from '@/types/account';
import { trpc } from '@/utils/trpc';
import { LoadingButton } from '@mui/lab';
import {
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  InputLabel,
  ListItemText,
  MenuItem,
  Select,
  TextField,
} from '@mui/material';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import { forwardRef, useContext, useEffect, useImperativeHandle, useState } from 'react';

type VerifyTwitterProps = {
  account: Account;
};

export type VerifyTwitterRef = {
  showModal: () => void;
};

const VerifyTwitter = ({ account }: VerifyTwitterProps, ref: React.Ref<VerifyTwitterRef>) => {
  const [open, setOpen] = useState(false);
  const [tweetUrl, setTweetUrl] = useState('');

  const wallet = useContext(WalletContext);
  const router = useRouter();

  const { enqueueSnackbar } = useSnackbar();

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

  const {
    mutateAsync: verifyTwitter,
    isLoading: verifyingTwitter,
    isSuccess: twitterVerified,
    isError: twitterVerifyError,
    error: twitterVerifyErrorData,
  } = trpc.accounts.verifyTwitter.useMutation();

  useEffect(() => {
    if (twitterVerified) {
      enqueueSnackbar('Twitter account verified', {
        variant: 'success',
      });
      handleClose();
    }

    if (twitterVerifyError) {
      enqueueSnackbar(`Error verifying twitter account: ${twitterVerifyErrorData?.message}`, {
        variant: 'error',
      });
    }
  }, [twitterVerified, twitterVerifyError, twitterVerifyErrorData]);

  const verify = async () => {
    if (tweetUrl.indexOf('twitter.com') === -1) {
      enqueueSnackbar('The tweet URL you provided is not valid', {
        variant: 'error',
      });
      return;
    }

    const parts = tweetUrl.split('/');
    const tweetId = Number(parts[5]);
    if (isNaN(tweetId)) {
      enqueueSnackbar('The tweet URL you provided is not valid', {
        variant: 'error',
      });
      return;
    }

    verifyTwitter({ tweetId });
  };

  return (
    <div>
      <Dialog
        open={open}
        onClose={handleClose}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Paste your verification tweet URL</DialogTitle>
        <DialogContent>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: {
                xs: 'autofill',
              },
            }}
          >
            <TextField
              label="Tweet URL"
              placeholder="https://twitter.com/markGoingUP/status/1493919760954068998"
              variant="outlined"
              required
              sx={fieldStyle}
              value={tweetUrl}
              onChange={(e) => setTweetUrl(e.target.value)}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button
            color="secondary"
            variant="contained"
            onClick={handleClose}
          >
            Cancel
          </Button>
          <LoadingButton
            loading={verifyingTwitter}
            loadingIndicator="Verifying..."
            color="primary"
            variant="contained"
            onClick={verify}
          >
            Verify Twitter Account
          </LoadingButton>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default forwardRef(VerifyTwitter);
