import { ReactNode, useState, createContext, useEffect, useRef } from 'react';
import { ethers } from 'ethers';
import { useRouter } from 'next/router';
import Web3Modal from 'web3modal';
import { useSnackbar } from 'notistack';
import WalletChainSelection from './WalletChainSelection';
import WalletConnectProvider from '@walletconnect/web3-provider';
import Web3Token from 'web3-cardano-token/dist/browser';

type WalletContext = {
    chain: string;
    address: string;
    network: string;
    walletType: string;
    ethersProvider: ethers.providers.Web3Provider;
    ethersSigner: ethers.providers.JsonRpcSigner;
    connect: () => Promise<any>;
    disconnect: () => Promise<any>;
    signMessage: (message: string) => Promise<any>;
    networks: any;
    walletTypes: any;
};

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const WalletContext = createContext<WalletContext>({} as WalletContext);

type Props = {
    children: ReactNode;
};

const walletTypes = {
    metamask: { display: 'MetaMask' },
    walletconnect: { display: 'WalletConnect' }
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
};

let web3Modal;
export function WalletProvider({ children }: Props) {
    const router = useRouter();
    const { enqueueSnackbar } = useSnackbar();
    const wselRef = useRef(null);

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
    const [chain, setChain] = useState(null);
    const [ethersProvider, setEthersProvider] = useState(null);
    const [ethersSigner, setEthersSigner] = useState(null);
    const [walletType, setWalletType] = useState(null);

    const connect = async () => {
        if (!address) wselRef.current.showModal();
    };

    const disconnect = async () => {
        if (chain === 'Ethereum') {
            disconnectEthereum();
        } else if (chain === 'Cardano') {
            disconnectCardano();
        }
    };

    const checkForGoingUpAccount = async (address) => {
        const response = await fetch(`/api/has-account?address=${address}`);
        if (response.status === 200) {
            const result = await response.json();

            if (
                result.hasAccount &&
                router.pathname?.toLowerCase() === '/create-account' &&
                router.pathname?.toLowerCase() !== '/profile/[address]'
            ) {
                router.push(`/profile/${address}`);
            }

            if (
                !result.hasAccount &&
                router.pathname !== '/create-account' &&
                router.pathname?.toLowerCase() !== '/profile/[address]'
            ) {
                router.push('/create-account');
            }
        } else {
            throw `${response.status}: ${(await response).text()}`;
        }
    };

    const connectEthereum = async () => {
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
                userAddress = ethers.utils.getAddress(instance.selectedAddress);
                break;
            case 'walletconnect':
                // @ts-ignore
                userAddress = ethers.utils.getAddress(instance.accounts[0]);
                break;
        }

        setChain(`Ethereum`);
        setNetwork(instance.networkVersion);
        setWalletType(walletType);
        setEthersProvider(provider);
        setEthersSigner(signer);
        setAddress(userAddress);

        enqueueSnackbar('Wallet connected', { variant: 'success' });
        checkForGoingUpAccount(userAddress);
    };

    const disconnectEthereum = async () => {
        web3Modal.clearCachedProvider();

        clearState();
    };

    const clearState = () => {
        setChain(null);
        setAddress(null);
        setNetwork(null);
        setEthersProvider(null);
    };

    const connectCardano = async () => {
        // @ts-ignore
        const flint = window.cardano?.flint;
        if (!flint) {
            enqueueSnackbar(
                'You do not have Flint wallet. Please install Flint wallet and try again.',
                { variant: 'error' }
            );
            return;
        }

        const fw = await flint.enable();
        const address = (await fw.getUsedAddresses())[0];

        setChain(`Cardano`);
        setNetwork(await fw.getNetworkId());
        setWalletType('flint');
        setEthersProvider(null);
        setEthersSigner(null);
        setAddress(address);
        // const token = await CardanoWeb3.sign(msg => flint.signData(address, new Buffer('myString').toString('hex');))

        checkForGoingUpAccount(address);
    };

    const disconnectCardano = async () => {
        clearState();
    };

    const signMessage = async (message) => {
        if (chain === 'Ethereum') {
            const signature = await ethersSigner.signMessage(message);
            return signature;
        } else if (chain === 'Cardano') {
            // @ts-ignore
            const cardano = window.cardano;
            await cardano.flint.enable();

            // getting address from which we will sign message
            const address = (await cardano.getUsedAddresses())[0];

            // generating a token with 1 day of expiration time
            const token = await Web3Token.sign(
                (msg) =>
                    cardano.signData(address, Buffer.from(msg).toString('hex')),
                '1d'
            );

            console.log(token);
            return token;
        }
    };

    return (
        <WalletContext.Provider
            value={{
                chain,
                address,
                network,
                walletType,
                ethersProvider,
                ethersSigner,
                networks,
                walletTypes,
                connect,
                disconnect,
                signMessage
            }}
        >
            {children}
            <WalletChainSelection
                ref={wselRef}
                connectEthereum={connectEthereum}
                connectCardano={connectCardano}
            />
        </WalletContext.Provider>
    );
}
