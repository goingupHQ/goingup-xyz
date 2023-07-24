import Head from 'next/head';
import { Typography, Box } from '@mui/material';
import { AppContext } from '../../contexts/app-context';
import { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { OrganizationsContext } from '../../contexts/organizations-context';
import OrganizationsList from '../../components/pages/organizations/organizations-list';
import LoadingIllustration from '../../components/common/loading-illustration';

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
