import { createContext, useContext, useEffect, useState } from 'react';
import { WalletContext } from './wallet-context';
import artifact from '../artifacts/GoingUpProjects.json';
console.log('Projects ABI', artifact.abi);

export const ProjectsContext = createContext();

export const ProjectsProvider = ({ children }) => {
    const wallet = useContext(WalletContext);

    // polygon mumbai testnet
    const contractAddress = '0xe0b5f0c73754347E1d2E3c84382970D7A70d666B';
    const contractNetwork = 80001;
    const networkParams = {
        chainId: '0x13881',
        chainName: 'Polygon Testnet',
        nativeCurrency: {
            name: 'MATIC',
            symbol: 'MATIC',
            decimals: 18,
        },
        rpcUrls: ['https://matic-mumbai.chainstacklabs.com'],
        blockExplorerUrls: ['https://mumbai.polygonscan.com/'],
    };

    // polygon mainnet
    // const contractAddress = 'NOT_YET_DEPLOYED';
    // const contractNetwork = 137;
    // const networkParams = {
    //     chainId: '0x89',
    //     chainName: 'Matic Mainnet',
    //     nativeCurrency: {
    //         name: 'MATIC',
    //         symbol: 'MATIC',
    //         decimals: 18,
    //     },
    //     rpcUrls: ['https://polygon-rpc.com/'],
    //     blockExplorerUrls: ['https://polygonscan.com/'],
    // };

    async function switchToCorrectNetwork() {
        if (wallet.walletType === 'walletconnect') {
            throw new Error('WalletConnect does not support adding networks. Please add the network manually.');
        } else {
            try {
                await ethereum.request({
                    method: 'wallet_switchEthereumChain',
                    params: [{ chainId: networkParams.chainId }],
                });
            } catch (switchError) {
                if (switchError.code === 4902) {
                    await ethereum.request({
                        method: 'wallet_addEthereumChain',
                        params: [
                            networkParams
                        ],
                    });
                }
            }
        }
    }

    const isCorrectNetwork = wallet?.network === contractNetwork;

    const getContract = () => {
        const contract = new ethers.Contract(contractAddress, artifact.abi, wallet.ethersSigner);
    }

    const getProjects = async () => {
    }

    const value = {
        networkParams,
        isCorrectNetwork,
        switchToCorrectNetwork,
    };
    return <ProjectsContext.Provider value={value}>{children}</ProjectsContext.Provider>;
};
