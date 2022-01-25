import { FC, ReactNode, useState, useReducer, createContext } from 'react';
import PropTypes from 'prop-types';

type WalletContext = {
    address: string;
    setAddress: any;
    network: string;
    setNetwork: any;
    connect: () => Promise<any>;
};

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const WalletContext = createContext<WalletContext>({} as WalletContext);

type Props = {
    children: ReactNode;
};

export function WalletProvider({ children }: Props) {
    const [address, setAddress] = useState(null);
    const [network, setNetwork] = useState(null);

    const connect = async () => {
        console.log('connect to wallet');
    };

    return (
        <WalletContext.Provider
            value={{ address, setAddress, network, setNetwork, connect }}
        >
            {children}
        </WalletContext.Provider>
    );
}