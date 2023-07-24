import CreateRewardToken from '@/components/organizations/create-reward-token';
import OrgPageHeader from '@/components/organizations/org-page-header';
import RewardTokenCard from '@/components/organizations/reward-token-card';
import { Organization } from '@/types/organization';
import { trpc } from '@/utils/trpc';
import { Box, Button, Grid, Typography } from '@mui/material';
import Head from 'next/head';
import { useRouter } from 'next/router';

const RewardTokens = () => {
  const router = useRouter();
  const code = router.query.code as string;
  const { data: organization, isLoading } = trpc.organizations.get.useQuery({ code }, { enabled: Boolean(code) });

  return (
    <>
      <Head>
        <title>{isLoading ? 'Loading Organization...' : `${organization?.name} - Reward Tokens`}</title>
      </Head>

      <OrgPageHeader org={organization} />

      <Box sx={{ mt: 2 }}>
        <Typography variant="h5">Reward Tokens</Typography>
        <Typography>Manage your organizations reward tokens</Typography>
      </Box>

      {organization !== undefined && organization !== null && <CreateRewardToken org={organization} />}

      {Boolean(organization?.rewardTokens) === false || organization?.rewardTokens?.length === 0 ? (
        <>
          <Box
            component="img"
            src="/images/illustrations/empty-box.svg"
            sx={{ width: 300, height: 300, my: 2 }}
          />
          <Typography
            variant="h6"
            sx={{ my: 2 }}
          >
            No reward tokens found
          </Typography>
        </>
      ) : (
        <>
          <Grid container spacing={2} sx={{ mt: 2 }}>
            {organization?.rewardTokens?.map((rewardToken) => (
              <Grid item xs={12} md={6} lg={4} xl={3} key={rewardToken}>
                <RewardTokenCard rewardTokenId={rewardToken} />
              </Grid>
            ))}
          </Grid>
        </>
      )}
    </>
  );
};

export default RewardTokens;
