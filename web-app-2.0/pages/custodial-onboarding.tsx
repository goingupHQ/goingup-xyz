import AvailabilitySelect from '@/components/common/availability-select';
import OccupationMultiSelect from '@/components/common/occupation-multi-select';
import OccupationSelect from '@/components/common/occupation-select';
import UserGoalSelect from '@/components/common/user-goal-select';
import { Availability, Occupation, UserGoal } from '@/contexts/app-context';
import { trpc } from '@/utils/trpc';
import { LoadingButton } from '@mui/lab';
import { Box, Fade, Stack, TextField, Typography } from '@mui/material';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import { useEffect, useState } from 'react';

const CustodialOnboarding = () => {
  const { enqueueSnackbar } = useSnackbar();
  const nextRouter = useRouter();

  const [name, setName] = useState<string>('');
  const [occupation, setOccupation] = useState<Occupation | null>(null);
  const [openTo, setOpenTo] = useState<Availability[]>([]);
  const [idealCollabs, setIdealCollabs] = useState<Occupation[]>([]);
  const [userGoals, setUserGoals] = useState<UserGoal[]>([]);

  const {
    data: account,
    mutateAsync: completeOnboarding,
    isLoading: completingOnboarding,
    isSuccess: onboardingCompleted,
    isError: onboardingFailed,
  } = trpc.accounts.completeCustodialOnboarding.useMutation();

  useEffect(() => {
    if (onboardingCompleted) {
      enqueueSnackbar('Your GoingUP account setup is complete!', { variant: 'success' });
      nextRouter.push(`/profile/${account?.address}`);
    }

    if (onboardingFailed) {
      enqueueSnackbar('Something went wrong. Please try again.', { variant: 'error' });
    }
  }, [onboardingCompleted, onboardingFailed]);

  return (
    <>
      <Head>
        <title>Complete your GoingUP account setup</title>
      </Head>

      <Fade
        in={true}
        timeout={1000}
      >
        <Box>
          <Typography variant="h1">Complete your GoingUP account setup</Typography>
          <Typography
            variant="subtitle1"
            sx={{ marginBottom: 4 }}
          >
            You're almost there! Please fill out the form below to complete your account setup.
          </Typography>

          <Stack
            spacing={3}
            justifyContent="flex-start"
            sx={{
              mt: 4,
              width: {
                xs: '100%',
                md: '60%',
                lg: '40%',
              },
            }}
          >
            <TextField
              label="Your Name"
              placeholder="You can give a nickname, prefered name or alias"
              variant="outlined"
              required
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <OccupationSelect
              value={occupation}
              setValue={setOccupation}
            />

            <AvailabilitySelect
              value={openTo}
              setValue={setOpenTo}
              label="I am open to..."
            />

            <OccupationMultiSelect
              value={idealCollabs}
              setValue={setIdealCollabs}
              label="I would like to collaborate with..."
            />

            <UserGoalSelect
              value={userGoals}
              setValue={setUserGoals}
            />

            <LoadingButton
              variant="contained"
              color="primary"
              sx={{ alignSelf: 'flex-start' }}
              loading={completingOnboarding}
              onClick={() =>
                completeOnboarding({
                  name,
                  occupation: occupation!.id,
                  openTo: openTo.map((availability) => availability.id),
                  idealCollab: idealCollabs.map((occupation) => occupation.id),
                  projectGoals: userGoals.map((goal) => goal.id),
                })
              }
            >
              Complete my GoingUP profile
            </LoadingButton>
          </Stack>
        </Box>
      </Fade>
    </>
  );
};

export default CustodialOnboarding;
