import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    Grid,
    InputLabel,
    MenuItem,
    Select,
    Stack,
    TextField,
    Typography,
    useTheme,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { forwardRef, useContext, useImperativeHandle, useState, useEffect, useRef } from 'react';
import { WalletContext } from '../../../contexts/wallet-context';
import { AppContext } from '../../../contexts/app-context';
import AddressInput from '../../common/address-input';
import { UtilityTokensContext } from '../../../contexts/utility-tokens-context';
import { useSnackbar } from 'notistack';
import { ethers } from 'ethers';
import { ProjectsContext } from '../../../contexts/projects-context';

const LeaveProjectModal = (props, ref) => {
    const [open, setOpen] = useState(false);
    const wallet = useContext(WalletContext);
    const projectsContext = useContext(ProjectsContext);

    const [reason, setReason] = useState('');

    const { enqueueSnackbar, closeSnackbar } = useSnackbar();

    const { project, reload } = props;

    useEffect(() => {
        if (wallet.address) setOpen(false);
    }, [wallet.address]);

    useImperativeHandle(ref, () => ({
        showModal() {
            setReason('');
            setOpen(true);
        },
    }));

    const handleClose = () => {
        setOpen(false);
    };


    const [leaving, setLeaving] = useState(false);
    const leave = async () => {
        try {
            setLeaving(true);

            const tx = await projectsContext.leaveProject(project.id, reason);

            setOpen(false);

            const shortTxHash = tx.hash.substr(0, 6) + '...' + tx.hash.substr(tx.hash.length - 4, 4);
            const key = enqueueSnackbar(`Leave project transaction submitted (${shortTxHash})`, {
                variant: 'info',
                action: (key) => (
                    <Button variant="contained" color="primary" onClick={() => {
                        window.open(`${projectsContext.networkParams.blockExplorerUrls[0]}tx/${tx.hash}`, '_blank');
                    }}>Open in Block Explorer</Button>
                ),
                persist: true,
            });

            tx.wait().then((receipt) => {
                closeSnackbar(key);
                enqueueSnackbar('Member invite transaction confirmed', {
                    variant: 'success',
                });
                if (reload) reload();
            });
        } catch (err) {
            if (typeof err === 'string') enqueueSnackbar(err, { variant: 'error' });
            else enqueueSnackbar(err.message, { variant: 'error' });
        } finally {
            setLeaving(false);
        }
    };

    return (
        <Dialog open={open} onClose={handleClose} maxWidth="md">
            <DialogTitle>
                <Typography variant="h2">Leave Project {project?.name}</Typography>
            </DialogTitle>
            <DialogContent sx={{ paddingTop: 5 }}>
                <br />
                <Grid container spacing={3}>

                    <Grid item xs={12}>
                        <TextField
                            label="Reason for leaving"
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            fullWidth
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <Stack direction="row" spacing={2} justifyContent="flex-start">
                            <LoadingButton loading={leaving} variant="contained" color="primary" onClick={leave}>
                                Leave Project
                            </LoadingButton>

                            <Button variant="contained" color="secondary" onClick={handleClose}>
                                Cancel
                            </Button>
                        </Stack>
                    </Grid>
                </Grid>
            </DialogContent>
        </Dialog>
    );
};

export default forwardRef(LeaveProjectModal);
