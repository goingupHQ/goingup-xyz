import { FC, ReactNode, useEffect, useReducer, createContext } from 'react';
import PropTypes from 'prop-types';

interface WalletState {
    address: string;
    network: string;
}

interface WalletProviderProps {
    children: ReactNode;
  }

interface WalletContextValue extends WalletState {
    getWalletState: () => Promise<any>;
    // signInWithEmailAndPassword: (email: string, password: string) => Promise<any>;
    // signInWithGoogle: () => Promise<any>;
    // logout: () => Promise<void>;
}

type WalletChangedAction = {
    type: 'WALLET_CHANGED';
    payload: {
        address: string;
        network: string;
    };
};

const reducer = (state: WalletState, action: Action): WalletState => {
    if (action.type === 'WALLET_CHANGED') {
        const { address, network } = action.payload;

        return {
            ...state,
            address,
            network
        };
    }

    return state;
};

const initialWalletState: WalletState = {
    address: null,
    network: null
};

type Action = WalletChangedAction;

export const WalletContext = createContext<WalletContextValue>({
    ...initialWalletState,
    getWalletState: () => Promise.resolve()
    // signInWithEmailAndPassword: () => Promise.resolve(),
    // signInWithGoogle: () => Promise.resolve(),
    // logout: () => Promise.resolve()
});

export const WalletProvider: FC<WalletProviderProps> = (props) => {
    const { children } = props;
    const [state, dispatch] = useReducer(reducer, initialWalletState);

    const getWalletState = () => Promise.resolve(state);

    return (
        <WalletContext.Provider
            value={{
                ...state,
                getWalletState
            }}
        >
            {children}
        </WalletContext.Provider>
    )
};