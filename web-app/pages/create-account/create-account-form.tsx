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
    styled
} from '@mui/material';
import { useSnackbar } from 'notistack';
import { WalletContext } from 'src/contexts/WalletContext';
import PersonalInfo from './personal-info';
import ProjectGoals from './project-goals';
import InviteFriends from './invite-friends';
import { LoadingButton } from '@mui/lab';
import { useRouter } from 'next/router';

export default function CreateAccountForm() {
    const router = useRouter();
    const wallet = useContext(WalletContext);
    const theme = useTheme();
    const { enqueueSnackbar } = useSnackbar();
    const steps = ['Personal Information', 'Project Goals', 'Invite Friends'];
    const [activeStep, setActiveStep] = useState(0);
    const [skipped, setSkipped] = useState(new Set<number>());

    const [open, setOpen] = React.useState(false);

    const handleClose = () => {
        setOpen(false);
    };

    const [name, setName] = useState('');
    const [occupation, setOccupation] = useState<any>(null);
    const [openTo, setOpenTo] = useState<number[]>([]);
    const [projectGoals, setProjectGoals] = useState<number[]>([]);
    const [idealCollab, setIdealCollab] = useState<number[]>([]);
    const [email2, setEmail2] = useState<any>('');
    const [email1, setEmail1] = useState<any>('');
    const [email3, setEmail3] = useState<any>('');
    const [email4, setEmail4] = useState<any>('');
    const [inviteMessage, setInviteMessage] = useState<String>(null);
    const [creating, setCreating] = useState<boolean>(false);

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
        setInviteMessage
    };

    const personalInfoRef = useRef(null);

    // @ts-ignore
    const isStepOptional = (step: number) => {
        // return step === 1;
        return false;
    };

    const isStepSkipped = (step: number) => {
        return skipped.has(step);
    };

    const handleNext = () => {
        let newSkipped = skipped;
        if (isStepSkipped(activeStep)) {
            newSkipped = new Set(newSkipped.values());
            newSkipped.delete(activeStep);
        }

        let hasError = false;

        if (activeStep === 0) {
            if (!name) {
                enqueueSnackbar('We need your name', {
                    variant: 'error'
                });
                hasError = true;
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
                setActiveStep((prevActiveStep) => prevActiveStep + 1);
                setSkipped(newSkipped);
            }
        }
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const handleReset = () => {
        setActiveStep(0);
    };

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
            >
                {steps.map((label, index) => {
                    const stepProps: { completed?: boolean } = {};
                    const labelProps: {
                        optional?: React.ReactNode;
                    } = {};
                    if (isStepOptional(index)) {
                        labelProps.optional = (
                            <Typography variant="caption">Optional</Typography>
                        );
                    }
                    if (isStepSkipped(index)) {
                        stepProps.completed = false;
                    }
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
                            color="inherit"
                            disabled={activeStep === 0}
                            onClick={handleBack}
                            sx={{ mr: 1 }}
                        >
                            Back
                        </Button>
                        <Box sx={{ flex: '1 1 auto' }} />
                        <Button onClick={handleNext}>
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
                        We are about to create your GoingUP account. Are you sure the details you provided are correct?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button variant='text' onClick={handleClose}>No</Button>
                    <LoadingButton variant='contained' onClick={createAccount} loading={creating} loadingIndicator='Creating...'>
                        Yes, create my GoingUP account
                    </LoadingButton>
                </DialogActions>
            </Dialog>
        </>
    );
}
