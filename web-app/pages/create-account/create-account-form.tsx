import React, { useState, useRef } from 'react';
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
import PersonalInfo from './personal-info';
import ProjectGoals from './project-goals';
import InviteFriends from './invite-friends';

export default function CreateAccountForm() {
    const theme = useTheme();
    const { enqueueSnackbar } = useSnackbar();
    const steps = ['Personal Information', 'Project Goals', 'Invite Friends'];
    const [activeStep, setActiveStep] = useState(0);
    const [skipped, setSkipped] = useState(new Set<number>());

    const [open, setOpen] = React.useState(false);

    const handleClose = () => {
        setOpen(false);
    };

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [discord, setDiscord] = useState('');
    const [occupation, setOccupation] = useState<any>(null);
    const [availabilityState, setAvailabilityState] = useState<any>(null);
    const [primaryGoal, setPrimaryGoal] = useState<any>(null);
    const [idealCollab, setIdealCollab] = useState<any>(null);
    const [email2, setEmail2] = useState<any>('');
    const [email1, setEmail1] = useState<any>('');
    const [email3, setEmail3] = useState<any>('');
    const [email4, setEmail4] = useState<any>('');


    const state = {
        firstName,
        setFirstName,
        lastName,
        setLastName,
        email,
        setEmail,
        discord,
        setDiscord,
        occupation,
        setOccupation,
        availabilityState,
        setAvailabilityState,
        primaryGoal,
        setPrimaryGoal,
        idealCollab,
        setIdealCollab,
        email1,
        setEmail1,
        email2,
        setEmail2,
        email3,
        setEmail3,
        email4,
        setEmail4
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
console.log(state);
        if (activeStep === 0) {
            if (!firstName) {
                enqueueSnackbar('We need your first name', {
                    variant: 'error'
                });
                hasError = true;
            }

            if (!lastName) {
                enqueueSnackbar('We need your last name', { variant: 'error' });
                hasError = true;
            }

            if (!occupation) {
                enqueueSnackbar('Please choose an occupation', { variant: 'error' });
                hasError = true;
            }

            if (!availabilityState) {
                enqueueSnackbar('Please choose an availability', { variant: 'error' });
                hasError = true;
            }
        }

        if (activeStep === 1) {
            if (!primaryGoal) {
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
                    <Button variant='contained' onClick={handleClose} autoFocus>
                        Yes, create my GoingUP account
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}
