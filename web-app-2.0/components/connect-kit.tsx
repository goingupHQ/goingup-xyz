import React from 'react';
import { WagmiConfig, createClient } from 'wagmi';
import { mainnet, polygon, goerli, polygonMumbai } from 'wagmi/chains';
import { ConnectKitProvider, ConnectKitButton, getDefaultClient } from 'connectkit';
import { useTheme } from '@mui/material';

const infuraId = process.env.NEXT_PUBLIC_INFURA_KEY;
// const chains = [mainnet, polygon, goerli, polygonMumbai];
const chains = [polygon, polygonMumbai];
const client = createClient(
  getDefaultClient({
    appName: 'GoingUP',
    appIcon: '/images/goingup-glyph.png',
    infuraId,
    chains,
  })
);

type ConnectKitProps = {
  children: React.ReactNode;
};

export default function ConnectKit({ children }: ConnectKitProps) {
  const theme = useTheme();
  const borderRadius = `${theme.shape.borderRadius}px`;
  const primaryColor = theme.palette.primary.main;
  return (
    <WagmiConfig client={client}>
      <ConnectKitProvider
        customTheme={{
          '--ck-font-family': theme.typography.fontFamily,
          '--ck-border-radius': borderRadius,
          '--ck-primary-color': primaryColor,
          '--ck-primary-button-hover-background': primaryColor,
          '--ck-primary-button-hover-color': theme.palette.primary.contrastText,
          '--ck-primary-button-border-radius': borderRadius,
          '--ck-primary-button-hover-border-radius': borderRadius,
          '--ck-primary-button-active-border-radius': borderRadius,
          '--ck-secondary-button-border-radius': borderRadius,
          '--ck-secondary-button-hover-border-radius': borderRadius,
          '--ck-secondary-button-active-border-radius': borderRadius,
          '--ck-tertiary-button-border-radius': borderRadius,
          '--ck-tertiary-button-hover-border-radius': borderRadius,
          '--ck-tertiary-button-active-border-radius': borderRadius,
        }}
        mode={theme.palette.mode}
      >
        {children}
      </ConnectKitProvider>
    </WagmiConfig>
  );
}
