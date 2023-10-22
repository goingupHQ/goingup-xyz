import { Typography } from '@mui/material';
import Head from 'next/head';
import OrganizationsList from '../../components/pages/organizations/organizations-list';

export default function Organizations() {
  return (
    <>
      <Head>
        <title>GoingUP: Organizations</title>
        <link
          rel="icon"
          href="/favicon.ico"
        />
      </Head>

      <Typography
        variant="h1"
        marginY={3}
      >
        Organizations
      </Typography>
      <OrganizationsList />
    </>
  );
}
