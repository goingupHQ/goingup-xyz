import { createContext, useContext, useEffect, useState } from 'react';
import { ethers } from 'ethers';
import artifact from '../artifacts/GoingUpUtilityTokens.json';
import { useSnackbar } from 'notistack';
import { WalletContext } from './wallet-context';

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
        return new ethers.providers.AlchemyProvider(this.chainId, process.env.NEXT_PUBLIC_ALPOLY_MAIN);
    },
};

const testnet = {
    chainId: 80001,
    chainName: 'Polygon Mumbai Testnet',
    address: '0x825D5014239a59d7587b9F53b3186a76BF58aF72',
    get provider() {
        return new ethers.providers.AlchemyProvider(this.chainId, process.env.NEXT_PUBLIC_ALPOLY_TEST);
    },
};

export const UtilityTokensProvider = ({ children }) => {
    const [utilityTokens, setUtilityTokens] = useState([]);

    const { enqueueSnackbar } = useSnackbar();
    const wallet = useContext(WalletContext);

    const sendUtilityToken = async (to, tokenId, amount, message) => {
        if (wallet.network != 137 && wallet.network != 80001) {
            enqueueSnackbar(`Please switch your wallet network to Polygon 💫`, {
                variant: 'error',
            });
            return null;
        }

        const contractAddress = wallet.network == 137 ? mainnet.address : testnet.address; console.log('utility-tokens-context.js: sendUtilityToken() contractAddress:', contractAddress);
        const abi = artifact.abi;
        const provider = wallet.network == 137 ? mainnet.provider : testnet.provider;

        const signer = wallet.ethersSigner;
        const contract = new ethers.Contract(contractAddress, abi, signer);
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

    return (
        <UtilityTokensContext.Provider
            value={{
                utilityTokens,
                getUtilityTokens,
                sendUtilityToken,
            }}
        >
            {children}
        </UtilityTokensContext.Provider>
    );
};
