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
    Grid,
    InputLabel,
    ListItemText,
    MenuItem,
    Select,
    TextField,
    Typography
} from '@mui/material';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import { forwardRef, useContext, useImperativeHandle, useState } from 'react';

const VerifyEmail = (props, ref) => {
    const { account } = props;
    const [open, setOpen] = useState(false);
    const [email, setEmail] = useState('');
    const [sendingCode, setSendingCode] = useState<boolean>(false);
    const [codeSent, setCodeSent] = useState<boolean>(false);
    const [code, setCode] = useState<string>('');
    const [verifying, setVerifying] = useState<boolean>(false);

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

    const sendCode = async () => {
        if (!email) {
            enqueueSnackbar('Please enter your email address', { variant: 'error' });
            return;
        }

        setSendingCode(true);
        const { address, ethersSigner } = wallet;
        const signature = await wallet.signMessage('send-verification-email-code');

        try {
            const valid = email.toLowerCase().match(/^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i);

            if (!valid) {
                enqueueSnackbar('Please enter a valid email address', { variant: 'error' });
                return;
            }

            const response = await fetch(`/api/send-email-verification-code?address=${address}&name=${account.name}&email=${email}&signature=${signature}`);

            if (response.status === 200) {
                setCodeSent(true);
                enqueueSnackbar('Verification code sent', { variant: 'success' });
            }
        } catch (err) {
            console.log(err);
            enqueueSnackbar('Your email verification code could not be sent', { variant: 'error' });
        } finally {
            setSendingCode(false);
        }
    };

    const verify = async () => {
        if (!code) {
            enqueueSnackbar(`Please enter the verification code we sent to your ${email}`, { variant: 'error' });
            return;
        }

        setVerifying(true);

        try {
            const { address, ethersSigner } = wallet;
            const signature = await wallet.signMessage('verify-email');

            const response = await fetch(`/api/verify-email?address=${address}&signature=${signature}&code=${code}`);

            if (response.status === 200) {
                props.refresh();
                enqueueSnackbar('Your email address was verified and linked to your profile', { variant: 'success' });
                setOpen(false);
            } else {
                console.log(response);
                enqueueSnackbar('Your email address could not be verified', { variant: 'error' });
            }
        } catch (err) {
            enqueueSnackbar('Your email address could not be verified', { variant: 'error' });
            console.log(err);
        } finally {
            setVerifying(false);
        }
    };

    return (
        <div>
            <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
                <DialogTitle>
                    Email Verification
                </DialogTitle>
                <DialogContent>
                    <Grid
                        container
                        spacing={2}
                        alignItems="center"
                        sx={{ marginTop: 1 }}
                    >
                        <Grid item xs={12}>
                                <Typography variant="body1">
                                    Enter your email address and we will send you a verification code
                                </Typography>
                            </Grid>
                        <Grid item xs={12}>
                            <TextField
                                type="email"
                                label="Your email address"
                                variant="outlined"
                                required
                                value={email}
                                fullWidth
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </Grid>
                        <Grid item xs={4}>
                            <LoadingButton
                                variant="outlined"
                                color="info"
                                fullWidth
                                loading={sendingCode}
                                onClick={sendCode}
                            >
                                Send Code
                            </LoadingButton>
                        </Grid>
                        {codeSent &&
                        <>
                            <Grid item xs={12}>
                                <Typography variant="body1">
                                    We have sent your email verification code. Please check your inbox and paste the verification code below.
                                </Typography>
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    label="Verification Code"
                                    variant="outlined"
                                    required
                                    value={code}
                                    fullWidth
                                    onChange={(e) => setCode(e.target.value)}
                                />
                            </Grid>
                        </>
                        }
                    </Grid>
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
                        disabled={!codeSent}
                        loading={verifying}
                        loadingIndicator="Verifying..."
                        color="primary"
                        variant="contained"
                        onClick={verify}
                    >
                        Verify Email
                    </LoadingButton>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default forwardRef(VerifyEmail);
