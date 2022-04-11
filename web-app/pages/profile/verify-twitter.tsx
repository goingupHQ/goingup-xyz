import { AppContext } from '@/contexts/AppContext';
import { WalletContext } from '@/contexts/WalletContext';
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
    TextField
} from '@mui/material';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import { forwardRef, useContext, useImperativeHandle, useState } from 'react';

const VerifyTwitter = (props, ref) => {
    const { account } = props;
    const [open, setOpen] = useState(false);
    const [tweetUrl, setTweetUrl] = useState('');

    const [saving, setSaving] = useState(false);

    const wallet = useContext(WalletContext);
    const router = useRouter();

    const { enqueueSnackbar } = useSnackbar();

    useImperativeHandle(ref, () => ({
        showModal() {
            setOpen(true);
        }
    }));

    const handleClose = () => {
        setOpen(false);
    };

    const fieldStyle = {
        m: 1
    };

    const verify = async () => {
        if (tweetUrl.indexOf('twitter.com') === -1) {
            enqueueSnackbar('The tweet URL you provided is not valid', {
                variant: 'error'
            });
            return;
        }

        const parts = tweetUrl.split('/');
        // @ts-ignore
        if (isNaN(parts[5])) {
            enqueueSnackbar('The tweet URL you provided is not valid', {
                variant: 'error'
            });
            return;
        }

        setSaving(true);

        try {
            const verifyResponse = await fetch(
                `/api/verify-twitter?tweetid=${parts[5]}&address=${wallet.address}`
            );

            if (verifyResponse.status !== 200) {
                const responseText = await verifyResponse.text();
                let errorMessage;
                switch (responseText) {
                    case 'no-hastag':
                        errorMessage =
                            'You need to add #GoingUP in the verification tweet';
                        break;
                    case 'no-address':
                        errorMessage =
                            'Your wallet address is missing from the verification tweet';
                        break;
                    case 'address-mismatch':
                        errorMessage =
                            'The wallet address in the verification tweet does not match your wallet address';
                        break;
                    case 'invalid-tweetid':
                        errorMessage =
                            'The verification tweet URL you provided is invalid';
                        break;
                }
                enqueueSnackbar(errorMessage, { variant: 'error' });
                return;
            }

            const result = await verifyResponse.json();
            console.log(result);

            const { address, ethersSigner } = wallet;
            const message = 'update-account';
            const signature = await wallet.signMessage(message);

            const response = await fetch('/api/update-account/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    address,
                    signature,
                    account: {
                        twitter: result.data.includes.users[0].username,
                        twitterUser: result.data.includes.users[0]
                    }
                })
            });

            if (response.status === 200) {
                enqueueSnackbar('Twitter account connected', {
                    variant: 'success'
                });
                router.replace(router.asPath);
                setOpen(false);
            } else {
                enqueueSnackbar('Failed to connect Twitter account', {
                    variant: 'error'
                });
            }
        } catch (err) {
            enqueueSnackbar('Failed to save profile changes', {
                variant: 'error'
            });
            console.log(err);
        } finally {
            setSaving(false);
        }
    };

    return (
        <div>
            <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
                <DialogTitle>Paste your verification tweet URL</DialogTitle>
                <DialogContent>
                    <Box
                        sx={{
                            display: 'grid',
                            gridTemplateColumns: {
                                xs: 'autofill'
                            }
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
                        loading={saving}
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
