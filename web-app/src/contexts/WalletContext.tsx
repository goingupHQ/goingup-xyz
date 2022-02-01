import { ReactNode, useState, createContext, useEffect, useContext } from 'react';
import { ethers } from 'ethers';
import { useRouter } from 'next/router';
import Web3Modal from 'web3modal';
import { AppContext } from './AppContext';
import { useSnackbar } from 'notistack';

type WalletContext = {
    address: string;
    network: string;
    ethersProvider: ethers.providers.Web3Provider;
    ethersSigner: ethers.providers.JsonRpcSigner;
    connect: () => Promise<any>;
    disconnect: () => Promise<any>;
    networks: any;
};

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const WalletContext = createContext<WalletContext>({} as WalletContext);

type Props = {
    children: ReactNode;
};

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
}

let web3Modal;
export function WalletProvider({ children }: Props) {
    const router = useRouter();
    const app = useContext(AppContext);
    const { enqueueSnackbar } = useSnackbar();

    useEffect(() => {
        const providerOptions = {
            /* See Provider Options Section */
        };

        web3Modal = new Web3Modal({
            // network: 'mainnet',
            // cacheProvider: true,
            providerOptions
        });
    }, [])

    const [address, setAddress] = useState(null);
    const [network, setNetwork] = useState(null);
    const [ethersProvider, setEthersProvider] = useState(null);
    const [ethersSigner, setEthersSigner] = useState(null);

    const connect = async () => {
        const instance = await web3Modal.connect();
        instance.on('accountsChanged', accounts => {
            setAddress(ethers.utils.getAddress(accounts[0]));
        });

        instance.on('chainChanged', chainId => {
            const networkId = parseInt(chainId, 16);
            setNetwork(networkId);
        });

        const provider = new ethers.providers.Web3Provider(instance);
        const signer = provider.getSigner();
        // const message = 'goingup.xyz';
        // const signature = await signer.signMessage(message);
        // console.log('signed message', signature);

        // const recoveredAddress = await app.api.getSignerAddress(message, signature);
        // const expectedAddress = await signer.getAddress();
        // if (expectedAddress !== recoveredAddress) {
        //     enqueueSnackbar('The signed message you sent failed verification', { variant: 'error' });
        //     return;
        // }

        setAddress(ethers.utils.getAddress(instance.selectedAddress));
        setNetwork(instance.networkVersion);
        setEthersProvider(provider);
        setEthersSigner(signer);

        enqueueSnackbar('Wallet connected', { variant: 'success' });

        if (router.pathname !== '/create-account') router.push('/create-account');
    };

    const disconnect = async () => {
        web3Modal.clearCachedProvider();

        setAddress(null);
        setNetwork(null);
        setEthersProvider(null);
    }

    return (
        <WalletContext.Provider
            value={{
                address,
                network,
                ethersProvider,
                ethersSigner,
                networks,
                connect,
                disconnect
            }}
        >
            {children}
        </WalletContext.Provider>
    );
}
