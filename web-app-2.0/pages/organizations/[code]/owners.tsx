import { trpc } from '@/utils/trpc';
import { Backdrop, Box, CircularProgress, Grid, Typography } from '@mui/material';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Profile from '@/components/common/profile';
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

      <Box sx={{ mt: 2 }}>
        <Typography variant="h5">Organization Owners</Typography>
        <Typography>
          Please email us at <a href="mailto:app@goingup.xyz">app@goingup.xyz</a> if you want to make changes to your
          organization&apos;s ownership.
        </Typography>
      </Box>

      <Grid
        container
        spacing={2}
        sx={{ mt: 2 }}
      >
        {organization?.owners?.map((owner) => (
          <Grid
            item
            xs={12}
            md={6}
            lg={4}
            xl={3}
            key={owner}
          >
            <Profile
              key={owner}
              addressOrAccount={owner}
            />
          </Grid>
        ))}
      </Grid>

      <Backdrop
        open={isLoading}
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </>
  );
}
