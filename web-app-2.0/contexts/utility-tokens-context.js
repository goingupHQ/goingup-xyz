import { createContext, useContext, useEffect, useState } from 'react';
import { ethers } from 'ethers';
import artifact from '../artifacts/GoingUpUtilityTokens.json';
import { useSnackbar } from 'notistack';
import { WalletContext } from './wallet-context';
import { Button } from '@mui/material';
import { useSwitchNetwork } from 'wagmi';

export const UtilityTokensContext = createContext();

const getUtilityTokens = async () => {
  const response = await fetch('/api/utility-tokens');
  const result = await response.json();
  return result;
};

const mainnet = {
  chainId: 137,
  chainName: 'Polygon Mainnet',
  address: '0x10D7B3aFA213D93a922a062fb91E8EcbD4A703d2',
  get provider() {
    return new ethers.providers.InfuraProvider(this.chainId, process.env.NEXT_PUBLIC_INFURA_KEY);
  },
};

const testnet = {
  chainId: 80001,
  chainName: 'Polygon Mumbai Testnet',
  address: '0x825D5014239a59d7587b9F53b3186a76BF58aF72',
  get provider() {
    return new ethers.providers.InfuraProvider(this.chainId, process.env.NEXT_PUBLIC_INFURA_KEY);
  },
};

export const UtilityTokensProvider = ({ children }) => {
  const [utilityTokens, setUtilityTokens] = useState([]);

  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const wallet = useContext(WalletContext);

  const { switchNetwork } = useSwitchNetwork();
  const sendUtilityToken = async (to, tokenId, amount, message) => {
    if (wallet.network?.id != 137 && wallet.network?.id != 80001) {
      enqueueSnackbar(`You are not on Polygon mainnet. Switch?`, {
        variant: 'warning',
        action: (key) => (
          <>
            <Button
              variant="contained"
              color="primary"
              sx={{ mr: 1 }}
              onClick={async () => {
                closeSnackbar(key);
                if (switchNetwork) {
                  await switchNetworkAsync(137);
                  enqueueSnackbar(`Switched to Polygon mainnet. Please try again.`, {
                    variant: 'success',
                  });
                } else {
                  enqueueSnackbar(`Switching networks is not supported on your wallet.`, {
                    variant: 'error',
                  });
                }
              }}
            >
              Yes
            </Button>
            <Button
              variant="contained"
              color="secondary"
              onClick={() => closeSnackbar(key)}
            >
              No
            </Button>
          </>
        ),
      });
      return null;
    }

    const contractAddress = wallet.network?.id == 137 ? mainnet.address : testnet.address;
    console.log('utility-tokens-context.js: sendUtilityToken() contractAddress:', contractAddress);
    const abi = artifact.abi;
    const provider = wallet.network?.id == 137 ? mainnet.provider : testnet.provider;

    const signer = wallet.ethersSigner;
    const contract = new ethers.Contract(contractAddress, abi, signer);
    console.log('signer:', signer);
    console.log('contract:', contract);
    const settings = await contract.tokenSettings(tokenId);
    console.log('settings:', settings);
    const tx = await contract.mint(to, tokenId, amount, Boolean(message), message, {
      value: settings.price.mul(amount),
    });

    return tx;
  };

  useEffect(() => {
    getUtilityTokens().then((utilityTokens) => {
      setUtilityTokens(utilityTokens);
    });
  }, []);

  const getWriteMintLogs = async (tokenID, address) => {
    const contractAddress = wallet.utilityToken.address;
    const provider = wallet.utilityToken.provider;
    const contract = new ethers.Contract(contractAddress, artifact.abi, provider);

    const cachedLogsResponse = await fetch(`/api/accounts/${address}/get-utility-mint-logs?tokenId=${tokenID}`);
    const cachedLogsData = await cachedLogsResponse.json();
    const { lastCachedBlock, mintLogs } = cachedLogsData;

    const filter = contract.filters.WriteMintData(tokenID, address);
    filter.fromBlock = lastCachedBlock;
    filter.toBlock = 'latest';
    filter.address = contractAddress;
    const logs = await provider.getLogs(filter);
    const allLogs = [...mintLogs, ...logs];
    return allLogs;
  };

  return (
    <UtilityTokensContext.Provider
      value={{
        utilityTokens,
        getUtilityTokens,
        sendUtilityToken,
        getWriteMintLogs,
      }}
    >
      {children}
    </UtilityTokensContext.Provider>
  );
};
