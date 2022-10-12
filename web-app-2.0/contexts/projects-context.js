import { createContext, useContext, useEffect, useState } from 'react';
import { WalletContext } from './wallet-context';
import artifact from '../artifacts/GoingUpProjects.json';
import { ethers } from 'ethers';
import moment from 'moment';
import { useSnackbar } from 'notistack';
import { Button } from '@mui/material';
import { useRouter } from 'next/router';
import { UtilityTokensContext } from './utility-tokens-context';

export const ProjectsContext = createContext();

export const ProjectsProvider = ({ children }) => {
    const wallet = useContext(WalletContext);
    const utilityTokensContext = useContext(UtilityTokensContext);

    // polygon mumbai testnet
    // const contractAddress = '0xF5df032832cb3c4BEf2D28B440fA57D5dAC47881';
    // const contractNetwork = 80001;

    // polygon mainnet
    const contractAddress = '0xb6b83BaE8251d305FcbdaF2aE8cDffAC39216C95';
    const contractNetwork = 137;

    const { networkParams } = wallet.networks[contractNetwork];

    const [isCorrectNetwork, setIsCorrectNetwork] = useState(wallet.network == contractNetwork);

    const { enqueueSnackbar, closeSnackbar } = useSnackbar();
    const router = useRouter();

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

    // check for project invites
    useEffect(() => {
        if (wallet.address && isCorrectNetwork) {
            getPendingInvitesByAddress(wallet.address).then((projectIDs) => {
                if (projectIDs.length === 0) return;
                enqueueSnackbar(`You have ${projectIDs.length} pending project invites.`, {
                    variant: 'info',
                    persist: true,
                    action: (key) => (
                        <>
                            <Button
                                variant="contained"
                                color="primary"
                                size="small"
                                sx={{ mr: 1 }}
                                onClick={() => {
                                    router.push(`/projects/pending-invites`);
                                    closeSnackbar(key);
                                }}
                            >
                                Review
                            </Button>
                            <Button
                                variant="contained"
                                color="secondary"
                                size="small"
                                onClick={() => closeSnackbar(key)}
                            >
                                Ignore
                            </Button>
                        </>
                    ),
                });
            });
        }
    }, [wallet.address, isCorrectNetwork]);

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

    const getAccountProjects = async () => {
        const contract = getContract();
        const projects = [];

        const response = await fetch(`/api/projects/account/${router.query.address}`);
        const projectIds = await response.json();

        for (const projectId of projectIds) {
            const project = await contract.projects(projectId);
            projects.push(project);
        }

        return projects;
    };

    const getAccountJoinedProjects = async (address) => {
        const contract = getContract();
        const projectIds = await contract.getProjectsByAddress(router.query.address);

        const projects = [];
        for (const projectId of projectIds) {
            const project = await contract.projects(projectId);
            projects.push(project);
        }

        return projects;
    }

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
    };

    const getProject = async (projectId) => {
        if (!wallet.address) throw `no wallet connected`;
        const contract = getContract();
        const project = await contract.projects(projectId);
        return project;
    };

    const getJoinedProjects = async (address) => {
        const contract = getContract();
        const projectIds = await contract.getProjectsByAddress(address);

        const projects = [];
        for (const projectId of projectIds) {
            const project = await contract.projects(projectId);
            projects.push(project);
        }

        return projects;
    }

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
            isPrivate,
            { value: price }
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

    const getProjectMember = async (projectId, memberAddress) => {
        const contract = getContract();
        const member = await contract.projectMemberMapping(projectId, memberAddress);

        const memberData = {
            address: memberAddress,
            role: member.role,
            goal: member.goal,
            goalAchieved: member.goalAchieved,
            rewardVerified: member.rewardVerified,
            reward: JSON.parse(member.rewardData),
        };

        return memberData;
    };

    const getPendingInvites = async (projectId) => {
        const contract = getContract();
        const invites = await contract.getPendingInvites(projectId);
        return invites;
    };

    const getPendingInvitesByAddress = async (address) => {
        const contract = getContract();
        const projectIds = await contract.getPendingInvitesByAddress(address);

        const data = [];
        for (const projectId of projectIds) {
            const project = await getProject(projectId);
            const memberData = await getProjectMember(projectId, address);
            data.push({
                projectId,
                project,
                memberData
            });
        }

        return data;
    };

    const getMembersAndInvites = async (projectId) => {
        const contract = getContract();
        const members = await getProjectMembers(projectId);
        const pendingInvites = await getPendingInvites(projectId);

        return {
            members,
            pendingInvites,
        };
    };

    const inviteProjectMember = async (projectId, member, role, goal, rewards) => {
        const contract = getContract();

        const freeMembers = await contract.freeMembers();
        const pendingInvites = await contract.getPendingInvites(projectId);
        const members = await contract.getProjectMembers(projectId);

        const fee = ethers.BigNumber.from(0);
        if (pendingInvites.length + members.length + 1 >= freeMembers) fee = await contract.addMemberPrice();

        const tx = await contract.inviteMember(projectId, member, role, goal, JSON.stringify(rewards), { value: fee });
        return tx;
    };

    const disinviteProjectMember = async (projectId, member) => {
        const contract = getContract();

        const tx = await contract.disinviteMember(projectId, member);
        return tx;
    };

    const acceptProjectInvite = async (projectId) => {
        const contract = getContract();
        const tx = await contract.acceptProjectInvitation(projectId);
        return tx;
    };

    const removeProjectMember = async (projectId, member) => {
        const contract = getContract();
        const tx = await contract.removeMember(projectId, member, '');
        return tx;
    };

    const leaveProject = async (projectId, reason) => {
        const contract = getContract();
        const tx = await contract.leaveProject(projectId, reason);
        return tx;
    };

    const setMemberGoalAsAchieved = async(projectId, member) => {
        const contract = getContract();
        const tx = await contract.setMemberGoalAsAchieved(projectId, member);
        return tx;
    }

    const value = {
        networkParams,
        isCorrectNetwork,
        switchToCorrectNetwork,
        getProjects,
        getProjectsAfterBlock,
        getProject,
        getAccountProjects,
        getAccountJoinedProjects,
        getJoinedProjects,
        createProject,
        updateProject,
        transferProjectOwnership,
        getProjectMembers,
        getProjectMember,
        getPendingInvites,
        getPendingInvitesByAddress,
        getMembersAndInvites,
        inviteProjectMember,
        disinviteProjectMember,
        acceptProjectInvite,
        removeProjectMember,
        leaveProject,
        setMemberGoalAsAchieved,
    };
    return <ProjectsContext.Provider value={value}>{children}</ProjectsContext.Provider>;
};
