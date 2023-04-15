import { trpc } from '@/utils/trpc';
import { Backdrop, Box, CircularProgress, Grid, Stack, Typography } from '@mui/material';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Profile from '@/components/common/profile';

export default function Owners() {
  const router = useRouter();
  const code = router.query.code as string;
  const { data: organization, isLoading } = trpc.organizations.get.useQuery({ code }, { enabled: Boolean(code) });

  return (
    <>
      <Head>
        <title>{organization?.name}: Manage Owners</title>
      </Head>

      <Stack direction="row" spacing={2} justifyContent="flex-start" alignItems="center">
        <Box component="img" src={organization?.logo} sx={{ width: 50, height: 50 }} />
        <Typography variant="h4">{organization?.name}</Typography>
      </Stack>

      <Box sx={{ mt: 2 }}>
        <Typography variant="h5">Organization Owners</Typography>
      </Box>

      <Backdrop open={isLoading} sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <CircularProgress color="inherit" />
      </Backdrop>

      <Grid container spacing={2} sx={{ mt: 2 }}>
      {organization?.owners?.map((owner) => (
        <Grid item xs={12} md={6} lg={4} xl={3}>
          <Profile key={owner} address={owner} />
        </Grid>
      ))}
      </Grid>
    </>
  );
}
