import React from 'react';
import { Grid, Card, Typography, Fade, Box } from '@mui/material';
import ProfilePhotoSection from './profile-photo-section';
import ProfileAddressSection from './profile-address-section';
import { Account } from '@/types/account';

type ProfileSectionProps = {
  account: Account;
  refresh: () => void;
};

const ProfileSection = ({ account, refresh }: ProfileSectionProps) => {
  return (
    <>
      <Fade
        in={true}
        timeout={1000}
      >
        <Card>
          <Grid
            padding={0}
            container
            direction={{
              xs: 'column',
              md: 'row',
            }}
            justifyContent="space-between"
            alignItems={{
              xs: 'flex-start',
              md: 'center',
            }}
            marginTop={'15px'}
            sx={{
              paddingX: { xs: '15px', md: '30px' },
              marginTop: { xs: '15px', md: '30px' },
            }}
          >
            <Grid item>
              <ProfilePhotoSection
                account={account}
                refresh={refresh}
              />
            </Grid>
            <Grid item>
              <ProfileAddressSection
                account={account}
                refresh={refresh}
              />
            </Grid>
          </Grid>
          <Box paddingBottom={'30px'}>
            <Typography
              sx={{ margin: '30px' }}
            >
              {account.about}
            </Typography>
          </Box>
        </Card>
      </Fade>
    </>
  );
};

export default ProfileSection;
