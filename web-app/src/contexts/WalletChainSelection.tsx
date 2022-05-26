import { AppContext } from '@/contexts/AppContext';
import { WalletContext } from '@/contexts/WalletContext';
import { LoadingButton } from '@mui/lab';
import {
    Dialog,
    DialogActions,
    DialogContent,
    Stack,
    useTheme
} from '@mui/material';
import { forwardRef, useContext, useImperativeHandle, useState, useEffect } from 'react';

const WalletChainSelection = (props, ref) => {
    const { connectEthereum, connectCardano } = props;
    const [open, setOpen] = useState(false);
    const theme = useTheme();
    const wallet = useContext(WalletContext);

    useEffect(() => {
        if (wallet.address) setOpen(false);
    }, [wallet.address])

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

    const chainItemSx = {
        padding: 2,
        '&:hover': {
            backgroundColor: theme.colors.secondary.main,
            color: theme.colors.primary.dark
        },
        cursor: 'pointer',
        borderRadius: '5px'
    };

    return (
        <div>
            <Dialog open={open} onClose={handleClose} maxWidth="md">
                <DialogContent sx={{ paddingY: 5 }}>
                    <Stack
                        direction="column"
                    >
                        <Stack
                            direction="row"
                            spacing={2}
                            alignItems="center"
                            sx={chainItemSx}
                            onClick={() => {
                                // handleClose();
                                connectEthereum();
                            }}
                        >
                            <img
                                src="/images/ethereum-eth-logo.svg"
                                width={64}
                                height={64}
                            />

                            <h1>Connect using Ethereum</h1>
                        </Stack>

                        {/* <Stack
                            direction="row"
                            spacing={2}
                            alignItems="center"
                            sx={chainItemSx}
                            onClick={() => {
                                connectCardano();
                            }}
                        >
                            <img
                                src="/images/cardano-ada-logo.svg"
                                width={64}
                                height={64}
                            />
                            <h1>Connect using Cardano</h1>
                        </Stack> */}
                    </Stack>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default forwardRef(WalletChainSelection);
