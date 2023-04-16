import { trpc } from '@/utils/trpc';
import { Backdrop, Box, CircularProgress, Grid, Stack, Typography } from '@mui/material';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Profile from '@/components/common/profile';
import Navigation from '@/components/organizations/navigation';
import OrgPageHeader from '@/components/organizations/org-page-header';

export default function Owners() {
  const router = useRouter();
  const code = router.query.code as string;
  const { data: organization, isLoading } = trpc.organizations.get.useQuery({ code }, { enabled: Boolean(code) });

  return (
    <>
      <Head>
        <title>{isLoading ? 'Loading Organization...' : `${organization?.name}`}</title>
      </Head>

      <OrgPageHeader org={organization} />

      <Backdrop open={isLoading} sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <CircularProgress color="inherit" />
      </Backdrop>

      <Grid container spacing={2} sx={{ mt: 2 }}>
      {organization?.owners?.map((owner) => (
        <Grid item xs={12} md={6} lg={4} xl={3}>
          <Profile key={owner} addressOrAccount={owner} />
        </Grid>
      ))}
      </Grid>
    </>
  );
}
