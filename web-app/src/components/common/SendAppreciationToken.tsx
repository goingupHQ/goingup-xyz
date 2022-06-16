// @ts-nocheck
import { AppContext } from '@/contexts/AppContext';
import { WalletContext } from '@/contexts/WalletContext';
import { LoadingButton } from '@mui/lab';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    Select,
    Grid,
    InputLabel,
    MenuItem,
    Typography,
    TextField
} from '@mui/material';
import {
    forwardRef,
    useContext,
    useImperativeHandle,
    useState,
    useEffect
} from 'react';
import { ethers } from 'ethers';
import { useSnackbar } from 'notistack';
import artifact from './../../../artifacts/GoingUpUtilityToken.json';

const SendAppreciationToken = (props, ref) => {
    const { sendToName, sendToAddress } = props;
    const [open, setOpen] = useState(false);
    const [sending, setSending] = useState(false);

    const [tier, setTier] = useState(1);
    const [message, setMessage] = useState('');

    const wallet = useContext(WalletContext);
    const { enqueueSnackbar } = useSnackbar();

    useImperativeHandle(ref, () => ({
        showModal() {
            setOpen(true);
        }
    }));

    const close = () => {
        setOpen(false);
    };

    const fieldStyle = {
        m: 1
    };

    const send = async () => {
        setSending(true);
        try {
            if (wallet.chain === 'Ethereum') {
                if (wallet.network != wallet.utilityToken.chainId) {
                    enqueueSnackbar(`Please switch to ${wallet.utilityToken.chainName} 💫`, {
                        variant: 'error'
                    });
                    return;
                }
                const address = wallet.utilityToken.address;
                const signer = wallet.ethersSigner;

                const contract = new ethers.Contract(
                    address,
                    artifact.abi,
                    signer
                );
                const settings = await contract.tokenSettings(tier);
                const tx = await contract.mint(sendToAddress, tier, 1, Boolean(message), message, {
                    value: settings.price
                });

                enqueueSnackbar(
                    `The appreciation token mint transaction has been submitted to the blockchain 👍`,
                    { variant: 'success' }
                );
                close();
            }

            if (wallet.chain === 'Cardano') {
                enqueueSnackbar(
                    'Sorry, appreciation tokens are not yet available for Cardano',
                    { variant: 'error' }
                );
            }
        } catch (err) {
            console.log(err);
            enqueueSnackbar('Sorry something went wrong 😥', {
                variant: 'error'
            });
        } finally {
            setSending(false);
        }
    };

    return (
        <div>
            <Dialog open={open} onClose={close} maxWidth="lg">
                <DialogTitle>
                    Send Appreciation Token To {sendToName}
                </DialogTitle>
                <DialogContent>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sx={{ textAlign: 'center' }}>
                            <img
                                src={`/images/appreciation-token-t${tier}-display.png`}
                                style={{ maxWidth: '200px' }}
                            />
                        </Grid>
                        <Grid
                            item
                            xs={12}
                            sx={{ paddingTop: '25px !important' }}
                        >
                            <FormControl fullWidth>
                                <InputLabel id="demo-simple-select-label">
                                    Token Tier
                                </InputLabel>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    value={tier}
                                    label="Token Tier"
                                    onChange={(e) => {
                                        // @ts-ignore
                                        setTier(parseInt(e.target.value));
                                    }}
                                >
                                    <MenuItem value={1}>
                                        Appreciation Token Tier 1
                                    </MenuItem>
                                    <MenuItem value={2}>
                                        Appreciation Token Tier 2
                                    </MenuItem>
                                    <MenuItem value={3}>
                                        Appreciation Token Tier 3
                                    </MenuItem>
                                    <MenuItem value={4}>
                                        Appreciation Token Tier 4
                                    </MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sx={{ textAlign: 'center' }}>
                            <TextField
                                label="Message"
                                multiline
                                rows={4}
                                fullWidth
                                value={message}
                                onChange={e => setMessage(e.target.value)}
                            />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button
                        color="secondary"
                        variant="contained"
                        onClick={close}
                    >
                        Cancel
                    </Button>
                    <LoadingButton
                        loading={sending}
                        loadingIndicator="Submitting..."
                        color="primary"
                        variant="contained"
                        onClick={send}
                    >
                        Send Appreciation Token
                    </LoadingButton>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default forwardRef(SendAppreciationToken);
