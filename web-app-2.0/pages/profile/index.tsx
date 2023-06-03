import Head from 'next/head';
import { Typography } from '@mui/material';
import { AppContext } from '../../contexts/app-context';
import { useContext, useEffect } from 'react';
import { WalletContext } from '../../contexts/wallet-context';
import { Box } from '@mui/system';
import { useRouter } from 'next/router';
import { trpc } from '@/utils/trpc';

export default function Profile() {
  const wallet = useContext(WalletContext);
  const router = useRouter();

  const { refetch: checkAccount } = trpc.accounts.hasAccount.useQuery(
    { address: wallet.address! },
    { enabled: Boolean(wallet.address) }
  );

  useEffect(() => {
    if (wallet.address) {
      checkAccount().then((hasAccount) => {
        if (!hasAccount) {
          router.push('/profile/create');
        } else {
          router.push(`/profile/${wallet.address}`);
        }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wallet.address]);

  return (
    <>
      <Head>
        <title>GoingUP: Profile</title>
        <link
          rel="icon"
          href="/favicon.ico"
        />
      </Head>

      <Typography variant="h1">Profile</Typography>

      {wallet.address === null && (
        <Box sx={{ mt: 4, textAlign: 'center' }}>
          <Typography variant="h2">
            You need a connected wallet with a GoingUP account to access your Profile
          </Typography>
          <img
            src="/images/illustrations/connection-lost.svg"
            alt="connection-lost"
            style={{ width: '100%', maxWidth: '500px' }}
          />
        </Box>
      )}

      {wallet.address !== null && (
        <Box sx={{ mt: 4, textAlign: 'center' }}>
          <Typography variant="h2">Redirecting... </Typography>
          <img
            src="/images/illustrations/connection-lost.svg"
            alt="connection-lost"
            style={{ width: '100%', maxWidth: '500px' }}
          />
        </Box>
      )}
    </>
  );
}
