import { WalletContext } from './wallet-context';
import { Dialog, DialogContent, Stack, Typography, useTheme } from '@mui/material';
import { forwardRef, createRef, useContext, useImperativeHandle, useState, useEffect } from 'react';
import { AppContext } from './app-context';
import ConnectUsingEmail from './connect-using-email';
import { useSnackbar } from 'notistack';

const WalletChainSelection = (props, ref) => {
    const [open, setOpen] = useState(false);
    const theme = useTheme();
    const wallet = useContext(WalletContext);
    const app = useContext(AppContext);

    const { enqueueSnackbar } = useSnackbar();

    const connectUsingEmailRef = createRef();

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

    const fieldStyle = {
        m: 1,
    };

    const chainItemSx = {
        padding: { xs: 2, md: '1rem 2rem' },
        backgroundColor: theme.palette.primary.main,
        color: 'black',
        '&:hover': {
            backgroundColor: theme.palette.primary.light,
        },
        cursor: 'pointer',
        borderRadius: '5px',
    };

    return (
        <>
            <Dialog open={open} onClose={handleClose} maxWidth="md">
                <DialogContent sx={{ paddingY: 4 }}>
                    <Stack direction="column" spacing={3}>
                        <Typography variant="h2" align="center">
                            Choose Wallet Type
                        </Typography>

                        <Stack
                            direction="column"
                            alignItems="center"
                            justifyContent="center"
                            sx={chainItemSx}
                            onClick={() => {
                                // handleClose();
                                // connectUsingEmailRef.current.showModal();
                                enqueueSnackbar('Not yet available but it is coming soon!', { variant: 'info' });
                            }}
                        >
                            <h2
                                style={{
                                    whiteSpace: 'nowrap',
                                    textOverflow: 'ellipsis',
                                    overflowX: 'hidden',
                                    margin: '0px',
                                }}
                            >
                                GoingUP Wallet
                            </h2>
                            <sub>Your own wallet, managed by us.</sub>
                        </Stack>

                        <Stack
                            direction="column"
                            alignItems="center"
                            justifyContent="center"
                            sx={chainItemSx}
                            onClick={() => {
                                handleClose();
                                wallet.setWeb3ModalTheme(app.mode);
                                wallet.connectEthereum();
                            }}
                        >
                            <h2
                                style={{
                                    whiteSpace: 'nowrap',
                                    textOverflow: 'ellipsis',
                                    overflowX: 'hidden',
                                    margin: '0px',
                                }}
                            >
                                Ethereum and EVM-compatible chains
                            </h2>
                            <sub>Metamask, Coinbase Wallet, WalletConnect, etc.</sub>
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
            <ConnectUsingEmail ref={connectUsingEmailRef} />
        </>
    );
};

export default forwardRef(WalletChainSelection);
