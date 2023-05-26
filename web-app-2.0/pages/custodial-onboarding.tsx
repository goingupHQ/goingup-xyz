import AvailabilitySelect from '@/components/common/availability-select';
import OccupationMultiSelect from '@/components/common/occupation-multi-select';
import OccupationSelect from '@/components/common/occupation-select';
import UserGoalSelect from '@/components/common/user-goal-select';
import { Availability, Occupation, UserGoal } from '@/contexts/app-context';
import { Box, Fade, Stack, TextField, Typography } from '@mui/material';
import Head from 'next/head';
import { useState } from 'react';

const CustodialOnboarding = () => {
  const [name, setName] = useState<string>('');
  const [occupation, setOccupation] = useState<Occupation | null>(null);
  const [openTo, setOpenTo] = useState<Availability[]>([]);
  const [idealCollabs, setIdealCollabs] = useState<Occupation[]>([]);
  const [userGoals, setUserGoals] = useState<UserGoal[]>([]);

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

          </Stack>
        </Box>
      </Fade>
    </>
  );
};

export default CustodialOnboarding;
