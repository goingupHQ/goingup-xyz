import Head from 'next/head';
import { Box, Grid } from '@mui/material';
import { useRouter } from 'next/router';
import OrganizationPage from '../../../components/pages/organizations/organization-header';
import JobsOpening from '../../../components/pages/organizations/jobs-opening';
import OrganizationProjects from '../../../components/pages/organizations/organization-projects';
import OrganizationTokens from '../../../components/pages/organizations/organization-tokens';
import { trpc } from '@/utils/trpc';
import LoadingIllustration from '@/components/common/loading-illustration';
import { useAccount } from 'wagmi';
import Navigation from '@/components/organizations/navigation';
import { useContext } from 'react';
import { WalletContext } from '@/contexts/wallet-context';

export default function Organization() {
  const router = useRouter();
  const code = router.query.code as string;
  const {
    data: organization,
    isFetching,
    isFetched,
  } = trpc.organizations.get.useQuery({ code }, { enabled: Boolean(code) });

  const wallet = useContext(WalletContext);
  const address = wallet?.address;
  const isOwner = organization?.owners?.includes(address || '');

  return (
    <>
      {isFetching && <LoadingIllustration />}
      {!isFetching && isFetched && organization && (
        <>
          <Head>
            <title>GoingUP: Organizations</title>
            <link
              rel="icon"
              href="/favicon.ico"
            />
          </Head>

          {isOwner && <Navigation org={organization} />}

          <Box>
            <OrganizationPage organization={organization} />
            <OrganizationProjects account={organization} />
            <OrganizationTokens account={organization} />
            {/* <Grid
              container
              spacing={4}
            >
              <Grid
                item
                xs={12}
                md={6}
              >
                <OrganizationMembers />
              </Grid>
              <Grid
                item
                xs={12}
                md={6}
              >
                <OrganizationPartnerships />
              </Grid>
            </Grid> */}
            <JobsOpening account={organization} />
          </Box>
        </>
      )}
    </>
  );
}
