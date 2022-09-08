import { createContext, useContext, useEffect, useState } from 'react';
import { WalletContext } from './wallet-context';
import artifact from '../artifacts/GoingUpProjects.json';
import { ethers } from 'ethers';
import moment from 'moment';

export const ProjectsContext = createContext();

export const ProjectsProvider = ({ children }) => {
    const wallet = useContext(WalletContext);

    // polygon mumbai testnet
    const contractAddress = '0xe0b5f0c73754347E1d2E3c84382970D7A70d666B';
    const contractNetwork = 80001;

    // polygon mainnet
    // const contractAddress = 'NOT_YET_DEPLOYED';
    // const contractNetwork = 137;

    const { networkParams } = wallet.networks[contractNetwork];

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
                        params: [networkParams],
                    });
                }
            }
        }
    }

    useEffect(() => {
        setIsCorrectNetwork(wallet.network == contractNetwork);
    }, [wallet]);

    console.log(wallet.network, contractNetwork);
    const [isCorrectNetwork, setIsCorrectNetwork] = useState(wallet.network == contractNetwork);

    const getContract = () => {
        return new ethers.Contract(contractAddress, artifact.abi, wallet.ethersSigner);
    };

    const getProjects = async () => {
        const contract = getContract();
        const projects = [];

        const response = await fetch(`/api/projects/account/${wallet.address}`);
        const projectIds = await response.json();

        for (const projectId of projectIds) {
            const project = await contract.projects(projectId);
            projects.push(project);
        }

        return projects;
    };

    const getProjectsAfterBlock = async (block) => {
        const contract = getContract();
        const projects = [];

        const response = await fetch(`/api/projects/after-block/${wallet.address}?block=${block}`);
        const projectIds = await response.json();

        for (const projectId of projectIds) {
            const project = await contract.projects(projectId);
            projects.push(project);
        }

        return projects;
    }

    const getProject = async (projectId) => {
        if (!wallet.address) throw `no wallet connected`;
        const contract = getContract();
        const project = await contract.projects(projectId);
        return project;
    };

    const createProject = async (name, description, started, ended, primaryUrl, tags, isPrivate) => {
        const contract = getContract();

        if (!isCorrectNetwork) throw 'Wrong network';
        if (!wallet.ethersSigner) throw 'No wallet';

        const price = await contract.price();

        const tx = await contract.create(
            name,
            description || '',
            started ? moment(started).unix() : 0,
            ended ? moment(ended).unix() : 0,
            primaryUrl || '',
            tags ? tags.join(',') : '',
            isPrivate,
            { value: price }
        );
        return tx;
    };

    const updateProject = async (projectId, name, description, started, ended, primaryUrl, tags, isPrivate) => {
        const contract = getContract();

        if (!isCorrectNetwork) throw 'Wrong network';
        if (!wallet.ethersSigner) throw 'No wallet';

        const price = await contract.price();

        const tx = await contract.update(
            projectId,
            name,
            description || '',
            started ? moment(started).unix() : 0,
            ended ? moment(ended).unix() : 0,
            primaryUrl || '',
            tags ? tags.join(',') : '',
            isPrivate, { value: price }
        );
        return tx;
    };

    const transferProjectOwnership = async (projectId, newOwner) => {
        const contract = getContract();

        if (!isCorrectNetwork) throw 'Wrong network';
        if (!wallet.ethersSigner) throw 'No wallet';

        const price = await contract.price();

        const tx = await contract.transferProjectOwnership(projectId, newOwner, { value: price });
        return tx;
    };

    const getProjectMembers = async (projectId) => {
        const contract = getContract();
        const members = await contract.getProjectMembers(projectId);
        return members;
    };

    const inviteProjectMember = async (projectId, member) => {
        const contract = getContract();

    };

    const value = {
        networkParams,
        isCorrectNetwork,
        switchToCorrectNetwork,
        getProjects,
        getProjectsAfterBlock,
        getProject,
        createProject,
        updateProject,
        transferProjectOwnership,
        getProjectMembers,
    };
    return <ProjectsContext.Provider value={value}>{children}</ProjectsContext.Provider>;
};
