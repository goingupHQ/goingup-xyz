import React, { useState } from 'react';
import Head from 'next/head';
import TopNavigationLayout from 'src/layouts/TopNavigationLayout';
import {
    Box,
    Button,
    Grid,
    Card,
    CardHeader,
    CardContent,
    Typography,
    Avatar,
    Step,
    Stepper,
    StepLabel,
    TextField,
    styled
} from '@mui/material';
import PersonalInfo from './personal-info';
import ProjectGoals from './project-goals';

const CardContentWrapper = styled(CardContent)(
    () => `
        position: relative;
  `
);

const steps = ['Personal Information', 'Project Goals', 'Invite Friends'];

function CreateAccount() {
    const [activeStep, setActiveStep] = useState(0);
    const [skipped, setSkipped] = useState(new Set<number>());

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

        setActiveStep((prevActiveStep) => prevActiveStep + 1);
        setSkipped(newSkipped);
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const handleSkip = () => {
        if (!isStepOptional(activeStep)) {
            // You probably want to guard against something like this,
            // it should never occur unless someone's actively trying to break something.
            throw new Error("You can't skip a step that isn't optional.");
        }

        setActiveStep((prevActiveStep) => prevActiveStep + 1);
        setSkipped((prevSkipped) => {
            const newSkipped = new Set(prevSkipped.values());
            newSkipped.add(activeStep);
            return newSkipped;
        });
    };

    const handleReset = () => {
        setActiveStep(0);
    };

    return (
        <>
            <Head>
                <title>Create an account with GoingUP</title>
            </Head>
            <Grid
                sx={{ px: 4 }}
                container
                direction="row"
                justifyContent="center"
                alignItems="stretch"
                spacing={3}
            >
                <Grid item xs={12}>
                    <Card
                        sx={{
                            height: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                            marginTop: '4rem'
                        }}
                    >
                        <CardHeader
                            sx={{
                                px: 3,
                                pt: 3,
                                alignItems: 'flex-start'
                            }}
                            title={
                                <>
                                    <Typography variant="h1">
                                        Create Account
                                    </Typography>
                                    <Typography variant="subtitle1">
                                        Fill in the fields below to sign up for
                                        an account
                                    </Typography>
                                </>
                            }
                        />
                        <CardContentWrapper
                            sx={{
                                px: 3,
                                pt: 0
                            }}
                        >
                            <Stepper activeStep={activeStep}>
                                {steps.map((label, index) => {
                                    const stepProps: { completed?: boolean } =
                                        {};
                                    const labelProps: {
                                        optional?: React.ReactNode;
                                    } = {};
                                    if (isStepOptional(index)) {
                                        labelProps.optional = (
                                            <Typography variant="caption">
                                                Optional
                                            </Typography>
                                        );
                                    }
                                    if (isStepSkipped(index)) {
                                        stepProps.completed = false;
                                    }
                                    return (
                                        <Step key={label} {...stepProps}>
                                            <StepLabel {...labelProps}>
                                                {label}
                                            </StepLabel>
                                        </Step>
                                    );
                                })}
                            </Stepper>
                            {activeStep === steps.length ? (
                                <React.Fragment>
                                    <Typography sx={{ mt: 2, mb: 1 }}>
                                        All steps completed - you&apos;re
                                        finished
                                    </Typography>
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            flexDirection: 'row',
                                            pt: 2
                                        }}
                                    >
                                        <Box sx={{ flex: '1 1 auto' }} />
                                        <Button onClick={handleReset}>
                                            Reset
                                        </Button>
                                    </Box>
                                </React.Fragment>
                            ) : (
                                <React.Fragment>
                                    {/* <Typography sx={{ mt: 2, mb: 1 }}>
                                        Step {activeStep + 1}
                                    </Typography> */}

                                    {activeStep === 0 && <PersonalInfo />}
                                    {activeStep === 1 && <ProjectGoals />}

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
                                        {isStepOptional(activeStep) && (
                                            <Button
                                                color="inherit"
                                                onClick={handleSkip}
                                                sx={{ mr: 1 }}
                                            >
                                                Skip
                                            </Button>
                                        )}
                                        <Button onClick={handleNext}>
                                            {activeStep === steps.length - 1
                                                ? 'Finish'
                                                : 'Next'}
                                        </Button>
                                    </Box>
                                </React.Fragment>
                            )}
                        </CardContentWrapper>
                    </Card>
                </Grid>
            </Grid>
        </>
    );
}

CreateAccount.getLayout = (page) => (
    <TopNavigationLayout>{page}</TopNavigationLayout>
);

export default CreateAccount;
