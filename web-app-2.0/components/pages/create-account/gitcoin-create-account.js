import React, { useState, useRef, useContext } from 'react';
import {
    Box,
    Button,
    Typography,
    Step,
    Stepper,
    StepLabel,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    useTheme,
    useMediaQuery,
    styled,
    Paper,
} from '@mui/material';
import { useSnackbar } from 'notistack';
import { WalletContext } from '../../../contexts/wallet-context';
import PersonalInfo from './personal-info';
import ProjectGoals from './project-goals';
import InviteFriends from './invite-friends';
import { LoadingButton } from '@mui/lab';
import { useRouter } from 'next/router';

export default function GitcoinCreateAccountForm() {
    const router = useRouter();
    const wallet = useContext(WalletContext);
    const { enqueueSnackbar } = useSnackbar();

    const [open, setOpen] = React.useState(false);

    const handleClose = () => {
        setOpen(false);
    };

    const [name, setName] = useState('');
    const [occupation, setOccupation] = useState(null);
    const [openTo, setOpenTo] = useState([]);
    const [projectGoals, setProjectGoals] = useState([]);
    const [idealCollab, setIdealCollab] = useState([]);
    const [email2, setEmail2] = useState('');
    const [email1, setEmail1] = useState('');
    const [email3, setEmail3] = useState('');
    const [email4, setEmail4] = useState('');
    const [inviteMessage, setInviteMessage] = useState(null);
    const [creating, setCreating] = useState(false);

    const state = {
        name,
        setName,
        occupation,
        setOccupation,
        openTo,
        setOpenTo,
        projectGoals,
        setProjectGoals,
        idealCollab,
        setIdealCollab,
        email1,
        setEmail1,
        email2,
        setEmail2,
        email3,
        setEmail3,
        email4,
        setEmail4,
        inviteMessage,
        setInviteMessage,
    };

    const showCreateConfirm = () => {
        let hasErrors = false;

        if (!name) {
            enqueueSnackbar('Please enter your name', { variant: 'error' });
            hasErrors = true;
        }

        if (!occupation) {
            enqueueSnackbar('Please enter your occupation', { variant: 'error' });
            hasErrors = true;
        }

        if (!openTo.length) {
            enqueueSnackbar('Please select at least one option for "Open To"', { variant: 'error' });
            hasErrors = true;
        }

        if (!projectGoals.length) {
            enqueueSnackbar('Please select at least one option for "Project Goals"', { variant: 'error' });
            hasErrors = true;
        }

        if (!idealCollab.length) {
            enqueueSnackbar('Please select at least one option for "Ideal Collaboration"', { variant: 'error' });
            hasErrors = true;
        }

        if (!hasErrors) {
            setOpen(true);
        }
    }

    const createAccount = async (e) => {
        e.preventDefault();
        setCreating(true);

        try {
            const { address } = wallet;
            const signature = await wallet.signMessage('create-account');

            const response = await fetch('/api/create-account/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    address,
                    signature,
                    account: {
                        name,
                        occupation,
                        openTo,
                        projectGoals,
                        idealCollab,
                    },
                    email1,
                    email2,
                    email3,
                    email4,
                    inviteMessage,
                }),
            });

            console.log(response.status);

            if (response.status === 200) {
                enqueueSnackbar('Your account was successfully created', { variant: 'success' });
                router.push(`/profile/${wallet.address}`);
            } else {
                enqueueSnackbar('There was a problem creating your account', { variant: 'error' });
            }

            setOpen(false);
        } catch (err) {
            console.log(err);
            if (typeof err === 'string') {
                enqueueSnackbar(err, { variant: 'error' });
            } else {
                enqueueSnackbar('There was a problem creating your account', { variant: 'error' });
            }
        } finally {
            setCreating(false);
        }
    };

    return (
        <>
            <Paper sx={{ p: 2, mb: 2 }}>
                <Typography variant="h3" sx={{ mb: 2 }}>
                    Personal Information
                </Typography>
                <PersonalInfo state={state} />
            </Paper>

            <Paper sx={{ p: 2, mb: 2 }}>
                <Typography variant="h3" sx={{ mb: 2 }}>
                    Project Goals
                </Typography>
                <ProjectGoals state={state} />
            </Paper>

            <Paper sx={{ p: 2, mb: 2 }}>
                <InviteFriends state={state} />
            </Paper>

            <Button size="large" variant="contained" onClick={() => showCreateConfirm()}>
                Create my account and claim my GoingUP NFT
            </Button>

            <Dialog open={open} onClose={handleClose}>
                <DialogTitle id="alert-dialog-title">{'Create Account & Claim GoingUP NFT'}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        <Typography variant="body1" sx={{ mb: 2 }}>
                            We are about to create your GoingUP account. Are you sure the details you provided are correct?
                        </Typography>

                        <Typography variant="body1" sx={{ mb: 2 }}>
                            At the same time, we will mint and send you a GoingUP NFT to your wallet address
                        </Typography>
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button variant="text" onClick={handleClose}>
                        No
                    </Button>
                    <LoadingButton
                        variant="contained"
                        onClick={createAccount}
                        loading={creating}
                        loadingIndicator="Creating..."
                    >
                        Yes, create my GoingUP account
                    </LoadingButton>
                </DialogActions>
            </Dialog>
        </>
    );
}
