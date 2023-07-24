import { Box } from '@mui/material';
import { useContext, useEffect } from 'react';
import { WalletContext } from '../contexts/wallet-context';
import DesktopNav from './layout/desktop-nav';
import Header from './layout/header';

type LayoutProps = {
  children: React.ReactNode;
};

export default function Layout({ children }: LayoutProps) {
  const wallet = useContext(WalletContext);

  useEffect(() => {
    // connect wallet if cached
    if (localStorage.getItem('wallet-context-cache')) wallet.connect();
  }, []);

  return (
    <>
      <Header />
      <Box
        sx={{
          paddingTop: { xs: '74px', md: '80px' },
          paddingBottom: 5,
          paddingX: { xs: '15px', md: '65px' },
        }}
      >
        <DesktopNav />
        <Box sx={{ mb: { xs: 1, md: 3 } }} />
        {children}
      </Box>
    </>
  );
}
