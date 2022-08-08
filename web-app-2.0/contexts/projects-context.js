import { createContext, useContext, useEffect, useState } from 'react';
import { WalletContext } from './wallet-context';
import artifact from '../artifacts/GoingUpProjects.json';

export const ProjectsContext = createContext();

export const ProjectsProvider = ({ children }) => {
    const wallet = useContext(WalletContext);

    const contractAddress = '0xe0b5f0c73754347E1d2E3c84382970D7A70d666B'; // polygon mumbai
    const contractNetwork = 80001;

    async function addNetwork(type) {

        if (type === 'web3') {
            if (typeof ethereum !== 'undefined') {
                eth = new Web3Eth(ethereum);
            } else if (typeof web3 !== 'undefined') {
                eth = new Web3Eth(web3.givenProvider);
            } else {
                eth = new Web3Eth(ethereum);
            }
        }

        if (typeof eth !== 'undefined') {
            var network = 0;
            network = await eth.net.getId();
            netID = network.toString();
            var params;
            if (isTestnet == "false") {
                if (netID == "137") {
                    alert("Polygon Network has already been added to Metamask.");
                    return;
                } else {
                    params = [{
                        chainId: '0x89',
                        chainName: 'Matic Mainnet',
                        nativeCurrency: {
                            name: 'MATIC',
                            symbol: 'MATIC',
                            decimals: 18
                        },
                        rpcUrls: ['https://polygon-rpc.com/'],
                        blockExplorerUrls: ['https://polygonscan.com/']
                    }]
                }
            } else {
                if (netID == "80001") {
                    alert("Polygon Mumbai Network has already been added to Metamask.");
                    return;
                } else {
                    params = [{
                        chainId: '0x13881',
                        chainName: 'Polygon Testnet',
                        nativeCurrency: {
                            name: 'MATIC',
                            symbol: 'MATIC',
                            decimals: 18
                        },
                        rpcUrls: ['https://matic-mumbai.chainstacklabs.com'],
                        blockExplorerUrls: ['https://mumbai.polygonscan.com/']
                    }]
                }
            }

            window.ethereum.request({ method: 'wallet_addEthereumChain', params })
                .then(() => console.log('Success'))
                .catch((error) => console.log("Error", error.message));
        } else {
            alert('Unable to locate a compatible web3 browser!');
        }
    }

    const value = {
    };
    return <ProjectsContext.Provider value={value}>{children}</ProjectsContext.Provider>;
};
