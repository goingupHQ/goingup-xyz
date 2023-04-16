import OrgPageHeader from '@/components/organizations/org-page-header';
import { Organization } from '@/types/organization';
import { trpc } from '@/utils/trpc';
import { Box, Typography } from '@mui/material';
import Head from 'next/head';
import { useRouter } from 'next/router';

type RewardTokensProps = {
  org: Organization;
};

const RewardTokens = ({ org }: RewardTokensProps) => {
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
        <Typography>
          Manage your organizations reward tokens
        </Typography>
      </Box>
    </>
  );
};

export default RewardTokens;
