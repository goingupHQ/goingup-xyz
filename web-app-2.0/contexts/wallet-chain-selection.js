import { WalletContext } from './wallet-context';
import {
    Dialog,
    DialogContent,
    Stack,
    Typography,
    useTheme
} from '@mui/material';
import { forwardRef, useContext, useImperativeHandle, useState, useEffect } from 'react';
import { AppContext } from './app-context';

const WalletChainSelection = (props, ref) => {
    const [open, setOpen] = useState(false);
    const theme = useTheme();
    const wallet = useContext(WalletContext);
    const app = useContext(AppContext);

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
        padding: { xs: 2, md: '2rem 4rem' },
        backgroundColor: theme.palette.primary.main,
        color: 'black',
        '&:hover': {
            backgroundColor: theme.palette.primary.light,
        },
        cursor: 'pointer',
        borderRadius: '5px',
    };

    return (
        <Dialog open={open} onClose={handleClose} maxWidth="md">
            <DialogContent sx={{ paddingY: 5 }}>
                <Stack
                    direction="column"
                >
                    <Stack
                        direction="row"
                        spacing={2}
                        alignItems="center"
                        justifyContent="center"
                        sx={chainItemSx}
                        onClick={() => {
                            handleClose();
                            wallet.setWeb3ModalTheme(app.mode)
                            wallet.connectEthereum();
                        }}
                    >
                        <img
                            src="/images/ethereum-eth-logo.svg"
                            width={32}
                            height={32}
                        />

                        <h2 style={{
                            whiteSpace: 'nowrap',
                            textOverflow: 'ellipsis',
                            overflowX: 'hidden'
                        }}>
                            Connect on Ethereum
                        </h2>
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
    );
};

export default forwardRef(WalletChainSelection);
