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
    TextField
} from '@mui/material';
import { useSnackbar } from 'notistack';
import { WalletContext } from '../../../contexts/wallet-context';
import PersonalInfo from './human-council-personal-info';
import ProjectGoals from './project-goals';
import InviteFriends from './invite-friends';
import { LoadingButton } from '@mui/lab';
import { useRouter } from 'next/router';
import isEmail from 'validator/lib/isEmail';

export default function CreateAccountForm() {
    const router = useRouter();
    const wallet = useContext(WalletContext);
    const theme = useTheme();
    const { enqueueSnackbar } = useSnackbar();
    const steps = ['Personal Information', 'Project Goals', 'Invite Friends'];
    const [activeStep, setActiveStep] = useState(0);

    const [open, setOpen] = React.useState(false);

    const handleClose = () => {
        setOpen(false);
    };

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
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
        email,
        setEmail,
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
        setInviteMessage
    };

    const personalInfoRef = useRef(null);

    const handleNext = () => {
        let hasError = false;

        if (activeStep === 0) {
            if (!name) {
                enqueueSnackbar('We need your name', {
                    variant: 'error'
                });
                hasError = true;
            }

            if (!email) {
                enqueueSnackbar('We need your email', {
                    variant: 'error'
                });
                hasError = true;
            } else {
                if (!isEmail(email)) {
                    enqueueSnackbar('Please enter a valid email', {
                        variant: 'error'
                    });
                    hasError = true;
                }
            }

            if (!occupation) {
                enqueueSnackbar('Please choose an occupation', { variant: 'error' });
                hasError = true;
            }

            if (!openTo.length) {
                enqueueSnackbar('Please choose an availability', { variant: 'error' });
                hasError = true;
            }
        }

        if (activeStep === 1) {
            if (!projectGoals.length) {
                enqueueSnackbar('Please choose your primary goal', {
                    variant: 'error'
                });
                hasError = true;
            }

            if (!idealCollab) {
                enqueueSnackbar('Please choose your ideal collaborator', { variant: 'error' });
                hasError = true;
            }
        }

        if (!hasError) {
            if (activeStep === steps.length - 1) {
                setOpen(true);
            } else {
                // send login code email when step 0 is complete
                if (activeStep === 0) {
                    fetch('/api/accounts/email/send-human-council-code', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            email
                        })
                    });
                }

                setActiveStep((prevActiveStep) => prevActiveStep + 1);
            }
        }
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const handleReset = () => {
        setActiveStep(0);
    };

    const [loginCode, setLoginCode] = useState('');

    const createAccount = async (e) => {
        e.preventDefault();
        setCreating(true);

        try {
            const { address } = wallet;
            const signature = await wallet.signMessage('create-account');

            const response = await fetch('api/create-account/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    address,
                    signature,
                    account: {
                        name, occupation, openTo, projectGoals, idealCollab
                    },
                    email1, email2, email3, email4, inviteMessage
                })
            })

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
        } finally {
            setCreating(false);
        }
    }

    return (
        <>
            <Stepper
                activeStep={activeStep}
                orientation={
                    useMediaQuery(theme.breakpoints.down('sm'))
                        ? 'vertical'
                        : 'horizontal'
                }
                sx={{
                    mb: { xs: 0, md: 4 },
                }}
            >
                {steps.map((label, index) => {
                    const stepProps = {};
                    const labelProps = { optional: React.ReactNode } = {};

                    return (
                        <Step key={label} {...stepProps}>
                            <StepLabel {...labelProps}>{label}</StepLabel>
                        </Step>
                    );
                })}
            </Stepper>
            {activeStep === steps.length ? (
                <React.Fragment>
                    <Typography sx={{ mt: 2, mb: 1 }}>
                        All steps completed - you&apos;re finished
                    </Typography>
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'row',
                            pt: 2
                        }}
                    >
                        <Box sx={{ flex: '1 1 auto' }} />
                        <Button onClick={handleReset}>Reset</Button>
                    </Box>
                </React.Fragment>
            ) : (
                <React.Fragment>
                    {/* <Typography sx={{ mt: 2, mb: 1 }}>
                                        Step {activeStep + 1}
                                    </Typography> */}

                    {activeStep === 0 && <PersonalInfo state={state} />}
                    {activeStep === 1 && <ProjectGoals state={state} />}
                    {activeStep === 2 && <InviteFriends state={state} />}

                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'row',
                            pt: 2
                        }}
                    >
                        <Button
                            variant="contained"
                            color="secondary"
                            disabled={activeStep === 0}
                            onClick={handleBack}
                            sx={{ mr: 1 }}
                        >
                            Back
                        </Button>
                        <Box sx={{ flex: '1 1 auto' }} />
                        <Button variant="contained" onClick={handleNext}>
                            {activeStep === steps.length - 1
                                ? 'Finish'
                                : 'Next'}
                        </Button>
                    </Box>
                </React.Fragment>
            )}

            <Dialog
                open={open}
                onClose={handleClose}
            >
                <DialogTitle id="alert-dialog-title">
                    {"Account Creation"}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        We sent an login code to {email}. Please paste it below to complete your account creation.
                    </DialogContentText>
                    <TextField
                        autoFocus
                        label="Login Code"
                        value={loginCode}
                        onChange={(e) => setLoginCode(e.target.value)}
                        fullWidth
                        sx={{ mt: 3 }}
                    />

                </DialogContent>
                <DialogActions>
                    <Button variant='text' onClick={handleClose}>Go back</Button>
                    <LoadingButton variant='contained' onClick={createAccount} loading={creating} loadingIndicator='Creating...'>
                        Create my GoingUP account
                    </LoadingButton>
                </DialogActions>
            </Dialog>
        </>
    );
}
