import { ReactNode, useState, createContext, useEffect, useRef, useContext } from 'react';
import { ethers } from 'ethers';
import { useRouter } from 'next/router';
import Web3Modal from 'web3modal';
import { useSnackbar } from 'notistack';
import WalletConnectProvider from '@walletconnect/web3-provider';
import CoinbaseWalletSDK from '@coinbase/wallet-sdk';
import { AppContext } from './app-context';
import { Backdrop, Button, Paper, Stack, Typography } from '@mui/material';

export const WalletContext = createContext({});

const walletTypes = {
    metamask: { display: 'MetaMask' },
    walletconnect: { display: 'WalletConnect' },
    flint: { display: 'Flint' },
};

const networks = {
    1: {
        name: 'Ethereum Mainnet',
    },
    3: {
        name: 'Ropsten Testnet',
    },
    4: {
        name: 'Rinkeby Testnet',
    },
    5: {
        name: 'Goerli Testnet',
    },
    42: {
        name: 'Kovan Testnet',
    },
    137: {
        name: 'Polygon Mainnet',
        group: 'polygon',
        networkParams: {
            chainId: '0x89',
            chainName: 'Matic Mainnet',
            nativeCurrency: {
                name: 'MATIC',
                symbol: 'MATIC',
                decimals: 18,
            },
            rpcUrls: ['https://polygon-rpc.com/'],
            blockExplorerUrls: ['https://polygonscan.com/'],
        },
    },
    80001: {
        name: 'Polygon Mumbai Testnet',
        group: 'polygon',
        networkParams: {
            chainId: '0x13881',
            chainName: 'Polygon Testnet',
            nativeCurrency: {
                name: 'MATIC',
                symbol: 'MATIC',
                decimals: 18,
            },
            rpcUrls: ['https://matic-mumbai.chainstacklabs.com'],
            blockExplorerUrls: ['https://mumbai.polygonscan.com/'],
        },
    },
    'CARDANO-0': {
        name: 'Cardano Testnet',
    },
    'CARDANO-1': {
        name: 'Cardano Mainnet',
    },
};

let web3Modal;
const providerOptions = {
    walletconnect: {
        package: WalletConnectProvider,
        options: {
            infuraId: '86d5aa67154b4d1283f804fe39fcb07c',
        },
    },
    coinbasewallet: {
        package: CoinbaseWalletSDK,
        options: {
            appName: 'GoingUP',
            infuraId: '86d5aa67154b4d1283f804fe39fcb07c',
            chainId: 1,
        },
        theme: 'light',
    },
};

const web3ModalOptions = {
    // network: 'mainnet',
    cacheProvider: true,
    providerOptions,
    theme: 'light',
};

