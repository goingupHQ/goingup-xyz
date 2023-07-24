import React from 'react';
import Head from 'next/head';
import possessive from '@wardrakus/possessive';
import { Fade, Box, Typography } from '@mui/material';
import { useRouter } from 'next/router';
import Poaps from '../../components/profile/poaps';
import AppreciationTokens from '../../components/profile/appreciation-tokens';
import ProjectsSection from '../../components/profile/project-sections';
import { trpc } from '@/utils/trpc';
import ProfileSection from '@/components/profile/profile-section';

function ProfilePage() {
  const router = useRouter();
  const { address } = router.query;

  const {
    data: account,
    isLoading: loadingAccount,
    refetch: getAccount,
  } = trpc.accounts.get.useQuery({ address: (address as string) || '' }, { enabled: Boolean(address) });

  console.log(address);
  console.log(account);

  return (
    <>
      {account && (
        <>
          <Head>
            <title>{possessive(account?.name)} GoingUP Profile</title>
          </Head>
          <Box
            justifyContent="center"
            alignItems="center"
            sx={{
              marginBottom: '20px',
              display: { xs: 'flex', md: 'none' },
            }}
          >
            <Typography variant="h2">{account?.name}</Typography>
          </Box>
          <Fade
            in={true}
            timeout={1000}
          >
            <Box marginTop={3}>
              <ProfileSection
                account={account}
                refresh={getAccount}
              />
              <ProjectsSection account={account} />
              <AppreciationTokens
                account={account}
                refresh={getAccount}
              />
              <Poaps
                account={account}
                refresh={getAccount}
              />
            </Box>
          </Fade>
        </>
      )}
    </>
  );
}

export default ProfilePage;
