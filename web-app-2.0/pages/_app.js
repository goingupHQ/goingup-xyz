import {
  createTheme,
  ThemeProvider,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { SnackbarProvider } from "notistack";
import { useContext } from "react";
import Layout from "../components/layout";
import { AppContext, AppProvider } from "../contexts/app-context";
import { ProjectsProvider } from "../contexts/projects-context";
import { WalletProvider } from "../contexts/wallet-context";
import "../styles/globals.css";
import { WagmiConfig, createClient, configureChains } from "wagmi";
import { publicProvider } from "wagmi/providers/public";
import { alchemyProvider } from "wagmi/providers/alchemy";
import "@rainbow-me/rainbowkit/styles.css";
import { getDefaultWallets } from "@rainbow-me/rainbowkit";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';

const polygonMumbai = {
  id: 80001,
  name: "Polygon Mumbai",
  network: "Polygon Mumbai Testnet",
  rpcUrls: {
    default: "https://matic-mumbai.chainstacklabs.com",
  },
  blockExplorers: {
    default: {
      name: "Polygon Mumbai Scan",
      url: "'https://mumbai.polygonscan.com/",
    },
  },
  testnet: true,
};

const polygon = {
  id: 137,
  name: "Polygon",
  network: "Polygon Mainnet",
  rpcUrls: {
    default: "https://polygon-rpc.com/",
  },
  blockExplorers: {
    default: {
      name: "Polygon Scan",
      url: "https://polygonscan.com/",
    },
  },
  testnet: false,
};

export const { chains, provider, webSocketProvider } = configureChains(
  [polygonMumbai, polygon],
  [
    alchemyProvider({ apiKey: "QoyYGyWecbDsHBaaDFapJeqKEFgFyRMM" }),
    publicProvider(),
  ]
);

const { connectors } = getDefaultWallets({
  appName: "GoingUP",
  chains,
});

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
  webSocketProvider,
});

export default function App({ Component, pageProps }) {
  return (
    <LocalizationProvider dateAdapter={AdapterMoment}>
      <WagmiConfig client={wagmiClient}>
        <SnackbarProvider maxSnack={7} preventDuplicate>
          <AppProvider>
            <WalletProvider>
              <ProjectsProvider>
                <Layout chains={chains}>
                  <Component {...pageProps} />
                </Layout>
              </ProjectsProvider>
            </WalletProvider>
          </AppProvider>
        </SnackbarProvider>
      </WagmiConfig>
    </LocalizationProvider>
  );
}