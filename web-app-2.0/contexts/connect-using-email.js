import { WalletContext } from './wallet-context';
import { Box, Button, Dialog, DialogContent, Fade, Stack, TextField, Typography } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { forwardRef, useContext, useImperativeHandle, useState, useEffect } from 'react';
import { useSnackbar } from 'notistack';
import sleep from '@react-corekit/sleep';
import isEmail from 'validator/lib/isEmail';
const ConnectUsingEmail = (props, ref) => {
    const [open, setOpen] = useState(false);
    const wallet = useContext(WalletContext);

    const { enqueueSnackbar } = useSnackbar();

    const [step, setStep] = useState(0);
    const [email, setEmail] = useState('');
    const [sendingEmail, setSendingEmail] = useState(false);

    useEffect(() => {
        if (wallet.address) setOpen(false);
    }, [wallet.address]);

    useImperativeHandle(ref, () => ({
        showModal() {
            setOpen(true);
        },
    }));

    const handleClose = (event, reason) => {
        if (reason && reason == "backdropClick")
            return;
        setOpen(false);
    }

    const changeStep = async (step) => {
        setStep(-1);
        sleep(500).then(() => {
            setStep(step);
        });
    }

    const sendLoginCode = async () => {
        if (!email) {
            enqueueSnackbar('Please enter your email address', { variant: 'error' });
            return;
        }

        if (!isEmail(email)) {
            enqueueSnackbar('Please enter a valid email address', { variant: 'error' });
            return;
        }

        setSendingEmail(true);

        try {
            await sleep(1000);
            const res = await fetch('/api/accounts/email/send-wallet-login-code', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            });

            if (res.status === 200) {
                changeStep(1);
                enqueueSnackbar('Login code sent to your email', { variant: 'success' });
            } else {
                enqueueSnackbar('Error sending login code', { variant: 'error' });
            }
        } catch (e) {
            console.error(e);
            enqueueSnackbar('Error sending login code', { variant: 'error' });
        } finally {
            setSendingEmail(false);
        }
    };

    return (
        <Dialog open={open} onClose={handleClose} maxWidth="md">
            <DialogContent sx={{ paddingY: 4, minHeight: 230 }} >
                <Stack direction="column" spacing={3}>
                    <Typography variant="h2" align="center">
                        Connect to the app using your GoingUP Wallet
                    </Typography>

                    <Fade in={step === 0} mountOnEnter unmountOnExit>
                        <Stack direction="column" spacing={2}>
                            <Typography variant="body1" align="center">
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

                            <LoadingButton
                                variant="contained"
                                color="primary"
                                fullWidth
                                onClick={sendLoginCode}
                                loading={sendingEmail}
                            >
                                Send Login Code
                            </LoadingButton>
                        </Stack>
                    </Fade>

                    <Fade in={step === 1} mountOnEnter unmountOnExit>
                        <Stack direction="column" spacing={2}>
                            <Typography variant="body1" align="center">
                                We have sent a login code to your <b>{email}</b>. Please enter it below to login.
                            </Typography>

                            <TextField label="Login Code" placeholder="123456" variant="outlined" fullWidth />

                            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                                <Button variant="contained" color="primary" fullWidth>
                                    Login and Connect
                                </Button>

                                <Button variant="outlined" color="primary" fullWidth onClick={() => changeStep(0)}>
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
