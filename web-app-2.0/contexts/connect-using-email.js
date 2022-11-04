import { WalletContext } from './wallet-context';
import { Button, Dialog, DialogContent, Stack, TextField, Typography } from '@mui/material';
import { forwardRef, useContext, useImperativeHandle, useState, useEffect } from 'react';

const ConnectUsingEmail = (props, ref) => {
    const [open, setOpen] = useState(false);
    const wallet = useContext(WalletContext);

    useEffect(() => {
        if (wallet.address) setOpen(false);
    }, [wallet.address]);

    useImperativeHandle(ref, () => ({
        showModal() {
            setOpen(true);
        },
    }));

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <Dialog open={open} onClose={handleClose} maxWidth="md">
            <DialogContent sx={{ paddingY: 4 }}>
                <Stack direction="column" spacing={3}>
                    <Typography variant="h2" align="center">
                        Connect to the app using your GoingUP Wallet
                    </Typography>

                    <Typography variant="body1" align="center">
                        To connect your wallet, you will need to login with your email address
                    </Typography>

                    <TextField label="Your email address" placeholder="mark@goingup.xyz" variant="outlined" fullWidth />

                    <Button variant="contained" color="primary" fullWidth>
                        Send Login Code
                    </Button>
                </Stack>
            </DialogContent>
        </Dialog>
    );
};

export default forwardRef(ConnectUsingEmail);