export function WalletProvider({ children }) {
    const router = useRouter();
    const wselRef = useRef(null);

    const app = useContext(AppContext);

    const [address, setAddress] = useState(null);
    const [network, setNetwork] = useState(null);
    const [chain, setChain] = useState(null);
    const [ethersProvider, setEthersProvider] = useState(null);
    const [ethersSigner, setEthersSigner] = useState(null);
    const [walletType, setWalletType] = useState(null);

    const { enqueueSnackbar, closeSnackbar } = useSnackbar();

    useEffect(() => {
        if (address) {
            if (Notification.permission === 'denied') {
                if (localStorage.getItem('notifs-denied-forever') === 'true') return;

                enqueueSnackbar('Please enable notifications in your browser settings', {
                    variant: 'warning',
                    persist: true,
                    action: (key) => (
                        <Stack direction="row" spacing={1}>
                            <Button variant="contained" color="primary" onClick={() => closeSnackbar(key)}>
                                Later
                            </Button>

                            <Button
                                variant="contained"
                                color="secondary"
                                onClick={() => {
                                    closeSnackbar(key);
                                    localStorage.setItem('notifs-denied-forever', true);
                                    enqueueSnackbar('Notifications disabled for this device', { variant: 'warning' });
                                }}
                            >
                                Never
                            </Button>
                        </Stack>
                    ),
                });
            }

            if (Notification.permission === 'granted') {
                // check for existing subscription
                if (localStorage.getItem('psn-subscription')) {
                    const subscription = JSON.parse(localStorage.getItem('subscription'));
                    postPsnSubscription(subscription);
                } else {
                    app.subscribeUserToPush()
                        .then((subscription) => {
                            postPsnSubscription(subscription);
                        });
                }
            }

            if (Notification.permission === 'default') {
                if (localStorage.getItem('notifs-denied-forever') === 'true') return;
                enqueueSnackbar('Do you want to receive notifications from GoingUP?', {
                    variant: 'info',
                    persist: true,
                    action: (key) => (
                        <Stack direction="row" spacing={1}>
                            <Button variant="contained" color="primary" onClick={() => askNotifsConsent(key)}>
                                Yes
                            </Button>

                            <Button variant="contained" color="secondary" onClick={() => closeSnackbar(key)}>
                                No
                            </Button>

                            <Button
                                variant="contained"
                                color="secondary"
                                onClick={() => {
                                    closeSnackbar(key);
                                    localStorage.setItem('notifs-denied-forever', true);
                                    enqueueSnackbar('Notifications disabled for this device', { variant: 'warning' });
                                }}
                            >
                                Never
                            </Button>
                        </Stack>
                    ),
                });
            }
        }
    }, [address]);

    const askNotifsConsent = async (snackbarKey) => {
        closeSnackbar(snackbarKey);
        const key = enqueueSnackbar('Please approve notifications in the prompt which should be near the address bar', {
            variant: 'info',
            persist: true,
        });

        try {
            const result = await Notification.requestPermission();

            if (result === 'granted') {
                const subscription = await app.subscribeUserToPush();
                postPsnSubscription(subscription);
            } else {
                enqueueSnackbar('You did not allow notifications', { variant: 'warning' });
            }
        } catch (e) {
            console.log(e);
        } finally {
            closeSnackbar(key);
        }
    };

    const postPsnSubscription = async (subscription) => {
        if (subscription) {
            localStorage.setItem('psn-subscription', JSON.stringify(subscription));
            await fetch('/api/psn', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    subscription,
                    address,
                }),
            });

            enqueueSnackbar('Notifications enabled', { variant: 'success' });
        }
    }

    const connect = async () => {
        let cache;

        try {
            cache = JSON.parse(localStorage.getItem('wallet-context-cache'));
        } catch (err) {}

        if (cache) {
            if (!address) {
                if (cache.blockchain === 'ethereum') {
                    connectEthereum();
                } else if (cache.blockchain === 'cardano') {
                    connectCardano();
                }
            }
        } else {
            if (!address) wselRef.current.showModal();
        }
    };

    const disconnect = async () => {
        if (chain === 'Ethereum') {
            disconnectEthereum();
        } else if (chain === 'Cardano') {
            disconnectCardano();
        }

        localStorage.removeItem('wallet-context-cache');
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
        web3Modal = new Web3Modal(web3ModalOptions);
        const instance = await web3Modal.connect();
        instance.on('accountsChanged', (accounts) => {
            setAddress(ethers.utils.getAddress(accounts[0]));
        });

        instance.on('chainChanged', (chainId) => {
            const networkId = parseInt(chainId, 16);
            setNetwork(networkId);
        });

        const provider = new ethers.providers.Web3Provider(instance, 'any');
        const signer = provider.getSigner();

        let walletType = null;
        if (instance.isMetaMask) walletType = 'metamask';
        if (instance.isWalletConnect) walletType = 'walletconnect';
        if (instance.isCoinbaseWallet) walletType = 'coinbase';

        let userAddress = null;
        switch (walletType) {
            case 'metamask':
            case 'coinbase':
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
        localStorage.setItem(
            'wallet-context-cache',
            JSON.stringify({
                blockchain: 'ethereum',
                type: walletType,
            })
        );
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
        // // @ts-ignore
        // const flint = window.cardano?.flint;
        // if (!flint) {
        //     enqueueSnackbar(
        //         'You do not have Flint wallet. Please install Flint wallet and try again.',
        //         { variant: 'error' }
        //     );
        //     return;
        // }
        // const fw = await flint.enable();
        // const rawAddress = (await fw.getUsedAddresses())[0];
        // const computedAddress = Address.from_bytes(
        //     Buffer.from(rawAddress, 'hex')
        // ).to_bech32();
        // console.log(computedAddress);
        // setChain(`Cardano`);
        // setNetwork(`CARDANO-${await fw.getNetworkId()}`);
        // setWalletType('flint');
        // setEthersProvider(null);
        // setEthersSigner(null);
        // setAddress(computedAddress);
        // // const token = await CardanoWeb3.sign(msg => flint.signData(address, new Buffer('myString').toString('hex');))
        // checkForGoingUpAccount(address);
        // localStorage.setItem('wallet-context-cache', JSON.stringify({
        //     blockchain: 'cardano',
        //     type: 'flint'
        // }));
    };

    const disconnectCardano = async () => {
        clearState();
    };

    const signMessage = async (message) => {
        if (chain === 'Ethereum') {
            const signature = await ethersSigner.signMessage(message);
            return signature;
        } else if (chain === 'Cardano') {
            //     // @ts-ignore
            //     const cardano = window.cardano;
            //     await cardano.flint.enable();
            //     // getting address from which we will sign message
            //     const address = (await cardano.getUsedAddresses())[0];
            //     // generating a token with 1 day of expiration time
            //     const token = await Web3Token.sign(
            //         (msg) =>
            //             cardano.signData(address, Buffer.from(msg).toString('hex')),
            //         '1d'
            //     );
            //     console.log(token);
            //     return token;
        }
    };

    // const utilityToken = {
    //     chainId: 5,
    //     chainName: 'Goerli Testnet',
    //     address: '0x75c390a5B9BE38caC9F9Ff1159805C750e6e6d23',
    //     get provider() {
    //         return new ethers.providers.AlchemyProvider(this.chainId, '8L_6aM0-crh5sm3t4BFg6Hjv90NIh0bw')
    //     }
    // }

    const utilityToken = {
        chainId: 137,
        chainName: 'Polygon Mainnet',
        address: '0x10D7B3aFA213D93a922a062fb91E8EcbD4A703d2',
        get provider() {
            return new ethers.providers.AlchemyProvider(this.chainId, 'QoyYGyWecbDsHBaaDFapJeqKEFgFyRMM');
        },
    };

    const setWeb3ModalTheme = (theme) => {
        web3ModalOptions.theme = theme;
        web3ModalOptions.providerOptions.coinbasewallet.darkMode = theme === 'dark';
        web3ModalOptions.providerOptions.coinbasewallet.options.darkMode = theme === 'dark';
        web3ModalOptions.providerOptions.coinbasewallet.theme = theme;
        console.log(web3ModalOptions);
    };

    const mainnetENSProvider = ethers.getDefaultProvider('homestead');

    return (
        <WalletContext.Provider
            value={{
                networks,
                chain,
                connectEthereum,
                disconnectEthereum,
                address,
                network,
                walletType,
                ethersProvider,
                ethersSigner,
                networks,
                walletTypes,
                connect,
                disconnect,
                signMessage,
                utilityToken,
                setWeb3ModalTheme,
                mainnetENSProvider,
            }}
        >
            {children}
        </WalletContext.Provider>
    );
}
