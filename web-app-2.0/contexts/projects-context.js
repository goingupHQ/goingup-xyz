import { createContext, useContext, useEffect, useState } from 'react';
import { WalletContext } from './wallet-context';
import artifact from '../artifacts/GoingUpProjects.json';
import { ethers } from 'ethers';
import moment from 'moment';
import { useSnackbar } from 'notistack';
import { Button } from '@mui/material';
import { useRouter } from 'next/router';
import { UtilityTokensContext } from './utility-tokens-context';
import { useSwitchNetwork } from 'wagmi';

export const ProjectsContext = createContext();

export const ProjectsProvider = ({ children }) => {
    const wallet = useContext(WalletContext);
    const utilityTokensContext = useContext(UtilityTokensContext);

    // polygon mumbai testnet
    // const contractAddress = '0x89e41C41Fa8Aa0AE4aF87609D3Cb0F466dB343ab';
    // const contractNetwork = 80001;

    // polygon mainnet
    const contractAddress = '0x9C28e833aE76A1e123c2799034cA6865A1113CA5';
    const contractNetwork = 137;

    const { networkParams } = wallet.networks[contractNetwork];

    const [isCorrectNetwork, setIsCorrectNetwork] = useState(wallet.network?.id === contractNetwork);

    const { enqueueSnackbar, closeSnackbar } = useSnackbar();
    const router = useRouter();

    const { switchNetwork: evmSwitchNetwork } = useSwitchNetwork();
    async function switchToCorrectNetwork() {
        if (wallet.walletType === 'connectkit') {
            // evm
            console.log(evmSwitchNetwork);
            await evmSwitchNetwork(contractNetwork);
        }
    }

    useEffect(() => {
        setIsCorrectNetwork(wallet.network?.id === contractNetwork);
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
        if (!wallet.ethersSigner) return getReadOnlyContract();
        if (wallet.network?.id != contractNetwork) return getReadOnlyContract();
        console.log('getContract');
        return new ethers.Contract(contractAddress, artifact.abi, wallet.ethersSigner);
    };

    const getReadOnlyContract = () => {
        const readOnlyProvider = new ethers.providers.JsonRpcProvider(`https://polygon-rpc.com`);
        return new ethers.Contract(contractAddress, artifact.abi, readOnlyProvider);
    }

    const getProjectsCount = async () => {
        const contract = getReadOnlyContract();
        let count = 0;
        let currentProjectId = 1;
        while (true) {
            const project = await contract.projects(currentProjectId);
            if (project.id.toNumber() === 0) break;
            count++;
            currentProjectId++;
        };

        return count;
    };

    const getProjects = async () => {
        const response = await fetch(`/api/projects/account/${wallet.address}`);
        const projects = await response.json();
        return projects;
    };

    const getAccountProjects = async (address, includePrivate = false) => {
        const response = await fetch(`/api/projects/account/${address}`);
        const projects = await response.json();

        if (!includePrivate) {
            return projects.filter((project) => !project.isPrivate);
        }

        return projects;
    };

    const getAccountJoinedProjects = async (address, includePrivate = false) => {
        const projects = await getJoinedProjects(address);
        if (!includePrivate) {
            return projects.filter((project) => !project.isPrivate);
        }

        return projects;
    }

    const getProjectsAfterBlock = async (block) => {
        const response = await fetch(`/api/projects/after-block/${wallet.address}?block=${block}`);
        const projects = await response.json();
        return projects;
    };

    const getProject = async (projectId) => {
        if (!wallet.address) throw `no wallet connected`;
        const contract = getContract();
        const project = await contract.projects(projectId);

        if (project.owner === ethers.constants.AddressZero) {
            return null;
        } else {
            return project;
        }
    };

    const getJoinedProjects = async (address) => {
        const contract = getContract();
        const memberRecordIds = await contract.getProjectsByAddress(address);

        const projectIds = [];
        for (const memberRecordId of memberRecordIds) {
            const memberRecord = await contract.projectMemberStorage(memberRecordId);
            if (!projectIds.includes(memberRecord.projectId.toString())) projectIds.push(memberRecord.projectId.toString());
        }

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

    const getProjectMember = async (memberRecordId) => {
        const contract = getContract();
        const member = await contract.projectMemberStorage(memberRecordId);

        const memberData = {
            id: member.id,
            projectId: member.projectId,
            member: member.member,
            address: member.member,
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
        const memberRecordIds = await contract.getPendingInvitesByAddress(address);

        return memberRecordIds;
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

        let fee = ethers.BigNumber.from(0);
        if (pendingInvites.length + members.length + 1 >= freeMembers) fee = await contract.addMemberPrice();

        const tx = await contract.inviteMember(projectId, member, role, goal, JSON.stringify(rewards), { value: fee });
        return tx;
    };

    const disinviteProjectMember = async (projectId, member) => {
        const contract = getContract();

        const tx = await contract.disinviteMember(projectId, member);
        return tx;
    };

    const acceptProjectInvite = async (memberRecordId) => {
        const contract = getContract();
        const tx = await contract.acceptProjectInvitation(memberRecordId);
        return tx;
    };

    const removeProjectMember = async (projectId, memberRecordId, reason = '') => {
        const contract = getContract();
        const tx = await contract.removeMember(projectId, memberRecordId, reason);
        return tx;
    };

    const leaveProject = async (projectId, reason) => {
        const contract = getContract();
        const tx = await contract.leaveProject(projectId, reason);
        return tx;
    };

    const setMemberGoalAsAchieved = async(projectId, memberRecordId) => {
        const contract = getContract();
        const tx = await contract.setMemberGoalAsAchieved(projectId, memberRecordId);
        return tx;
    }

    const setProjectLogo = async (projectId, imageUrl) => {
        const contract = getContract();
        const tx = await contract.setProjectExtraData(projectId, 'logo', imageUrl);
        return tx;
    };

    const getProjectLogo = async (projectId) => {
        const contract = getContract();
        const logo = await contract.extraData(projectId, 'logo');
        return logo;
    };

    const manuallyAddMember = async (projectId, member, role, goal, rewards) => {
        const contract = getContract();
        const tx = await contract.manuallyAddMember(projectId, member, role, goal, JSON.stringify(rewards));
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
        setProjectLogo,
        getProjectLogo,
        manuallyAddMember,
        getProjectsCount
    };
    return <ProjectsContext.Provider value={value}>{children}</ProjectsContext.Provider>;
};
