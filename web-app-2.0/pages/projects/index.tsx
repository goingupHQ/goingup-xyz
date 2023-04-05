import Head from 'next/head';
import { Box, Button, Grid, Stack, Typography } from '@mui/material';
import { AppContext } from '../../contexts/app-context';
import { useContext, useEffect, useState } from 'react';
import { WalletContext } from '../../contexts/wallet-context';
import { ProjectsContext } from '../../contexts/projects-context';
import ProjectsList from '../../components/pages/projects/projects-list';
import NextLink from 'next/link';
import WrongNetwork from '../../components/pages/projects/wrong-network';

export default function Projects() {
  const app = useContext(AppContext);
  const wallet = useContext(WalletContext);
  const projectsContext = useContext(ProjectsContext);

  return (
    <>
      <Head>
        <title>GoingUP: Projects</title>
        <link
          rel="icon"
          href="/favicon.ico"
        />
      </Head>

      <Box>
        <Grid
          container
          sx={{ mb: 3 }}
          rowSpacing={2}
        >
          <Grid
            item
            xs={12}
            md={6}
          >
            <Typography variant="h1">Projects</Typography>
          </Grid>

          <Grid
            item
            xs={12}
            md={6}
            sx={{ textAlign: { xs: 'initial', md: 'right' } }}
          >
            <NextLink
              href="/projects/create"
              passHref
            >
              <Button
                variant="contained"
                color="primary"
                size="large"
              >
                Create A Project
              </Button>
            </NextLink>
          </Grid>
        </Grid>

        {wallet.address === null && (
          <Stack
            justifyContent="center"
            alignItems="center"
            direction="column"
            spacing={4}
          >
            <Typography variant="h2">You need a connected wallet with a GoingUP account to access Projects</Typography>
            <img
              src="/images/illustrations/connection-lost.svg"
              alt="connection-lost"
              style={{ width: '100%', maxWidth: '500px' }}
            />
          </Stack>
        )}

        {wallet.address !== null && (
          <>
            {!projectsContext.isCorrectNetwork && <WrongNetwork />}

            {projectsContext.isCorrectNetwork && <ProjectsList />}
          </>
        )}
      </Box>
    </>
  );
}
