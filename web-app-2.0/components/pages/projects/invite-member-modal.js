import {
    Dialog,
    DialogContent,
    DialogTitle,
    Stack,
    Typography,
    useTheme
} from '@mui/material';
import { forwardRef, useContext, useImperativeHandle, useState, useEffect } from 'react';
import { WalletContext } from '../../../contexts/wallet-context';
import { AppContext } from '../../../contexts/app-context';
import AddressInput from '../../common/address-input';

const InviteMemberModal = (props, ref) => {
    const [open, setOpen] = useState(false);
    const theme = useTheme();
    const wallet = useContext(WalletContext);
    const app = useContext(AppContext);
    const [address, setAddress] = useState('');

    const { project } = props;

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
            <DialogTitle>
                <Typography variant="h1">Invite Member To {project?.name}</Typography>
            </DialogTitle>
            <DialogContent sx={{ paddingY: 10 }}>
                <Stack
                    direction="column"
                >
                    <AddressInput value={address} onChange={setAddress} />
                </Stack>
            </DialogContent>
        </Dialog>
    );
};

export default forwardRef(InviteMemberModal);
