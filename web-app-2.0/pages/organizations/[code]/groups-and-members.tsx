import OrgPageHeader from '@/components/organizations/org-page-header';
import { trpc } from '@/utils/trpc';
import { Box, Typography } from '@mui/material';
import Head from 'next/head';
import { useRouter } from 'next/router';

const RewardsAndMembers = () => {
  const router = useRouter();
  const code = router.query.code as string;
  const { data: organization, isLoading } = trpc.organizations.get.useQuery({ code }, { enabled: Boolean(code) });

  return (
    <>
      <Head>
        <title>
          {isLoading ? 'Loading Organization...' : `${organization?.name} - Rewards and Members`}
        </title>
      </Head>

      <OrgPageHeader org={organization} />

      <Box sx={{ mt: 2 }}>
        <Typography variant="h5">Groups and Members</Typography>
        <Typography>Manage your organization&apos;s groups &amp; members and distribute reward tokens</Typography>
      </Box>

    </>
  );
};

export default RewardsAndMembers;
