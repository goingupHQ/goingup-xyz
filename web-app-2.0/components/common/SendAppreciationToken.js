import { WalletContext } from '../../contexts/wallet-context';
import { AppContext } from '../../contexts/app-context';
import { LoadingButton } from '@mui/lab';
import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  FormControl,
  Select,
  Grid,
  InputLabel,
  MenuItem,
  TextField,
  Stack,
} from '@mui/material';
import { forwardRef, useContext, useImperativeHandle, useState } from 'react';
import { useSnackbar } from 'notistack';
import AccountNameAddress from './account-name-address';
import { UtilityTokensContext } from '../../contexts/utility-tokens-context';
import { trpc } from '../../utils/trpc';
import { TRPCError } from '@trpc/server';

const SendAppreciationToken = (props, ref) => {
  const { sendToName, sendToAddress, onSent } = props;
  const [open, setOpen] = useState(false);
  const [sending, setSending] = useState(false);

  const [tier, setTier] = useState(1);
  const [amount, setAmount] = useState(1);
  const [message, setMessage] = useState('');
  const [member, setMember] = useState(null);
  const [projectId, setProjectId] = useState(null);

  const wallet = useContext(WalletContext);
  const { enqueueSnackbar } = useSnackbar();

  const utilityTokensContext = useContext(UtilityTokensContext);

  useImperativeHandle(ref, () => ({
    showModal() {
      setOpen(true);
    },

    openFromProjectMember(projectId, member) {
      setProjectId(projectId);
      setMember(member);
      setTier(member.reward?.tokenId || 1);
      setAmount(member.reward?.amount || 1);
      setOpen(true);
    },
  }));

  const close = () => {
    setOpen(false);
  };

  const { mutateAsync: sendTokenFromCustodialWallet } = trpc.utilityTokens.sendTokenFromCustodialWallet.useMutation();

  const send = async () => {
    setSending(true);
    try {
      let tx;
      if (wallet.walletType === 'evm') {
        tx = await utilityTokensContext.sendUtilityToken(sendToAddress, tier, amount, message);
      } else if (wallet.walletType === 'custodial') {
        tx = await sendTokenFromCustodialWallet({
          chainId: 137,
          to: sendToAddress,
          tokenId: tier,
          amount,
          message,
        });
      }

      if (tx) {
        if (projectId && member?.address) {
          fetch(`/api/projects/rewards/${tx.hash}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              projectId,
              member: member.address,
              memberRecordId: member.id,
              tokenId: tier,
              amount,
              type: 'goingup-appreciation-token',
            }),
          });
        }

        if (onSent && typeof onSent === 'function') {
          onSent();
        }

        enqueueSnackbar(`The appreciation token mint transaction has been submitted to the blockchain 👍`, {
          variant: 'success',
        });

        close();
      }
    } catch (err) {
      if (err instanceof TRPCError) {
        enqueueSnackbar(err.message, {
          variant: 'error',
        });
      } else {
        console.error(err);
        enqueueSnackbar('Sorry something went wrong 😥', {
          variant: 'error',
        });
      }
    } finally {
      setSending(false);
    }
  };

  const getTokenImage = (tokenId) => {
    switch (tokenId) {
      case 1:
      case 2:
      case 3:
      case 4:
        return `/images/appreciation-token-t${tokenId}-display.jpg`;
      case 5:
        return `/images/human-council-token.jpg`;
      case 6:
        return `/images/gitcoin-donor-art.png`;
      case 7:
        return `/images/hc-nirvana.jpg`;
      case 8:
        return `/images/cm-volunteer-appr.jpg`;
    }
  };

  return (
    <div>
      <Dialog
        open={open}
        onClose={close}
        maxWidth="sm"
      >
        <DialogTitle>
          Send Appreciation Token To <AccountNameAddress address={sendToAddress} />
        </DialogTitle>
        <DialogContent>
          <Grid
            container
            spacing={2}
          >
            <Grid
              item
              xs={12}
              sx={{ textAlign: 'center' }}
            >
              <img
                src={getTokenImage(tier)}
                style={{ maxWidth: '200px' }}
                alt="appreciation-token"
              />
            </Grid>
            <Grid
              item
              xs={12}
              md={Boolean(member) ? 6 : 12}
              sx={{ paddingTop: { sm: 'initial', md: '25px !important' } }}
            >
              <FormControl fullWidth>
                <InputLabel id="token-tier-label">Token Tier</InputLabel>
                <Select
                  labelId="token-tier-label"
                  id="token-tier-select"
                  value={tier}
                  label="Token Tier"
                  onChange={(e) => {
                    // @ts-ignore
                    setTier(parseInt(e.target.value));
                  }}
                  disabled={Boolean(member)}
                >
                  <MenuItem value={1}>Appreciation Token Tier 1</MenuItem>
                  <MenuItem value={2}>Appreciation Token Tier 2</MenuItem>
                  <MenuItem value={3}>Appreciation Token Tier 3</MenuItem>
                  <MenuItem value={4}>Appreciation Token Tier 4</MenuItem>
                  <MenuItem value={5}>Human Council DAO Appreciation Token</MenuItem>
                  <MenuItem value={7}>Human Council x Nirvana Project</MenuItem>
                  <MenuItem value={8}>Token of Appreciation for Crypto Mondays Volunteers</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {Boolean(member) && (
              <Grid
                item
                xs={12}
                md={Boolean(member) ? 6 : 12}
                sx={{ paddingTop: { sm: 'initial', md: '25px !important' } }}
              >
                <TextField
                  label="Amount"
                  fullWidth
                  value={amount}
                  disabled
                />
              </Grid>
            )}

            <Grid
              item
              xs={12}
              sx={{ textAlign: 'center' }}
            >
              <TextField
                label="Message"
                multiline
                rows={4}
                fullWidth
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </Grid>

            <Grid
              item
              xs={12}
            >
              <Stack
                direction={{ xs: 'column', md: 'row' }}
                spacing={2}
                justifyContent="flex-start"
              >
                <LoadingButton
                  loading={sending}
                  loadingIndicator="Submitting..."
                  color="primary"
                  variant="contained"
                  onClick={send}
                >
                  Send Appreciation Token
                </LoadingButton>
                <Button
                  color="secondary"
                  variant="contained"
                  onClick={close}
                >
                  Cancel
                </Button>
              </Stack>
            </Grid>
          </Grid>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default forwardRef(SendAppreciationToken);
