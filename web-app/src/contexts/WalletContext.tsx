import { ReactNode, useState, createContext, useEffect, Dispatch } from 'react';
import { ethers } from 'ethers';
import Web3Modal from 'web3modal';

type WalletContext = {
    address: string;
    network: string;
    ethersProvider: ethers.providers.Web3Provider;
    connect: () => Promise<any>;
    disconnect: () => Promise<any>;
};

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const WalletContext = createContext<WalletContext>({} as WalletContext);

type Props = {
    children: ReactNode;
};

let web3Modal;

export function WalletProvider({ children }: Props) {
    useEffect(() => {

    }, [])

    const [address, setAddress] = useState(null);
    const [network, setNetwork] = useState(null);
    const [ethersProvider, setEthersProvider] = useState(null);

    const connect = async () => {
        const providerOptions = {
            /* See Provider Options Section */
        };

        web3Modal = new Web3Modal({
            // network: 'mainnet',
            // cacheProvider: true,
            providerOptions
        });

        const instance = await web3Modal.connect();
        const provider = new ethers.providers.Web3Provider(instance);

        setAddress(ethers.utils.getAddress(instance.selectedAddress));
        setNetwork(instance.networkVersion);
        setEthersProvider(provider);
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
                connect,
                disconnect
            }}
        >
            {children}
        </WalletContext.Provider>
    );
}
