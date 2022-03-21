import {
    ReactNode,
    useState,
    createContext,
    useEffect
} from 'react';
import { ethers } from 'ethers';
import { useRouter } from 'next/router';
import Web3Modal from 'web3modal';
import { useSnackbar } from 'notistack';
import WalletConnectProvider from '@walletconnect/web3-provider';

type WalletContext = {
    address: string;
    network: string;
    walletType: string;
    ethersProvider: ethers.providers.Web3Provider;
    ethersSigner: ethers.providers.JsonRpcSigner;
    connect: () => Promise<any>;
    disconnect: () => Promise<any>;
    networks: any;
    walletTypes: any;
};

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const WalletContext = createContext<WalletContext>({} as WalletContext);

type Props = {
    children: ReactNode;
};

const walletTypes = {
    'metamask': { display: 'MetaMask' },
    'walletconnect': { display: 'WalletConnect' }
}

const networks = {
    1: {
        name: 'Ethereum Mainnet'
    },
    3: {
        name: 'Ropsten Testnet'
    },
    4: {
        name: 'Rinkeby Testnet'
    },
    5: {
        name: 'Goerli Testnet'
    },
    42: {
        name: 'Kovan Testnet'
    },
    137: {
        name: 'Polygon Mainnet'
    },
    80001: {
        name: 'Polygon Mumbai Testnet'
    }
};

let web3Modal;
export function WalletProvider({ children }: Props) {
    const router = useRouter();
    const { enqueueSnackbar } = useSnackbar();

    useEffect(() => {
        const providerOptions = {
            walletconnect: {
                package: WalletConnectProvider,
                options: {
                    infuraId: '86d5aa67154b4d1283f804fe39fcb07c'
                }
            }
        };

        web3Modal = new Web3Modal({
            // network: 'mainnet',
            cacheProvider: true,
            providerOptions
        });
    }, []);

    const [address, setAddress] = useState(null);
    const [network, setNetwork] = useState(null);
    const [ethersProvider, setEthersProvider] = useState(null);
    const [ethersSigner, setEthersSigner] = useState(null);
    const [walletType, setWalletType] = useState(null);

    const connect = async () => {
        const instance = await web3Modal.connect();
        instance.on('accountsChanged', (accounts) => {
            setAddress(ethers.utils.getAddress(accounts[0]));
        });

        instance.on('chainChanged', (chainId) => {
            const networkId = parseInt(chainId, 16);
            setNetwork(networkId);
        });

        const provider = new ethers.providers.Web3Provider(instance);
        const signer = provider.getSigner();

        let walletType = null;
        // @ts-ignore
        if (instance.isMetaMask) walletType = 'metamask';
        // @ts-ignore
        if (instance.isWalletConnect) walletType = 'walletconnect';

        let userAddress: string | null = null;
        switch (walletType) {
            case 'metamask':
                // @ts-ignore
                userAddress = ethers.utils.getAddress(instance.selectedAddress); break;
            case 'walletconnect':
                // @ts-ignore
                userAddress = ethers.utils.getAddress(instance.accounts[0]); break;
        }

        setAddress(userAddress);
        setNetwork(instance.networkVersion);
        setWalletType(walletType);
        setEthersProvider(provider);
        setEthersSigner(signer);

        enqueueSnackbar('Wallet connected', { variant: 'success' });
        const response = await fetch(`/api/has-account?address=${userAddress}`);
        if (response.status === 200) {
            const result = await response.json(); console.log(router);

            if (result.hasAccount && router.pathname?.toLowerCase() === '/create-account' && router.pathname?.toLowerCase() !== '/profile/[address]') {
                router.push(`/profile/${userAddress}`);
            }

            if (!result.hasAccount && router.pathname !== '/create-account' && router.pathname?.toLowerCase() !== '/profile/[address]') {
                router.push('/create-account');
            }
        } else {
            throw(`${response.status}: ${(await response).text()}`)
        }
    };

    const disconnect = async () => {
        web3Modal.clearCachedProvider();

        setAddress(null);
        setNetwork(null);
        setEthersProvider(null);
    };

    return (
        <WalletContext.Provider
            value={{
                address,
                network,
                walletType,
                ethersProvider,
                ethersSigner,
                networks,
                walletTypes,
                connect,
                disconnect
            }}
        >
            {children}
        </WalletContext.Provider>
    );
}
